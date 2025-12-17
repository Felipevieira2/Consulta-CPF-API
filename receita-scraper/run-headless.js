#!/usr/bin/env node

/**
 * Script para executar o scraper em modo headless (oculto)
 * Navegador não será exibido - mais rápido
 */

const { PlaywrightWebKitCPFConsultor } = require('./scraper.js');

async function main() {
    console.log('👻 Executando em MODO HEADLESS - navegador oculto');
    console.log('💡 Para executar consulta automática: node run-headless.js CPF DATA');
    console.log('💡 Exemplo: node run-headless.js 45083784807 29/03/1995');
    
    const consultor = new PlaywrightWebKitCPFConsultor();
    
    try {
        // Forçar modo headless
        process.env.VISUAL_MODE = 'false';
        
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
        
        console.log('❌ Para modo headless, forneça CPF e data como parâmetros');
        console.log('💡 Exemplo: node run-headless.js 45083784807 29/03/1995');
        
        await consultor.close();
        
    } catch (error) {
        console.error('❌ Erro:', error);
        await consultor.close();
    }
}

if (require.main === module) {
    main().catch(console.error);
}
