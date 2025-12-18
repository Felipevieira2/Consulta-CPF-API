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
        
        // Cria contexto com configurações otimizadas
        this.context = await this.browser.newContext({
            viewport: { width: 1440 + Math.floor(Math.random() * 200), height: 900 + Math.floor(Math.random() * 200) },            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15',            ignoreHTTPSErrors: true,
            javaScriptEnabled: true,
            acceptDownloads: false,
            locale: 'pt-BR',
            timezoneId: 'America/Sao_Paulo'
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

    async consultarCPF(cpf, birthDate) {
        console.log(`🔍 Iniciando consulta para CPF: ${cpf}`);
    
        if (!cpf || !birthDate) {
            return { erro: true, mensagem: !cpf ? 'CPF não informado' : 'Data de nascimento não informada' };
        }
    
        cpf = cpf.replace(/[^0-9]/g, '');
    
        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
            if (/^\d{8}$/.test(birthDate)) {
                birthDate = `${birthDate.substr(0,2)}/${birthDate.substr(2,2)}/${birthDate.substr(4,4)}`;
            } else {
                return { erro: true, mensagem: 'Formato de data inválido. Use dd/mm/aaaa' };
            }
        }
    
        try {
            await this.page.goto('https://servicos.receita.fazenda.gov.br/servicos/cpf/consultasituacao/consultapublica.asp', { waitUntil: 'domcontentloaded' });
    
            // Stealth extra: esconder mais traços de automação
            await this.page.addInitScript(() => {
                // Já tinha webdriver, adicionar mais
                Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] }); // fake plugins
                Object.defineProperty(navigator, 'languages', { get: () => ['pt-BR', 'pt', 'en-US', 'en'] });
                window.chrome = { runtime: {}, app: {}, webstore: {} }; // fake chrome obj (alguns sites checam)
                delete navigator.__proto__.webdriver;
            });
    
            await this.page.waitForSelector('#txtCPF', { timeout: 30000 });
            await takeScreenshot(this.page, '01_pagina_inicial');
    
            // Preenchimento mais humano: focus + type (digitação simulada)
            await this.page.click('#txtCPF');
            await this.page.type('#txtCPF', cpf, { delay: Math.random() * 100 + 50 }); // delay randômico ~50-150ms por tecla
    
            await this.page.click('#txtDataNascimento');
            await this.page.type('#txtDataNascimento', birthDate, { delay: Math.random() * 100 + 50 });
    
            // Scroll leve para simular usuário real
            await this.page.evaluate(() => window.scrollBy(0, 200));
    
            await this.page.waitForTimeout(Math.random() * 1000 + 500); // delay humano
    
            await takeScreenshot(this.page, '02_preenchido');
    
            // Clique no botão Consultar (mais natural com hover primeiro)
            await this.page.hover('input[value="Consultar"]');
            await this.page.click('input[value="Consultar"]');
    
            // Aguardar resultado (mais robusto)
            await Promise.race([
                this.page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }),
                this.page.waitForSelector('.clConteudoDados', { timeout: 30000 })
            ]);
    
            await takeScreenshot(this.page, '03_resultado');
    
            // Tratamento de erros (mantido, mas simplificado)
            const erroDivergenciaData = await this.page.evaluate(() => document.body.innerText.includes('Data de nascimento informada está divergente'));
            if (erroDivergenciaData) return { erro: true, mensagem: 'Data de nascimento divergente', type: 'data_divergente' };
    
            const erroCpfIncorreto = await this.page.evaluate(() => document.body.innerText.includes('CPF incorreto'));
            if (erroCpfIncorreto) return { erro: true, mensagem: 'CPF incorreto', type: 'cpf_incorreto' };
    
            const cpfNaoExiste = await this.page.evaluate(() => document.body.innerText.includes('CPF não encontrado'));
            if (cpfNaoExiste) return { erro: true, mensagem: 'CPF não encontrado', type: 'cpf_nao_encontrado' };
    
            // Extração de dados (mantida)
            const data = await this.page.evaluate(() => {
                const extract = (pattern) => {
                    const match = document.body.innerHTML.match(pattern);
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
    
            await takeScreenshot(this.page, '04_sucesso');
            return data;
    
        } catch (error) {
            console.error('Erro na consulta:', error.message);
            await takeScreenshot(this.page, '99_erro');
            return { erro: true, mensagem: `Erro inesperado: ${error.message}` };
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