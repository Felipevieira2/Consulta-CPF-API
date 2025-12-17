const { webkit } = require('playwright');
const fs = require('fs');
const path = require('path');

// Função para criar diretório de screenshots (do scraper.js)
const setupScreenshotDir = () => {
    const dir = path.join(__dirname, 'screenshots', 'ultima_consulta');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {
            recursive: true
        });
    }
    // Limpar screenshots anteriores
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        if (file.endsWith('.png')) {
            fs.unlinkSync(path.join(dir, file));
        }
    });
    return dir;
};

// Função para capturar screenshots (do scraper.js)
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

class PlaywrightWebKitCPFConsultor {
    constructor() {
        this.browser = null;
        this.context = null;
        this.page = null;
        this.screenshotDir = setupScreenshotDir();
    }

    async launch() {
        console.log('🚀 Iniciando Playwright com WebKit (Safari) para consulta CPF...');
        
        // Configurações do WebKit - modo visual ou headless
        const isVisual = process.env.VISUAL_MODE === 'true' || process.argv.includes('--visual');
        
        this.browser = await webkit.launch({
            headless: !isVisual, // false = mostra navegador, true = oculto
            slowMo: isVisual ? 500 : 100, // Mais lento quando visual
            // WebKit não suporta os mesmos args do Chrome/Chromium
            // Usar apenas args compatíveis com WebKit
            args: []
        });
        
        if (isVisual) {
            console.log('🖥️ Modo VISUAL ativado - navegador será exibido!');
        } else {
            console.log('👻 Modo HEADLESS ativado - navegador oculto');
        }
        
        // Cria contexto com configurações otimizadas e limpeza automática
        this.context = await this.browser.newContext({
            viewport: { width: 1366, height: 768 },
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            ignoreHTTPSErrors: true,
            javaScriptEnabled: true,
            acceptDownloads: false,
            locale: 'pt-BR',
            timezoneId: 'America/Sao_Paulo',
            // Configurações de limpeza automática
            clearCookies: true,
            clearCache: true,
            bypassCSP: true,
            // Configurações de privacidade
            permissions: [],
            geolocation: undefined,
            colorScheme: 'light'
        });

        // Remove sinais de automação (do scraper.js)
        await this.context.addInitScript(() => {
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined,
            });
            delete navigator.__proto__.webdriver;
        });

        this.page = await this.context.newPage();
        
        // Configurar timeouts otimizados
        this.page.setDefaultNavigationTimeout(45000);
        this.page.setDefaultTimeout(20000);

        // Otimização: Reduzir recursos carregados de forma mais seletiva
        await this.page.route('**/*', (route) => {
            const resourceType = route.request().resourceType();
            const url = route.request().url();
            
            // Bloquear apenas recursos realmente desnecessários
            if (['image', 'media', 'websocket'].includes(resourceType) ||
                url.includes('analytics') || url.includes('tracking') || 
                url.includes('ads') || url.includes('facebook') || 
                url.includes('google-analytics')) {
                route.abort();
            } else {
                route.continue();
            }
        });
        
        console.log('✅ WebKit iniciado para consulta CPF!');
        return this.page;
    }

    async navigateTo(url) {
        console.log(`🌐 Navegando para: ${url}`);
        try {
            await this.page.goto(url, { waitUntil: 'networkidle' });
        } catch (error) {
            console.log('⚠️ Erro na navegação, tentando novamente...');
            await this.page.goto(url);
        }
    }

    // Função principal para consultar CPF (TODA a lógica do scraper.js)
    async consultarCPF(cpf, birthDate) {
        console.log(`🔍 Iniciando consulta para CPF: ${cpf}`);
        // Aguardar um pouco antes de acessar para evitar rate limiting
        console.log('⏳ Aguardando 3 segundos para evitar bloqueios...');
        await this.page.waitForTimeout(3000);
        if (!cpf || !birthDate) {
            return {
                erro: true,
                mensagem: !cpf ? 'CPF não informado' : 'Data de nascimento não informada'
            };
        }

        // Formatar CPF (remover caracteres não numéricos) - do scraper.js
        cpf = cpf.replace(/[^0-9]/g, '');

        // Validar formato da data de nascimento - do scraper.js
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

        try {
            console.log('Acessando site da Receita Federal...');
            
            // Tentar diferentes estratégias de carregamento
            let carregouSite = false;
            const tentativas = [
                { waitUntil: 'domcontentloaded', timeout: 15000 },
                { waitUntil: 'load', timeout: 20000 },
                { waitUntil: 'networkidle', timeout: 30000 }
            ];
            
            for (const config of tentativas) {
                try {
                    await this.page.goto('https://servicos.receita.fazenda.gov.br/servicos/cpf/consultasituacao/consultapublica.asp', config);
                    console.log(`✅ Site carregado com estratégia: ${config.waitUntil}`);
                    carregouSite = true;
                    break;
                } catch (error) {
                    console.log(`⚠️ Falha com ${config.waitUntil}: ${error.message}`);
                    if (config === tentativas[tentativas.length - 1]) {
                        throw error;
                    }
                }
            }
            
            if (!carregouSite) {
                throw new Error('Não foi possível carregar o site da Receita Federal');
            }
            // Aguardar carregamento do formulário
            await this.page.waitForSelector('#txtCPF');
            await takeScreenshot(this.page, '01_inicial');

            // Preenchimento otimizado (do scraper.js)
            console.log('Preenchendo CPF...');
            await this.page.evaluate((cpfValue) => {
                document.querySelector('#txtCPF').value = cpfValue;
            }, cpf);

            console.log('Preenchendo data de nascimento...');
            await this.page.evaluate((dateValue) => {
                document.querySelector('#txtDataNascimento').value = dateValue;
            }, birthDate);
            await takeScreenshot(this.page, '02_apos_preenchimento');

            // Aguardar carregamento do captcha
            console.log('Aguardando carregamento do captcha...');
            await this.page.waitForSelector('iframe[title="Widget contendo caixa de seleção para desafio de segurança hCaptcha"]');
            await takeScreenshot(this.page, '03_antes_captcha');

            // Detecção inteligente de captcha
            console.log('🔍 Verificando se há captcha na página...');
            
            let captchaEncontrado = false;
            let captchaResolvido = false;
            
            try {
                // Primeiro, verificar se realmente há um captcha visível
                const temCaptchaVisivel = await this.page.evaluate(() => {
                    // Verificar iframes de captcha
                    const iframes = document.querySelectorAll('iframe');
                    let captchaIframe = null;
                    
                    for (const iframe of iframes) {
                        const src = iframe.src || '';
                        const title = iframe.title || '';
                        
                        if (src.includes('hcaptcha.com') || title.toLowerCase().includes('captcha')) {
                            // Verificar se o iframe está visível
                            const rect = iframe.getBoundingClientRect();
                            if (rect.width > 0 && rect.height > 0) {
                                captchaIframe = iframe;
                                break;
                            }
                        }
                    }
                    
                    return {
                        temCaptcha: !!captchaIframe,
                        captchaInfo: captchaIframe ? {
                            src: captchaIframe.src,
                            title: captchaIframe.title,
                            width: captchaIframe.getBoundingClientRect().width,
                            height: captchaIframe.getBoundingClientRect().height
                        } : null
                    };
                });
                
                console.log('🔍 Resultado da verificação:', temCaptchaVisivel);
                
                if (temCaptchaVisivel.temCaptcha) {
                    captchaEncontrado = true;
                    console.log('✅ Captcha encontrado e visível');
                    console.log('📊 Info do captcha:', temCaptchaVisivel.captchaInfo);
                    
                    // Tentar interagir com o captcha apenas se ele existir e estiver visível
                    try {
                        const iframe = await this.page.$('iframe[src*="hcaptcha.com"]');
                        if (iframe) {
                            const frameHandle = await iframe.contentFrame();
                            if (frameHandle) {
                                console.log('🎯 Tentando interagir com captcha...');
                                
                                // Aguardar o checkbox aparecer
                                try {
                                    await frameHandle.waitForSelector('#checkbox', { timeout: 3000 });
                                    
                                    // Verificar se já está marcado
                                    const jaResolvido = await frameHandle.evaluate(() => {
                                        const checkbox = document.querySelector('#checkbox');
                                        const token = document.querySelector('textarea[name="h-captcha-response"]');
                                        return (checkbox && checkbox.getAttribute('aria-checked') === 'true') || 
                                               (token && token.value.length > 0);
                                    });
                                    
                                    if (jaResolvido) {
                                        console.log('✅ Captcha já estava resolvido');
                                        captchaResolvido = true;
                                    } else {
                                        // Tentar clicar no checkbox
                                        await frameHandle.click('#checkbox');
                                        console.log('🖱️ Clique no captcha realizado');
                                        
                                        // Aguardar um pouco para ver se resolve
                                        await this.page.waitForTimeout(2000);
                                        
                                        // Verificar se foi resolvido
                                        const resolveuAposClique = await frameHandle.evaluate(() => {
                                            const checkbox = document.querySelector('#checkbox');
                                            const token = document.querySelector('textarea[name="h-captcha-response"]');
                                            return (checkbox && checkbox.getAttribute('aria-checked') === 'true') || 
                                                   (token && token.value.length > 0);
                                        });
                                        
                                        if (resolveuAposClique) {
                                            console.log('✅ Captcha resolvido após clique!');
                                            captchaResolvido = true;
                                        } else {
                                            console.log('⚠️ Captcha não foi resolvido automaticamente');
                                        }
                                    }
                                } catch (selectorError) {
                                    console.log('⚠️ Checkbox do captcha não encontrado:', selectorError.message);
                                }
                            }
                        }
                    } catch (interactionError) {
                        console.log('⚠️ Erro na interação com captcha:', interactionError.message);
                    }
                } else {
                    console.log('ℹ️ Nenhum captcha visível encontrado na página');
                }
                
                // Verificar se o botão Consultar está disponível
                const botaoStatus = await this.page.evaluate(() => {
                    const botao = document.querySelector('input[value="Consultar"]');
                    return {
                        existe: !!botao,
                        habilitado: botao ? !botao.disabled : false,
                        visivel: botao ? botao.offsetParent !== null : false
                    };
                });
                
                console.log('🔘 Status do botão Consultar:', botaoStatus);
                
                if (captchaEncontrado && !captchaResolvido) {
                    const isVisual = process.env.VISUAL_MODE === 'true' || process.argv.includes('--visual');
                    
                    if (isVisual) {
                        console.log('🖥️ Modo visual: aguardando resolução manual do captcha...');
                        
                        // Em modo visual, aguardar resolução manual
                        let tentativasEspera = 0;
                        const maxEspera = 60; // 60 segundos
                        
                        while (!captchaResolvido && tentativasEspera < maxEspera) {
                            await this.page.waitForTimeout(1000);
                            
                            // Verificar se foi resolvido manualmente
                            const resolvidoManualmente = await this.page.evaluate(() => {
                                const token = document.querySelector('textarea[name="h-captcha-response"]');
                                return token && token.value.length > 0;
                            });
                            
                            if (resolvidoManualmente) {
                                console.log('✅ Captcha resolvido manualmente!');
                                captchaResolvido = true;
                                break;
                            }
                            
                            tentativasEspera++;
                            if (tentativasEspera % 10 === 0) {
                                console.log(`⏳ Aguardando resolução manual... (${tentativasEspera}s)`);
                            }
                        }
                    } else if (botaoStatus.habilitado) {
                        console.log('💡 Captcha não resolvido, mas botão está habilitado - prosseguindo');
                    } else {
                        console.log('⚠️ Captcha não resolvido e botão desabilitado - pode falhar');
                    }
                } else if (!captchaEncontrado) {
                    console.log('✅ Nenhum captcha necessário - prosseguindo normalmente');
                } else {
                    console.log('✅ Captcha resolvido - prosseguindo');
                }
                
                await takeScreenshot(this.page, '04_apos_captcha');
                
            } catch (error) {
                console.log('⚠️ Erro na verificação de captcha:', error.message);
                await takeScreenshot(this.page, '04_erro_captcha');
            }

            // Aguardar e verificar o botão Consultar (do scraper.js)
            console.log('Aguardando botão Consultar...');
            await this.page.waitForSelector('input[value="Consultar"]', {
                timeout: 30000
            });



            // Aguardar um pouco mais para garantir que tudo está pronto
            await this.page.waitForTimeout(500);

            // Clicar no botão Consultar com melhor tratamento
            console.log('Clicando em Consultar...');
            
            try {
                // Verificar se o botão está presente e habilitado
                const botaoInfo = await this.page.evaluate(() => {
                    const botao = document.querySelector('input[value="Consultar"]');
                    if (!botao) return { existe: false };
                    
                    return {
                        existe: true,
                        habilitado: !botao.disabled,
                        visivel: botao.offsetParent !== null,
                        texto: botao.value
                    };
                });
                
                console.log('🔍 Status do botão:', botaoInfo);
                
                if (!botaoInfo.existe) {
                    throw new Error('Botão Consultar não encontrado');
                }
                
                if (!botaoInfo.habilitado) {
                    console.log('⚠️ Botão está desabilitado, tentando habilitar...');
                    
                    // Tentar habilitar o botão via JavaScript
                    await this.page.evaluate(() => {
                        const botao = document.querySelector('input[value="Consultar"]');
                        if (botao) {
                            botao.disabled = false;
                            botao.removeAttribute('disabled');
                        }
                    });
                    
                    await this.page.waitForTimeout(500);
                }
                
                // Tentar múltiplas estratégias de clique
                let cliqueSucesso = false;
                
                // Estratégia 1: Clique simples
                try {
                    await this.page.click('input[value="Consultar"]');
                    console.log('✅ Clique simples realizado');
                    cliqueSucesso = true;
                } catch (error) {
                    console.log('⚠️ Clique simples falhou:', error.message);
                }
                
                // Estratégia 2: Clique via JavaScript se o simples falhou
                if (!cliqueSucesso) {
                    try {
                        await this.page.evaluate(() => {
                            const botao = document.querySelector('input[value="Consultar"]');
                            if (botao) {
                                botao.click();
                            }
                        });
                        console.log('✅ Clique via JavaScript realizado');
                        cliqueSucesso = true;
                    } catch (error) {
                        console.log('⚠️ Clique via JavaScript falhou:', error.message);
                    }
                }
                
                // Estratégia 3: Submeter formulário diretamente
                if (!cliqueSucesso) {
                    try {
                        await this.page.evaluate(() => {
                            const form = document.querySelector('form');
                            if (form) {
                                form.submit();
                            }
                        });
                        console.log('✅ Formulário submetido diretamente');
                        cliqueSucesso = true;
                    } catch (error) {
                        console.log('⚠️ Submit do formulário falhou:', error.message);
                    }
                }
                
                if (!cliqueSucesso) {
                    throw new Error('Todas as estratégias de clique falharam');
                }
                
                console.log('✅ Clique realizado com sucesso');
                
                // Aguardar navegação ou mudança na página
                console.log('Aguardando resposta da consulta...');
                
                // Aguardar por qualquer mudança na página (navegação ou conteúdo)
                await Promise.race([
                    // Opção 1: Navegação completa
                    this.page.waitForNavigation({ 
                        waitUntil: 'networkidle', 
                        timeout: 30000 
                    }).then(() => 'navigation'),
                    
                    // Opção 2: Verificar se já estamos na página de resultado
                    this.page.waitForSelector('.clConteudoDados', { timeout: 5000 })
                        .then(() => 'resultado_encontrado')
                        .catch(() => null),
                    
                    // Opção 3: Mudança no conteúdo (com verificação de segurança)
                    this.page.waitForFunction(
                        () => {
                            // Verificar se document.body existe antes de acessar innerText
                            if (!document.body) return false;
                            
                            try {
                                const body = document.body.innerText || '';
                                const html = document.body.innerHTML || '';
                                
                                // Verificar se já temos o resultado na página
                                return html.includes('Situação Cadastral') || 
                                       html.includes('Comprovante de Situação Cadastral no CPF') ||
                                       body.includes('Data de nascimento informada') ||
                                       body.includes('CPF incorreto') ||
                                       body.includes('CPF não encontrado') ||
                                       body.includes('erro') ||
                                       body.includes('Erro') ||
                                       // Verificar se já temos dados específicos do resultado
                                       html.includes('clConteudoDados') ||
                                       html.includes('N<sup>o</sup> do CPF:');
                            } catch (e) {
                                return false;
                            }
                        },
                        { timeout: 30000, polling: 500 }
                    ).then(() => 'content_change'),
                    
                    // Opção 4: Timeout de segurança
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Timeout na resposta')), 30000)
                    )
                ]).catch(async (error) => {
                    // Se der erro, verificar se já temos o resultado na página
                    try {
                        const temResultado = await this.page.evaluate(() => {
                            if (!document.body) return false;
                            const html = document.body.innerHTML || '';
                            return html.includes('Situação Cadastral') || 
                                   html.includes('clConteudoDados') ||
                                   html.includes('N<sup>o</sup> do CPF:');
                        });
                        
                        if (temResultado) {
                            console.log('✅ Resultado já encontrado na página');
                            return 'resultado_ja_presente';
                        }
                    } catch (e) {
                        console.log('⚠️ Erro ao verificar resultado:', e.message);
                    }
                    
                    throw error;
                });
                
                console.log('✅ Resposta recebida da consulta');
                
            } catch (clickError) {
                console.log('❌ Erro no clique simples, tentando clique alternativo... message: ' + clickError.message);
           
               
                
               
               
            }

            // Verificar se há alertas (do scraper.js)
            try {
                await this.page.waitForTimeout(1000);
                const alertMessage = await this.page.evaluate(() => {
                    return window.alert ? window.alert.toString() : null;
                });

                if (alertMessage) {
                    console.log(`Alerta detectado: ${alertMessage}`);
                }
            } catch (e) {
                console.log('Nenhum alerta detectado');
            }

            await takeScreenshot(this.page, '05_resultado');

            console.log('Verificando se há mensagem de erro sobre data de nascimento divergente...');
            // TODOS os tratamentos de erro do scraper.js
            const temErroDivergencia = await this.page.evaluate(() => {
                const conteudo = document.body.innerText;
                return conteudo.includes('Data de nascimento informada') &&
                    conteudo.includes('está divergente') &&
                    conteudo.includes('Retorne a página anterior');
            });

            if (temErroDivergencia) {
                console.log('Erro detectado: Data de nascimento divergente');
                return {
                  error: true,
                  message: 'Data de nascimento informada está divergente da constante na base de dados.',
                  type: 'data_divergente'
                };
            }

            const temErroDivergenciaCpf = await this.page.evaluate(() => {
                const conteudo = document.body.innerText;
                return conteudo.includes('CPF incorreto');
            });

            if (temErroDivergenciaCpf) {
                console.log('Erro detectado: CPF está com divergente');
                return {
                    error: true,
                    message: 'CPF informado está incorreto',
                    type: 'cpf_incorreto'
                };
            }

            //cpf nao existe 
            const cpfNaoExiste = await this.page.evaluate(() => {    
                const conteudo = document.body.innerText;
                return conteudo.includes('CPF não encontrado');
            });

            if (cpfNaoExiste) {
                return {    
                    error: true,
                    message: 'CPF não encontrado na base de dados da Receita Federal',
                    type: 'cpf_nao_encontrado'
                };
            }

            // TODA a lógica de extração de dados do scraper.js
            const data = await this.page.evaluate(() => {
                // Usar querySelector em vez de regex quando possível - mais rápido
                const getTextContent = (selector) => {
                    const el = document.querySelector(selector);
                    return el ? el.textContent.trim() : null;
                };
                
                // Usar regex apenas quando necessário
                const html = document.body.innerHTML;
                const extract = (pattern) => {
                    const match = html.match(pattern);
                    return match ? match[1].trim() : null;
                };
                
                return {
                    // Dados extraídos de forma mais eficiente
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

            console.log('Consulta finalizada com sucesso');
            await takeScreenshot(this.page, '06_final_sucesso');
            
            // Salvar dados da última consulta
            const resultadoCompleto = {
                ...data,
                cpf_consultado: cpf,
                data_nascimento_consultada: birthDate,
                timestamp: new Date().toISOString(),
                sucesso: true
            };
            
            const resultadoPath = path.join(__dirname, 'screenshots', 'ultima_consulta', 'resultado.json');
            fs.writeFileSync(resultadoPath, JSON.stringify(resultadoCompleto, null, 2));
            
            return data;

        } catch (error) {
            console.error('Erro durante a consulta:', error);
            await takeScreenshot(this.page, '07_erro');
            
            // Salvar dados do erro
            const resultadoErro = {
                cpf_consultado: cpf,
                data_nascimento_consultada: birthDate,
                timestamp: new Date().toISOString(),
                sucesso: false,
                erro: true,
                mensagem: `Erro ao consultar CPF: ${error.message}`
            };
            
            const resultadoPath = path.join(__dirname, 'screenshots', 'ultima_consulta', 'resultado.json');
            fs.writeFileSync(resultadoPath, JSON.stringify(resultadoErro, null, 2));
            
            return {
                erro: true,
                mensagem: `Erro ao consultar CPF: ${error.message}`
            };
        }
    }

    async injectControlPanel() {
        console.log('🔧 Injetando painel de controle CPF...');
        
        await this.page.addScriptTag({
            content: `
            // Cria painel de controle visual para CPF
            (function() {
                const panel = document.createElement('div');
                panel.id = 'webkit-cpf-panel';
                panel.style.cssText = \`
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    width: 350px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    border-radius: 15px;
                    padding: 20px;
                    z-index: 999999;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    color: white;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    backdrop-filter: blur(10px);
                \`;
                
                panel.innerHTML = \`
                    <h3 style="margin: 0 0 15px 0; font-size: 16px; text-align: center;">
                        🦊 WebKit CPF Consultor (Scraper.js Completo)
                    </h3>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <input type="text" id="cpf-input" placeholder="CPF (11144477735)" 
                               style="padding: 8px; border: none; border-radius: 6px; font-size: 12px;" 
                               value="11144477735">
                        <input type="text" id="data-input" placeholder="Data (01/01/1990)" 
                               style="padding: 8px; border: none; border-radius: 6px; font-size: 12px;" 
                               value="01/01/1990">
                        <button onclick="webkitConsultarCPF()" 
                                style="padding: 10px; border: none; border-radius: 8px; background: #28a745; color: white; cursor: pointer; font-size: 13px; font-weight: bold;">
                            🔍 Consultar CPF (Lógica Completa)
                        </button>
                        <button onclick="webkitAutoFill()" 
                                style="padding: 8px; border: none; border-radius: 8px; background: rgba(255,255,255,0.2); color: white; cursor: pointer; font-size: 12px;">
                            🔄 Auto-preencher
                        </button>
                        <button onclick="webkitHighlight('input')" 
                                style="padding: 8px; border: none; border-radius: 8px; background: rgba(255,255,255,0.2); color: white; cursor: pointer; font-size: 12px;">
                            🎯 Destacar campos
                        </button>
                        <button onclick="webkitScreenshot()" 
                                style="padding: 8px; border: none; border-radius: 8px; background: rgba(255,255,255,0.2); color: white; cursor: pointer; font-size: 12px;">
                            📸 Screenshot
                        </button>
                    </div>
                    <div id="cpf-result" style="margin-top: 15px; font-size: 11px; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 6px; max-height: 200px; overflow-y: auto;">
                        <div style="text-align: center; opacity: 0.8;">
                            ✅ Toda a lógica do scraper.js integrada!<br>
                            Resultado da consulta aparecerá aqui
                        </div>
                    </div>
                \`;
                
                document.body.appendChild(panel);
                
                // Torna o painel arrastável
                let isDragging = false;
                let currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;
                
                panel.addEventListener('mousedown', dragStart);
                document.addEventListener('mousemove', drag);
                document.addEventListener('mouseup', dragEnd);
                
                function dragStart(e) {
                    initialX = e.clientX - xOffset;
                    initialY = e.clientY - yOffset;
                    if (e.target === panel || e.target.tagName === 'H3') {
                        isDragging = true;
                    }
                }
                
                function drag(e) {
                    if (isDragging) {
                        e.preventDefault();
                        currentX = e.clientX - initialX;
                        currentY = e.clientY - initialY;
                        xOffset = currentX;
                        yOffset = currentY;
                        panel.style.transform = \`translate(\${currentX}px, \${currentY}px)\`;
                    }
                }
                
                function dragEnd() {
                    isDragging = false;
                }
            })();
            
            // Funções helper globais para CPF
            window.webkitConsultarCPF = async function() {
                const cpf = document.getElementById('cpf-input').value;
                const data = document.getElementById('data-input').value;
                const resultDiv = document.getElementById('cpf-result');
                
                resultDiv.innerHTML = '<div style="text-align: center;">🔄 Consultando CPF com lógica completa do scraper.js...</div>';
                
                try {
                    // Sinaliza para o script principal executar a consulta
                    window.webkitCPFConsultaRequest = { cpf, data };
                    console.log('🔍 Solicitando consulta CPF com lógica completa:', cpf, data);
                } catch (error) {
                    resultDiv.innerHTML = \`<div style="color: #ff6b6b;">❌ Erro: \${error.message}</div>\`;
                }
            };
            
            window.webkitAutoFill = function() {
                const cpf = document.getElementById('cpf-input').value || '11144477735';
                const data = document.getElementById('data-input').value || '01/01/1990';
                
                console.log('🔄 WebKit: Preenchendo formulário...');
                
                // Busca campos de CPF
                const cpfSelectors = [
                    'input[name*="cpf"]', 'input[id*="cpf"]', 'input[id*="CPF"]',
                    'input[placeholder*="CPF"]', 'input[type="text"]'
                ];
                
                let cpfField = null;
                for (const selector of cpfSelectors) {
                    cpfField = document.querySelector(selector);
                    if (cpfField) break;
                }
                
                if (cpfField) {
                    cpfField.focus();
                    cpfField.value = cpf;
                    cpfField.dispatchEvent(new Event('input', { bubbles: true }));
                    cpfField.dispatchEvent(new Event('change', { bubbles: true }));
                    console.log('✅ CPF preenchido:', cpf);
                } else {
                    console.log('❌ Campo CPF não encontrado');
                }
                
                // Busca campos de data
                const dataSelectors = [
                    'input[name*="data"]', 'input[id*="data"]', 'input[id*="Data"]',
                    'input[placeholder*="data"]', 'input[type="date"]'
                ];
                
                let dataField = null;
                for (const selector of dataSelectors) {
                    dataField = document.querySelector(selector);
                    if (dataField) break;
                }
                
                if (dataField) {
                    dataField.focus();
                    dataField.value = data;
                    dataField.dispatchEvent(new Event('input', { bubbles: true }));
                    dataField.dispatchEvent(new Event('change', { bubbles: true }));
                    console.log('✅ Data preenchida:', data);
                } else {
                    console.log('❌ Campo data não encontrado');
                }
            };
            
            window.webkitHighlight = function(selector = 'input, button, select') {
                console.log('🎯 WebKit: Destacando elementos...');
                const elements = document.querySelectorAll(selector);
                elements.forEach((el, index) => {
                    el.style.outline = '3px solid #ff6b6b';
                    el.style.backgroundColor = 'rgba(255, 107, 107, 0.1)';
                    
                    setTimeout(() => {
                        el.style.outline = '';
                        el.style.backgroundColor = '';
                    }, 3000);
                });
                console.log(\`✅ \${elements.length} elementos destacados\`);
            };
            
            window.webkitScreenshot = function() {
                console.log('📸 WebKit: Solicitando screenshot...');
                window.webkitScreenshotRequested = true;
            };
            
            window.webkitUpdateResult = function(result) {
                const resultDiv = document.getElementById('cpf-result');
                if (result.error || result.erro) {
                    resultDiv.innerHTML = \`<div style="color: #ff6b6b;">❌ \${result.message || result.mensagem}</div>\`;
                } else {
                    resultDiv.innerHTML = \`
                        <div style="color: #28a745; font-weight: bold;">✅ Consulta realizada com lógica completa!</div>
                        <div style="margin-top: 8px; font-size: 10px;">
                            <strong>CPF:</strong> \${result.cpf || 'N/A'}<br>
                            <strong>Nome:</strong> \${result.nome || 'N/A'}<br>
                            <strong>Situação:</strong> \${result.situacao_cadastral || 'N/A'}<br>
                            <strong>Data Nasc:</strong> \${result.data_nascimento || 'N/A'}<br>
                            <strong>Data Inscrição:</strong> \${result.data_inscricao || 'N/A'}<br>
                            <strong>Dígito Verificador:</strong> \${result.digito_verificador || 'N/A'}
                        </div>
                    \`;
                }
            };
            
            console.log('🦊 WebKit CPF Control Panel carregado com TODA a lógica do scraper.js!');
            console.log('Funções: webkitConsultarCPF(), webkitAutoFill(), webkitHighlight(), webkitScreenshot()');
            `
        });
    }

    async limparCache() {
        console.log('🧹 Limpando cache do navegador...');
        
        if (this.context) {
            try {
                // Limpar cookies
                await this.context.clearCookies();
                console.log('✅ Cookies limpos');
                
                // Limpar storage local e session
                if (this.page) {
                    await this.page.evaluate(() => {
                        localStorage.clear();
                        sessionStorage.clear();
                        // Limpar cache do service worker se existir
                        if ('serviceWorker' in navigator) {
                            navigator.serviceWorker.getRegistrations().then(registrations => {
                                registrations.forEach(registration => registration.unregister());
                            });
                        }
                    });
                    console.log('✅ Storage local e session limpos');
                }
            } catch (error) {
                console.log('⚠️ Erro na limpeza:', error.message);
            }
        }
    }

    async reiniciarNavegador() {
        console.log('🔄 Reiniciando navegador...');
        
        // Fechar navegador atual
        if (this.browser) {
            await this.browser.close();
        }
        
        // Aguardar um pouco
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Reiniciar
        await this.launch();
        
        console.log('✅ Navegador reiniciado');
    }

    async close() {
        console.log('🔄 Fechando navegador e limpando recursos...');
        
        try {
            // Limpar cache antes de fechar
            await this.limparCache();
            
            // Fechar página
            if (this.page) {
                await this.page.close();
            }
            
            // Fechar contexto
            if (this.context) {
                await this.context.close();
            }
            
            // Fechar navegador
            if (this.browser) {
                await this.browser.close();
            }
            
            console.log('✅ Navegador fechado e limpo');
        } catch (error) {
            console.log('⚠️ Erro ao fechar:', error.message);
        }
    }
}

// Função principal
async function main() {
    const consultor = new PlaywrightWebKitCPFConsultor();
    
    try {
        await consultor.launch();
        await consultor.navigateTo('https://servicos.receita.fazenda.gov.br/servicos/cpf/consultasituacao/consultapublica.asp');
        
        // Verificar se argumentos foram fornecidos para execução automática
        const args = process.argv.slice(2);
        if (args.length >= 2) {
            const cpf = args[0];
            const birthDate = args[1];
            
            console.log(`🚀 Executando consulta automática para CPF: ${cpf} e Data: ${birthDate}`);
            
            const resultado = await consultor.consultarCPF(cpf, birthDate);
            console.log('✅ Resultado da consulta:', resultado);
            
            await consultor.close();
            return;
        }
        
        // await consultor.injectControlPanel();
        
        console.log('🎯 WebKit CPF Consultor ativo com TODA a lógica do scraper.js!');
        console.log('💡 Use o painel visual ou as funções do console para interagir');
        console.log('🔍 Melhor compatibilidade com hCaptcha usando WebKit (Safari)');
        
        // Monitoramento de solicitações de consulta
        setInterval(async () => {
            try {
                const consultaRequest = await consultor.page.evaluate(() => {
                    if (window.webkitCPFConsultaRequest) {
                        const request = window.webkitCPFConsultaRequest;
                        window.webkitCPFConsultaRequest = null;
                        return request;
                    }
                    return null;
                });
                
                if (consultaRequest) {
                    console.log('🔄 Executando consulta CPF com lógica completa do scraper.js...');
                    const resultado = await consultor.consultarCPF(consultaRequest.cpf, consultaRequest.data);
                    
                    await consultor.page.evaluate((result) => {
                        if (window.webkitUpdateResult) {
                            window.webkitUpdateResult(result);
                        }
                    }, resultado);
                    
                    console.log('✅ Consulta finalizada:', resultado);
                }
            } catch (error) {
                console.error('❌ Erro no monitoramento de consulta:', error.message);
            }
        }, 1000);
        
        // Monitoramento de solicitações de screenshot
        setInterval(async () => {
            try {
                const screenshotRequested = await consultor.page.evaluate(() => {
                    if (window.webkitScreenshotRequested) {
                        window.webkitScreenshotRequested = false;
                        return true;
                    }
                    return false;
                });
                
                if (screenshotRequested) {
                    //await takeScreenshot(consultor.page, 'manual_request');
                }
            } catch (error) {
                console.error('❌ Erro no screenshot:', error.message);
            }
        }, 500);
        
    } catch (error) {
        console.error('❌ Erro:', error);
        await consultor.close();
    }
}

// Exportar para uso como módulo
module.exports = {
    PlaywrightWebKitCPFConsultor,
    consultarCPF: async (cpf, birthDate) => {
        const consultor = new PlaywrightWebKitCPFConsultor();
        try {
            await consultor.launch();
            await consultor.navigateTo('https://servicos.receita.fazenda.gov.br/servicos/cpf/consultasituacao/consultapublica.asp');
            return await consultor.consultarCPF(cpf, birthDate);
        } finally {
            await consultor.close();
        }
    }
};

// Executar se chamado diretamente
if (require.main === module) {
    main().catch(console.error);
}