#!/usr/bin/env node

/**
 * Script para executar o scraper em modo visual
 * Mostra o navegador durante a execução
 */

const { PlaywrightWebKitCPFConsultor } = require('./scraper.js');

async function main() {
    console.log('🖥️ Executando em MODO VISUAL - você verá o navegador!');
    console.log('💡 Para executar consulta automática: node run-visual.js CPF DATA');
    console.log('💡 Exemplo: node run-visual.js 45083784807 29/03/1995');
    
    const consultor = new PlaywrightWebKitCPFConsultor();
    
    try {
        // Forçar modo visual
        process.env.VISUAL_MODE = 'true';
        
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
            
            // Aguardar um pouco antes de fechar para ver o resultado
            console.log('⏳ Aguardando 10 segundos para visualizar o resultado...');
            await new Promise(resolve => setTimeout(resolve, 10000));
            
            await consultor.close();
            return;
        }
        
        // Modo interativo - manter navegador aberto
        console.log('🎯 Navegador aberto em modo interativo!');
        console.log('📋 Você pode:');
        console.log('   - Preencher manualmente os campos');
        console.log('   - Usar as funções do console do navegador');
        console.log('   - Pressionar Ctrl+C para sair');
        
        // Aguardar indefinidamente até o usuário pressionar Ctrl+C
        await new Promise(() => {});
        
    } catch (error) {
        console.error('❌ Erro:', error);
        await consultor.close();
    }
}

// Capturar Ctrl+C para fechar graciosamente
process.on('SIGINT', async () => {
    console.log('\n👋 Fechando navegador...');
    process.exit(0);
});

if (require.main === module) {
    main().catch(console.error);
}
