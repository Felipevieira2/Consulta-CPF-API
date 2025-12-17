#!/usr/bin/env node

const { PlaywrightWebKitCPFConsultor } = require('./scraper');
const fs = require('fs');
const path = require('path');

async function limpezaRapida() {
    console.log('⚡ LIMPEZA RÁPIDA DO NAVEGADOR');
    console.log('=============================\n');
    
    // 1. Limpar através do navegador
    console.log('🎭 Iniciando navegador para limpeza...');
    const consultor = new PlaywrightWebKitCPFConsultor();
    
    try {
        await consultor.launch();
        await consultor.limparCache();
        await consultor.close();
        console.log('✅ Limpeza via navegador concluída\n');
    } catch (error) {
        console.log('⚠️ Erro na limpeza via navegador:', error.message);
    }
    
    // 2. Limpar screenshots antigos
    console.log('📸 Limpando screenshots antigos...');
    const screenshotDir = path.join(__dirname, 'screenshots', 'ultima_consulta');
    
    if (fs.existsSync(screenshotDir)) {
        const arquivos = fs.readdirSync(screenshotDir);
        let removidos = 0;
        
        arquivos.forEach(arquivo => {
            if (arquivo.endsWith('.png')) {
                try {
                    fs.unlinkSync(path.join(screenshotDir, arquivo));
                    removidos++;
                } catch (error) {
                    console.log(`⚠️ Erro ao remover ${arquivo}`);
                }
            }
        });
        
        console.log(`✅ ${removidos} screenshots removidos\n`);
    }
    
    // 3. Reinstalar WebKit limpo
    console.log('🔄 Reinstalando WebKit...');
    const { exec } = require('child_process');
    
    return new Promise((resolve) => {
        exec('npx playwright install webkit', (error, stdout, stderr) => {
            if (error) {
                console.log('⚠️ Erro ao reinstalar WebKit:', error.message);
            } else {
                console.log('✅ WebKit reinstalado com sucesso');
            }
            
            console.log('\n🎉 LIMPEZA RÁPIDA CONCLUÍDA!');
            console.log('💡 Recomendação: Reinicie o servidor agora.');
            resolve();
        });
    });
}

// Executar se chamado diretamente
if (require.main === module) {
    limpezaRapida().catch(console.error);
}

module.exports = { limpezaRapida };
