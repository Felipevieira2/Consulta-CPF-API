const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

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

class ChromiumCPFConsultor {
    constructor() {
        this.browser = null;
        this.context = null;
        this.page = null;
        this.cookiesPath = path.join(__dirname, 'cookies_hcaptcha.json');
    }
    
    // Sistema de cache de cookies (igual ao scraper.js)
    async loadCookies() {
        try {
            if (fs.existsSync(this.cookiesPath)) {
                const cookiesString = fs.readFileSync(this.cookiesPath, 'utf8');
                const cookies = JSON.parse(cookiesString);
                await this.context.addCookies(cookies);
                console.log('✅ Cookies do hCaptcha carregados (melhor reputação!)');
                return true;
            }
        } catch (error) {
            console.log('⚠️ Não foi possível carregar cookies:', error.message);
        }
        return false;
    }
    
    async saveCookies() {
        try {
            const cookies = await this.context.cookies();
            const relevantCookies = cookies.filter(cookie => 
                cookie.domain.includes('hcaptcha.com') || 
                cookie.domain.includes('receita.fazenda.gov.br')
            );
            fs.writeFileSync(this.cookiesPath, JSON.stringify(relevantCookies, null, 2));
            console.log('✅ Cookies salvos para próxima execução');
        } catch (error) {
            console.log('⚠️ Não foi possível salvar cookies:', error.message);
        }
    }

    async launch() {
        console.log('🚀 Iniciando Playwright com Chromium ANTI-DETECÇÃO...');
        
        // Configurações MELHORADAS com anti-detecção
        this.browser = await chromium.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu',
                '--disable-blink-features=AutomationControlled',  // IMPORTANTE!
                '--disable-features=IsolateOrigins,site-per-process',
                '--lang=pt-BR'
            ]
        });
        
        console.log('👻 Modo SERVIDOR ativado - Chromium anti-detecção');
        
        // User-Agents realistas e variados
        const userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        ];
        const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
        
        // Contexto com TODAS as melhorias anti-detecção
        this.context = await this.browser.newContext({
            viewport: { 
                width: 1366 + Math.floor(Math.random() * 300), 
                height: 768 + Math.floor(Math.random() * 300) 
            },
            userAgent: randomUserAgent,
            ignoreHTTPSErrors: true,
            javaScriptEnabled: true,
            acceptDownloads: false,
            locale: 'pt-BR',
            timezoneId: 'America/Sao_Paulo',
            permissions: ['geolocation', 'notifications'],
            deviceScaleFactor: 1,
            isMobile: false,
            hasTouch: false,
            extraHTTPHeaders: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                'Accept-Encoding': 'gzip, deflate, br',
                'DNT': '1',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Cache-Control': 'max-age=0'
            }
        });

        // TÉCNICAS AVANÇADAS ANTI-DETECÇÃO (iguais ao scraper.js)
        await this.context.addInitScript(() => {
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined,
            });
            delete navigator.__proto__.webdriver;
            
            Object.defineProperty(navigator, 'plugins', {
                get: () => [
                    {
                        0: {type: "application/x-google-chrome-pdf", suffixes: "pdf", description: "Portable Document Format"},
                        description: "Portable Document Format",
                        filename: "internal-pdf-viewer",
                        length: 1,
                        name: "Chrome PDF Plugin"
                    },
                    {
                        0: {type: "application/pdf", suffixes: "pdf", description: ""},
                        description: "",
                        filename: "mhjfbmdgcfjbbpaeojofohoefgiehjai",
                        length: 1,
                        name: "Chrome PDF Viewer"
                    }
                ]
            });
            
            Object.defineProperty(navigator, 'languages', {
                get: () => ['pt-BR', 'pt', 'en-US', 'en']
            });
            
            Object.defineProperty(navigator, 'hardwareConcurrency', {
                get: () => 8
            });
            
            Object.defineProperty(navigator, 'deviceMemory', {
                get: () => 8
            });
            
            const originalQuery = window.navigator.permissions.query;
            window.navigator.permissions.query = (parameters) => (
                parameters.name === 'notifications' ?
                    Promise.resolve({ state: Notification.permission }) :
                    originalQuery(parameters)
            );
            
            if (!window.chrome) {
                window.chrome = {};
            }
            window.chrome.runtime = {
                connect: () => {},
                sendMessage: () => {}
            };
            
            Object.defineProperty(navigator, 'connection', {
                get: () => ({
                    effectiveType: '4g',
                    rtt: 50,
                    downlink: 10,
                    saveData: false
                })
            });
            
            const originalToString = Function.prototype.toString;
            Function.prototype.toString = function() {
                if (this === navigator.webdriver) {
                    return 'function webdriver() { [native code] }';
                }
                return originalToString.apply(this, arguments);
            };
        });

        this.page = await this.context.newPage();
        
        // CARREGAR COOKIES SALVOS
        await this.loadCookies();
        
        // Configurar timeouts para servidor
        this.page.setDefaultNavigationTimeout(60000);
        this.page.setDefaultTimeout(30000);

        // Bloqueio otimizado para servidor
        await this.page.route('**/*', (route) => {
            const resourceType = route.request().resourceType();
            const url = route.request().url();
            
            // Bloquear recursos desnecessários para economizar banda
            if (['image', 'media', 'websocket', 'font'].includes(resourceType) ||
                url.includes('analytics') || url.includes('tracking') || 
                url.includes('ads') || url.includes('facebook') || 
                url.includes('google-analytics') || url.includes('gtag')) {
                route.abort();
            } else {
                route.continue();
            }
        });
        
        console.log('✅ Chromium iniciado para servidor!');
        return this.page;
    }

    async navigateTo(url) {
        console.log(`🌐 Navegando para: ${url}`);
        try {
            await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
        } catch (error) {
            console.log('⚠️ Erro na navegação, tentando novamente...');
            await this.page.goto(url, { waitUntil: 'load', timeout: 30000 });
        }
    }

    // Função principal para consultar CPF (adaptada para servidor)
    async consultarCPF(cpf, birthDate) {
        console.log(`🔍 Iniciando consulta para CPF: ${cpf}`);
        
        // Limpar screenshots anteriores
        const dir = path.join(__dirname, 'screenshots', 'ultima_consulta');
        if (fs.existsSync(dir)) {
            const files = fs.readdirSync(dir);
            files.forEach(file => {
                if (file.endsWith('.png')) {
                    fs.unlinkSync(path.join(dir, file));
                }
            });
        }
        
        // Aguardar um pouco antes de acessar para evitar rate limiting
        console.log('⏳ Aguardando 3 segundos para evitar bloqueios...');
        await this.page.waitForTimeout(3000);
        
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
                { waitUntil: 'domcontentloaded', timeout: 20000 },
                { waitUntil: 'load', timeout: 30000 },
                { waitUntil: 'networkidle', timeout: 45000 }
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
            await this.page.waitForSelector('#txtCPF', { timeout: 15000 });
            await takeScreenshot(this.page, '01_inicial');

            // Preenchimento otimizado
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
            try {
                await this.page.waitForSelector('iframe[title="Widget contendo caixa de seleção para desafio de segurança hCaptcha"]', { timeout: 10000 });
                await takeScreenshot(this.page, '03_antes_captcha');
            } catch (e) {
                console.log('⚠️ Captcha não encontrado, continuando...');
            }

            // Lógica de detecção do hCaptcha
            console.log('🔍 Detectando hCaptcha...');
            try {
                const hcaptchaSelectors = [
                    'iframe[src*="hcaptcha.com"]',
                    'iframe[title*="hCaptcha"]',
                    '.h-captcha iframe'
                ];

                let hcaptchaIframeHandle = null;

                for (const selector of hcaptchaSelectors) {
                    try {
                        await this.page.waitForSelector(selector, { timeout: 5000 });
                        const iframe = await this.page.$(selector);
                        if (iframe) {
                            const src = await iframe.getAttribute('src');
                            if (src && src.includes('hcaptcha.com')) {
                                hcaptchaIframeHandle = iframe;
                                console.log(`✅ hCaptcha encontrado: ${selector}`);
                                break;
                            }
                        }
                    } catch (e) {
                        continue;
                    }
                }

                if (hcaptchaIframeHandle) {
                    console.log('🎯 Tentando interagir com hCaptcha...');
                    await this.page.waitForTimeout(2000);
                    
                    try {
                        const frameHandle = await hcaptchaIframeHandle.contentFrame();
                        if (frameHandle) {
                            await frameHandle.waitForSelector('#checkbox', { timeout: 8000 });
                            
                            const isChecked = await frameHandle.evaluate(() => {
                                const checkbox = document.querySelector('#checkbox');
                                return checkbox && (checkbox.checked || checkbox.getAttribute('aria-checked') === 'true');
                            });
                            
                            if (!isChecked) {
                                await frameHandle.click('#checkbox');
                                console.log('✅ Checkbox clicado');
                                await this.page.waitForTimeout(1000);
                            } else {
                                console.log('✅ Checkbox já marcado');
                            }
                        }
                    } catch (frameError) {
                        console.log('⚠️ Erro na interação com hCaptcha:', frameError.message);
                    }
                } else {
                    console.log('⚠️ hCaptcha não encontrado');
                }
                
            } catch (error) {
                console.error('❌ Erro na detecção do hCaptcha:', error.message);
                await takeScreenshot(this.page, '04_erro_deteccao_hcaptcha');
            }

            // Aguardar e verificar o botão Consultar
            console.log('Aguardando botão Consultar...');
            await this.page.waitForSelector('input[value="Consultar"]', { timeout: 30000 });
            await this.page.waitForTimeout(1000);

            // Clicar no botão Consultar
            console.log('Clicando em Consultar...');
            
            try {
                await this.page.click('input[value="Consultar"]');
                console.log('✅ Clique realizado com sucesso');
                
                // Aguardar resposta da consulta
                console.log('Aguardando resposta da consulta...');
                
                await Promise.race([
                    this.page.waitForNavigation({ 
                        waitUntil: 'networkidle', 
                        timeout: 45000 
                    }).then(() => 'navigation'),
                    
                    // Verificar se já estamos na página de resultado
                    this.page.waitForSelector('.clConteudoDados', { timeout: 5000 })
                        .then(() => 'resultado_encontrado')
                        .catch(() => null),
                    
                    this.page.waitForFunction(
                        () => {
                            // Verificar se document.body existe antes de acessar innerText
                            if (!document.body) return false;
                            
                            try {
                                const body = document.body.innerText || '';
                                const html = document.body.innerHTML || '';
                                
                                return html.includes('Situação Cadastral') || 
                                       html.includes('Comprovante de Situação Cadastral no CPF') ||
                                       body.includes('Data de nascimento informada') ||
                                       body.includes('CPF incorreto') ||
                                       body.includes('CPF não encontrado') ||
                                       body.includes('erro') ||
                                       body.includes('Erro') ||
                                       html.includes('clConteudoDados') ||
                                       html.includes('N<sup>o</sup> do CPF:');
                            } catch (e) {
                                return false;
                            }
                        },
                        { timeout: 45000, polling: 500 }
                    ).then(() => 'content_change'),
                    
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Timeout na resposta')), 45000)
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
                console.log('❌ Erro no clique:', clickError.message);
            }

            await takeScreenshot(this.page, '05_resultado');

            console.log('Verificando se há mensagem de erro...');
            
            // Verificação de erros
            const bodyText = await this.page.evaluate(() => {
                return document.body ? document.body.innerText : '';
            });
            
            if (bodyText.includes('Data de nascimento informada') && bodyText.includes('está divergente')) {
                console.log('Erro detectado: Data de nascimento divergente');
                const resultadoErro = {
                    cpf_consultado: cpf,
                    data_nascimento_consultada: birthDate,
                    timestamp: new Date().toISOString(),
                    sucesso: false,
                    erro: true,
                    mensagem: 'Data de nascimento informada está divergente da constante na base de dados.'
                };
                
                const resultadoPath = path.join(__dirname, 'screenshots', 'ultima_consulta', 'resultado.json');
                fs.writeFileSync(resultadoPath, JSON.stringify(resultadoErro, null, 2));
                
                return {
                    error: true,
                    message: 'Data de nascimento informada está divergente da constante na base de dados.',
                    type: 'data_divergente'
                };
            }

            if (bodyText.includes('CPF incorreto')) {
                console.log('Erro detectado: CPF incorreto');
                const resultadoErro = {
                    cpf_consultado: cpf,
                    data_nascimento_consultada: birthDate,
                    timestamp: new Date().toISOString(),
                    sucesso: false,
                    erro: true,
                    mensagem: 'CPF informado está incorreto'
                };
                
                const resultadoPath = path.join(__dirname, 'screenshots', 'ultima_consulta', 'resultado.json');
                fs.writeFileSync(resultadoPath, JSON.stringify(resultadoErro, null, 2));
                
                return {
                    error: true,
                    message: 'CPF informado está incorreto',
                    type: 'cpf_incorreto'
                };
            }

            if (bodyText.includes('CPF não encontrado')) {
                const resultadoErro = {
                    cpf_consultado: cpf,
                    data_nascimento_consultada: birthDate,
                    timestamp: new Date().toISOString(),
                    sucesso: false,
                    erro: true,
                    mensagem: 'CPF não encontrado na base de dados da Receita Federal'
                };
                
                const resultadoPath = path.join(__dirname, 'screenshots', 'ultima_consulta', 'resultado.json');
                fs.writeFileSync(resultadoPath, JSON.stringify(resultadoErro, null, 2));
                
                return {    
                    error: true,
                    message: 'CPF não encontrado na base de dados da Receita Federal',
                    type: 'cpf_nao_encontrado'
                };
            }

            // Extração de dados
            const data = await this.page.evaluate(() => {
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
            
            // SALVAR COOKIES para próxima execução
            await this.saveCookies();
            
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
            
            // Tentar salvar cookies mesmo em caso de erro
            try {
                await this.saveCookies();
            } catch (e) {
                console.log('⚠️ Não foi possível salvar cookies após erro');
            }
            
            return {
                erro: true,
                mensagem: `Erro ao consultar CPF: ${error.message}`
            };
        }
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
        }
    }
}

// Exportar para uso como módulo
module.exports = {
    ChromiumCPFConsultor,
    consultarCPF: async (cpf, birthDate) => {
        const consultor = new ChromiumCPFConsultor();
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
    const args = process.argv.slice(2);
    if (args.length >= 2) {
        const cpf = args[0];
        const birthDate = args[1];
        
        console.log(`🚀 Executando consulta automática para CPF: ${cpf} e Data: ${birthDate}`);
        
        const consultor = new ChromiumCPFConsultor();
        consultor.launch()
            .then(() => consultor.navigateTo('https://servicos.receita.fazenda.gov.br/servicos/cpf/consultasituacao/consultapublica.asp'))
            .then(() => consultor.consultarCPF(cpf, birthDate))
            .then(resultado => {
                console.log('✅ Resultado da consulta:', resultado);
                return consultor.close();
            })
            .catch(error => {
                console.error('❌ Erro:', error);
                return consultor.close();
            });
    } else {
        console.log('❌ Uso: node scraper-servidor.js <CPF> <DATA_NASCIMENTO>');
        console.log('💡 Exemplo: node scraper-servidor.js 45083784807 29/03/1995');
    }
}
