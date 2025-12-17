const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Função para criar diretório de screenshots
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

class PlaywrightChromiumCPFConsultor {
    constructor(options = {}) {
        this.browser = null;
        this.context = null;
        this.page = null;
        this.screenshotDir = setupScreenshotDir();
        this.options = {
            // Caminho para o Thorium Browser (ajuste conforme sua instalação)
            executablePath: options.executablePath || process.env.THORIUM_PATH || null,
            // Outras opções
            headless: options.headless !== undefined ? options.headless : true,
            slowMo: options.slowMo || 100
        };
    }

    async launch() {
        console.log('🚀 Iniciando Playwright com Chromium/Thorium para consulta CPF...');
        
        // Configurações do Chromium - modo visual ou headless
        const isVisual = process.env.VISUAL_MODE === 'true' || process.argv.includes('--visual');
        
        const launchOptions = {
            headless: isVisual ? false : this.options.headless,
            slowMo: isVisual ? 500 : this.options.slowMo,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu',
                '--disable-blink-features=AutomationControlled',
                '--disable-features=IsolateOrigins,site-per-process',
                '--lang=pt-BR',
                '--window-size=1366,768'
            ]
        };

        // Se um caminho para o Thorium foi especificado, use-o
        if (this.options.executablePath) {
            launchOptions.executablePath = this.options.executablePath;
            console.log(`🦊 Usando Thorium/Chromium customizado: ${this.options.executablePath}`);
        }
        
        this.browser = await chromium.launch(launchOptions);
        
        if (isVisual) {
            console.log('🖥️ Modo VISUAL ativado - navegador será exibido!');
        } else {
            console.log('👻 Modo HEADLESS ativado - navegador oculto');
        }
        
        // Contexto Ultra Stealth - Simula navegador real
        const stealthUserAgents = [
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
            'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/120.0',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
        ];
        
        const randomUserAgent = stealthUserAgents[Math.floor(Math.random() * stealthUserAgents.length)];
        
        this.context = await this.browser.newContext({
            // Viewport com variação humana
            viewport: { 
                width: 1366 + Math.floor(Math.random() * 100), 
                height: 768 + Math.floor(Math.random() * 100) 
            },
            userAgent: randomUserAgent,
            ignoreHTTPSErrors: true,
            javaScriptEnabled: true,
            acceptDownloads: false,
            locale: 'pt-BR',
            timezoneId: 'America/Sao_Paulo',
            
            // Headers stealth
            extraHTTPHeaders: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
                'Cache-Control': 'max-age=0',
                'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
                'Sec-Ch-Ua-Mobile': '?0',
                'Sec-Ch-Ua-Platform': '"Linux"',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1',
                'Upgrade-Insecure-Requests': '1'
            },
            
            // Configurações de privacidade realistas
            permissions: ['geolocation'],
            geolocation: { latitude: -23.5505, longitude: -46.6333 }, // São Paulo
            colorScheme: 'light',
            
            // Simular comportamento real
            hasTouch: false,
            isMobile: false,
            
            // Configurações de rede realistas
            offline: false,
            
            // Simular dispositivo real
            deviceScaleFactor: 1,
            
            // Cookies e storage
            storageState: undefined // Começar limpo mas permitir cookies
        });

        // Modo Stealth Avançado - Remove TODOS os sinais de automação
        await this.context.addInitScript(() => {
            // 1. Remover webdriver
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined,
            });
            delete navigator.__proto__.webdriver;
            
            // 2. Mascarar plugins
            Object.defineProperty(navigator, 'plugins', {
                get: () => [1, 2, 3, 4, 5] // Simular plugins reais
            });
            
            // 3. Mascarar languages
            Object.defineProperty(navigator, 'languages', {
                get: () => ['pt-BR', 'pt', 'en-US', 'en']
            });
            
            // 4. Simular permissões
            const originalQuery = window.navigator.permissions.query;
            window.navigator.permissions.query = (parameters) => (
                parameters.name === 'notifications' ?
                    Promise.resolve({ state: 'prompt' }) :
                    originalQuery(parameters)
            );
            
            // 5. Mascarar chrome runtime
            if (window.chrome) {
                Object.defineProperty(window.chrome, 'runtime', {
                    get: () => undefined
                });
            }
            
            // 6. Remover sinais do Playwright
            delete window.__playwright;
            delete window.__pw_manual;
            delete window.__PW_inspect;
            
            // 7. Mascarar stack traces
            const originalError = Error.prepareStackTrace;
            Error.prepareStackTrace = (error, stack) => {
                if (originalError) return originalError(error, stack);
                return stack.toString();
            };
            
            // 8. Simular comportamento de mouse/teclado humano
            let mouseX = 0, mouseY = 0;
            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });
            
            // 9. Mascarar timing de automação
            const originalSetTimeout = window.setTimeout;
            window.setTimeout = function(callback, delay) {
                // Adicionar variação humana no timing
                const humanDelay = delay + Math.random() * 100 - 50;
                return originalSetTimeout(callback, Math.max(0, humanDelay));
            };
            
            // 10. Simular viewport real
            Object.defineProperty(window.screen, 'availWidth', { get: () => 1366 });
            Object.defineProperty(window.screen, 'availHeight', { get: () => 768 });
            
            console.log('🥷 Modo Stealth Avançado ativado');
        });

        this.page = await this.context.newPage();
        
        // Configurar timeouts otimizados
        this.page.setDefaultNavigationTimeout(45000);
        this.page.setDefaultTimeout(20000);

        // Roteamento stealth - Bloquear apenas o essencial
        await this.page.route('**/*', (route) => {
            const resourceType = route.request().resourceType();
            const url = route.request().url();
            
            // Lista de domínios suspeitos para bloquear
            const blockedDomains = [
                'google-analytics.com',
                'googletagmanager.com',
                'facebook.com',
                'doubleclick.net',
                'googlesyndication.com',
                'amazon-adsystem.com'
            ];
            
            // Bloquear apenas recursos claramente desnecessários
            const shouldBlock = blockedDomains.some(domain => url.includes(domain)) ||
                               (resourceType === 'image' && !url.includes('captcha') && !url.includes('hcaptcha')) ||
                               resourceType === 'media' ||
                               url.includes('/ads/') ||
                               url.includes('/tracking/');
            
            if (shouldBlock) {
                route.abort();
            } else {
                // Adicionar headers realistas
                const headers = route.request().headers();
                headers['sec-fetch-site'] = 'same-origin';
                headers['sec-fetch-mode'] = 'cors';
                
                route.continue({ headers });
            }
        });
        
        console.log('✅ Chromium/Thorium iniciado para consulta CPF!');
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

    // Método para simular digitação humana
    async preencherComportamentoHumano(seletor, texto) {
        try {
            // Aguardar elemento aparecer
            await this.page.waitForSelector(seletor, { timeout: 10000 });
            
            // Mover mouse para o campo (comportamento humano)
            const elemento = await this.page.$(seletor);
            const box = await elemento.boundingBox();
            
            if (box) {
                // Mover mouse gradualmente para o campo
                await this.page.mouse.move(
                    box.x + box.width / 2 + Math.random() * 10 - 5,
                    box.y + box.height / 2 + Math.random() * 10 - 5,
                    { steps: Math.floor(Math.random() * 5) + 3 }
                );
                
                // Pequena pausa antes de clicar
                await this.page.waitForTimeout(Math.random() * 300 + 100);
            }
            
            // Clicar no campo
            await this.page.click(seletor);
            
            // Limpar campo existente com comportamento humano
            await this.page.keyboard.down('Control');
            await this.page.keyboard.press('KeyA');
            await this.page.keyboard.up('Control');
            await this.page.waitForTimeout(Math.random() * 100 + 50);
            
            // Digitar caractere por caractere com variação de velocidade
            for (let i = 0; i < texto.length; i++) {
                await this.page.keyboard.type(texto[i]);
                
                // Variação humana na velocidade de digitação
                const delay = Math.random() * 150 + 50; // 50-200ms entre caracteres
                await this.page.waitForTimeout(delay);
                
                // Ocasionalmente fazer uma pausa mais longa (como humanos fazem)
                if (Math.random() < 0.1) {
                    await this.page.waitForTimeout(Math.random() * 500 + 200);
                }
            }
            
            // Pequena pausa após terminar de digitar
            await this.page.waitForTimeout(Math.random() * 200 + 100);
            
            // Disparar eventos de mudança
            await this.page.evaluate((sel) => {
                const element = document.querySelector(sel);
                if (element) {
                    element.dispatchEvent(new Event('input', { bubbles: true }));
                    element.dispatchEvent(new Event('change', { bubbles: true }));
                    element.dispatchEvent(new Event('blur', { bubbles: true }));
                }
            }, seletor);
            
        } catch (error) {
            console.log(`⚠️ Erro no preenchimento humano de ${seletor}:`, error.message);
            
            // Fallback para método tradicional
            await this.page.fill(seletor, texto);
        }
    }

    // Método para simular movimento de mouse aleatório
    async simularMovimentoMouse() {
        try {
            const viewport = this.page.viewportSize();
            const x = Math.random() * viewport.width;
            const y = Math.random() * viewport.height;
            
            await this.page.mouse.move(x, y, { 
                steps: Math.floor(Math.random() * 10) + 5 
            });
        } catch (error) {
            // Ignorar erros de movimento de mouse
        }
    }

    // Função principal para consultar CPF
    async consultarCPF(cpf, birthDate) {
        console.log(`🔍 Iniciando consulta stealth para CPF: ${cpf}`);
        
        // Simular comportamento humano antes de começar
        console.log('🥷 Simulando comportamento humano...');
        await this.simularMovimentoMouse();
        
        // Aguardar com variação humana
        const delayHumano = 2000 + Math.random() * 3000; // 2-5 segundos
        console.log(`⏳ Aguardando ${Math.round(delayHumano/1000)}s para evitar detecção...`);
        await this.page.waitForTimeout(delayHumano);
        
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

            // Preenchimento com comportamento humano realista
            console.log('Preenchendo CPF com comportamento humano...');
            await this.preencherComportamentoHumano('#txtCPF', cpf);

            console.log('Preenchendo data de nascimento com comportamento humano...');
            await this.preencherComportamentoHumano('#txtDataNascimento', birthDate);
            await takeScreenshot(this.page, '02_apos_preenchimento');

            // Aguardar carregamento do captcha
            console.log('Aguardando carregamento do captcha...');
            await this.page.waitForSelector('iframe[title="Widget contendo caixa de seleção para desafio de segurança hCaptcha"]', { timeout: 10000 }).catch(() => {
                console.log('⚠️ Captcha não encontrado - continuando...');
            });
            await takeScreenshot(this.page, '03_antes_captcha');

            // Detecção inteligente de captcha
            console.log('🔍 Verificando se há captcha na página...');
            
            let captchaEncontrado = false;
            let captchaResolvido = false;
            
            try {
                const temCaptchaVisivel = await this.page.evaluate(() => {
                    const iframes = document.querySelectorAll('iframe');
                    let captchaIframe = null;
                    
                    for (const iframe of iframes) {
                        const src = iframe.src || '';
                        const title = iframe.title || '';
                        
                        if (src.includes('hcaptcha.com') || title.toLowerCase().includes('captcha')) {
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
                    
                    const isVisual = process.env.VISUAL_MODE === 'true' || process.argv.includes('--visual');
                    
                    if (isVisual) {
                        console.log('🖥️ Modo visual: aguardando resolução manual do captcha...');
                        console.log('👉 Por favor, resolva o captcha manualmente no navegador');
                        
                        // Aguardar resolução manual
                        let tentativasEspera = 0;
                        const maxEspera = 120; // 120 segundos (2 minutos)
                        
                        while (!captchaResolvido && tentativasEspera < maxEspera) {
                            await this.page.waitForTimeout(1000);
                            
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
                        
                        if (!captchaResolvido) {
                            throw new Error('Timeout: Captcha não foi resolvido no tempo limite');
                        }
                    } else {
                        console.log('⚠️ Captcha detectado em modo headless - não é possível resolver automaticamente');
                        console.log('💡 Use VISUAL_MODE=true para resolver manualmente');
                    }
                } else {
                    console.log('ℹ️ Nenhum captcha visível encontrado na página');
                }
                
                await takeScreenshot(this.page, '04_apos_captcha');
                
            } catch (error) {
                console.log('⚠️ Erro na verificação de captcha:', error.message);
                await takeScreenshot(this.page, '04_erro_captcha');
            }

            // Aguardar e verificar o botão Consultar
            console.log('Aguardando botão Consultar...');
            await this.page.waitForSelector('input[value="Consultar"]', { timeout: 30000 });
            await this.page.waitForTimeout(500);

            // Clicar no botão Consultar
            console.log('Clicando em Consultar...');
            
            try {
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
                
                // Estratégia 2: Clique via JavaScript
                if (!cliqueSucesso) {
                    try {
                        await this.page.evaluate(() => {
                            const botao = document.querySelector('input[value="Consultar"]');
                            if (botao) botao.click();
                        });
                        console.log('✅ Clique via JavaScript realizado');
                        cliqueSucesso = true;
                    } catch (error) {
                        console.log('⚠️ Clique via JavaScript falhou:', error.message);
                    }
                }
                
                // Estratégia 3: Submeter formulário
                if (!cliqueSucesso) {
                    try {
                        await this.page.evaluate(() => {
                            const form = document.querySelector('form');
                            if (form) form.submit();
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
                
                // Aguardar resposta da consulta
                console.log('Aguardando resposta da consulta...');
                
                await Promise.race([
                    this.page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }).then(() => 'navigation'),
                    this.page.waitForSelector('.clConteudoDados', { timeout: 5000 }).then(() => 'resultado_encontrado').catch(() => null),
                    this.page.waitForFunction(
                        () => {
                            if (!document.body) return false;
                            
                            try {
                                const html = document.body.innerHTML || '';
                                return html.includes('Situação Cadastral') || 
                                       html.includes('Comprovante de Situação Cadastral no CPF') ||
                                       html.includes('clConteudoDados') ||
                                       html.includes('N<sup>o</sup> do CPF:');
                            } catch (e) {
                                return false;
                            }
                        },
                        { timeout: 30000, polling: 500 }
                    ).then(() => 'content_change'),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Timeout na resposta')), 30000)
                    )
                ]).catch(async (error) => {
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
                    
                    throw error;
                });
                
                console.log('✅ Resposta recebida da consulta');
                
            } catch (clickError) {
                console.log('❌ Erro no processo de consulta:', clickError.message);
                throw clickError;
            }

            await this.page.waitForTimeout(1000);
            await takeScreenshot(this.page, '05_resultado');

            // Verificar erros
            console.log('Verificando se há mensagens de erro...');
            
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
                console.log('Erro detectado: CPF incorreto');
                return {
                    error: true,
                    message: 'CPF informado está incorreto',
                    type: 'cpf_incorreto'
                };
            }

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

            // Extrair dados
            const data = await this.page.evaluate(() => {
                const getTextContent = (selector) => {
                    const el = document.querySelector(selector);
                    return el ? el.textContent.trim() : null;
                };
                
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

            console.log('Consulta finalizada com sucesso');
            await takeScreenshot(this.page, '06_final_sucesso');
            
            // Salvar resultado
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

    async close() {
        console.log('🔄 Fechando navegador...');
        
        try {
            if (this.page) await this.page.close();
            if (this.context) await this.context.close();
            if (this.browser) await this.browser.close();
            
            console.log('✅ Navegador fechado');
        } catch (error) {
            console.log('⚠️ Erro ao fechar:', error.message);
        }
    }
}

// Função principal
async function main() {
    // Opções para configurar o Thorium
    const options = {};
    
    // Se você instalou o Thorium, adicione o caminho aqui
    // Exemplos de caminhos comuns no Linux:
    // - /usr/bin/thorium-browser
    // - /opt/thorium/thorium-browser
    // - ~/Applications/thorium-browser
    
    if (process.env.THORIUM_PATH) {
        options.executablePath = process.env.THORIUM_PATH;
    }
    
    const consultor = new PlaywrightChromiumCPFConsultor(options);
    
    try {
        await consultor.launch();
        await consultor.navigateTo('https://servicos.receita.fazenda.gov.br/servicos/cpf/consultasituacao/consultapublica.asp');
        
        // Verificar se argumentos foram fornecidos para execução automática
        const args = process.argv.slice(2).filter(arg => !arg.startsWith('--'));
        if (args.length >= 2) {
            const cpf = args[0];
            const birthDate = args[1];
            
            console.log(`🚀 Executando consulta automática para CPF: ${cpf} e Data: ${birthDate}`);
            
            const resultado = await consultor.consultarCPF(cpf, birthDate);
            console.log('✅ Resultado da consulta:', JSON.stringify(resultado, null, 2));
            
            await consultor.close();
            return;
        }
        
        console.log('🎯 Chromium/Thorium CPF Consultor ativo!');
        console.log('💡 Execute com: node scraper-linux-chromium.js CPF DATA');
        console.log('💡 Exemplo: node scraper-linux-chromium.js 11144477735 01/01/1990');
        console.log('💡 Modo visual: VISUAL_MODE=true node scraper-linux-chromium.js 11144477735 01/01/1990');
        
    } catch (error) {
        console.error('❌ Erro:', error);
        await consultor.close();
    }
}

// Exportar para uso como módulo
module.exports = {
    PlaywrightChromiumCPFConsultor,
    consultarCPF: async (cpf, birthDate, options = {}) => {
        const consultor = new PlaywrightChromiumCPFConsultor(options);
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

