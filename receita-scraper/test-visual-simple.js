#!/usr/bin/env node

/**
 * Teste simples do scraper em modo visual
 * Versão simplificada para debug
 */

const { webkit } = require('playwright');

async function testVisual() {
    console.log('🚀 Iniciando teste visual simples...');
    
    // Configuração para modo visual
    const browser = await webkit.launch({
        headless: false, // VISUAL - mostra navegador
        slowMo: 500 // Mais lento para visualizar
    });
    
    const context = await browser.newContext({
        viewport: { width: 1366, height: 768 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        ignoreHTTPSErrors: true
    });
    
    const page = await context.newPage();
    
    try {
        console.log('🌐 Navegando para site da Receita Federal...');
        
        // Aguardar um pouco antes de acessar para evitar rate limiting
        console.log('⏳ Aguardando 3 segundos para evitar bloqueios...');
        await page.waitForTimeout(3000);
        
        await page.goto('https://servicos.receita.fazenda.gov.br/servicos/cpf/consultasituacao/consultapublica.asp', {
            waitUntil: 'domcontentloaded',
            timeout: 30000
        });
        
        console.log('⏳ Aguardando campos do formulário...');
        await page.waitForSelector('#txtCPF', { timeout: 10000 });
        await page.waitForSelector('#txtDataNascimento', { timeout: 5000 });
        
        // Pegar CPF e data dos argumentos ou usar padrão
        const args = process.argv.slice(2);
        const cpf = args[0] || '45083784807';
        const birthDate = args[1] || '29/03/1995';
        
        console.log(`📋 Preenchendo CPF: ${cpf}`);
        await page.focus('#txtCPF');
        await page.fill('#txtCPF', cpf);
        
        console.log(`📅 Preenchendo data: ${birthDate}`);
        await page.focus('#txtDataNascimento');
        await page.fill('#txtDataNascimento', birthDate);
        
        // Verificar se foi preenchido
        const valores = await page.evaluate(() => {
            return {
                cpf: document.querySelector('#txtCPF')?.value || '',
                data: document.querySelector('#txtDataNascimento')?.value || ''
            };
        });
        
        console.log('✅ Valores preenchidos:', valores);
        
        console.log('🎯 Navegador aberto! Você pode:');
        console.log('   - Ver os campos preenchidos');
        console.log('   - Resolver o captcha manualmente');
        console.log('   - Clicar em Consultar');
        console.log('   - Pressionar Ctrl+C para sair');
        
        // Aguardar indefinidamente até Ctrl+C
        await new Promise(() => {});
        
    } catch (error) {
        console.error('❌ Erro:', error.message);
    } finally {
        // Não fechar automaticamente para permitir visualização
        console.log('👋 Para fechar, pressione Ctrl+C');
    }
}

// Capturar Ctrl+C para fechar graciosamente
process.on('SIGINT', async () => {
    console.log('\n👋 Fechando navegador...');
    process.exit(0);
});

// Executar
testVisual().catch(console.error);
