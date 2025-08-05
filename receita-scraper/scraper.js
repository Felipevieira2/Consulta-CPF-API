const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Função para criar diretório de screenshots
const setupScreenshotDir = () => {
    const dir = path.join(__dirname, 'screenshots');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {
            recursive: true
        });
    }
    return dir;
};

// Função para capturar screenshots
const takeScreenshot = async (page, name) => {
    const dir = setupScreenshotDir();
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const filename = `${name}_${timestamp}.png`;
    const filepath = path.join(dir, filename);
    await page.screenshot({
        path: filepath
    });
    console.log(`Screenshot salvo: ${filepath}`);
};

// Função principal para consultar CPF
async function consultarCPF(cpf, birthDate) {
    console.log(`Iniciando consulta para CPF: ${cpf}`);

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

    const browser = await puppeteer.launch({
        headless: 'new',
        args: [
            '--no-sandbox',
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--disable-setuid-sandbox',
            '--window-size=1920,1080',
            '--disable-features=VizDisplayCompositor',
            '--disable-web-security',
            '--disable-extensions',
            '--disable-audio-output',
            '--disable-background-networking',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-breakpad',
            '--disable-component-extensions-with-background-pages',
            '--disable-default-apps',
            '--disable-ipc-flooding-protection',
            '--js-flags=--expose-gc'
        ]
    });

    try {
        const page = await browser.newPage();

        // Configurar viewport e user agent
        await page.setViewport({
            width: 1920,
            height: 1080
        });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

        // Configurar timeouts
        await page.setDefaultNavigationTimeout(60000);
        await page.setDefaultTimeout(30000);

        // Otimização 2: Reduzir recursos carregados
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            const resourceType = request.resourceType();
            // Bloquear recursos desnecessários
            if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
                request.abort();
            } else {
                request.continue();
            }
        });

        console.log('Acessando site da Receita Federal...');
        await page.goto('https://servicos.receita.fazenda.gov.br/servicos/cpf/consultasituacao/consultapublica.asp', {
            waitUntil: 'networkidle2'
        });

        // Aguardar carregamento do formulário
        await page.waitForSelector('#txtCPF');
        // await takeScreenshot(page, 'inicial');

        // Otimização 3: Usar métodos mais eficientes para interação
        console.log('Preenchendo CPF...');
        await page.evaluate((cpfValue) => {
            document.querySelector('#txtCPF').value = cpfValue;
        }, cpf);

        console.log('Preenchendo data de nascimento...');
        await page.evaluate((dateValue) => {
            document.querySelector('#txtDataNascimento').value = dateValue;
        }, birthDate);
        // await takeScreenshot(page, 'apos_preenchimento');

        // Aguardar carregamento do captcha
        console.log('Aguardando carregamento do captcha...');
        await page.waitForSelector('iframe[title="Widget contendo caixa de seleção para desafio de segurança hCaptcha"]');
        // await takeScreenshot(page, 'antes_captcha');

        // Abordagem alternativa para o captcha
        console.log('Tentando abordagem alternativa para o captcha...');
        try {
            // Esperar pelo iframe do hCaptcha
            await page.waitForSelector('iframe[src*="hcaptcha.com"]', {
                timeout: 30000
            });
            console.log('Frame do hCaptcha encontrado');

            // Obter todos os iframes
            const iframes = await page.$$('iframe');
            console.log(`Total de iframes na página: ${iframes.length}`);

            // Encontrar o iframe do hCaptcha
            let hcaptchaIframeHandle;
            for (const iframe of iframes) {
                const src = await iframe.evaluate(el => el.src);
                console.log(`Iframe src: ${src}`);
                if (src.includes('hcaptcha.com')) {
                    hcaptchaIframeHandle = iframe;
                    break;
                }
            }

            if (hcaptchaIframeHandle) {
                console.log('Iframe do hCaptcha encontrado, tentando interagir...');
                
                // Obter o frame a partir do handle - mais eficiente
                const frameHandle = await hcaptchaIframeHandle.contentFrame();
                
                if (frameHandle) {
                    try {  

                        await page.waitForTimeout(300);
                        // Usar evaluate para interação direta com o DOM - mais rápido
                        await frameHandle.evaluate(() => {
                            const checkbox = document.querySelector('#checkbox');
                            if (checkbox) checkbox.click();
                        });
                      
                        await page.waitForTimeout(300);
                        // Verificação mais eficiente do estado do checkbox
                        const checkboxChecked = await frameHandle.waitForFunction(
                            () => {
                                const checkbox = document.querySelector('#checkbox');
                                return checkbox && (checkbox.getAttribute('aria-checked') === 'true' || checkbox.checked === true);
                            },
                            { timeout: 3000, polling: 100 } // Polling mais frequente, timeout menor
                        ).catch(() => false);
                        
                        if (checkboxChecked) {
                            console.log('Checkbox marcado com sucesso');
                        }
                    } catch (e) {
                        console.log('Falha na interação com checkbox:', e.message);
                    }
                }
            } else {
                console.log('Não foi possível encontrar o iframe do hCaptcha');
            }

            // Aguardar tempo para possível resolução manual
            console.log('Aguardando possível resolução manual do captcha...');
   
            // await takeScreenshot(page, 'apos_tentativa_captcha');
            // await page.waitForTimeout(1000); // Ajuste o valor conforme necessário
        } catch (error) {
            console.error('Erro na abordagem alternativa para o captcha:', error);
            // await takeScreenshot(page, 'erro_abordagem_alternativa');
        }

        // waiting 'input[value="Consultar"]'
        await page.waitForSelector('input[value="Consultar"]', {
            timeout: 30000
        });

        // Clicar no botão Consultar
        console.log('Clicando em Consultar...');
        await Promise.all([
            page.click('input[value="Consultar"]'),
            page.waitForNavigation({
                waitUntil: 'networkidle2'
            }).catch(() => {})
        ]);

        // Verificar se há alertas
        try {
            await page.waitForTimeout(1000);
            const alertMessage = await page.evaluate(() => {
                return window.alert ? window.alert.toString() : null;
            });

            if (alertMessage) {
                console.log(`Alerta detectado: ${alertMessage}`);
            }
        } catch (e) {
            console.log('Nenhum alerta detectado');
        }

        // await takeScreenshot(page, 'resultado');

        console.log('Verificando se há mensagem de erro sobre data de nascimento divergente...');
        // Verificar se há mensagem de erro sobre data de nascimento divergente
        const temErroDivergencia = await page.evaluate(() => {
            const conteudo = document.body.innerText;
            return conteudo.includes('Data de nascimento informada') &&
                conteudo.includes('está divergente') &&
                conteudo.includes('Retorne a página anterior');
        });

        if (temErroDivergencia) {
            console.log('Erro detectado: Data de nascimento divergente');
            // Capturar a mensagem de erro completa
            return {
              error: true,
              message: 'Data de nascimento informada está divergente da constante na base de dados.',
              type: 'data_divergente'
            };
        }

        const temErroDivergenciaCpf = await page.evaluate(() => {
            const conteudo = document.body.innerText;
            return conteudo.includes('CPF incorreto');
        });

        if (temErroDivergenciaCpf) {
            console.log('Erro detectado: CPF está com divergente');

            // Capturar a mensagem de erro completa
                return {
                    error: true,
                    message: 'CPF informado está incorreto',
                    type: 'cpf_incorreto'
                };
        }

        //cpf nao existe 
        const cpfNaoExiste = await page.evaluate(() => {    
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

        // Otimização 5: Processamento paralelo para extração de dados
        const data = await page.evaluate(() => {
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
    } finally {
        await browser.close();
    }
}

module.exports = {
    consultarCPF
};
