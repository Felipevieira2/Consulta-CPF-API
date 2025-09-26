const { webkit } = require('playwright');
const fs = require('fs');
const path = require('path');

// Função para criar diretório de screenshots (do scraper.js)
const setupScreenshotDir = () => {
    const dir = path.join(__dirname, 'screenshots');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {
            recursive: true
        });
    }
    return dir;
};

// Função para capturar screenshots (do scraper.js)
const takeScreenshot = async (page, name) => {
    const dir = setupScreenshotDir();
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const filename = `${name}_${timestamp}.png`;
    const filepath = path.join(dir, filename);
    await page.screenshot({
        path: filepath
    });
    console.log(`📸 Screenshot salvo: ${filepath}`);
    return filepath;
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
        
        // Configurações otimizadas do WebKit - argumentos compatíveis
        this.browser = await webkit.launch({
            headless: true,
            slowMo: 100,
            args: [
                '--disable-web-security'
            ]
        });

        // Cria contexto com configurações do scraper.js
        this.context = await this.browser.newContext({
            viewport: { width: 1920, height: 1080 },
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        });

        // Remove sinais de automação (do scraper.js)
        await this.context.addInitScript(() => {
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined,
            });
            delete navigator.__proto__.webdriver;
        });

        this.page = await this.context.newPage();
        
        // Configurar timeouts (do scraper.js)
        this.page.setDefaultNavigationTimeout(60000);
        this.page.setDefaultTimeout(30000);

        // Otimização: Reduzir recursos carregados (do scraper.js)
        await this.page.route('**/*', (route) => {
            const resourceType = route.request().resourceType();
            // Bloquear recursos desnecessários
            if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
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
            await this.page.goto('https://servicos.receita.fazenda.gov.br/servicos/cpf/consultasituacao/consultapublica.asp', {
                waitUntil: 'networkidle'
            });

            // Aguardar carregamento do formulário
            await this.page.waitForSelector('#txtCPF');
            //await takeScreenshot(this.page, 'inicial');

            // Preenchimento otimizado (do scraper.js)
            console.log('Preenchendo CPF...');
            await this.page.evaluate((cpfValue) => {
                document.querySelector('#txtCPF').value = cpfValue;
            }, cpf);

            console.log('Preenchendo data de nascimento...');
            await this.page.evaluate((dateValue) => {
                document.querySelector('#txtDataNascimento').value = dateValue;
            }, birthDate);
            //await takeScreenshot(this.page, 'apos_preenchimento');

            // Aguardar carregamento do captcha
            console.log('Aguardando carregamento do captcha...');
            await this.page.waitForSelector('iframe[title="Widget contendo caixa de seleção para desafio de segurança hCaptcha"]');
            //await takeScreenshot(this.page, 'antes_captcha');

            // TODA a lógica de captcha do scraper.js - VERSÃO MELHORADA
            console.log('🔍 Iniciando detecção avançada do hCaptcha...');
            try {
                // Múltiplos seletores para encontrar o iframe do hCaptcha
                const hcaptchaSelectors = [
                    'iframe[src*="hcaptcha.com"]',
                    'iframe[title*="hCaptcha"]',
                    'iframe[title*="Widget contendo caixa de seleção para desafio de segurança hCaptcha"]',
                    'iframe[data-hcaptcha-widget-id]',
                    '.h-captcha iframe'
                ];

                let hcaptchaIframeHandle = null;
                let selectorUsed = '';

                // Tentar encontrar o iframe com diferentes seletores
                for (const selector of hcaptchaSelectors) {
                    try {
                        console.log(`🔎 Tentando seletor: ${selector}`);
                        await this.page.waitForSelector(selector, { timeout: 10000 });
                        
                        const iframe = await this.page.$(selector);
                        if (iframe) {
                            // Verificar se o iframe é realmente do hCaptcha
                            const iframeInfo = await iframe.evaluate(el => ({
                                src: el.src,
                                title: el.title,
                                id: el.id,
                                className: el.className,
                                dataset: Object.keys(el.dataset)
                            }));
                            
                            console.log(`📋 Info do iframe encontrado:`, iframeInfo);
                            
                            if (iframeInfo.src.includes('hcaptcha.com') || 
                                iframeInfo.title.toLowerCase().includes('hcaptcha') ||
                                iframeInfo.dataset.includes('hcaptcha-widget-id')) {
                                hcaptchaIframeHandle = iframe;
                                selectorUsed = selector;
                                console.log(`✅ Iframe do hCaptcha encontrado com seletor: ${selector}`);
                                break;
                            }
                        }
                    } catch (e) {
                        console.log(`⚠️ Seletor ${selector} não funcionou: ${e.message}`);
                        continue;
                    }
                }

                // Se não encontrou com seletores específicos, buscar em todos os iframes
                if (!hcaptchaIframeHandle) {
                    console.log('🔍 Buscando em todos os iframes da página...');
                    const allIframes = await this.page.$$('iframe');
                    console.log(`📊 Total de iframes encontrados: ${allIframes.length}`);

                    for (let i = 0; i < allIframes.length; i++) {
                        const iframe = allIframes[i];
                        try {
                            const iframeInfo = await iframe.evaluate(el => ({
                                src: el.src || '',
                                title: el.title || '',
                                id: el.id || '',
                                className: el.className || ''
                            }));
                            
                            console.log(`📋 Iframe ${i + 1}:`, iframeInfo);
                            
                            if (iframeInfo.src.includes('hcaptcha.com') || 
                                iframeInfo.title.toLowerCase().includes('hcaptcha')) {
                                hcaptchaIframeHandle = iframe;
                                selectorUsed = `iframe[${i + 1}]`;
                                console.log(`✅ Iframe do hCaptcha encontrado na posição ${i + 1}`);
                                break;
                            }
                        } catch (e) {
                            console.log(`⚠️ Erro ao verificar iframe ${i + 1}: ${e.message}`);
                        }
                    }
                }

                if (hcaptchaIframeHandle) {
                    console.log(`🎯 Iframe do hCaptcha confirmado! Usado: ${selectorUsed}`);
                    
                    // Aguardar um pouco para o iframe carregar completamente
                    await this.page.waitForTimeout(2000);
                    
                    // Obter o frame content com retry
                    let frameHandle = null;
                    let retryCount = 0;
                    const maxRetries = 5;
                    
                    while (!frameHandle && retryCount < maxRetries) {
                        try {
                            frameHandle = await hcaptchaIframeHandle.contentFrame();
                            if (frameHandle) {
                                console.log(`✅ Frame content obtido na tentativa ${retryCount + 1}`);
                                break;
                            }
                        } catch (e) {
                            console.log(`⚠️ Tentativa ${retryCount + 1} falhou: ${e.message}`);
                        }
                        
                        retryCount++;
                        await this.page.waitForTimeout(1000);
                    }
                    
                    if (frameHandle) {
                        console.log('🔧 Tentando interagir com o checkbox do hCaptcha...');
                        
                        try {
                            // Aguardar o checkbox aparecer no frame
                            await frameHandle.waitForSelector('#checkbox', { timeout: 10000 });
                            console.log('✅ Checkbox encontrado no frame');
                            
                            // Verificar estado inicial do checkbox
                            const initialState = await frameHandle.evaluate(() => {
                                const checkbox = document.querySelector('#checkbox');
                                if (!checkbox) return { found: false };
                                
                                return {
                                    found: true,
                                    checked: checkbox.checked,
                                    ariaChecked: checkbox.getAttribute('aria-checked'),
                                    disabled: checkbox.disabled,
                                    visible: checkbox.offsetParent !== null,
                                    className: checkbox.className
                                };
                            });
                            
                            console.log('📊 Estado inicial do checkbox:', initialState);
                            
                            if (initialState.found && !initialState.checked && initialState.ariaChecked !== 'true') {
                                // Tentar clicar no checkbox
                                await frameHandle.evaluate(() => {
                                    const checkbox = document.querySelector('#checkbox');
                                    if (checkbox && !checkbox.disabled) {
                                        checkbox.click();
                                        console.log('Clique executado no checkbox');
                                    }
                                });
                                
                                await this.page.waitForTimeout(500);
                                
                                // Verificar se o clique funcionou
                                const afterClickState = await frameHandle.evaluate(() => {
                                    const checkbox = document.querySelector('#checkbox');
                                    if (!checkbox) return { found: false };
                                    
                                    return {
                                        found: true,
                                        checked: checkbox.checked,
                                        ariaChecked: checkbox.getAttribute('aria-checked'),
                                        className: checkbox.className
                                    };
                                });
                                
                                console.log('📊 Estado após clique:', afterClickState);
                                
                                if (afterClickState.checked || afterClickState.ariaChecked === 'true') {
                                    console.log('✅ Checkbox marcado com sucesso!');
                                } else {
                                    console.log('⚠️ Checkbox não foi marcado, pode precisar de resolução manual');
                                }
                            } else if (initialState.checked || initialState.ariaChecked === 'true') {
                                console.log('✅ Checkbox já estava marcado!');
                            } else {
                                console.log('⚠️ Checkbox não está disponível para interação');
                            }
                            
                        } catch (frameError) {
                            console.log('❌ Erro na interação com o frame:', frameError.message);
                        }
                    } else {
                        console.log('❌ Não foi possível obter o conteúdo do frame após várias tentativas');
                    }
                } else {
                    console.log('❌ Iframe do hCaptcha não foi encontrado com nenhum método');
                }

                // Aguardar tempo para possível resolução manual
                console.log('⏳ Aguardando possível resolução manual do captcha (10 segundos)...');
                await this.page.waitForTimeout(10000);
                //await takeScreenshot(this.page, 'apos_tentativa_captcha');
                
            } catch (error) {
                console.error('❌ Erro na detecção avançada do hCaptcha:', error);
                //await takeScreenshot(this.page, 'erro_deteccao_hcaptcha');
            }

            // Aguardar e verificar o botão Consultar (do scraper.js)
            console.log('Aguardando botão Consultar...');
            await this.page.waitForSelector('input[value="Consultar"]', {
                timeout: 30000
            });

            // Verificar se o botão está habilitado e visível (do scraper.js)
            const botaoInfo = await this.page.evaluate(() => {
                const botao = document.querySelector('input[value="Consultar"]');
                if (!botao) return { existe: false };
                
                return {
                    existe: true,
                    habilitado: !botao.disabled,
                    visivel: botao.offsetParent !== null,
                    style: window.getComputedStyle(botao).display
                };
            });

            console.log('Estado do botão Consultar:', botaoInfo);

            if (!botaoInfo.existe) {
                throw new Error('Botão Consultar não encontrado');
            }

            if (!botaoInfo.habilitado) {
                console.log('⚠️ Botão Consultar está desabilitado. Aguardando habilitação...');
                
                // Aguardar até o botão ficar habilitado (captcha resolvido)
                await this.page.waitForFunction(
                    () => {
                        const botao = document.querySelector('input[value="Consultar"]');
                        return botao && !botao.disabled;
                    },
                    { timeout: 60000, polling: 1000 }
                ).catch(() => {
                    throw new Error('Timeout: Botão Consultar não foi habilitado. Verifique se o captcha foi resolvido.');
                });
                
                console.log('✅ Botão Consultar foi habilitado!');
            }

            // Aguardar um pouco mais para garantir que tudo está pronto
            await this.page.waitForTimeout(1000);

            // Clicar no botão Consultar com melhor tratamento (do scraper.js)
            console.log('Clicando em Consultar...');
            
            try {
                // Tentar clique simples primeiro
                await this.page.click('input[value="Consultar"]');
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
                    
                    // Opção 2: Mudança no conteúdo (para casos onde não há navegação)
                    this.page.waitForFunction(
                        () => {
                            const body = document.body.innerText;
                            return body.includes('Situação Cadastral') || 
                                   body.includes('Data de nascimento informada') ||
                                   body.includes('CPF incorreto') ||
                                   body.includes('CPF não encontrado') ||
                                   body.includes('erro') ||
                                   body.includes('Erro');
                        },
                        { timeout: 30000, polling: 1000 }
                    ).then(() => 'content_change'),
                    
                    // Opção 3: Timeout de segurança
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Timeout na resposta')), 45000)
                    )
                ]);
                
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

            //await takeScreenshot(this.page, 'resultado');

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
            return data;

        } catch (error) {
            console.error('Erro durante a consulta:', error);
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
    const consultor = new PlaywrightWebKitCPFConsultor();
    
    try {
        await consultor.launch();
        await consultor.navigateTo('https://servicos.receita.fazenda.gov.br/servicos/cpf/consultasituacao/consultapublica.asp');
        await consultor.injectControlPanel();
        
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