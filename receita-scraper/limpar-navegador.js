#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('🧹 LIMPEZA DO NAVEGADOR WEBKIT');
console.log('==============================');

// Função para deletar diretório recursivamente
function deletarDiretorio(caminho) {
    if (fs.existsSync(caminho)) {
        try {
            fs.rmSync(caminho, { recursive: true, force: true });
            console.log(`✅ Removido: ${caminho}`);
            return true;
        } catch (error) {
            console.log(`❌ Erro ao remover ${caminho}: ${error.message}`);
            return false;
        }
    } else {
        console.log(`ℹ️ Não encontrado: ${caminho}`);
        return true;
    }
}

// Função para limpar cache do Playwright
function limparCachePlaywright() {
    console.log('\n🎭 Limpando cache do Playwright...');
    
    const caminhosPossíveis = [
        path.join(os.homedir(), 'AppData', 'Local', 'ms-playwright'),
        path.join(os.homedir(), '.cache', 'ms-playwright'),
        path.join(os.homedir(), 'Library', 'Caches', 'ms-playwright'),
        path.join(__dirname, '.cache'),
        path.join(__dirname, 'node_modules', '.cache')
    ];
    
    let limpezasRealizadas = 0;
    
    caminhosPossíveis.forEach(caminho => {
        if (fs.existsSync(caminho)) {
            console.log(`🔍 Verificando: ${caminho}`);
            
            // Listar subdiretórios
            try {
                const itens = fs.readdirSync(caminho);
                itens.forEach(item => {
                    const caminhoCompleto = path.join(caminho, item);
                    const stats = fs.statSync(caminhoCompleto);
                    
                    if (stats.isDirectory() && (
                        item.includes('webkit') || 
                        item.includes('chromium') || 
                        item.includes('firefox') ||
                        item.includes('cache') ||
                        item.includes('temp')
                    )) {
                        if (deletarDiretorio(caminhoCompleto)) {
                            limpezasRealizadas++;
                        }
                    }
                });
            } catch (error) {
                console.log(`⚠️ Erro ao acessar ${caminho}: ${error.message}`);
            }
        }
    });
    
    return limpezasRealizadas;
}

// Função para limpar screenshots antigos
function limparScreenshots() {
    console.log('\n📸 Limpando screenshots antigos...');
    
    const screenshotDir = path.join(__dirname, 'screenshots');
    
    if (!fs.existsSync(screenshotDir)) {
        console.log('ℹ️ Diretório de screenshots não encontrado');
        return 0;
    }
    
    let arquivosRemovidos = 0;
    
    try {
        const pastas = fs.readdirSync(screenshotDir);
        
        pastas.forEach(pasta => {
            const caminhoCompleto = path.join(screenshotDir, pasta);
            const stats = fs.statSync(caminhoCompleto);
            
            if (stats.isDirectory() && pasta !== 'ultima_consulta') {
                // Remover pastas antigas (manter apenas ultima_consulta)
                if (deletarDiretorio(caminhoCompleto)) {
                    arquivosRemovidos++;
                }
            }
        });
        
        // Limpar arquivos antigos na pasta ultima_consulta
        const ultimaConsultaDir = path.join(screenshotDir, 'ultima_consulta');
        if (fs.existsSync(ultimaConsultaDir)) {
            const arquivos = fs.readdirSync(ultimaConsultaDir);
            arquivos.forEach(arquivo => {
                if (arquivo.endsWith('.png') || arquivo.endsWith('.json')) {
                    const caminhoArquivo = path.join(ultimaConsultaDir, arquivo);
                    const stats = fs.statSync(caminhoArquivo);
                    
                    // Remover arquivos com mais de 1 hora
                    const umaHoraAtras = Date.now() - (60 * 60 * 1000);
                    if (stats.mtime.getTime() < umaHoraAtras) {
                        try {
                            fs.unlinkSync(caminhoArquivo);
                            console.log(`✅ Removido arquivo antigo: ${arquivo}`);
                            arquivosRemovidos++;
                        } catch (error) {
                            console.log(`❌ Erro ao remover ${arquivo}: ${error.message}`);
                        }
                    }
                }
            });
        }
        
    } catch (error) {
        console.log(`❌ Erro ao limpar screenshots: ${error.message}`);
    }
    
    return arquivosRemovidos;
}

// Função para limpar logs e temporários
function limparTemporarios() {
    console.log('\n🗂️ Limpando arquivos temporários...');
    
    const caminhosTempPossíveis = [
        path.join(os.tmpdir(), 'playwright*'),
        path.join(__dirname, 'logs'),
        path.join(__dirname, 'temp'),
        path.join(__dirname, '.tmp')
    ];
    
    let limpezasRealizadas = 0;
    
    caminhosTempPossíveis.forEach(caminho => {
        if (deletarDiretorio(caminho)) {
            limpezasRealizadas++;
        }
    });
    
    return limpezasRealizadas;
}

// Função principal
async function executarLimpeza() {
    console.log('🚀 Iniciando limpeza completa...\n');
    
    const resultados = {
        cachePlaywright: limparCachePlaywright(),
        screenshots: limparScreenshots(),
        temporarios: limparTemporarios()
    };
    
    console.log('\n📊 RELATÓRIO DE LIMPEZA');
    console.log('=======================');
    console.log(`🎭 Cache Playwright: ${resultados.cachePlaywright} itens removidos`);
    console.log(`📸 Screenshots: ${resultados.screenshots} arquivos removidos`);
    console.log(`🗂️ Temporários: ${resultados.temporarios} diretórios removidos`);
    
    const totalItens = Object.values(resultados).reduce((a, b) => a + b, 0);
    
    if (totalItens > 0) {
        console.log(`\n✅ Limpeza concluída! ${totalItens} itens removidos.`);
        console.log('💡 Recomendação: Reinicie o servidor para aplicar as mudanças.');
    } else {
        console.log('\n✨ Sistema já estava limpo!');
    }
    
    console.log('\n🔄 Para reinstalar navegadores limpos:');
    console.log('   npx playwright install webkit');
}

// Executar se chamado diretamente
if (require.main === module) {
    executarLimpeza().catch(console.error);
}

module.exports = { executarLimpeza };
