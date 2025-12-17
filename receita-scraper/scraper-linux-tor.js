const { chromium } = require('playwright');
const { SocksProxyAgent } = require('socks-proxy-agent');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Função para criar diretório de screenshots
const setupScreenshotDir = () => {
    const dir = path.join(__dirname, 'screenshots', 'ultima_consulta');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
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

// Verificar se TOR está rodando
async function verificarTorStatus() {
    try {
        // Tentar conectar na porta padrão do TOR
        const { exec } = require('child_process');
        const { promisify } = require('util');
        const execAsync = promisify(exec);
        
        // Verificar se o serviço TOR está ativo
        try {
            await execAsync('systemctl is-active tor');
            return { ativo: true, metodo: 'systemd' };
        } catch (e) {
            // Se systemctl falhar, verificar se a porta está aberta
            try {
                await execAsync('netstat -tuln | grep 9050');
                return { ativo: true, metodo: 'porta' };
            } catch (e2) {
                return { ativo: false, metodo: null };
            }
        }
    } catch (error) {
        return { ativo: false, metodo: null };
    }
}

// Obter IP atual através do TOR
async function obterIpTor() {
    try {
        const https = require('https');
        const { SocksProxyAgent } = require('socks-proxy-agent');
        
        const agent = new SocksProxyAgent('socks5://127.0.0.1:9050');
        
        return new Promise((resolve, reject) => {
            https.get('https://api.ipify.org?format=json', { agent }, (res) => {
                let data = '';
                res.on('data', (chunk) => { data += chunk; });
                res.on('end', () => {
                    try {
                        const json = JSON.parse(data);
                        resolve(json.ip);
                    } catch (e) {
                        reject(e);
                    }
                });
            }).on('error', reject);
        });
    } catch (error) {
        return null;
    }
}

class PlaywrightTorCPFConsultor {
    constructor(options = {}) {
        this.browser = null;
        this.context = null;
        this.page = null;
        this.screenshotDir = setupScreenshotDir();
        this.options = {
            torProxy: options.torProxy || 'socks5://127.0.0.1:9050',
            headless: options.headless !== undefined ? options.headless : true,
            slowMo: options.slowMo || 100
        };
    }

    async launch() {
        console.log('🧅 Iniciando Playwright com Chromium + TOR para consulta CPF...');
        
        // Verificar se TOR está rodando
        const torStatus = await verificarTorStatus();
        if (!torStatus.ativo) {
            console.log('⚠️ TOR não está rodando!');
            console.log('💡 Instale e inicie o TOR:');
            console.log('   sudo apt install tor');
            console.log('   sudo systemctl start tor');
            throw new Error('TOR não está rodando. Execute: sudo systemctl start tor');
        }
        
        console.log(`✅ TOR detectado e ativo (método: ${torStatus.metodo})`);
        
        // Obter IP através do TOR
        try {
            const ipTor = await obterIpTor();
            if (ipTor) {
                console.log(`🌍 Seu IP através do TOR: ${ipTor}`);
            }
        } catch (e) {
            console.log('⚠️ Não foi possível verificar IP do TOR');
        }
        
        // Configurações do Chromium - modo visual ou headless
        const isVisual = process.env.VISUAL_MODE === 'true' || process.argv.includes('--visual');
        
        const launchOptions = {
            headless: isVisual ? false : this.options.headless,
            slowMo: isVisual ? 500 : this.options.slowMo,
            // Configurar proxy TOR
            proxy: {
                server: this.options.torProxy
            },
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-blink-features=AutomationControlled',
                '--lang=pt-BR'
            ]
        };
        
        this.browser = await chromium.launch(launchOptions);
        
        if (isVisual) {
            console.log('🖥️ Modo VISUAL ativado - navegador será exibido!');
        } else {
            console.log('👻 Modo HEADLESS ativado - navegador oculto');
        }
        
        console.log('🧅 Conectado através da rede TOR para anonimato');
        
        // Contexto Ultra Stealth - Simula navegador real
        const stealthUserAgents = [
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
            'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/120.0',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        ];
        
        const randomUserAgent = stealthUserAgents[Math.floor(Math.random() * stealthUserAgents.length)];
        
        this.context = await this.browser.newContext({
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
            
            permissions: ['geolocation'],
            geolocation: { latitude: -23.5505, longitude: -46.6333 },
            colorScheme: 'light',
            hasTouch: false,
            isMobile: false,
            offline: false,
            deviceScaleFactor: 1,
            storageState: undefined
        });

        // Modo Stealth Avançado
        await this.context.addInitScript(() => {
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined,
            });
            delete navigator.__proto__.webdriver;
            
            Object.defineProperty(navigator, 'plugins', {
                get: () => [1, 2, 3, 4, 5]
            });
            
            Object.defineProperty(navigator, 'languages', {
                get: () => ['pt-BR', 'pt', 'en-US', 'en']
            });
            
            const originalQuery = window.navigator.permissions.query;
            window.navigator.permissions.query = (parameters) => (
                parameters.name === 'notifications' ?
                    Promise.resolve({ state: 'prompt' }) :
                    originalQuery(parameters)
            );
            
            if (window.chrome) {
                Object.defineProperty(window.chrome, 'runtime', {
                    get: () => undefined
                });
            }
            
            delete window.__playwright;
            delete window.__pw_manual;
            delete window.__PW_inspect;
            
            console.log('🥷 Modo Stealth + TOR Avançado ativado');
        });

        this.page = await this.context.newPage();
        
        this.page.setDefaultNavigationTimeout(60000); // 60s para TOR
        this.page.setDefaultTimeout(30000);

        // Bloquear recursos desnecessários
        await this.page.route('**/*', (route) => {
            const resourceType = route.request().resourceType();
            const url = route.request().url();
            
            const blockedDomains = [
                'google-analytics.com',
                'googletagmanager.com',
                'facebook.com',
                'doubleclick.net',
                'googlesyndication.com',
                'amazon-adsystem.com'
            ];
            
            const shouldBlock = blockedDomains.some(domain => url.includes(domain)) ||
                               (resourceType === 'image' && !url.includes('captcha') && !url.includes('hcaptcha')) ||
                               resourceType === 'media' ||
                               url.includes('/ads/') ||
                               url.includes('/tracking/');
            
            if (shouldBlock) {
                route.abort();
            } else {
                const headers = route.request().headers();
                headers['sec-fetch-site'] = 'same-origin';
                headers['sec-fetch-mode'] = 'cors';
                route.continue({ headers });
            }
        });
        
        console.log('✅ Chromium + TOR iniciado para consulta CPF com anonimato!');
        return this.page;
    }

    async navigateTo(url) {
        console.log(`🌐 Navegando para: ${url} (através do TOR)`);
        try {
            await this.page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
        } catch (error) {
            console.log('⚠️ Erro na navegação, tentando novamente...');
            await this.page.goto(url, { timeout: 60000 });
        }
    }

    async preencherComportamentoHumano(seletor, texto) {
        try {
            await this.page.waitForSelector(seletor, { timeout: 10000 });
            
            const elemento = await this.page.$(seletor);
            const box = await elemento.boundingBox();
            
            if (box) {
                await this.page.mouse.move(
                    box.x + box.width / 2 + Math.random() * 10 - 5,
                    box.y + box.height / 2 + Math.random() * 10 - 5,
                    { steps: Math.floor(Math.random() * 5) + 3 }
                );
                await this.page.waitForTimeout(Math.random() * 300 + 100);
            }
            
            await this.page.click(seletor);
            await this.page.keyboard.down('Control');
            await this.page.keyboard.press('KeyA');
            await this.page.keyboard.up('Control');
            await this.page.waitForTimeout(Math.random() * 100 + 50);
            
            for (let i = 0; i < texto.length; i++) {
                await this.page.keyboard.type(texto[i]);
                const delay = Math.random() * 150 + 50;
                await this.page.waitForTimeout(delay);
                
                if (Math.random() < 0.1) {
                    await this.page.waitForTimeout(Math.random() * 500 + 200);
                }
            }
            
            await this.page.waitForTimeout(Math.random() * 200 + 100);
            
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
            await this.page.fill(seletor, texto);
        }
    }

    async simularMovimentoMouse() {
        try {
            const viewport = this.page.viewportSize();
            const x = Math.random() * viewport.width;
            const y = Math.random() * viewport.height;
            
            await this.page.mouse.move(x, y, { 
                steps: Math.floor(Math.random() * 10) + 5 
            });
        } catch (error) {
            // Ignorar erros
        }
    }

    async consultarCPF(cpf, birthDate) {
        console.log(`🔍 Iniciando consulta através do TOR para CPF: ${cpf}`);
        
        console.log('🥷 Simulando comportamento humano...');
        await this.simularMovimentoMouse();
        
        const delayHumano = 3000 + Math.random() * 3000; // 3-6 segundos (TOR é mais lento)
        console.log(`⏳ Aguardando ${Math.round(delayHumano/1000)}s para evitar detecção...`);
        await this.page.waitForTimeout(delayHumano);
        
        if (!cpf || !birthDate) {
            return {
                erro: true,
                mensagem: !cpf ? 'CPF não informado' : 'Data de nascimento não informada'
            };
        }

        cpf = cpf.replace(/[^0-9]/g, '');

        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
            try {
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
            console.log('Acessando site da Receita Federal através do TOR...');
            
            let carregouSite = false;
            const tentativas = [
                { waitUntil: 'domcontentloaded', timeout: 30000 },
                { waitUntil: 'load', timeout: 45000 },
                { waitUntil: 'networkidle', timeout: 60000 }
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
            
            await this.page.waitForSelector('#txtCPF');
            await takeScreenshot(this.page, '01_inicial_tor');

            console.log('Preenchendo CPF com comportamento humano...');
            await this.preencherComportamentoHumano('#txtCPF', cpf);

            console.log('Preenchendo data de nascimento com comportamento humano...');
            await this.preencherComportamentoHumano('#txtDataNascimento', birthDate);
            await takeScreenshot(this.page, '02_apos_preenchimento_tor');

            console.log('Aguardando carregamento do captcha...');
            await this.page.waitForSelector('iframe[title="Widget contendo caixa de seleção para desafio de segurança hCaptcha"]', { timeout: 15000 }).catch(() => {
                console.log('⚠️ Captcha não encontrado - continuando...');
            });
            await takeScreenshot(this.page, '03_antes_captcha_tor');

            // Detecção de captcha
            console.log('🔍 Verificando captcha...');
            
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
                            title: captchaIframe.title
                        } : null
                    };
                });
                
                if (temCaptchaVisivel.temCaptcha) {
                    captchaEncontrado = true;
                    console.log('✅ Captcha encontrado e visível');
                    
                    const isVisual = process.env.VISUAL_MODE === 'true' || process.argv.includes('--visual');
                    
                    if (isVisual) {
                        console.log('🖥️ Modo visual: aguardando resolução manual do captcha...');
                        console.log('👉 Por favor, resolva o captcha manualmente no navegador');
                        
                        let tentativasEspera = 0;
                        const maxEspera = 120;
                        
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
                        console.log('⚠️ Captcha detectado em modo headless');
                        console.log('💡 Use VISUAL_MODE=true para resolver manualmente');
                    }
                } else {
                    console.log('ℹ️ Nenhum captcha visível');
                }
                
                await takeScreenshot(this.page, '04_apos_captcha_tor');
                
            } catch (error) {
                console.log('⚠️ Erro na verificação de captcha:', error.message);
            }

            console.log('Aguardando botão Consultar...');
            await this.page.waitForSelector('input[value="Consultar"]', { timeout: 30000 });
            await this.page.waitForTimeout(500);

            console.log('Clicando em Consultar...');
            
            const botaoInfo = await this.page.evaluate(() => {
                const botao = document.querySelector('input[value="Consultar"]');
                if (!botao) return { existe: false };
                
                return {
                    existe: true,
                    habilitado: !botao.disabled,
                    visivel: botao.offsetParent !== null
                };
            });
            
            if (!botaoInfo.existe) {
                throw new Error('Botão Consultar não encontrado');
            }
            
            if (!botaoInfo.habilitado) {
                await this.page.evaluate(() => {
                    const botao = document.querySelector('input[value="Consultar"]');
                    if (botao) {
                        botao.disabled = false;
                        botao.removeAttribute('disabled');
                    }
                });
                await this.page.waitForTimeout(500);
            }
            
            let cliqueSucesso = false;
            
            try {
                await this.page.click('input[value="Consultar"]');
                cliqueSucesso = true;
            } catch (error) {
                try {
                    await this.page.evaluate(() => {
                        const botao = document.querySelector('input[value="Consultar"]');
                        if (botao) botao.click();
                    });
                    cliqueSucesso = true;
                } catch (e) {
                    await this.page.evaluate(() => {
                        const form = document.querySelector('form');
                        if (form) form.submit();
                    });
                    cliqueSucesso = true;
                }
            }
            
            if (!cliqueSucesso) {
                throw new Error('Todas as estratégias de clique falharam');
            }
            
            console.log('Aguardando resposta através do TOR (pode demorar mais)...');
            
            await Promise.race([
                this.page.waitForNavigation({ waitUntil: 'networkidle', timeout: 60000 }).then(() => 'navigation'),
                this.page.waitForSelector('.clConteudoDados', { timeout: 10000 }).then(() => 'resultado_encontrado').catch(() => null),
                this.page.waitForFunction(
                    () => {
                        if (!document.body) return false;
                        try {
                            const html = document.body.innerHTML || '';
                            return html.includes('Situação Cadastral') || 
                                   html.includes('clConteudoDados');
                        } catch (e) {
                            return false;
                        }
                    },
                    { timeout: 60000, polling: 500 }
                ).then(() => 'content_change')
            ]);

            await this.page.waitForTimeout(2000);
            await takeScreenshot(this.page, '05_resultado_tor');

            // Verificar erros
            const temErroDivergencia = await this.page.evaluate(() => {
                const conteudo = document.body.innerText;
                return conteudo.includes('Data de nascimento informada') &&
                    conteudo.includes('está divergente');
            });

            if (temErroDivergencia) {
                return {
                    error: true,
                    message: 'Data de nascimento informada está divergente da constante na base de dados.',
                    type: 'data_divergente',
                    usou_tor: true
                };
            }

            const temErroDivergenciaCpf = await this.page.evaluate(() => {
                const conteudo = document.body.innerText;
                return conteudo.includes('CPF incorreto');
            });

            if (temErroDivergenciaCpf) {
                return {
                    error: true,
                    message: 'CPF informado está incorreto',
                    type: 'cpf_incorreto',
                    usou_tor: true
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
                    type: 'cpf_nao_encontrado',
                    usou_tor: true
                };
            }

            // Extrair dados
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

            console.log('Consulta finalizada com sucesso através do TOR!');
            await takeScreenshot(this.page, '06_final_sucesso_tor');
            
            const resultadoCompleto = {
                ...data,
                cpf_consultado: cpf,
                data_nascimento_consultada: birthDate,
                timestamp: new Date().toISOString(),
                sucesso: true,
                usou_tor: true,
                anonimo: true
            };
            
            const resultadoPath = path.join(__dirname, 'screenshots', 'ultima_consulta', 'resultado_tor.json');
            fs.writeFileSync(resultadoPath, JSON.stringify(resultadoCompleto, null, 2));
            
            return resultadoCompleto;

        } catch (error) {
            console.error('Erro durante a consulta:', error);
            await takeScreenshot(this.page, '07_erro_tor');
            
            return {
                erro: true,
                mensagem: `Erro ao consultar CPF: ${error.message}`,
                usou_tor: true
            };
        }
    }

    async close() {
        console.log('🔄 Fechando navegador TOR...');
        
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
    const consultor = new PlaywrightTorCPFConsultor();
    
    try {
        await consultor.launch();
        await consultor.navigateTo('https://servicos.receita.fazenda.gov.br/servicos/cpf/consultasituacao/consultapublica.asp');
        
        const args = process.argv.slice(2).filter(arg => !arg.startsWith('--'));
        if (args.length >= 2) {
            const cpf = args[0];
            const birthDate = args[1];
            
            console.log(`🚀 Executando consulta através do TOR para CPF: ${cpf}`);
            
            const resultado = await consultor.consultarCPF(cpf, birthDate);
            console.log('\n✅ Resultado da consulta:', JSON.stringify(resultado, null, 2));
            
            await consultor.close();
            return;
        }
        
        console.log('🎯 Chromium + TOR CPF Consultor ativo!');
        console.log('💡 Execute: node scraper-linux-tor.js CPF DATA');
        console.log('💡 Exemplo: VISUAL_MODE=true node scraper-linux-tor.js 11144477735 01/01/1990');
        
    } catch (error) {
        console.error('❌ Erro:', error);
        await consultor.close();
    }
}

// Exportar
module.exports = {
    PlaywrightTorCPFConsultor,
    consultarCPF: async (cpf, birthDate, options = {}) => {
        const consultor = new PlaywrightTorCPFConsultor(options);
        try {
            await consultor.launch();
            await consultor.navigateTo('https://servicos.receita.fazenda.gov.br/servicos/cpf/consultasituacao/consultapublica.asp');
            return await consultor.consultarCPF(cpf, birthDate);
        } finally {
            await consultor.close();
        }
    },
    verificarTorStatus,
    obterIpTor
};

if (require.main === module) {
    main().catch(console.error);
}

