const { webkit } = require('playwright');
const fs = require('fs');
const path = require('path');

// ============================================
// CONFIGURAÇÕES ANTI-DETECÇÃO
// ============================================

// User-Agents rotativos para parecer mais natural
const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0',
];

// Viewports comuns para variação
const VIEWPORTS = [
    { width: 1920, height: 1080 },
    { width: 1366, height: 768 },
    { width: 1536, height: 864 },
    { width: 1440, height: 900 },
    { width: 1680, height: 1050 },
    { width: 1280, height: 720 },
];

// Função para escolher item aleatório de um array
const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Função para delay aleatório (simula comportamento humano)
const humanDelay = (min = 100, max = 300) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Função para aguardar com delay aleatório
const waitHumanLike = async (page, minMs = 500, maxMs = 1500) => {
    const delay = humanDelay(minMs, maxMs);
    await page.waitForTimeout(delay);
    return delay;
};

// Função para digitar como humano (com variação de velocidade)
const typeHumanLike = async (page, selector, text) => {
    // Primeiro, clica no campo
    await page.click(selector);
    await waitHumanLike(page, 100, 300);
    
    // Limpa o campo antes de digitar
    await page.fill(selector, '');
    await waitHumanLike(page, 50, 150);
    
    // Digita caractere por caractere com delay variável
    for (const char of text) {
        await page.type(selector, char, { delay: humanDelay(50, 150) });
        
        // Ocasionalmente faz uma pausa maior (como humano pensando)
        if (Math.random() < 0.1) {
            await waitHumanLike(page, 200, 500);
        }
    }
    
    await waitHumanLike(page, 100, 300);
};

// Função para mover mouse de forma natural
const moveMouseNaturally = async (page, targetX, targetY) => {
    const steps = humanDelay(5, 15);
    const currentPos = { x: humanDelay(100, 500), y: humanDelay(100, 300) };
    
    for (let i = 0; i <= steps; i++) {
        const progress = i / steps;
        // Movimento com easing (não linear)
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        const x = currentPos.x + (targetX - currentPos.x) * easeProgress;
        const y = currentPos.y + (targetY - currentPos.y) * easeProgress;
        
        // Adiciona pequena variação para parecer mais natural
        const jitterX = (Math.random() - 0.5) * 3;
        const jitterY = (Math.random() - 0.5) * 3;
        
        await page.mouse.move(x + jitterX, y + jitterY);
        await page.waitForTimeout(humanDelay(10, 30));
    }
};

// Função para clicar de forma humana
const clickHumanLike = async (page, selector) => {
    const element = await page.$(selector);
    if (!element) {
        throw new Error(`Elemento não encontrado: ${selector}`);
    }
    
    const box = await element.boundingBox();
    if (!box) {
        // Fallback para clique direto
        await page.click(selector);
        return;
    }
    
    // Calcula posição aleatória dentro do elemento
    const targetX = box.x + box.width * (0.3 + Math.random() * 0.4);
    const targetY = box.y + box.height * (0.3 + Math.random() * 0.4);
    
    // Move mouse naturalmente até o elemento
    await moveMouseNaturally(page, targetX, targetY);
    
    // Pequena pausa antes de clicar
    await waitHumanLike(page, 50, 200);
    
    // Clica
    await page.mouse.click(targetX, targetY);
    
    // Pequena pausa após clicar
    await waitHumanLike(page, 100, 300);
};

// ============================================
// PERSISTÊNCIA DE COOKIES
// ============================================

const COOKIES_FILE = path.join(__dirname, 'cookies_hcaptcha.json');

// Função para salvar cookies após consulta bem-sucedida
const saveCookies = async (context) => {
    try {
        const cookies = await context.cookies();
        
        // Filtra apenas cookies relevantes (hCaptcha e Receita Federal)
        const relevantCookies = cookies.filter(cookie => 
            cookie.domain.includes('hcaptcha.com') || 
            cookie.domain.includes('receita.fazenda.gov.br') ||
            cookie.domain.includes('.gov.br')
        );
        
        if (relevantCookies.length > 0) {
            // Adiciona timestamp para controle de expiração
            const cookieData = {
                savedAt: new Date().toISOString(),
                cookies: relevantCookies
            };
            
            fs.writeFileSync(COOKIES_FILE, JSON.stringify(cookieData, null, 2));
            console.log(`🍪 Cookies salvos: ${relevantCookies.length} cookies armazenados`);
            return true;
        }
        
        console.log('⚠️ Nenhum cookie relevante para salvar');
        return false;
    } catch (error) {
        console.error('❌ Erro ao salvar cookies:', error.message);
        return false;
    }
};

// Função para carregar cookies salvos
const loadCookies = async (context) => {
    try {
        if (!fs.existsSync(COOKIES_FILE)) {
            console.log('📭 Nenhum cookie salvo encontrado (primeira execução)');
            return false;
        }
        
        const cookieData = JSON.parse(fs.readFileSync(COOKIES_FILE, 'utf8'));
        
        // Verifica se os cookies não são muito antigos (máximo 24 horas)
        const savedAt = new Date(cookieData.savedAt);
        const hoursAgo = (Date.now() - savedAt.getTime()) / (1000 * 60 * 60);
        
        if (hoursAgo > 24) {
            console.log(`⏰ Cookies expirados (${hoursAgo.toFixed(1)} horas atrás) - serão renovados`);
            fs.unlinkSync(COOKIES_FILE);
            return false;
        }
        
        // Filtra cookies que ainda não expiraram
        const now = Date.now() / 1000;
        const validCookies = cookieData.cookies.filter(cookie => {
            if (cookie.expires && cookie.expires > 0) {
                return cookie.expires > now;
            }
            return true; // Session cookies são válidos
        });
        
        if (validCookies.length > 0) {
            await context.addCookies(validCookies);
            console.log(`🍪 Cookies carregados: ${validCookies.length} cookies (salvos há ${hoursAgo.toFixed(1)} horas)`);
            return true;
        }
        
        console.log('⚠️ Todos os cookies expiraram');
        return false;
    } catch (error) {
        console.error('❌ Erro ao carregar cookies:', error.message);
        return false;
    }
};

// Função para limpar cookies salvos (útil para debug)
const clearSavedCookies = () => {
    try {
        if (fs.existsSync(COOKIES_FILE)) {
            fs.unlinkSync(COOKIES_FILE);
            console.log('🗑️ Cookies salvos removidos');
            return true;
        }
        console.log('📭 Nenhum cookie para remover');
        return false;
    } catch (error) {
        console.error('❌ Erro ao remover cookies:', error.message);
        return false;
    }
};

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
        
        // Configurações aleatórias para esta instância
        this.userAgent = randomChoice(USER_AGENTS);
        this.viewport = randomChoice(VIEWPORTS);
    }

    async launch() {
        console.log('🚀 Iniciando Playwright com WebKit (Safari) para consulta CPF...');
        console.log(`🎭 User-Agent: ${this.userAgent.substring(0, 50)}...`);
        console.log(`📐 Viewport: ${this.viewport.width}x${this.viewport.height}`);
        
        // Configurações do WebKit - modo visual ou headless
        const isVisual = process.env.VISUAL_MODE === 'true' || process.argv.includes('--visual');
        
        this.browser = await webkit.launch({
            headless: !isVisual, // false = mostra navegador, true = oculto
            slowMo: isVisual ? humanDelay(300, 700) : humanDelay(50, 150), // Delay variável
            // WebKit não suporta os mesmos args do Chrome/Chromium
            // Usar apenas args compatíveis com WebKit
            args: []
        });
        
        if (isVisual) {
            console.log('🖥️ Modo VISUAL ativado - navegador será exibido!');
        } else {
            console.log('👻 Modo HEADLESS ativado - navegador oculto');
        }
        
        // Cria contexto com configurações aleatorizadas para evitar fingerprinting
        this.context = await this.browser.newContext({
            viewport: this.viewport,
            userAgent: this.userAgent,
            ignoreHTTPSErrors: true,
            javaScriptEnabled: true,
            acceptDownloads: false,
            locale: 'pt-BR',
            timezoneId: 'America/Sao_Paulo',
            // Configurações adicionais para parecer mais real
            hasTouch: false,
            isMobile: false,
            deviceScaleFactor: randomChoice([1, 1, 1, 2]), // Maioria usa 1x
            colorScheme: randomChoice(['light', 'light', 'light', 'dark']), // Maioria usa light
        });

        // 🍪 Carregar cookies salvos de sessões anteriores (aumenta confiança do hCaptcha)
        const cookiesLoaded = await loadCookies(this.context);
        if (cookiesLoaded) {
            console.log('✅ Sessão anterior restaurada - maior chance de checkbox simples!');
        }

        // Anti-detecção expandida - mascara múltiplos sinais de automação
        await this.context.addInitScript(() => {
            // 1. Remove webdriver
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined,
            });
            delete navigator.__proto__.webdriver;
            
            // 2. Simula plugins (navegadores reais têm plugins)
            Object.defineProperty(navigator, 'plugins', {
                get: () => {
                    const plugins = [
                        { name: 'Chrome PDF Plugin', filename: 'internal-pdf-viewer' },
                        { name: 'Chrome PDF Viewer', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai' },
                        { name: 'Native Client', filename: 'internal-nacl-plugin' },
                    ];
                    plugins.length = 3;
                    return plugins;
                },
            });
            
            // 3. Simula idiomas
            Object.defineProperty(navigator, 'languages', {
                get: () => ['pt-BR', 'pt', 'en-US', 'en'],
            });
            
            // 4. Simula hardware concurrency (núcleos de CPU)
            Object.defineProperty(navigator, 'hardwareConcurrency', {
                get: () => [4, 8, 12, 16][Math.floor(Math.random() * 4)],
            });
            
            // 5. Simula memória do dispositivo
            Object.defineProperty(navigator, 'deviceMemory', {
                get: () => [4, 8, 16][Math.floor(Math.random() * 3)],
            });
            
            // 6. Adiciona objeto chrome (presente em Chrome real)
            window.chrome = {
                runtime: {},
                loadTimes: function() {},
                csi: function() {},
                app: {},
            };
            
            // 7. Mascara permissões
            const originalQuery = window.navigator.permissions?.query;
            if (originalQuery) {
                window.navigator.permissions.query = (parameters) => (
                    parameters.name === 'notifications' ?
                        Promise.resolve({ state: Notification.permission }) :
                        originalQuery(parameters)
                );
            }
            
            // 8. Sobrescreve toString para parecer nativo
            const originalToString = Function.prototype.toString;
            Function.prototype.toString = function() {
                if (this === window.navigator.permissions?.query) {
                    return 'function query() { [native code] }';
                }
                return originalToString.call(this);
            };
            
            // 9. Remove sinais de automação no WebGL
            const getParameter = WebGLRenderingContext.prototype.getParameter;
            WebGLRenderingContext.prototype.getParameter = function(parameter) {
                // UNMASKED_VENDOR_WEBGL
                if (parameter === 37445) {
                    return 'Intel Inc.';
                }
                // UNMASKED_RENDERER_WEBGL
                if (parameter === 37446) {
                    return 'Intel Iris OpenGL Engine';
                }
                return getParameter.call(this, parameter);
            };
            
            // 10. Simula histórico de navegação
            Object.defineProperty(window.history, 'length', {
                get: () => Math.floor(Math.random() * 5) + 2,
            });
            
            console.log('🛡️ Anti-detecção ativada');
        });

        this.page = await this.context.newPage();
        
        // Configurar timeouts otimizados
        this.page.setDefaultNavigationTimeout(45000);
        this.page.setDefaultTimeout(20000);

        // IMPORTANTE: Não bloquear recursos para evitar detecção
        // O hCaptcha pode detectar se recursos estão sendo bloqueados
        // Apenas bloquear ads externos que não afetam funcionalidade
        await this.page.route('**/*', (route) => {
            const url = route.request().url();
            
            // Bloquear APENAS ads de terceiros que não afetam o site
            if (url.includes('doubleclick.net') || 
                url.includes('googlesyndication.com') ||
                url.includes('adservice.google')) {
                route.abort();
            } else {
                // Permitir TUDO mais, incluindo imagens, scripts, etc.
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
        // Aguardar tempo aleatório para evitar rate limiting (parece mais humano)
        const delayInicial = humanDelay(2000, 5000);
        console.log(`⏳ Aguardando ${delayInicial}ms para evitar bloqueios...`);
        await this.page.waitForTimeout(delayInicial);
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
            
            // Simular comportamento humano: mover mouse pela página antes de interagir
            console.log('🖱️ Simulando comportamento humano...');
            await moveMouseNaturally(this.page, humanDelay(200, 400), humanDelay(200, 400));
            await waitHumanLike(this.page, 500, 1500);

            // Preenchimento com digitação humana (NÃO injetar valores diretamente!)
            console.log('Preenchendo CPF com digitação humana...');
            await clickHumanLike(this.page, '#txtCPF');
            await typeHumanLike(this.page, '#txtCPF', cpf);
            
            // Pequena pausa entre campos (como humano faria)
            await waitHumanLike(this.page, 300, 800);

            console.log('Preenchendo data de nascimento com digitação humana...');
            await clickHumanLike(this.page, '#txtDataNascimento');
            await typeHumanLike(this.page, '#txtDataNascimento', birthDate);
            
            await waitHumanLike(this.page, 200, 500);
            await takeScreenshot(this.page, '02_apos_preenchimento');

            // Aguardar carregamento do captcha com delay humano
            console.log('Aguardando carregamento do captcha...');
            await waitHumanLike(this.page, 500, 1500);
            await this.page.waitForSelector('iframe[title="Widget contendo caixa de seleção para desafio de segurança hCaptcha"]');
            await takeScreenshot(this.page, '03_antes_captcha');

            // Lógica otimizada de detecção do hCaptcha com comportamento humano
            console.log('🔍 Detectando hCaptcha...');
            try {
                // Seletores principais do hCaptcha
                const hcaptchaSelectors = [
                    'iframe[src*="hcaptcha.com"]',
                    'iframe[title*="hCaptcha"]',
                    '.h-captcha iframe'
                ];

                let hcaptchaIframeHandle = null;

                // Buscar iframe do hCaptcha
                for (const selector of hcaptchaSelectors) {
                    try {
                        await this.page.waitForSelector(selector, { timeout: 4000 });
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
                    console.log('🎯 Tentando interagir com hCaptcha de forma humana...');
                    
                    // Delay aleatório antes de interagir (humanos não clicam instantaneamente)
                    await waitHumanLike(this.page, 800, 2000);
                    
                    // Mover mouse em direção ao captcha de forma natural
                    const iframeBox = await hcaptchaIframeHandle.boundingBox();
                    if (iframeBox) {
                        // Mover para área próxima do captcha primeiro
                        await moveMouseNaturally(
                            this.page, 
                            iframeBox.x + iframeBox.width / 2 + humanDelay(-20, 20),
                            iframeBox.y + iframeBox.height / 2 + humanDelay(-10, 10)
                        );
                        await waitHumanLike(this.page, 300, 800);
                    }
                    
                    try {
                        const frameHandle = await hcaptchaIframeHandle.contentFrame();
                        if (frameHandle) {
                            await frameHandle.waitForSelector('#checkbox', { timeout: 5000 });
                            
                            const isChecked = await frameHandle.evaluate(() => {
                                const checkbox = document.querySelector('#checkbox');
                                return checkbox && (checkbox.checked || checkbox.getAttribute('aria-checked') === 'true');
                            });
                            
                            if (!isChecked) {
                                // Clique no checkbox com comportamento humano
                                const checkboxElement = await frameHandle.$('#checkbox');
                                if (checkboxElement) {
                                    const checkboxBox = await checkboxElement.boundingBox();
                                    if (checkboxBox) {
                                        // Posição aleatória dentro do checkbox
                                        const clickX = checkboxBox.x + checkboxBox.width * (0.3 + Math.random() * 0.4);
                                        const clickY = checkboxBox.y + checkboxBox.height * (0.3 + Math.random() * 0.4);
                                        
                                        await this.page.mouse.click(clickX, clickY);
                                        console.log('✅ Checkbox clicado com movimento humano');
                                    } else {
                                        await frameHandle.click('#checkbox');
                                        console.log('✅ Checkbox clicado (fallback)');
                                    }
                                } else {
                                    await frameHandle.click('#checkbox');
                                    console.log('✅ Checkbox clicado (fallback)');
                                }

                                // Delay aleatório após clique
                                await waitHumanLike(this.page, 2000, 4000);
                            } else {
                                console.log('✅ Checkbox já marcado');
                            }

                            // Verificar se o checkbox foi marcado
                            const isChecked2 = await frameHandle.evaluate(() => {
                                const checkbox = document.querySelector('#checkbox');
                                return checkbox && (checkbox.checked || checkbox.getAttribute('aria-checked') === 'true');
                            });

                            // Aguardar até que o checkbox esteja realmente marcado
                            let checkboxMarked = isChecked2;
                            let tentativas = 0;
                            const maxTentativas = 10; // mais tentativas com delays variáveis
                            
                            while (!checkboxMarked && tentativas < maxTentativas) {
                                console.log(`⏳ Aguardando checkbox ser marcado... (tentativa ${tentativas + 1}/${maxTentativas})`);
                                
                                // Delay variável entre verificações
                                await waitHumanLike(this.page, 800, 1500);
                                
                                if (tentativas % 3 === 0) {
                                    await takeScreenshot(this.page, `04_captcha_tentativa_${tentativas}`);
                                }
                                
                                // Verifica novamente se o checkbox está marcado
                                checkboxMarked = await frameHandle.evaluate(() => {
                                    const checkbox = document.querySelector('#checkbox');
                                    return checkbox && (checkbox.checked || checkbox.getAttribute('aria-checked') === 'true');
                                });
                                
                                tentativas++;
                            }
                            
                            if (checkboxMarked) {
                                console.log('✅ Checkbox marcado com sucesso');
                            } else {
                                console.log('❌ Timeout: Checkbox não foi marcado após várias tentativas');
                            }
                        }
                    } catch (frameError) {
                        console.log('⚠️ Erro na interação com hCaptcha:', frameError.message);
                    }
                } else {
                    console.log('⚠️ hCaptcha não encontrado');
                }
                await waitHumanLike(this.page, 300, 800);
                await takeScreenshot(this.page, '04_depois_do_clique_captcha');
            } catch (error) {
                console.error('❌ Erro na detecção avançada do hCaptcha:', error);
                await takeScreenshot(this.page, '04_erro_deteccao_hcaptcha');
            }

            // Aguardar e verificar o botão Consultar (do scraper.js)
            console.log('Aguardando botão Consultar...');
            await this.page.waitForSelector('input[value="Consultar"]', {
                timeout: 30000
            });

            // Aguardar tempo aleatório antes de clicar (comportamento humano)
            await waitHumanLike(this.page, 500, 1200);

            // Clicar no botão Consultar com comportamento humano
            console.log('Clicando em Consultar com movimento humano...');
            
            try {
                // Usar clique humano no botão Consultar
                await clickHumanLike(this.page, 'input[value="Consultar"]');
                console.log('✅ Clique realizado com movimento humano');
                
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
            
            // 🍪 Salvar cookies após consulta bem-sucedida (para próximas execuções)
            await saveCookies(this.context);
            
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

    async close() {
        if (this.browser) {
            await this.browser.close();
        }
    }
}

// Função principal
async function main() {
    const args = process.argv.slice(2);
    
    // Verificar se é para limpar cookies
    if (args.includes('--clear-cookies')) {
        console.log('🗑️ Limpando cookies salvos...');
        clearSavedCookies();
        console.log('✅ Cookies limpos! Execute novamente sem --clear-cookies para consultar.');
        return;
    }
    
    // Mostrar ajuda
    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
🔍 Consultor de CPF - Receita Federal

USO:
  node scraper.js <CPF> <DATA_NASCIMENTO> [opções]

EXEMPLOS:
  node scraper.js 11144477735 01/01/1990
  node scraper.js 11144477735 01/01/1990 --visual
  node scraper.js --clear-cookies

OPÇÕES:
  --visual          Mostra o navegador (útil para debug)
  --clear-cookies   Limpa cookies salvos e sai
  --help, -h        Mostra esta ajuda

🍪 PERSISTÊNCIA DE COOKIES:
  - Cookies são salvos automaticamente após consulta bem-sucedida
  - Cookies salvos aumentam a chance de passar pelo captcha simples
  - Cookies expiram após 24 horas
  - Use --clear-cookies para forçar nova sessão
        `);
        return;
    }
    
    const consultor = new PlaywrightWebKitCPFConsultor();
    
    try {
        await consultor.launch();
        await consultor.navigateTo('https://servicos.receita.fazenda.gov.br/servicos/cpf/consultasituacao/consultapublica.asp');
        
        // Filtrar argumentos (remover flags)
        const filteredArgs = args.filter(arg => !arg.startsWith('--'));
        
        // Verificar se argumentos foram fornecidos para execução automática
        if (filteredArgs.length >= 2) {
            const cpf = filteredArgs[0];
            const birthDate = filteredArgs[1];
            
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
    },
    // Funções de gerenciamento de cookies
    clearCookies: clearSavedCookies,
    getCookiesPath: () => COOKIES_FILE,
};

// Executar se chamado diretamente
if (require.main === module) {
    main().catch(console.error);
}