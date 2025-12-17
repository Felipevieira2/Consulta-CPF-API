#!/usr/bin/env node

/**
 * Executar scraper NO SERVIDOR (headless) COM SCREENSHOTS
 * Ideal para servidores sem interface gráfica
 */

const { webkit } = require('playwright');
const fs = require('fs');
const path = require('path');

// Função para criar diretório de screenshots
const setupScreenshotDir = () => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const dir = path.join(__dirname, 'screenshots', `servidor_${timestamp}`);
    
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    
    console.log(`📁 Screenshots do servidor serão salvos em: ${dir}`);
    return dir;
};

// Função para capturar screenshots no servidor
const takeServerScreenshot = async (page, name, screenshotDir) => {
    try {
        const timestamp = new Date().toISOString().slice(11, 19).replace(/:/g, '-');
        const filename = `${name}_${timestamp}.png`;
        const filepath = path.join(screenshotDir, filename);
        
        await page.screenshot({
            path: filepath,
            fullPage: true,
            type: 'png'
        });
        
        console.log(`📸 Screenshot servidor salvo: ${filename}`);
        return filepath;
    } catch (error) {
        console.log(`❌ Erro ao capturar screenshot ${name}:`, error.message);
    }
};

async function executarServidorComPrints(cpf, birthDate) {
    console.log('🖥️ Iniciando scraper SERVIDOR COM SCREENSHOTS...');
    console.log(`📋 CPF: ${cpf}, Data: ${birthDate}`);
    
    // Configurar diretório de screenshots
    const screenshotDir = setupScreenshotDir();
    
    const browser = await webkit.launch({
        headless: true, // SERVIDOR - sem interface
        args: [
            '--disable-blink-features=AutomationControlled',
            '--disable-web-security',
            '--no-sandbox',
            '--disable-dev-shm-usage'
        ]
    });
    
    const context = await browser.newContext({
        viewport: { width: 1366, height: 768 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        ignoreHTTPSErrors: true,
        javaScriptEnabled: true
    });
    
    // Remover sinais de automação
    await context.addInitScript(() => {
        Object.defineProperty(navigator, 'webdriver', {
            get: () => undefined,
        });
        delete navigator.__proto__.webdriver;
    });
    
    const page = await context.newPage();
    
    try {
        // SCREENSHOT 1: Início
        await takeServerScreenshot(page, '01_inicio_servidor', screenshotDir);
        
        console.log('🌐 Acessando site da Receita Federal...');
        console.log('⏳ Aguardando para evitar rate limiting...');
        await page.waitForTimeout(5000);
        
        await page.goto('https://servicos.receita.fazenda.gov.br/servicos/cpf/consultasituacao/consultapublica.asp', {
            waitUntil: 'networkidle',
            timeout: 45000
        });
        
        console.log('✅ Site carregado no servidor!');
        
        // SCREENSHOT 2: Site carregado
        await takeServerScreenshot(page, '02_site_carregado', screenshotDir);
        
        console.log('🔍 Procurando campos do formulário...');
        
        // Aguardar campos
        await page.waitForSelector('#txtCPF', { timeout: 15000 });
        await page.waitForSelector('#txtDataNascimento', { timeout: 10000 });
        
        console.log('✅ Campos encontrados no servidor!');
        
        // SCREENSHOT 3: Campos encontrados
        await takeServerScreenshot(page, '03_campos_encontrados', screenshotDir);
        
        console.log(`📋 Preenchendo formulário no servidor...`);
        console.log(`   CPF: ${cpf}`);
        console.log(`   Data: ${birthDate}`);
        
        // Preenchimento
        await page.waitForTimeout(1000);
        await page.focus('#txtCPF');
        await page.fill('#txtCPF', cpf);
        
        // SCREENSHOT 4: CPF preenchido
        await takeServerScreenshot(page, '04_cpf_preenchido', screenshotDir);
        
        await page.waitForTimeout(1000);
        await page.focus('#txtDataNascimento');
        await page.fill('#txtDataNascimento', birthDate);
        
        // SCREENSHOT 5: Formulário completo
        await takeServerScreenshot(page, '05_formulario_completo', screenshotDir);
        
        // Verificar preenchimento
        const valores = await page.evaluate(() => {
            return {
                cpf: document.querySelector('#txtCPF')?.value || '',
                data: document.querySelector('#txtDataNascimento')?.value || ''
            };
        });
        
        console.log('✅ Formulário preenchido no servidor:', valores);
        
        // Aguardar captcha
        console.log('🔐 Aguardando captcha carregar no servidor...');
        await page.waitForTimeout(3000);
        
        // SCREENSHOT 6: Com captcha
        await takeServerScreenshot(page, '06_com_captcha', screenshotDir);
        
        // Verificar captcha
        try {
            await page.waitForSelector('iframe[src*="hcaptcha"]', { timeout: 10000 });
            console.log('🔐 Captcha detectado no servidor!');
            
            // SCREENSHOT 7: Captcha detectado
            await takeServerScreenshot(page, '07_captcha_detectado', screenshotDir);
            
            console.log('⚠️ ATENÇÃO: Captcha detectado - execução automática limitada');
            console.log('💡 Para resolver captcha, use a versão visual: node executar-com-prints.js');
            
        } catch {
            console.log('ℹ️ Captcha não detectado - tentando continuar...');
            
            // Tentar clicar em consultar se não há captcha
            try {
                await page.waitForSelector('input[value="Consultar"]', { timeout: 5000 });
                await page.click('input[value="Consultar"]');
                
                console.log('🖱️ Clicou em Consultar no servidor');
                
                // SCREENSHOT 8: Após clicar consultar
                await takeServerScreenshot(page, '08_apos_consultar', screenshotDir);
                
                // Aguardar resultado
                await page.waitForTimeout(5000);
                
                // SCREENSHOT 9: Resultado
                await takeServerScreenshot(page, '09_resultado', screenshotDir);
                
                // Extrair resultado
                const resultado = await page.evaluate(() => {
                    const body = document.body.innerText;
                    return {
                        temResultado: body.includes('Situação Cadastral') || body.includes('Nome:'),
                        temErro: body.includes('CPF incorreto') || body.includes('Data de nascimento informada'),
                        conteudo: body
                    };
                });
                
                console.log('📊 Resultado da consulta:', resultado.temResultado ? 'SUCESSO' : 'ERRO');
                
                if (resultado.temResultado) {
                    console.log('✅ Consulta realizada com sucesso no servidor!');
                } else if (resultado.temErro) {
                    console.log('❌ Erro na consulta - verifique CPF e data');
                }
                
            } catch (consultarError) {
                console.log('❌ Erro ao tentar consultar:', consultarError.message);
            }
        }
        
        // SCREENSHOT FINAL
        await takeServerScreenshot(page, '10_final', screenshotDir);
        
        console.log('');
        console.log('✅ EXECUÇÃO NO SERVIDOR CONCLUÍDA!');
        console.log(`📸 Screenshots salvos em: ${screenshotDir}`);
        console.log('💡 Para ver os screenshots, acesse a pasta screenshots/');
        console.log('');
        
        await browser.close();
        
        return {
            sucesso: true,
            screenshotDir: screenshotDir,
            valores: valores
        };
        
    } catch (error) {
        console.error('❌ Erro durante execução no servidor:', error.message);
        
        // SCREENSHOT de erro
        await takeServerScreenshot(page, '99_erro_servidor', screenshotDir);
        
        await browser.close();
        
        return {
            sucesso: false,
            erro: error.message,
            screenshotDir: screenshotDir
        };
    }
}

// Função para uso como módulo
async function consultarCPFComPrints(cpf, birthDate) {
    return await executarServidorComPrints(cpf, birthDate);
}

// Executar se chamado diretamente
if (require.main === module) {
    const args = process.argv.slice(2);
    const cpf = args[0] || '45083784807';
    const birthDate = args[1] || '29/03/1995';
    
    executarServidorComPrints(cpf, birthDate).catch(console.error);
}

// Exportar para uso como módulo
module.exports = {
    consultarCPFComPrints,
    executarServidorComPrints
};
