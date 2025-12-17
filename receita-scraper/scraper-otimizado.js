const { webkit } = require('playwright');
const fs = require('fs');
const path = require('path');

// Função para capturar screenshots
const takeScreenshot = async (page, name) => {
    try {
        const dir = path.join(__dirname, 'screenshots', 'ultima_consulta');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        const filename = `${name}.png`;
        const filepath = path.join(dir, filename);
        
        await page.screenshot({
            path: filepath,
            fullPage: true
        });
        
        console.log(`📸 Screenshot salvo: ${filename}`);
        return filepath;
    } catch (error) {
        console.log(`❌ Erro ao capturar screenshot ${name}:`, error.message);
        return null;
    }
};

class ScraperOtimizado {
    constructor() {
        this.browser = null;
        this.context = null;
        this.page = null;
    }

    async launch() {
        console.log('🚀 Iniciando Scraper Otimizado...');
        
        const isVisual = process.env.VISUAL_MODE === 'true' || process.argv.includes('--visual');
        
        this.browser = await webkit.launch({
            headless: !isVisual,
            slowMo: isVisual ? 300 : 50
        });
        
        this.context = await this.browser.newContext({
            viewport: { width: 1366, height: 768 },
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            ignoreHTTPSErrors: true,
            locale: 'pt-BR',
            timezoneId: 'America/Sao_Paulo'
        });

        this.page = await this.context.newPage();
        this.page.setDefaultNavigationTimeout(30000);
        this.page.setDefaultTimeout(15000);

        // Bloquear recursos desnecessários
        await this.page.route('**/*', (route) => {
            const resourceType = route.request().resourceType();
            const url = route.request().url();
            
            if (['image', 'media', 'font'].includes(resourceType) ||
                url.includes('analytics') || url.includes('ads')) {
                route.abort();
            } else {
                route.continue();
            }
        });
        
        console.log('✅ Scraper otimizado iniciado!');
        return this.page;
    }

    async consultarCPF(cpf, birthDate) {
        console.log(`🔍 Consulta otimizada para CPF: ${cpf}`);
        
        if (!cpf || !birthDate) {
            return { erro: true, mensagem: 'CPF ou data não informados' };
        }

        cpf = cpf.replace(/[^0-9]/g, '');

        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
            if (/^\d{8}$/.test(birthDate)) {
                birthDate = `${birthDate.substr(0, 2)}/${birthDate.substr(2, 2)}/${birthDate.substr(4, 4)}`;
            } else {
                return { erro: true, mensagem: 'Formato de data inválido' };
            }
        }

        try {
            console.log('🌐 Acessando site da Receita Federal...');
            await this.page.goto('https://servicos.receita.fazenda.gov.br/servicos/cpf/consultasituacao/consultapublica.asp', {
                waitUntil: 'domcontentloaded',
                timeout: 30000
            });

            // Aguardar formulário carregar
            await this.page.waitForSelector('#txtCPF', { timeout: 10000 });
            await takeScreenshot(this.page, '01_inicial');

            // Preencher formulário
            console.log('📝 Preenchendo formulário...');
            await this.page.fill('#txtCPF', cpf);
            await this.page.fill('#txtDataNascimento', birthDate);
            await takeScreenshot(this.page, '02_preenchido');

            // Aguardar captcha aparecer
            console.log('⏳ Aguardando captcha...');
            await this.page.waitForTimeout(2000);
            await takeScreenshot(this.page, '03_captcha');

            // Estratégia inteligente para captcha
            const captchaResolvido = await this.tentarResolverCaptcha();
            
            if (!captchaResolvido) {
                console.log('⚠️ Captcha não resolvido, mas tentando prosseguir...');
            }

            // Tentar clicar em Consultar
            console.log('🔘 Tentando consultar...');
            const consultaRealizada = await this.realizarConsulta();
            
            if (!consultaRealizada) {
                return { erro: true, mensagem: 'Não foi possível realizar a consulta' };
            }

            // Aguardar resultado
            console.log('⏳ Aguardando resultado...');
            await this.page.waitForTimeout(3000);
            await takeScreenshot(this.page, '04_resultado');

            // Verificar erros
            const erro = await this.verificarErros();
            if (erro) {
                return erro;
            }

            // Extrair dados
            const dados = await this.extrairDados();
            
            console.log('✅ Consulta realizada com sucesso!');
            await takeScreenshot(this.page, '05_sucesso');
            
            return dados;

        } catch (error) {
            console.error('❌ Erro na consulta:', error.message);
            await takeScreenshot(this.page, '06_erro');
            return { erro: true, mensagem: error.message };
        }
    }

    async tentarResolverCaptcha() {
        try {
            // Verificar se há captcha
            const temCaptcha = await this.page.$('iframe[src*="hcaptcha.com"]');
            
            if (!temCaptcha) {
                console.log('✅ Nenhum captcha detectado');
                return true;
            }

            console.log('🔍 Captcha detectado, tentando resolver...');
            
            // Em modo visual, aguardar resolução manual
            const isVisual = process.env.VISUAL_MODE === 'true';
            if (isVisual) {
                console.log('🖥️ Modo visual: resolva o captcha manualmente');
                
                // Aguardar até 60 segundos para resolução manual
                for (let i = 0; i < 60; i++) {
                    await this.page.waitForTimeout(1000);
                    
                    const resolvido = await this.page.evaluate(() => {
                        const token = document.querySelector('textarea[name="h-captcha-response"]');
                        return token && token.value.length > 0;
                    });
                    
                    if (resolvido) {
                        console.log('✅ Captcha resolvido manualmente!');
                        return true;
                    }
                    
                    if (i % 10 === 0 && i > 0) {
                        console.log(`⏳ Aguardando resolução... (${i}s)`);
                    }
                }
            }
            
            // Tentar clique automático (pode não funcionar)
            try {
                const frame = await temCaptcha.contentFrame();
                if (frame) {
                    await frame.click('#checkbox');
                    await this.page.waitForTimeout(2000);
                    
                    const resolvido = await this.page.evaluate(() => {
                        const token = document.querySelector('textarea[name="h-captcha-response"]');
                        return token && token.value.length > 0;
                    });
                    
                    if (resolvido) {
                        console.log('✅ Captcha resolvido automaticamente!');
                        return true;
                    }
                }
            } catch (error) {
                console.log('⚠️ Clique automático no captcha falhou');
            }
            
            return false;
            
        } catch (error) {
            console.log('⚠️ Erro ao processar captcha:', error.message);
            return false;
        }
    }

    async realizarConsulta() {
        try {
            // Verificar se botão existe e está habilitado
            const botaoInfo = await this.page.evaluate(() => {
                const botao = document.querySelector('input[value="Consultar"]');
                return {
                    existe: !!botao,
                    habilitado: botao ? !botao.disabled : false,
                    visivel: botao ? botao.offsetParent !== null : false
                };
            });

            console.log('🔍 Status do botão:', botaoInfo);

            if (!botaoInfo.existe) {
                throw new Error('Botão Consultar não encontrado');
            }

            // Tentar habilitar se estiver desabilitado
            if (!botaoInfo.habilitado) {
                await this.page.evaluate(() => {
                    const botao = document.querySelector('input[value="Consultar"]');
                    if (botao) {
                        botao.disabled = false;
                        botao.removeAttribute('disabled');
                    }
                });
            }

            // Múltiplas estratégias de clique
            const estrategias = [
                () => this.page.click('input[value="Consultar"]'),
                () => this.page.evaluate(() => document.querySelector('input[value="Consultar"]').click()),
                () => this.page.evaluate(() => document.querySelector('form').submit())
            ];

            for (const estrategia of estrategias) {
                try {
                    await estrategia();
                    console.log('✅ Consulta enviada');
                    return true;
                } catch (error) {
                    console.log('⚠️ Estratégia falhou, tentando próxima...');
                }
            }

            return false;

        } catch (error) {
            console.log('❌ Erro ao realizar consulta:', error.message);
            return false;
        }
    }

    async verificarErros() {
        try {
            const conteudo = await this.page.textContent('body');
            
            if (conteudo.includes('Data de nascimento informada') && conteudo.includes('está divergente')) {
                return { erro: true, mensagem: 'Data de nascimento divergente', tipo: 'data_divergente' };
            }
            
            if (conteudo.includes('CPF incorreto')) {
                return { erro: true, mensagem: 'CPF incorreto', tipo: 'cpf_incorreto' };
            }
            
            if (conteudo.includes('CPF não encontrado')) {
                return { erro: true, mensagem: 'CPF não encontrado', tipo: 'cpf_nao_encontrado' };
            }
            
            return null;
            
        } catch (error) {
            return null;
        }
    }

    async extrairDados() {
        try {
            return await this.page.evaluate(() => {
                const html = document.body.innerHTML;
                const extract = (pattern) => {
                    const match = html.match(pattern);
                    return match ? match[1].trim() : null;
                };
                
                return {
                    cpf: extract(/N<sup>o<\/sup> do CPF:\s*<b>(.*?)<\/b>/),
                    nome: extract(/Nome:\s*<b>(.*?)<\/b>/),
                    data_nascimento: extract(/Data de Nascimento:\s*<b>(.*?)<\/b>/),
                    situacao_cadastral: extract(/Situação Cadastral:\s*<b>(.*?)<\/b>/),
                    data_inscricao: extract(/Data da Inscrição:\s*<b>(.*?)<\/b>/),
                    digito_verificador: extract(/Digito Verificador:\s*<b>(.*?)<\/b>/),
                    hora_emissao: extract(/Comprovante emitido às:\s*<b>(.*?)<\/b>/),
                    data_emissao: extract(/do dia\s*<b>(.*?)<\/b>/),
                    codigo_controle: extract(/Código de controle do comprovante:\s*<b>(.*?)<\/b>/)
                };
            });
        } catch (error) {
            console.log('⚠️ Erro ao extrair dados:', error.message);
            return { erro: true, mensagem: 'Erro na extração de dados' };
        }
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
        }
    }
}

// Função de consulta exportada
async function consultarCPF(cpf, birthDate) {
    const scraper = new ScraperOtimizado();
    try {
        await scraper.launch();
        return await scraper.consultarCPF(cpf, birthDate);
    } finally {
        await scraper.close();
    }
}

module.exports = { ScraperOtimizado, consultarCPF };
