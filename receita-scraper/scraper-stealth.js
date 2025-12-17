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

class StealthCPFConsultor {
    constructor() {
        this.browser = null;
        this.context = null;
        this.page = null;
    }

    async launch() {
        console.log('🥷 Iniciando Scraper ULTRA STEALTH...');
        
        const isVisual = process.env.VISUAL_MODE === 'true' || process.argv.includes('--visual');
        
        // Configurações stealth para WebKit
        this.browser = await webkit.launch({
            headless: !isVisual,
            slowMo: isVisual ? 200 : 50,
            args: [
                '--disable-blink-features=AutomationControlled',
                '--no-first-run',
                '--disable-default-apps',
                '--disable-dev-shm-usage',
                '--disable-extensions-file-access-check',
                '--disable-extensions-http-throttling',
                '--disable-extensions-https-throttling'
            ]
        });
        
        // User agents realistas rotacionados
        const userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
        ];
        
        const randomUA = userAgents[Math.floor(Math.random() * userAgents.length)];
        
        // Viewport com variação
        const viewports = [
            { width: 1366, height: 768 },
            { width: 1920, height: 1080 },
            { width: 1440, height: 900 },
            { width: 1536, height: 864 }
        ];
        
        const randomViewport = viewports[Math.floor(Math.random() * viewports.length)];
        
        this.context = await this.browser.newContext({
            viewport: randomViewport,
            userAgent: randomUA,
            locale: 'pt-BR',
            timezoneId: 'America/Sao_Paulo',
            
            // Headers ultra realistas
            extraHTTPHeaders: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                'Cache-Control': 'max-age=0',
                'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
                'Sec-Ch-Ua-Mobile': '?0',
                'Sec-Ch-Ua-Platform': '"Windows"',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1',
                'Upgrade-Insecure-Requests': '1',
                'DNT': '1'
            },
            
            // Configurações realistas
            geolocation: { latitude: -23.5505, longitude: -46.6333 }, // São Paulo
            permissions: ['geolocation'],
            colorScheme: 'light',
            reducedMotion: 'no-preference',
            forcedColors: 'none',
            
            // Configurações de dispositivo
            hasTouch: false,
            isMobile: false,
            deviceScaleFactor: 1,
            
            ignoreHTTPSErrors: true,
            javaScriptEnabled: true
        });

        // Script stealth ULTRA avançado
        await this.context.addInitScript(() => {
            // 1. Remover webdriver completamente
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined,
                configurable: true
            });
            delete navigator.__proto__.webdriver;
            
            // 2. Mascarar propriedades do navigator
            Object.defineProperty(navigator, 'plugins', {
                get: () => ({
                    length: 5,
                    0: { name: 'Chrome PDF Plugin' },
                    1: { name: 'Chrome PDF Viewer' },
                    2: { name: 'Native Client' },
                    3: { name: 'WebKit built-in PDF' },
                    4: { name: 'PDF Viewer' }
                })
            });
            
            Object.defineProperty(navigator, 'languages', {
                get: () => ['pt-BR', 'pt', 'en-US', 'en']
            });
            
            Object.defineProperty(navigator, 'platform', {
                get: () => 'Win32'
            });
            
            // 3. Mascarar chrome object
            if (!window.chrome) {
                window.chrome = {};
            }
            
            window.chrome.runtime = {
                onConnect: undefined,
                onMessage: undefined
            };
            
            // 4. Remover sinais do Playwright/WebKit
            delete window.__playwright;
            delete window.__pw_manual;
            delete window.__PW_inspect;
            delete window._webkit;
            delete window.__webkitInspector;
            
            // 5. Mascarar timing de automação
            const originalSetTimeout = window.setTimeout;
            const originalSetInterval = window.setInterval;
            
            window.setTimeout = function(callback, delay, ...args) {
                const humanDelay = delay + (Math.random() * 50 - 25);
                return originalSetTimeout(callback, Math.max(0, humanDelay), ...args);
            };
            
            window.setInterval = function(callback, delay, ...args) {
                const humanDelay = delay + (Math.random() * 100 - 50);
                return originalSetInterval(callback, Math.max(0, humanDelay), ...args);
            };
            
            // 6. Simular propriedades de tela realistas
            Object.defineProperty(screen, 'availWidth', { 
                get: () => window.innerWidth 
            });
            Object.defineProperty(screen, 'availHeight', { 
                get: () => window.innerHeight 
            });
            
            // 7. Mascarar detecção de headless
            Object.defineProperty(navigator, 'hardwareConcurrency', {
                get: () => 4 + Math.floor(Math.random() * 4)
            });
            
            Object.defineProperty(navigator, 'deviceMemory', {
                get: () => 8
            });
            
            // 8. Simular bateria (se disponível)
            if (navigator.getBattery) {
                const originalGetBattery = navigator.getBattery;
                navigator.getBattery = () => Promise.resolve({
                    charging: true,
                    chargingTime: Infinity,
                    dischargingTime: Infinity,
                    level: 0.8 + Math.random() * 0.2
                });
            }
            
            // 9. Mascarar canvas fingerprinting
            const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
            HTMLCanvasElement.prototype.toDataURL = function(...args) {
                const result = originalToDataURL.apply(this, args);
                // Adicionar ruído mínimo
                return result.replace(/.$/, String.fromCharCode(
                    result.charCodeAt(result.length - 1) + Math.floor(Math.random() * 3) - 1
                ));
            };
            
            // 10. Simular eventos de mouse/teclado
            let lastMouseMove = Date.now();
            document.addEventListener('mousemove', () => {
                lastMouseMove = Date.now();
            });
            
            // Propriedade para verificar atividade humana
            Object.defineProperty(window, '_humanActivity', {
                get: () => Date.now() - lastMouseMove < 30000
            });
            
            console.log('🥷 Ultra Stealth Mode ativado - Indetectável!');
        });

        this.page = await this.context.newPage();
        
        // Timeouts realistas
        this.page.setDefaultNavigationTimeout(60000);
        this.page.setDefaultTimeout(30000);

        // Roteamento stealth
        await this.page.route('**/*', (route) => {
            const url = route.request().url();
            const resourceType = route.request().resourceType();
            
            // Bloquear apenas recursos claramente suspeitos
            const blockedPatterns = [
                'google-analytics.com',
                'googletagmanager.com',
                'facebook.com/tr',
                'doubleclick.net',
                'googlesyndication.com'
            ];
            
            if (blockedPatterns.some(pattern => url.includes(pattern))) {
                route.abort();
            } else {
                // Adicionar headers realistas
                const headers = { ...route.request().headers() };
                headers['sec-fetch-site'] = url.includes('receita.fazenda.gov.br') ? 'same-origin' : 'cross-site';
                headers['sec-fetch-mode'] = 'cors';
                headers['sec-fetch-dest'] = resourceType;
                
                route.continue({ headers });
            }
        });
        
        console.log('✅ Scraper Ultra Stealth iniciado!');
        return this.page;
    }

    async navegarComComportamentoHumano(url) {
        console.log(`🌐 Navegando com comportamento humano para: ${url}`);
        
        // Simular pausa antes de navegar
        await this.page.waitForTimeout(1000 + Math.random() * 2000);
        
        try {
            await this.page.goto(url, { 
                waitUntil: 'domcontentloaded',
                timeout: 30000 
            });
            
            // Simular leitura da página
            await this.page.waitForTimeout(2000 + Math.random() * 3000);
            
            // Movimento de mouse aleatório
            await this.simularMovimentoHumano();
            
        } catch (error) {
            console.log('⚠️ Erro na navegação, tentando novamente...');
            await this.page.goto(url);
        }
    }

    async simularMovimentoHumano() {
        try {
            const viewport = this.page.viewportSize();
            
            // Múltiplos movimentos pequenos
            for (let i = 0; i < 3 + Math.random() * 3; i++) {
                const x = Math.random() * viewport.width;
                const y = Math.random() * viewport.height;
                
                await this.page.mouse.move(x, y, { 
                    steps: 5 + Math.random() * 10 
                });
                
                await this.page.waitForTimeout(100 + Math.random() * 300);
            }
        } catch (error) {
            // Ignorar erros de movimento
        }
    }

    async digitarComoHumano(seletor, texto) {
        await this.page.waitForSelector(seletor);
        
        // Clicar no campo
        await this.page.click(seletor);
        await this.page.waitForTimeout(200 + Math.random() * 300);
        
        // Limpar campo
        await this.page.keyboard.down('Control');
        await this.page.keyboard.press('KeyA');
        await this.page.keyboard.up('Control');
        await this.page.waitForTimeout(100);
        
        // Digitar com variação humana
        for (const char of texto) {
            await this.page.keyboard.type(char);
            
            // Variação na velocidade de digitação
            const delay = 80 + Math.random() * 120; // 80-200ms
            await this.page.waitForTimeout(delay);
            
            // Pausas ocasionais mais longas
            if (Math.random() < 0.15) {
                await this.page.waitForTimeout(300 + Math.random() * 500);
            }
        }
        
        // Pausa após digitar
        await this.page.waitForTimeout(200 + Math.random() * 400);
    }

    async consultarCPF(cpf, birthDate) {
        console.log(`🥷 Consulta stealth para CPF: ${cpf}`);
        
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
            // Navegar com comportamento humano
            await this.navegarComComportamentoHumano(
                'https://servicos.receita.fazenda.gov.br/servicos/cpf/consultasituacao/consultapublica.asp'
            );

            await takeScreenshot(this.page, '01_inicial_stealth');

            // Aguardar formulário carregar
            await this.page.waitForSelector('#txtCPF');
            
            // Simular leitura da página
            await this.page.waitForTimeout(1000 + Math.random() * 2000);
            await this.simularMovimentoHumano();

            // Preencher com comportamento humano
            console.log('📝 Preenchendo CPF com comportamento humano...');
            await this.digitarComoHumano('#txtCPF', cpf);

            console.log('📝 Preenchendo data com comportamento humano...');
            await this.digitarComoHumano('#txtDataNascimento', birthDate);

            await takeScreenshot(this.page, '02_preenchido_stealth');

            // Aguardar captcha aparecer
            await this.page.waitForTimeout(2000 + Math.random() * 2000);
            await takeScreenshot(this.page, '03_captcha_stealth');

            // Verificar captcha de forma inteligente
            const temCaptcha = await this.verificarCaptcha();
            
            if (temCaptcha) {
                console.log('🔍 Captcha detectado - aguardando resolução...');
                
                const isVisual = process.env.VISUAL_MODE === 'true';
                if (isVisual) {
                    await this.aguardarResolucaoManual();
                } else {
                    await this.tentarResolverCaptcha();
                }
            }

            // Clicar em consultar com comportamento humano
            await this.clicarConsultarHumano();

            // Aguardar resultado
            await this.aguardarResultado();

            await takeScreenshot(this.page, '04_resultado_stealth');

            // Verificar erros
            const erro = await this.verificarErros();
            if (erro) return erro;

            // Extrair dados
            const dados = await this.extrairDados();
            
            console.log('✅ Consulta stealth realizada com sucesso!');
            return dados;

        } catch (error) {
            console.error('❌ Erro na consulta stealth:', error.message);
            await takeScreenshot(this.page, '05_erro_stealth');
            return { erro: true, mensagem: error.message };
        }
    }

    async verificarCaptcha() {
        return await this.page.evaluate(() => {
            const iframes = document.querySelectorAll('iframe');
            for (const iframe of iframes) {
                if (iframe.src.includes('hcaptcha') || iframe.title.toLowerCase().includes('captcha')) {
                    const rect = iframe.getBoundingClientRect();
                    return rect.width > 0 && rect.height > 0;
                }
            }
            return false;
        });
    }

    async tentarResolverCaptcha() {
        try {
            const iframe = await this.page.$('iframe[src*="hcaptcha"]');
            if (iframe) {
                const frame = await iframe.contentFrame();
                if (frame) {
                    await frame.waitForSelector('#checkbox', { timeout: 5000 });
                    
                    // Simular movimento humano antes de clicar
                    await this.page.waitForTimeout(1000 + Math.random() * 2000);
                    
                    await frame.click('#checkbox');
                    console.log('🖱️ Clique no captcha realizado');
                    
                    // Aguardar resolução
                    await this.page.waitForTimeout(3000);
                }
            }
        } catch (error) {
            console.log('⚠️ Erro ao tentar resolver captcha:', error.message);
        }
    }

    async aguardarResolucaoManual() {
        console.log('🖥️ Aguardando resolução manual do captcha...');
        
        for (let i = 0; i < 120; i++) { // 2 minutos
            await this.page.waitForTimeout(1000);
            
            const resolvido = await this.page.evaluate(() => {
                const token = document.querySelector('textarea[name="h-captcha-response"]');
                return token && token.value.length > 0;
            });
            
            if (resolvido) {
                console.log('✅ Captcha resolvido manualmente!');
                return true;
            }
            
            if (i % 15 === 0 && i > 0) {
                console.log(`⏳ Aguardando... (${i}s)`);
            }
        }
        
        return false;
    }

    async clicarConsultarHumano() {
        console.log('🖱️ Clicando em Consultar com comportamento humano...');
        
        // Aguardar botão estar disponível
        await this.page.waitForSelector('input[value="Consultar"]');
        
        // Simular movimento para o botão
        const botao = await this.page.$('input[value="Consultar"]');
        const box = await botao.boundingBox();
        
        if (box) {
            await this.page.mouse.move(
                box.x + box.width / 2 + Math.random() * 10 - 5,
                box.y + box.height / 2 + Math.random() * 10 - 5,
                { steps: 5 + Math.random() * 5 }
            );
        }
        
        // Pausa antes de clicar
        await this.page.waitForTimeout(500 + Math.random() * 1000);
        
        // Clicar
        await this.page.click('input[value="Consultar"]');
        console.log('✅ Clique realizado');
    }

    async aguardarResultado() {
        console.log('⏳ Aguardando resultado...');
        
        await Promise.race([
            this.page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }),
            this.page.waitForFunction(() => {
                const html = document.body.innerHTML;
                return html.includes('Situação Cadastral') || 
                       html.includes('CPF incorreto') ||
                       html.includes('Data de nascimento informada');
            }, { timeout: 30000 })
        ]);
    }

    async verificarErros() {
        const conteudo = await this.page.textContent('body');
        
        if (conteudo.includes('Data de nascimento informada') && conteudo.includes('divergente')) {
            return { erro: true, mensagem: 'Data de nascimento divergente' };
        }
        
        if (conteudo.includes('CPF incorreto')) {
            return { erro: true, mensagem: 'CPF incorreto' };
        }
        
        if (conteudo.includes('CPF não encontrado')) {
            return { erro: true, mensagem: 'CPF não encontrado' };
        }
        
        return null;
    }

    async extrairDados() {
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
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
        }
    }
}

// Função de consulta exportada
async function consultarCPF(cpf, birthDate) {
    const scraper = new StealthCPFConsultor();
    try {
        await scraper.launch();
        return await scraper.consultarCPF(cpf, birthDate);
    } finally {
        await scraper.close();
    }
}

module.exports = { StealthCPFConsultor, consultarCPF };
