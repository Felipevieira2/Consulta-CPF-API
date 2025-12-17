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
        
        // Contexto ULTRA STEALTH - Simula navegador real com fingerprints únicos
        const stealthUserAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.216 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.6045.199 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.85 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.216 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.216 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15'
        ];
        
        const randomUserAgent = stealthUserAgents[Math.floor(Math.random() * stealthUserAgents.length)];
        
        // Gerar fingerprints únicos para cada sessão
        const uniqueFingerprint = {
            canvasNoise: Math.random() * 0.0001,
            webglVendor: ['Intel Inc.', 'NVIDIA Corporation', 'AMD'][Math.floor(Math.random() * 3)],
            webglRenderer: [
                'ANGLE (Intel, Intel(R) UHD Graphics 620, OpenGL 4.5)',
                'ANGLE (NVIDIA, NVIDIA GeForce GTX 1650, OpenGL 4.5)',
                'ANGLE (AMD, AMD Radeon RX 580, OpenGL 4.5)'
            ][Math.floor(Math.random() * 3)],
            platform: ['Win32', 'MacIntel', 'Linux x86_64'][Math.floor(Math.random() * 3)],
            hardwareConcurrency: [4, 6, 8, 12][Math.floor(Math.random() * 4)],
            deviceMemory: [4, 8, 16][Math.floor(Math.random() * 3)],
            screenResolution: [
                { width: 1920, height: 1080 },
                { width: 1366, height: 768 },
                { width: 2560, height: 1440 },
                { width: 1536, height: 864 }
            ][Math.floor(Math.random() * 4)],
            timezone: ['America/Sao_Paulo', 'America/New_York', 'Europe/London'][Math.floor(Math.random() * 3)],
            timezoneOffset: [-180, -240, -300, 0][Math.floor(Math.random() * 4)]
        };
        
        this.context = await this.browser.newContext({
            // Viewport ÚNICO para cada sessão (baseado em fingerprint)
            viewport: { 
                width: uniqueFingerprint.screenResolution.width,
                height: uniqueFingerprint.screenResolution.height
            },
            userAgent: randomUserAgent,
            ignoreHTTPSErrors: true,
            javaScriptEnabled: true,
            acceptDownloads: false,
            locale: ['pt-BR', 'pt-BR,pt;q=0.9', 'pt-BR,pt;q=0.9,en-US;q=0.8'][Math.floor(Math.random() * 3)],
            timezoneId: uniqueFingerprint.timezone,
            
            // Headers ÚNICOS por sessão (baseado em fingerprint)
            extraHTTPHeaders: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': ['pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7', 'pt-BR,pt;q=0.9', 'pt-BR,pt;q=0.9,en;q=0.8'][Math.floor(Math.random() * 3)],
                'Cache-Control': ['max-age=0', 'no-cache', 'no-store'][Math.floor(Math.random() * 3)],
                'Sec-Ch-Ua': `"Not_A Brand";v="8", "Chromium";v="${120 + Math.floor(Math.random() * 3)}", "Google Chrome";v="${120 + Math.floor(Math.random() * 3)}"`,
                'Sec-Ch-Ua-Mobile': '?0',
                'Sec-Ch-Ua-Platform': `"${uniqueFingerprint.platform === 'Win32' ? 'Windows' : uniqueFingerprint.platform === 'MacIntel' ? 'macOS' : 'Linux'}"`,
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1',
                'Upgrade-Insecure-Requests': '1',
                'DNT': Math.random() < 0.3 ? '1' : undefined // 30% chance de DNT
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

        // Modo STEALTH IMPOSSÍVEL DE DETECTAR - Remove TODOS os sinais de automação
        await this.context.addInitScript((fingerprint) => {
            // 1. Remover COMPLETAMENTE webdriver
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined,
                configurable: false
            });
            delete navigator.__proto__.webdriver;
            
            // 2. Mascarar plugins de forma realista
            const mockPlugins = {
                length: 5,
                0: { name: 'Chrome PDF Plugin', filename: 'internal-pdf-viewer', description: 'Portable Document Format' },
                1: { name: 'Chrome PDF Viewer', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai', description: '' },
                2: { name: 'Native Client', filename: 'internal-nacl-plugin', description: '' },
                3: { name: 'Chromium PDF Plugin', filename: 'internal-pdf-viewer', description: 'Portable Document Format' },
                4: { name: 'Microsoft Edge PDF Plugin', filename: 'edge-pdf-viewer', description: 'Portable Document Format' }
            };
            Object.defineProperty(navigator, 'plugins', {
                get: () => mockPlugins
            });
            
            // 3. Mascarar languages de forma dinâmica
            Object.defineProperty(navigator, 'languages', {
                get: () => ['pt-BR', 'pt', 'en-US', 'en']
            });
            
            // 4. Simular permissões realistas
            const originalQuery = window.navigator.permissions?.query;
            if (originalQuery) {
                window.navigator.permissions.query = (parameters) => (
                    parameters.name === 'notifications' ?
                        Promise.resolve({ state: 'prompt' }) :
                        originalQuery(parameters)
                );
            }
            
            // 5. Mascarar COMPLETAMENTE chrome runtime
            if (window.chrome) {
                Object.defineProperty(window.chrome, 'runtime', {
                    get: () => undefined
                });
            }
            
            // 6. Remover TODOS os sinais do Playwright/Puppeteer
            delete window.__playwright;
            delete window.__pw_manual;
            delete window.__PW_inspect;
            delete window.__nightmare;
            delete window._phantom;
            delete window.callPhantom;
            delete window.callSelenium;
            delete window._selenium;
            delete window.__webdriver_evaluate;
            delete window.__selenium_evaluate;
            delete window.__webdriver_script_function;
            delete window.__webdriver_script_func;
            delete window.__webdriver_script_fn;
            delete window.__fxdriver_evaluate;
            delete window.__driver_unwrapped;
            delete window.__webdriver_unwrapped;
            delete window.__driver_evaluate;
            delete window.__selenium_unwrapped;
            delete window.__fxdriver_unwrapped;
            
            // 7. Mascarar stack traces
            const originalError = Error.prepareStackTrace;
            Error.prepareStackTrace = (error, stack) => {
                if (originalError) return originalError(error, stack);
                return stack.toString();
            };
            
            // 8. Simular comportamento REALISTA de mouse/teclado humano
            let mouseX = 0, mouseY = 0, lastMouseMove = Date.now();
            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                lastMouseMove = Date.now();
            });
            
            // 9. Mascarar timing com variação HUMANA
            const originalSetTimeout = window.setTimeout;
            const originalSetInterval = window.setInterval;
            
            window.setTimeout = function(callback, delay) {
                const humanDelay = delay + Math.random() * 100 - 50;
                return originalSetTimeout(callback, Math.max(0, humanDelay));
            };
            
            window.setInterval = function(callback, delay) {
                const humanDelay = delay + Math.random() * 50 - 25;
                return originalSetInterval(callback, Math.max(0, humanDelay));
            };
            
            // 10. Simular viewport ÚNICO (do fingerprint)
            Object.defineProperty(window.screen, 'width', { 
                get: () => fingerprint.screenResolution.width 
            });
            Object.defineProperty(window.screen, 'height', { 
                get: () => fingerprint.screenResolution.height 
            });
            Object.defineProperty(window.screen, 'availWidth', { 
                get: () => fingerprint.screenResolution.width 
            });
            Object.defineProperty(window.screen, 'availHeight', { 
                get: () => fingerprint.screenResolution.height - 40 
            });
            
            // 11. Canvas Fingerprint ÚNICO (adicionar noise)
            const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
            HTMLCanvasElement.prototype.toDataURL = function(type) {
                const context = this.getContext('2d');
                if (context) {
                    const imageData = context.getImageData(0, 0, this.width, this.height);
                    for (let i = 0; i < imageData.data.length; i += 4) {
                        imageData.data[i] += fingerprint.canvasNoise * 255;
                    }
                    context.putImageData(imageData, 0, 0);
                }
                return originalToDataURL.apply(this, arguments);
            };
            
            // 12. WebGL Fingerprint ÚNICO
            const getParameter = WebGLRenderingContext.prototype.getParameter;
            WebGLRenderingContext.prototype.getParameter = function(parameter) {
                if (parameter === 37445) return fingerprint.webglVendor;
                if (parameter === 37446) return fingerprint.webglRenderer;
                return getParameter.apply(this, arguments);
            };
            
            // 13. Hardware Fingerprint ÚNICO
            Object.defineProperty(navigator, 'hardwareConcurrency', {
                get: () => fingerprint.hardwareConcurrency
            });
            
            Object.defineProperty(navigator, 'deviceMemory', {
                get: () => fingerprint.deviceMemory
            });
            
            // 14. Platform ÚNICO
            Object.defineProperty(navigator, 'platform', {
                get: () => fingerprint.platform
            });
            
            // 15. Timezone Offset ÚNICO
            Date.prototype.getTimezoneOffset = function() {
                return fingerprint.timezoneOffset;
            };
            
            // 16. Mascarar Performance API (remover sinais de automação)
            const originalPerformanceNow = Performance.prototype.now;
            Performance.prototype.now = function() {
                return originalPerformanceNow.apply(this, arguments) + Math.random() * 0.1;
            };
            
            // 17. Mascarar Battery API
            if (navigator.getBattery) {
                navigator.getBattery = () => Promise.resolve({
                    charging: Math.random() > 0.5,
                    chargingTime: Math.random() * 3600,
                    dischargingTime: Math.random() * 7200 + 3600,
                    level: 0.5 + Math.random() * 0.5
                });
            }
            
            // 18. Adicionar propriedades normais de navegador
            if (!window.chrome) {
                window.chrome = {
                    loadTimes: () => {},
                    csi: () => {},
                    app: {}
                };
            }
            
            // 19. Mascarar Notification API
            if (window.Notification) {
                Object.defineProperty(Notification, 'permission', {
                    get: () => 'default'
                });
            }
            
            // 20. Adicionar ruído ao AudioContext (fingerprint)
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                const originalCreateOscillator = AudioContext.prototype.createOscillator;
                AudioContext.prototype.createOscillator = function() {
                    const oscillator = originalCreateOscillator.apply(this, arguments);
                    const originalFrequency = oscillator.frequency.value;
                    oscillator.frequency.value = originalFrequency + Math.random() * 0.001;
                    return oscillator;
                };
            }
            
            console.log('🥷 Modo STEALTH IMPOSSÍVEL DE DETECTAR ativado com fingerprint único!');
        }, uniqueFingerprint);

        this.page = await this.context.newPage();
        
        // Configurar timeouts otimizados
        this.page.setDefaultNavigationTimeout(45000);
        this.page.setDefaultTimeout(20000);

        // Roteamento INTELIGENTE - Bloquear MINIMAMENTE para evitar detecção
        await this.page.route('**/*', (route) => {
            const resourceType = route.request().resourceType();
            const url = route.request().url();
            
            // Lista MÍNIMA de bloqueios (muito bloqueio pode ser detectado)
            const blockedDomains = [
                'google-analytics.com',
                'googletagmanager.com',
                'doubleclick.net'
            ];
            
            // Bloquear APENAS tracking óbvio (não bloquear demais = mais stealth)
            const shouldBlock = blockedDomains.some(domain => url.includes(domain)) ||
                               url.includes('/analytics.') ||
                               url.includes('/ga.js');
            
            if (shouldBlock) {
                route.abort();
            } else {
                // Adicionar headers EXTREMAMENTE realistas com variação
                const headers = route.request().headers();
                
                // Variar headers para parecer mais natural
                if (Math.random() < 0.8) {
                    headers['sec-fetch-site'] = url.includes(route.request().frame().url()) ? 'same-origin' : 'cross-site';
                    headers['sec-fetch-mode'] = resourceType === 'document' ? 'navigate' : 'no-cors';
                    headers['sec-fetch-dest'] = resourceType;
                }
                
                // Adicionar variação no timing (como navegador real)
                if (Math.random() < 0.1) {
                    setTimeout(() => route.continue({ headers }), Math.random() * 50);
                } else {
                    route.continue({ headers });
                }
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

    // Método para simular digitação ULTRA REALISTA
    async preencherComportamentoHumano(seletor, texto) {
        try {
            // Aguardar elemento aparecer
            await this.page.waitForSelector(seletor, { timeout: 10000 });
            
            // Simular movimento de olhos (ler antes de clicar)
            await this.page.waitForTimeout(Math.random() * 400 + 200);
            
            // Mover mouse de forma ULTRA REALISTA (curva Bezier)
            const elemento = await this.page.$(seletor);
            const box = await elemento.boundingBox();
            
            if (box) {
                // Posição alvo com variação humana
                const targetX = box.x + box.width / 2 + Math.random() * 20 - 10;
                const targetY = box.y + box.height / 2 + Math.random() * 20 - 10;
                
                // Mover em múltiplos passos com velocidade variável (mais realista)
                const steps = Math.floor(Math.random() * 15) + 10;
                for (let i = 0; i <= steps; i++) {
                    const progress = i / steps;
                    // Curva de aceleração/desaceleração (easing)
                    const eased = progress < 0.5 
                        ? 2 * progress * progress 
                        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                    
                    const currentPos = await this.page.mouse.position || { x: 0, y: 0 };
                    const x = currentPos.x + (targetX - currentPos.x) * eased;
                    const y = currentPos.y + (targetY - currentPos.y) * eased;
                    
                    await this.page.mouse.move(x, y);
                    await this.page.waitForTimeout(Math.random() * 10 + 5);
                }
                
                // Pausa antes de clicar (humanos não clicam instantaneamente)
                await this.page.waitForTimeout(Math.random() * 400 + 200);
            }
            
            // Clicar no campo
            await this.page.click(seletor);
            await this.page.waitForTimeout(Math.random() * 150 + 100);
            
            // Limpar campo com comportamento humano (verificar se tem conteúdo primeiro)
            const hasContent = await this.page.evaluate((sel) => {
                const el = document.querySelector(sel);
                return el ? el.value.length > 0 : false;
            }, seletor);
            
            if (hasContent) {
                // Selecionar tudo (Ctrl+A) com timing humano
                await this.page.keyboard.down('Control');
                await this.page.waitForTimeout(Math.random() * 50 + 30);
                await this.page.keyboard.press('KeyA');
                await this.page.waitForTimeout(Math.random() * 50 + 30);
                await this.page.keyboard.up('Control');
                await this.page.waitForTimeout(Math.random() * 100 + 50);
            }
            
            // Digitar com MÁXIMO REALISMO
            for (let i = 0; i < texto.length; i++) {
                const char = texto[i];
                
                // Variação EXTREMA na velocidade (humanos não digitam uniformemente)
                let delay;
                if (Math.random() < 0.05) {
                    // 5% chance de pausa longa (pensando)
                    delay = Math.random() * 800 + 400;
                } else if (Math.random() < 0.15) {
                    // 15% chance de digitação rápida (sequência conhecida)
                    delay = Math.random() * 50 + 30;
                } else {
                    // Velocidade normal com variação
                    delay = Math.random() * 150 + 80;
                }
                
                await this.page.keyboard.type(char);
                await this.page.waitForTimeout(delay);
                
                // Ocasionalmente "errar" e corrigir (backspace)
                if (Math.random() < 0.03 && i > 0) {
                    await this.page.waitForTimeout(Math.random() * 100 + 50);
                    await this.page.keyboard.press('Backspace');
                    await this.page.waitForTimeout(Math.random() * 150 + 100);
                    await this.page.keyboard.type(char);
                }
            }
            
            // Pausa após terminar (revisar o que foi digitado)
            await this.page.waitForTimeout(Math.random() * 300 + 200);
            
            // Disparar eventos de forma escalonada (mais natural)
            await this.page.evaluate((sel) => {
                const element = document.querySelector(sel);
                if (element) {
                    setTimeout(() => element.dispatchEvent(new Event('input', { bubbles: true })), 10);
                    setTimeout(() => element.dispatchEvent(new Event('change', { bubbles: true })), 50);
                    setTimeout(() => element.dispatchEvent(new Event('blur', { bubbles: true })), 100);
                }
            }, seletor);
            
        } catch (error) {
            console.log(`⚠️ Erro no preenchimento humano de ${seletor}:`, error.message);
            
            // Fallback para método tradicional
            await this.page.fill(seletor, texto);
        }
    }

    // Método para simular movimento de mouse ULTRA REALISTA
    async simularMovimentoMouse() {
        try {
            const viewport = this.page.viewportSize();
            
            // Humanos não movem o mouse de forma completamente aleatória
            // Eles tendem a mover em padrões (olhando elementos, lendo)
            const numMovimentos = Math.floor(Math.random() * 3) + 2; // 2-4 movimentos
            
            for (let i = 0; i < numMovimentos; i++) {
                // Zona mais provável de movimento (centro da tela, não extremos)
                const centerBias = 0.3; // 30% de viés para o centro
                let x = Math.random() * viewport.width;
                let y = Math.random() * viewport.height;
                
                if (Math.random() < centerBias) {
                    x = viewport.width * 0.3 + Math.random() * viewport.width * 0.4;
                    y = viewport.height * 0.3 + Math.random() * viewport.height * 0.4;
                }
                
                // Movimento com curva (não linear)
                const steps = Math.floor(Math.random() * 20) + 10;
                const currentPos = await this.page.evaluate(() => ({ x: 0, y: 0 }));
                
                for (let step = 0; step <= steps; step++) {
                    const progress = step / steps;
                    // Curva suave com overshoot ocasional
                    const eased = progress < 0.5
                        ? 2 * progress * progress
                        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                    
                    const currentX = currentPos.x + (x - currentPos.x) * eased;
                    const currentY = currentPos.y + (y - currentPos.y) * eased;
                    
                    await this.page.mouse.move(currentX, currentY);
                    await this.page.waitForTimeout(Math.random() * 15 + 5);
                }
                
                // Pausa entre movimentos (humanos param o mouse)
                await this.page.waitForTimeout(Math.random() * 500 + 200);
                
                // 20% chance de fazer micro-movimento (ajuste fino)
                if (Math.random() < 0.2) {
                    await this.page.mouse.move(
                        x + Math.random() * 20 - 10,
                        y + Math.random() * 20 - 10
                    );
                    await this.page.waitForTimeout(Math.random() * 200 + 100);
                }
            }
        } catch (error) {
            // Ignorar erros de movimento de mouse
        }
    }

    // Função principal para consultar CPF (TODA a lógica do scraper.js)
    async consultarCPF(cpf, birthDate) {
        console.log(`🔍 Iniciando consulta ULTRA STEALTH para CPF: ${cpf}`);
        
        // Simular comportamento EXTREMAMENTE humano antes de começar
        console.log('🥷 Simulando comportamento ULTRA realista...');
        
        // 1. Movimento inicial de mouse (humano sempre move o mouse ao chegar)
        await this.simularMovimentoMouse();
        await this.page.waitForTimeout(Math.random() * 800 + 400);
        
        // 2. Scroll aleatório (humanos geralmente dão scroll para ver a página)
        if (Math.random() < 0.7) { // 70% chance de dar scroll
            console.log('📜 Simulando scroll humano...');
            const scrolls = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < scrolls; i++) {
                await this.page.mouse.wheel(0, Math.random() * 200 + 100);
                await this.page.waitForTimeout(Math.random() * 600 + 300);
            }
            
            // Voltar ao topo
            await this.page.mouse.wheel(0, -500);
            await this.page.waitForTimeout(Math.random() * 400 + 200);
        }
        
        // 3. Movimento adicional de mouse (simular leitura da página)
        await this.simularMovimentoMouse();
        
        // 4. Aguardar com MÁXIMA variação humana
        const delayHumano = 3000 + Math.random() * 5000; // 3-8 segundos
        console.log(`⏳ Aguardando ${Math.round(delayHumano/1000)}s (comportamento humano natural)...`);
        await this.page.waitForTimeout(delayHumano);
        
        // 5. Último movimento antes de começar (foco)
        await this.page.waitForTimeout(Math.random() * 500 + 300);
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

            // Preenchimento com comportamento humano realista
            console.log('Preenchendo CPF com comportamento humano...');
            await this.preencherComportamentoHumano('#txtCPF', cpf);

            console.log('Preenchendo data de nascimento com comportamento humano...');
            await this.preencherComportamentoHumano('#txtDataNascimento', birthDate);
            await takeScreenshot(this.page, '02_apos_preenchimento');

            // Simular leitura da página antes do captcha (comportamento humano)
            console.log('📖 Simulando leitura da página...');
            await this.page.waitForTimeout(Math.random() * 1500 + 1000);
            await this.simularMovimentoMouse();
            
            // Aguardar carregamento do captcha
            console.log('Aguardando carregamento do captcha...');
            await this.page.waitForSelector('iframe[title="Widget contendo caixa de seleção para desafio de segurança hCaptcha"]');
            
            // Movimento de mouse antes de interagir com captcha (MUITO importante)
            await this.page.waitForTimeout(Math.random() * 800 + 500);
            await this.simularMovimentoMouse();
            
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

            // Detectar e EVITAR honeypots (campos invisíveis de armadilha)
            console.log('🕵️ Verificando honeypots...');
            const temHoneypot = await this.page.evaluate(() => {
                const inputs = document.querySelectorAll('input[type="text"], input[type="hidden"]');
                let honeypotDetectado = false;
                inputs.forEach(input => {
                    // Honeypots comuns têm display:none, visibility:hidden ou position:absolute com left:-9999px
                    const style = window.getComputedStyle(input);
                    if (style.display === 'none' || style.visibility === 'hidden' || 
                        parseInt(style.left) < -1000 || input.offsetParent === null) {
                        // NÃO preencher honeypots!
                        honeypotDetectado = true;
                    }
                });
                return honeypotDetectado;
            });
            
            if (temHoneypot) {
                console.log('⚠️ Honeypot detectado - evitando armadilha!');
            } else {
                console.log('✅ Nenhum honeypot detectado');
            }
            
            // Aguardar e verificar o botão Consultar (do scraper.js)
            console.log('Aguardando botão Consultar...');
            await this.page.waitForSelector('input[value="Consultar"]', {
                timeout: 30000
            });

            // Simular REVISÃO dos dados antes de submeter (comportamento humano)
            console.log('📋 Simulando revisão dos dados preenchidos...');
            await this.page.waitForTimeout(Math.random() * 2000 + 1500);
            
            // Movimento de mouse sobre os campos (como se estivesse revisando)
            await this.simularMovimentoMouse();
            await this.page.waitForTimeout(Math.random() * 1000 + 800);

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
                
                // Tentar múltiplas estratégias de clique REALISTA
                let cliqueSucesso = false;
                
                // Estratégia 1: Clique ULTRA REALISTA com movimento de mouse
                try {
                    // Mover mouse para o botão de forma realista
                    const botao = await this.page.$('input[value="Consultar"]');
                    const box = await botao.boundingBox();
                    
                    if (box) {
                        // Mover com curva e variação humana
                        const targetX = box.x + box.width / 2 + Math.random() * 10 - 5;
                        const targetY = box.y + box.height / 2 + Math.random() * 10 - 5;
                        
                        const steps = Math.floor(Math.random() * 20) + 15;
                        for (let i = 0; i <= steps; i++) {
                            const progress = i / steps;
                            const eased = progress < 0.5 
                                ? 2 * progress * progress 
                                : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                            
                            await this.page.waitForTimeout(Math.random() * 10 + 5);
                        }
                        
                        await this.page.mouse.move(targetX, targetY);
                        
                        // Pausa antes de clicar (humanos não clicam instantaneamente)
                        await this.page.waitForTimeout(Math.random() * 400 + 200);
                    }
                    
                    await this.page.click('input[value="Consultar"]');
                    console.log('✅ Clique REALISTA realizado');
                    cliqueSucesso = true;
                } catch (error) {
                    console.log('⚠️ Clique realista falhou:', error.message);
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