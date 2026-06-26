const { chromium, webkit, firefox } = require('playwright');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Carregar variáveis do arquivo .env de forma nativa se não estiverem definidas
const carregarEnv = () => {
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split(/\r?\n/).forEach(line => {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const parts = trimmed.split('=');
                if (parts.length >= 2) {
                    const key = parts[0].trim();
                    let value = parts.slice(1).join('=').trim();
                    // Remover aspas simples ou duplas
                    if ((value.startsWith('"') && value.endsWith('"')) || 
                        (value.startsWith("'") && value.endsWith("'"))) {
                        value = value.slice(1, -1);
                    }
                    // Definir na variável de ambiente se já não estiver definida
                    if (process.env[key] === undefined || process.env[key] === '') {
                        process.env[key] = value;
                    }
                }
            }
        });
    }
};
carregarEnv();

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

// Função para capturar screenshots (do scraper.js) - MELHORADA
const takeScreenshot = async (page, name) => {
    try {
        console.log(`📸 Tentando capturar screenshot: ${name}...`);

        const dir = path.join(__dirname, 'screenshots', 'ultima_consulta');
        if (!fs.existsSync(dir)) {
            console.log(`📁 Criando diretório: ${dir}`);
            fs.mkdirSync(dir, { recursive: true });
        }

        const filename = `${name}.png`;
        const filepath = path.join(dir, filename);

        // Aguardar um pouco para garantir que a página está estável
        await page.waitForTimeout(500);

        // Tentar capturar com timeout
        await Promise.race([
            page.screenshot({
                path: filepath,
                fullPage: false,
                timeout: 10000 // 10 segundos de timeout
            }),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Screenshot timeout')), 12000)
            )
        ]);

        // Verificar se o arquivo foi criado
        if (fs.existsSync(filepath)) {
            const stats = fs.statSync(filepath);
            console.log(`✅ Screenshot salvo com sucesso: ${filename} (${(stats.size / 1024).toFixed(2)} KB)`);
            return filepath;
        } else {
            console.log(`⚠️ Screenshot não foi criado: ${filename}`);
            return null;
        }
    } catch (error) {
        console.log(`❌ ERRO ao capturar screenshot ${name}:`, error.message);
        console.log(`   Stack: ${error.stack}`);

        // Tentar captura simples como fallback
        try {
            console.log(`🔄 Tentando captura simples...`);
            const dir = path.join(__dirname, 'screenshots', 'ultima_consulta');
            const filepath = path.join(dir, `${name}.png`);
            await page.screenshot({ path: filepath });
            console.log(`✅ Captura simples funcionou: ${name}`);
            return filepath;
        } catch (fallbackError) {
            console.log(`❌ Captura simples também falhou: ${fallbackError.message}`);
            return null;
        }
    }
};

// Função auxiliar para fazer requisições POST com HTTPS enviando e recebendo JSON
const fazerRequisicaoPost = (url, payload) => {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const data = JSON.stringify(payload);

        const options = {
            hostname: urlObj.hostname,
            port: 443,
            path: urlObj.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const req = https.request(options, (res) => {
            let responseBody = '';
            res.on('data', (chunk) => {
                responseBody += chunk;
            });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(responseBody);
                    resolve(parsed);
                } catch (e) {
                    reject(new Error(`Falha ao decodificar JSON da resposta: ${responseBody}`));
                }
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        req.write(data);
        req.end();
    });
};

class PlaywrightWebKitCPFConsultor {
    constructor() {
        this.browser = null;
        this.context = null;
        this.page = null;
        this.screenshotDir = setupScreenshotDir();
        this.cookiesPath = path.join(__dirname, 'cookies_hcaptcha.json');
        this.userDataDir = null;
    }

    // Método para resolver hCaptcha utilizando a API do CaptchaSonic
    async resolverHCaptchaCaptchaSonic(sitekey) {
        const apiKey = process.env.CAPTCHASONIC_KEY;
        if (!apiKey) {
            throw new Error('CAPTCHASONIC_KEY não configurada no arquivo .env');
        }

        const websiteURL = 'https://servicos.receita.fazenda.gov.br/servicos/cpf/consultasituacao/consultapublica.asp';
        console.log(`🤖 Iniciando resolução de hCaptcha via CaptchaSonic com sitekey: ${sitekey}`);

        const payloadCriar = {
            clientKey: apiKey,
            task: {
                type: 'HCaptchaTaskProxyless',
                websiteURL: websiteURL,
                websiteKey: sitekey
            }
        };

        try {
            const respostaCriar = await fazerRequisicaoPost('https://api.captchasonic.com/createTask', payloadCriar);
            if (respostaCriar.errorId !== 0 || !respostaCriar.taskId) {
                const desc = respostaCriar.errorDescription || respostaCriar.errorCode || JSON.stringify(respostaCriar);
                throw new Error(`Erro da API do CaptchaSonic: ${desc}`);
            }

            const taskId = respostaCriar.taskId;
            console.log(`✅ Tarefa criada com sucesso no CaptchaSonic. Task ID: ${taskId}. Aguardando resolução...`);

            const maxTentativas = 30; // 30 * 3s = 90s
            const payloadResultado = {
                clientKey: apiKey,
                taskId: taskId
            };

            for (let i = 0; i < maxTentativas; i++) {
                await this.page.waitForTimeout(3000); // Usar timer do Playwright (evita bloquear o loop de eventos)

                console.log(`⏳ Verificando resultado do captcha no CaptchaSonic (tentativa ${i + 1}/${maxTentativas})...`);
                const respostaResultado = await fazerRequisicaoPost('https://api.captchasonic.com/getTaskResult', payloadResultado);

                if (respostaResultado.errorId !== 0) {
                    const desc = respostaResultado.errorDescription || respostaResultado.errorCode || JSON.stringify(respostaResultado);
                    throw new Error(`Erro da API do CaptchaSonic ao obter resultado: ${desc}`);
                }

                if (respostaResultado.status === 'ready') {
                    const token = respostaResultado.solution?.gRecaptchaResponse;
                    if (!token) {
                        throw new Error('Resposta do captcha veio vazia no CaptchaSonic.');
                    }
                    console.log('✅ Captcha resolvido com sucesso pelo CaptchaSonic.');
                    return token;
                }

                if (respostaResultado.status === 'failed') {
                    throw new Error('A resolução do captcha falhou no CaptchaSonic.');
                }
            }

            throw new Error('Tempo limite excedido aguardando a resolução do captcha no CaptchaSonic.');
        } catch (error) {
            console.error('❌ Erro na integração com CaptchaSonic:', error.message);
            throw error;
        }
    }

    // NOVA FUNÇÃO: Carregar cookies salvos (diminui MUITO a detecção)
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

    // NOVA FUNÇÃO: Salvar cookies para próxima execução
    async saveCookies() {
        try {
            const cookies = await this.context.cookies();
            // Filtrar apenas cookies relevantes do hCaptcha e Receita
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

    // Helper para esperar com variação aleatória
    async waitRandom(min, max) {
        const ms = min + Math.floor(Math.random() * (max - min));
        await this.page.waitForTimeout(ms);
    }

    // Digitar como humano com atraso aleatório entre as teclas e ritmo variável
    async typeLikeHuman(selector, text) {
        console.log(`✍️ Digitando de forma humana no campo ${selector}...`);
        const element = await this.page.waitForSelector(selector);
        await element.focus();
        
        // Selecionar tudo e apagar qualquer valor prévio de forma realista
        await this.page.press(selector, 'Control+A');
        await this.page.waitForTimeout(80 + Math.floor(Math.random() * 120));
        await this.page.press(selector, 'Backspace');
        await this.page.waitForTimeout(100 + Math.floor(Math.random() * 150));

        for (const char of text) {
            // Atraso realista e variável entre 40ms e 160ms por caractere
            const delay = 40 + Math.floor(Math.random() * 120);
            await this.page.keyboard.type(char, { delay });
        }
    }

    // Clicar como humano com um leve deslocamento (offset) do centro exato do botão e movimentos suaves do mouse
    async clickLikeHuman(selector) {
        console.log(`🖱️ Clicando de forma humana no botão ${selector}...`);
        const element = await this.page.waitForSelector(selector);
        const box = await element.boundingBox();
        
        if (box) {
            // Deslocamento aleatório de +-6px do centro matemático
            const offsetX = (box.width / 2) + (Math.random() * 12 - 6);
            const offsetY = (box.height / 2) + (Math.random() * 12 - 6);
            
            // Mover o mouse de forma suave e gradual até as coordenadas
            await this.page.mouse.move(box.x + offsetX, box.y + offsetY, {
                steps: 5 + Math.floor(Math.random() * 7)
            });
            
            // Breve tempo de reação humana antes do clique físico
            await this.page.waitForTimeout(150 + Math.floor(Math.random() * 200));
            
            // Pressionar e soltar o botão do mouse
            await this.page.mouse.down();
            await this.page.waitForTimeout(60 + Math.floor(Math.random() * 90));
            await this.page.mouse.up();
        } else {
            // Fallback seguro caso o boundingBox falhe
            await element.click();
        }
    }

    async launch() {
        let browserTypeStr = process.env.PLAYWRIGHT_BROWSER || 'chromium';
        const isVisual = process.env.VISUAL_MODE === 'true' || process.argv.includes('--visual');
        
        // Caminho da extensão descompactada do CaptchaSonic
        const extensionPath = path.join(__dirname, 'captchasonic-ext-unpacked');
        const useExtension = fs.existsSync(extensionPath);

        if (useExtension) {
            console.log('🔌 Extensão do CaptchaSonic detectada! Forçando uso do CHROMIUM para suporte a extensões...');
            browserTypeStr = 'chromium';
        }

        console.log(`🚀 Iniciando Playwright com ${browserTypeStr.toUpperCase()} para consulta CPF...`);

        // Determinar qual engine de navegador usar
        let browserEngine = chromium;
        if (browserTypeStr === 'webkit') {
            browserEngine = webkit;
        } else if (browserTypeStr === 'firefox') {
            browserEngine = firefox;
        }

        // Configurar argumentos específicos para Chromium
        const launchArgs = [];
        if (browserTypeStr === 'chromium') {
            launchArgs.push(
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu',
                '--disable-blink-features=AutomationControlled',
                '--disable-features=IsolateOrigins,site-per-process',
                '--lang=pt-BR'
            );

            if (useExtension) {
                launchArgs.push(
                    `--disable-extensions-except=${extensionPath}`,
                    `--load-extension=${extensionPath}`
                );
            }
        }

        if (isVisual) {
            console.log('🖥️ Modo VISUAL ativado - navegador será exibido!');
        } else {
            console.log('👻 Modo HEADLESS ativado - navegador oculto');
        }

        // User-Agents realistas baseados no navegador
        let userAgents = [];
        if (browserTypeStr === 'chromium') {
            userAgents = [
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
            ];
        } else if (browserTypeStr === 'firefox') {
            userAgents = [
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0',
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:123.0) Gecko/20100101 Firefox/123.0'
            ];
        } else { // webkit / safari
            userAgents = [
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15',
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15',
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15'
            ];
        }
        const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];

        // Se usar extensão, precisamos usar launchPersistentContext (pois o Playwright exige para carregar extensões)
        if (useExtension && browserTypeStr === 'chromium') {
            // Gerar um ID de perfil exclusivo por consulta para evitar conflitos (SingletonLock) em execuções rápidas ou simultâneas
            const uniqueProfileId = `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
            const userDataDir = path.join(__dirname, 'screenshots', `chrome-profile-${uniqueProfileId}`);
            this.userDataDir = userDataDir;
            console.log(`📂 Utilizando perfil de usuário dinâmico e exclusivo em: ${userDataDir}`);
 
            // Limpeza preventiva de travas (removendo diretamente para evitar problemas com links simbólicos quebrados no Linux)
            const lockPath = path.join(userDataDir, 'SingletonLock');
            try {
                fs.unlinkSync(lockPath);
            } catch (e) {
                // Silencioso caso a trava não exista
            }
 
            const rodarHeadlessComExtensao = !isVisual;
            if (rodarHeadlessComExtensao) {
                console.log('👻 Modo HEADLESS ativo - Ocultando janela do Chromium movendo-a para fora da tela (--window-position=-2000,-2000) para evitar detecção...');
                launchArgs.push('--window-position=-2000,-2000');
            }

            this.context = await chromium.launchPersistentContext(userDataDir, {
                headless: false,
                slowMo: isVisual ? 50 : 0,
                args: launchArgs,
                viewport: {
                    width: 1366 + Math.floor(Math.random() * 300),
                    height: 768 + Math.floor(Math.random() * 300)
                },
                userAgent: randomUserAgent,
                ignoreHTTPSErrors: true,
                javaScriptEnabled: true,
                locale: 'pt-BR',
                timezoneId: 'America/Sao_Paulo',
                permissions: ['geolocation', 'notifications']
            });

            const pages = this.context.pages();
            this.page = pages.length > 0 ? pages[0] : await this.context.newPage();
            this.browser = null; // Sem objeto browser em contexto persistente
        } else {
            // Inicialização normal (sem extensão ou navegador diferente do Chromium)
            this.browser = await browserEngine.launch({
                headless: !isVisual,
                slowMo: isVisual ? 50 : 0,
                args: launchArgs
            });

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
                hasTouch: false
            });

            this.page = await this.context.newPage();
        }

        // CARREGAR COOKIES SALVOS (diminui detecção!)
        await this.loadCookies();

        // Configurar timeouts otimizados
        this.page.setDefaultNavigationTimeout(45000);
        this.page.setDefaultTimeout(20000);

        console.log(`✅ Navegador ${browserTypeStr.toUpperCase()} iniciado para consulta CPF!`);
        return this.page;
    }

    async navigateTo(url) {
        console.log(`🌐 Navegando para: ${url}`);
        try {
            // Usar domcontentloaded para evitar ficar travado esperando requisições de segundo plano
            await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
        } catch (error) {
            console.log('⚠️ Erro na navegação (domcontentloaded), tentando com carregamento padrão...');
            try {
                await this.page.goto(url, { waitUntil: 'load', timeout: 20000 });
            } catch (fallbackError) {
                console.log('⚠️ Falha no fallback de navegação, tentando goto simples...');
                await this.page.goto(url);
            }
        }
    }

    // Função principal para consultar CPF (TODA a lógica do scraper.js)
    async consultarCPF(cpf, birthDate) {
        console.log(`🔍 Iniciando consulta para CPF: ${cpf}`);
        // Aguardar um pouco antes de acessar para evitar rate limiting
        console.log('⏳ Aguardando 500ms para estabilização...');
        await this.page.waitForTimeout(500);
        if (!cpf || !birthDate) {
            return {
                error: true,
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
                        error: true,
                        mensagem: 'Formato de data inválido. Use o formato dd/mm/aaaa'
                    };
                }
            } catch (e) {
                return {
                    error: true,
                    mensagem: 'Formato de data inválido. Use o formato dd/mm/aaaa'
                };
            }
        }

        let alertMessage = null;
        const dialogListener = async (dialog) => {
            alertMessage = dialog.message();
            console.log(`🔔 Alerta do navegador detectado: "${alertMessage}"`);
            await dialog.dismiss().catch(() => {});
        };

        try {
            this.page.on('dialog', dialogListener);

            // Verificar se já estamos na página de consulta com o formulário pronto
            const urlAtual = this.page.url();
            const naUrlCorreta = urlAtual.includes('servicos.receita.fazenda.gov.br/servicos/cpf/consultasituacao/consultapublica.asp');
            const formularioVisivel = await this.page.$('#txtCPF').then(el => el !== null).catch(() => false);
            const jaEstaNaPagina = naUrlCorreta && formularioVisivel;

            if (!jaEstaNaPagina) {
                console.log('Acessando site da Receita Federal de forma HUMANA...');

                // TÉCNICA ANTI-BOT: Adicionar cookies e localStorage antes de acessar
                // (simula que o navegador já foi usado)
                await this.context.addCookies([
                    {
                        name: 'visited',
                        value: 'true',
                        domain: '.receita.fazenda.gov.br',
                        path: '/',
                        expires: Date.now() / 1000 + 86400
                    }
                ]);

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

                // IMPORTANTE: Injetar scripts anti-detecção LOGO APÓS carregar página
                await this.page.addInitScript(() => {
                    // Remover qualquer rastro de automação que possa ter sido adicionado
                    Object.defineProperty(document, 'hidden', {
                        get: () => false
                    });
                    Object.defineProperty(document, 'visibilityState', {
                        get: () => 'visible'
                    });
                });
            } else {
                console.log('✅ Já estamos na página de consulta e o formulário está visível. Evitando recarregamento para economizar créditos do CaptchaSonic.');
            }

            // Aguardar carregamento do formulário
            await this.page.waitForSelector('#txtCPF');
            await takeScreenshot(this.page, '01_inicial');

            // Preenchimento simulando comportamento humano detalhado
            console.log('Preenchendo formulário de consulta de forma humana...');
            
            // Focar e digitar o CPF de forma cadenciada
            await this.typeLikeHuman('#txtCPF', cpf);
            await this.page.dispatchEvent('#txtCPF', 'change');
            
            // Pausa de hesitação humana entre campos (300ms a 700ms)
            await this.waitRandom(300, 700);

            // Focar e digitar a Data de Nascimento
            await this.typeLikeHuman('#txtDataNascimento', birthDate);
            await this.page.dispatchEvent('#txtDataNascimento', 'change');
            
            // Disparar blur de forma realista
            await this.page.dispatchEvent('#txtDataNascimento', 'blur');

            await takeScreenshot(this.page, '02_apos_preenchimento');

            // Aguardar carregamento do captcha
            console.log('Aguardando carregamento do captcha...');
            // Tentar esperar pelo container oficial do h-captcha ou pelo iframe contendo hcaptcha.com
            await Promise.any([
                this.page.waitForSelector('.h-captcha iframe', { timeout: 25000 }),
                this.page.waitForSelector('iframe[src*="hcaptcha.com"]', { timeout: 25000 }),
                this.page.waitForSelector('iframe[title*="hCaptcha"]', { timeout: 25000 })
            ]).catch(() => {
                console.log('⚠️ Aviso: Seletor específico do iframe do hCaptcha não apareceu, prosseguindo com a verificação de token.');
            });
            await takeScreenshot(this.page, '03_antes_captcha');
 
            // Lógica simplificada de detecção e resolução do hCaptcha pela extensão CaptchaSonic
            console.log('🔍 Aguardando a resolução do hCaptcha pela extensão CaptchaSonic...');
            try {
                let resolvido = false;
                const maxEsperaSegundos = 45;
 
                for (let sec = 0; sec < maxEsperaSegundos; sec++) {
                    await this.page.waitForTimeout(1000);
 
                    // Verificar se o token de resposta foi preenchido na página principal pela extensão
                    const tokenPreenchido = await this.page.evaluate(() => {
                        const t1 = document.querySelector('[name="h-captcha-response"]')?.value;
                        const t2 = document.querySelector('[name="g-recaptcha-response"]')?.value;
                        return (t1 && t1.length > 50) ? t1 : ((t2 && t2.length > 50) ? t2 : null);
                    });
 
                    if (tokenPreenchido) {
                        console.log('✅ hCaptcha resolvido com sucesso pela extensão CaptchaSonic! Executando callback da página...');
                        resolvido = true;
                        
                        // Executar o callback da própria biblioteca do hCaptcha configurado na página
                        await this.page.evaluate((tokenSol) => {
                            const t1 = document.querySelector('[name="h-captcha-response"]');
                            if (t1) {
                                t1.value = tokenSol;
                                t1.dispatchEvent(new Event('input', { bubbles: true }));
                                t1.dispatchEvent(new Event('change', { bubbles: true }));
                            }
                            const t2 = document.querySelector('[name="g-recaptcha-response"]');
                            if (t2) {
                                t2.value = tokenSol;
                                t2.dispatchEvent(new Event('input', { bubbles: true }));
                                t2.dispatchEvent(new Event('change', { bubbles: true }));
                            }

                            const el = document.querySelector('.h-captcha');
                            if (el) {
                                const callbackName = el.getAttribute('data-callback');
                                if (callbackName && typeof window[callbackName] === 'function') {
                                    console.log('Executando callback do hCaptcha via extensão:', callbackName);
                                    window[callbackName](tokenSol);
                                }
                            }
                        }, tokenPreenchido);
                        break;
                    }
                }
 
                if (!resolvido) {
                    throw new Error('Tempo limite excedido aguardando a resolução do hCaptcha.');
                }
            } catch (error) {
                console.error('❌ Erro no monitoramento do hCaptcha:', error.message);
                throw error;
            }

            // Aguardar e verificar o botão Consultar (do scraper.js)
            console.log('Aguardando botão Consultar...');
            await this.page.waitForSelector('input[value="Consultar"]', {
                timeout: 30000
            });



            // Aguardar exatamente 1 segundo (tempo de reação e estabilização solicitado) antes de consultar
            console.log('⏳ hCaptcha resolvido. Aguardando 1 segundo antes de clicar em Consultar...');
            await this.page.waitForTimeout(1000);

            // Clicar no botão Consultar com melhor tratamento (do scraper.js)
            console.log('Clicando em Consultar...');

            try {
                // Clicar simulando mouse físico e coordenadas com offset realista
                await this.clickLikeHuman('input[value="Consultar"]');
                console.log('✅ Clique humano realizado com sucesso');

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
                console.log('⚠️ Falha no clique natural, tentando clique forçado com force: true... message: ' + clickError.message);
                try {
                    await this.page.click('input[value="Consultar"]', { force: true });
                    console.log('✅ Clique forçado realizado com sucesso');
                } catch (forceError) {
                    console.log('❌ Erro no clique forçado, tentando submissão alternativa via JS...');
                    try {
                        await this.page.evaluate(() => {
                            const btn = document.querySelector('input[value="Consultar"]');
                            if (btn) {
                                btn.click();
                            } else {
                                const form = document.querySelector('form');
                                if (form) form.submit();
                            }
                        });
                        console.log('✅ Clique/Submissão alternativo via JS executado com sucesso');
                    } catch (jsError) {
                        console.error('❌ Erro na submissão alternativa via JS:', jsError.message);
                        throw clickError;
                    }
                }
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

            // 1. Validar se houve alerta do sistema (como hCaptcha inválido ou erro de dados)
            if (alertMessage) {
                console.log(`❌ Consulta abortada: Alerta detectado no portal: "${alertMessage}"`);
                return {
                    error: true,
                    message: `Erro reportado pelo portal da Receita: ${alertMessage}`,
                    type: 'portal_alert',
                    alert_message: alertMessage
                };
            }

            // 2. Validar se a extração foi nula (indica que não houve sucesso real)
            if (!data.cpf || !data.nome) {
                console.log('⚠️ Extração falhou: CPF ou Nome não encontrados nos dados resultantes.');

                // Verificar se ainda estamos na página do formulário
                const aindaNoFormulario = await this.page.$('#txtCPF').then(el => el !== null).catch(() => false);
                if (aindaNoFormulario) {
                    return {
                        error: true,
                        mensagem: 'A consulta não avançou. O portal da Receita Federal rejeitou o hCaptcha ou os dados digitados.',
                        type: 'submissao_rejeitada'
                    };
                }

                return {
                    error: true,
                    mensagem: 'Não foi possível ler os dados cadastrais da página de resultado.',
                    type: 'erro_extracao'
                };
            }

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

            // SALVAR COOKIES para próxima execução (IMPORTANTE!)
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
                error: true,
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
                error: true,
                mensagem: `Erro ao consultar CPF: ${error.message}`
            };
        } finally {
            this.page.off('dialog', dialogListener);
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
        try {
            if (this.browser) {
                await this.browser.close();
            } else if (this.context) {
                await this.context.close();
            }
        } catch (e) {
            console.log('⚠️ Erro ao fechar contexto do navegador:', e.message);
        }

        // Limpeza síncrona/segura de travas e da pasta de perfil exclusiva após fechar o Chromium
        if (this.userDataDir && fs.existsSync(this.userDataDir)) {
            try {
                // Tentar remover o SingletonLock explicitamente para evitar travas em futuras instâncias
                const lockPath = path.join(this.userDataDir, 'SingletonLock');
                if (fs.existsSync(lockPath)) {
                    fs.unlinkSync(lockPath);
                }
                
                // Opcional: Para evitar encher o disco no servidor, você pode apagar a pasta inteira.
                // Como salvamos os cookies em cookies_hcaptcha.json, não há problema em limpar a pasta temporária do profile!
                fs.rmSync(this.userDataDir, { recursive: true, force: true });
                console.log(`🧹 Pasta de perfil temporário limpa com sucesso: ${this.userDataDir}`);
            } catch (cleanupError) {
                console.log(`⚠️ Falha ao limpar diretório temporário do profile: ${cleanupError.message}`);
            }
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

        const browserTypeStr = process.env.PLAYWRIGHT_BROWSER || 'chromium';
        console.log(`🎯 CPF Consultor (${browserTypeStr.toUpperCase()}) ativo com TODA a lógica do scraper.js!`);
        console.log('💡 Use o painel visual ou as funções do console para interagir');

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