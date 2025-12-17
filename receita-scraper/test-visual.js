const { webkit } = require('playwright');
const fs = require('fs');
const path = require('path');

// Função para criar diretório de screenshots
const setupScreenshotDir = () => {
    const dir = path.join(__dirname, 'screenshots');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {
            recursive: true
        });
    }
    return dir;
};

// Função para capturar screenshots
const takeScreenshot = async (page, name) => {
    const dir = setupScreenshotDir();
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const filename = `${name}_${timestamp}.png`;
    const filepath = path.join(dir, filename);
    await page.screenshot({
        path: filepath
    });
    console.log(`Screenshot salvo: ${filepath}`);
};

// Versão visual do consultarCPF para demonstração
async function consultarCPFVisual(cpf, birthDate) {
    console.log(`🚀 Iniciando consulta VISUAL para CPF: ${cpf}`);
    console.log(`📅 Data de nascimento: ${birthDate}`);

    if (!cpf || !birthDate) {
        return {
            erro: true,
            mensagem: !cpf ? 'CPF não informado' : 'Data de nascimento não informada'
        };
    }

    // Formatar CPF (remover caracteres não numéricos)
    cpf = cpf.replace(/[^0-9]/g, '');

    // Validar formato da data de nascimento
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
        try {
            // Tentar formatar se estiver em outro formato (ddmmaaaa)
            if (/^\d{8}$/.test(birthDate)) {
                birthDate = `${birthDate.substr(0, 2)}/${birthDate.substr(2, 2)}/${birthDate.substr(4, 4)}`;
            } else {
                return {
                    erro: true,
                    mensagem: 'Formato de data inválido. Use o formato dd/mm/aaaa'
                };
            }
        } catch (e) {
            return {
                erro: true,
                mensagem: 'Formato de data inválido. Use o formato dd/mm/aaaa'
            };
        }
    }

    console.log('🌐 Abrindo navegador em modo VISUAL...');
    const browser = await webkit.launch({
        headless: false, // 👁️ MODO VISUAL ATIVADO
        slowMo: 1000,   // 🐌 Adiciona delay entre ações para visualização
        args: [
            '--no-sandbox',
            '--disable-web-security',
            '--disable-extensions'
        ]
    });

    try {
        const context = await browser.newContext({
            viewport: { width: 1920, height: 1080 },
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        });
        
        const page = await context.newPage();

        // Configurar timeouts mais longos para visualização
        context.setDefaultNavigationTimeout(120000);
        context.setDefaultTimeout(60000);

        // NÃO bloquear recursos para ver tudo carregando
        console.log('📄 Permitindo carregamento completo de recursos para visualização...');

        console.log('🔗 Acessando site da Receita Federal...');
        await page.goto('https://servicos.receita.fazenda.gov.br/servicos/cpf/consultasituacao/consultapublica.asp', {
            waitUntil: 'networkidle'
        });

        // Aguardar carregamento do formulário
        console.log('⏳ Aguardando carregamento do formulário...');
        await page.waitForSelector('#txtCPF');
        await takeScreenshot(page, 'inicial');

        console.log('✏️ Preenchendo CPF...');
        await page.fill('#txtCPF', cpf);
        await page.waitForTimeout(1000); // Pausa para visualização

        console.log('📅 Preenchendo data de nascimento...');
        await page.fill('#txtDataNascimento', birthDate);
        await page.waitForTimeout(1000); // Pausa para visualização
        
        await takeScreenshot(page, 'apos_preenchimento');

        // Aguardar carregamento do captcha
        console.log('🤖 Aguardando carregamento do captcha...');
        await page.waitForSelector('iframe[title="Widget contendo caixa de seleção para desafio de segurança hCaptcha"]');
        await takeScreenshot(page, 'captcha_carregado');

        console.log('🔍 Tentando localizar e interagir com o captcha...');
        try {
            // Esperar pelo iframe do hCaptcha
            await page.waitForSelector('iframe[src*="hcaptcha.com"]', {
                timeout: 30000
            });
            console.log('✅ Frame do hCaptcha encontrado');

            // Obter todos os iframes
            const iframes = await page.locator('iframe').all();
            console.log(`📊 Total de iframes na página: ${iframes.length}`);

            // Encontrar o iframe do hCaptcha
            let hcaptchaFrame;
            for (const iframe of iframes) {
                const src = await iframe.getAttribute('src');
                console.log(`🔗 Iframe src: ${src}`);
                if (src && src.includes('hcaptcha.com')) {
                    hcaptchaFrame = page.frameLocator(`iframe[src*="hcaptcha.com"]`);
                    break;
                }
            }

            if (hcaptchaFrame) {
                console.log('🎯 Iframe do hCaptcha encontrado, tentando interagir...');
                
                try {  
                    await page.waitForTimeout(2000); // Pausa maior para visualização
                    
                    // Tentar clicar no checkbox dentro do iframe
                    const checkbox = hcaptchaFrame.locator('#checkbox');
                    if (await checkbox.isVisible({ timeout: 5000 }).catch(() => false)) {
                        console.log('👆 Clicando no checkbox do captcha...');
                        await checkbox.click();
                        console.log('✅ Checkbox clicado');
                        
                        await page.waitForTimeout(2000);
                        
                        // Verificar se o checkbox foi marcado
                        const isChecked = await checkbox.getAttribute('aria-checked').catch(() => null);
                        if (isChecked === 'true') {
                            console.log('✅ Checkbox marcado com sucesso');
                        }
                    }
                } catch (e) {
                    console.log('❌ Falha na interação com checkbox:', e.message);
                }
            } else {
                console.log('❌ Não foi possível encontrar o iframe do hCaptcha');
            }

            console.log('⏳ Aguardando possível resolução manual do captcha...');
            console.log('💡 DICA: Se aparecer um desafio visual, resolva-o manualmente!');
            
            await takeScreenshot(page, 'apos_tentativa_captcha');
            await page.waitForTimeout(3000); // Tempo para resolução manual se necessário
            
        } catch (error) {
            console.error('❌ Erro na abordagem do captcha:', error);
            await takeScreenshot(page, 'erro_captcha');
        }

        // Aguardar e verificar o botão Consultar
        console.log('🔍 Aguardando botão Consultar...');
        await page.waitForSelector('input[value="Consultar"]', {
            timeout: 30000
        });

        // Verificar se o botão está habilitado
        const botaoInfo = await page.evaluate(() => {
            const botao = document.querySelector('input[value="Consultar"]');
            if (!botao) return { existe: false };
            
            return {
                existe: true,
                habilitado: !botao.disabled,
                visivel: botao.offsetParent !== null,
                style: window.getComputedStyle(botao).display
            };
        });

        console.log('📊 Estado do botão Consultar:', botaoInfo);

        if (!botaoInfo.existe) {
            throw new Error('Botão Consultar não encontrado');
        }

        if (!botaoInfo.habilitado) {
            console.log('⚠️ Botão Consultar está desabilitado. Aguardando habilitação...');
            console.log('💡 O captcha precisa ser resolvido para habilitar o botão!');
            
            // Aguardar até o botão ficar habilitado (captcha resolvido)
            await page.waitForFunction(
                () => {
                    const botao = document.querySelector('input[value="Consultar"]');
                    return botao && !botao.disabled;
                },
                { timeout: 120000 } // Timeout maior para resolução manual
            ).catch(() => {
                throw new Error('Timeout: Botão Consultar não foi habilitado. Verifique se o captcha foi resolvido.');
            });
            
            console.log('✅ Botão Consultar foi habilitado!');
        }

        // Aguardar um pouco mais para garantir que tudo está pronto
        await page.waitForTimeout(2000);

        // Clicar no botão Consultar
        console.log('👆 Clicando em Consultar...');
        
        try {
            await page.click('input[value="Consultar"]');
            console.log('✅ Clique realizado com sucesso');
            
            // Aguardar navegação ou mudança na página
            console.log('⏳ Aguardando resposta da consulta...');
            
            await Promise.race([
                page.waitForNavigation({ 
                    waitUntil: 'networkidle', 
                    timeout: 60000 
                }).then(() => 'navigation'),
                
                page.waitForFunction(
                    () => {
                        const body = document.body.innerText;
                        return body.includes('Situação Cadastral') || 
                               body.includes('Data de nascimento informada') ||
                               body.includes('CPF incorreto') ||
                               body.includes('CPF não encontrado') ||
                               body.includes('erro') ||
                               body.includes('Erro');
                    },
                    { timeout: 60000 }
                ).then(() => 'content_change')
            ]);
            
            console.log('✅ Resposta recebida da consulta');
            
        } catch (clickError) {
            console.log('❌ Erro no clique, tentando método alternativo...');
            
            await page.evaluate(() => {
                const botao = document.querySelector('input[value="Consultar"]');
                if (botao) {
                    botao.click();
                } else {
                    throw new Error('Botão não encontrado para clique alternativo');
                }
            });
            
            console.log('✅ Clique alternativo realizado');
            await page.waitForTimeout(5000);
        }

        await takeScreenshot(page, 'resultado_final');

        // Verificar resultados
        console.log('🔍 Verificando resultados...');
        
        // Verificar erros comuns
        const temErroDivergencia = await page.evaluate(() => {
            const conteudo = document.body.innerText;
            return conteudo.includes('Data de nascimento informada') &&
                conteudo.includes('está divergente');
        });

        if (temErroDivergencia) {
            console.log('❌ Erro: Data de nascimento divergente');
            return {
                error: true,
                message: 'Data de nascimento informada está divergente da constante na base de dados.',
                type: 'data_divergente'
            };
        }

        const temErroCpf = await page.evaluate(() => {
            const conteudo = document.body.innerText;
            return conteudo.includes('CPF incorreto');
        });

        if (temErroCpf) {
            console.log('❌ Erro: CPF incorreto');
            return {
                error: true,
                message: 'CPF informado está incorreto',
                type: 'cpf_incorreto'
            };
        }

        const cpfNaoExiste = await page.evaluate(() => {    
            const conteudo = document.body.innerText;
            return conteudo.includes('CPF não encontrado');
        });

        if (cpfNaoExiste) {
            console.log('❌ Erro: CPF não encontrado');
            return {    
                error: true,
                message: 'CPF não encontrado na base de dados da Receita Federal',
                type: 'cpf_nao_encontrado'
            };
        }

        // Extrair dados se sucesso
        const data = await page.evaluate(() => {
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

        console.log('🎉 Consulta finalizada com sucesso!');
        console.log('📊 Dados extraídos:', data);
        
        // Manter navegador aberto por mais tempo para visualização
        console.log('⏳ Mantendo navegador aberto por 10 segundos para visualização...');
        await page.waitForTimeout(10000);
        
        return data;

    } catch (error) {
        console.error('❌ Erro durante a consulta:', error);
        await takeScreenshot(page, 'erro_final').catch(() => {});
        return {
            erro: true,
            mensagem: `Erro ao consultar CPF: ${error.message}`
        };
    } finally {
        console.log('🔒 Fechando navegador...');
        await browser.close();
    }
}

// Função de teste principal
async function testeVisual() {
    console.log('🎬 INICIANDO TESTE VISUAL DO SCRAPER');
    console.log('=====================================');
    
    // Dados de teste (use dados fictícios para teste)
    const cpfTeste = '11144477735'; // CPF de teste (formato válido mas fictício)
    const dataTeste = '01/01/1990';
    
    console.log(`📋 CPF de teste: ${cpfTeste}`);
    console.log(`📅 Data de teste: ${dataTeste}`);
    console.log('');
    console.log('⚠️  IMPORTANTE: Este é um teste visual com dados fictícios');
    console.log('⚠️  Para usar dados reais, modifique as variáveis cpfTeste e dataTeste');
    console.log('');
    
    try {
        const resultado = await consultarCPFVisual(cpfTeste, dataTeste);
        
        console.log('');
        console.log('🏁 RESULTADO FINAL:');
        console.log('==================');
        console.log(JSON.stringify(resultado, null, 2));
        
    } catch (error) {
        console.error('💥 Erro no teste:', error);
    }
}

// Executar teste se chamado diretamente
if (require.main === module) {
    testeVisual();
}

module.exports = {
    consultarCPFVisual,
    testeVisual
};