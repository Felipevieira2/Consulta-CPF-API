#!/usr/bin/env node

const readline = require('readline');
const { PlaywrightWebKitCPFConsultor } = require('./scraper');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function pergunta(texto) {
    return new Promise((resolve) => {
        rl.question(texto, resolve);
    });
}

async function menuPrincipal() {
    console.clear();
    console.log('🎯 TESTE COMPLETO - Scraper CPF Receita Federal');
    console.log('================================================');
    console.log('');
    console.log('Escolha uma opção:');
    console.log('');
    console.log('1. 🖥️  Teste Visual (você resolve o captcha)');
    console.log('2. 👻 Teste Headless (automático, pode falhar no captcha)');
    console.log('3. 🔧 Teste com CPF personalizado');
    console.log('4. 📊 Ver última consulta salva');
    console.log('5. 🌐 Testar servidor API');
    console.log('0. ❌ Sair');
    console.log('');
    
    const opcao = await pergunta('Digite sua opção: ');
    
    switch (opcao) {
        case '1':
            await testeVisual();
            break;
        case '2':
            await testeHeadless();
            break;
        case '3':
            await testePersonalizado();
            break;
        case '4':
            await verUltimaConsulta();
            break;
        case '5':
            await testarAPI();
            break;
        case '0':
            console.log('👋 Até logo!');
            rl.close();
            return;
        default:
            console.log('❌ Opção inválida!');
            await pergunta('Pressione Enter para continuar...');
            await menuPrincipal();
    }
}

async function testeVisual() {
    console.clear();
    console.log('🖥️ TESTE VISUAL - Captcha Manual');
    console.log('=================================');
    
    const cpf = await pergunta('CPF (ou Enter para usar 45083784807): ') || '45083784807';
    const data = await pergunta('Data nascimento (ou Enter para usar 29/03/1995): ') || '29/03/1995';
    
    console.log('\n🚀 Iniciando teste visual...');
    console.log('📋 INSTRUÇÕES:');
    console.log('1. O navegador abrirá automaticamente');
    console.log('2. Campos serão preenchidos automaticamente');
    console.log('3. RESOLVA O CAPTCHA manualmente');
    console.log('4. O sistema continuará automaticamente após resolver');
    console.log('5. Pressione Ctrl+C para cancelar a qualquer momento\n');
    
    await pergunta('Pressione Enter para continuar...');
    
    const consultor = new PlaywrightWebKitCPFConsultor();
    
    try {
        process.env.VISUAL_MODE = 'true';
        await consultor.launch();
        await consultor.navigateTo('https://servicos.receita.fazenda.gov.br/servicos/cpf/consultasituacao/consultapublica.asp');
        
        const resultado = await consultor.consultarCPF(cpf, data);
        
        console.log('\n✅ RESULTADO:');
        console.log(JSON.stringify(resultado, null, 2));
        
    } catch (error) {
        console.log('\n❌ Erro:', error.message);
    } finally {
        await consultor.close();
    }
    
    await pergunta('\nPressione Enter para voltar ao menu...');
    await menuPrincipal();
}

async function testeHeadless() {
    console.clear();
    console.log('👻 TESTE HEADLESS - Automático');
    console.log('===============================');
    
    const cpf = await pergunta('CPF (ou Enter para usar 45083784807): ') || '45083784807';
    const data = await pergunta('Data nascimento (ou Enter para usar 29/03/1995): ') || '29/03/1995';
    
    console.log('\n⚠️ AVISO: Em modo headless, o captcha pode não ser resolvido automaticamente.');
    console.log('O teste pode falhar na etapa do captcha, mas você verá todo o processo nos logs.\n');
    
    await pergunta('Pressione Enter para continuar...');
    
    const consultor = new PlaywrightWebKitCPFConsultor();
    
    try {
        delete process.env.VISUAL_MODE;
        await consultor.launch();
        await consultor.navigateTo('https://servicos.receita.fazenda.gov.br/servicos/cpf/consultasituacao/consultapublica.asp');
        
        const resultado = await consultor.consultarCPF(cpf, data);
        
        console.log('\n✅ RESULTADO:');
        console.log(JSON.stringify(resultado, null, 2));
        
    } catch (error) {
        console.log('\n❌ Erro:', error.message);
    } finally {
        await consultor.close();
    }
    
    await pergunta('\nPressione Enter para voltar ao menu...');
    await menuPrincipal();
}

async function testePersonalizado() {
    console.clear();
    console.log('🔧 TESTE PERSONALIZADO');
    console.log('======================');
    
    const cpf = await pergunta('Digite o CPF: ');
    const data = await pergunta('Digite a data de nascimento (dd/mm/aaaa): ');
    const modo = await pergunta('Modo visual? (s/n): ');
    
    const consultor = new PlaywrightWebKitCPFConsultor();
    
    try {
        if (modo.toLowerCase() === 's') {
            process.env.VISUAL_MODE = 'true';
            console.log('\n🖥️ Modo visual ativado');
        } else {
            delete process.env.VISUAL_MODE;
            console.log('\n👻 Modo headless ativado');
        }
        
        await consultor.launch();
        await consultor.navigateTo('https://servicos.receita.fazenda.gov.br/servicos/cpf/consultasituacao/consultapublica.asp');
        
        const resultado = await consultor.consultarCPF(cpf, data);
        
        console.log('\n✅ RESULTADO:');
        console.log(JSON.stringify(resultado, null, 2));
        
    } catch (error) {
        console.log('\n❌ Erro:', error.message);
    } finally {
        await consultor.close();
    }
    
    await pergunta('\nPressione Enter para voltar ao menu...');
    await menuPrincipal();
}

async function verUltimaConsulta() {
    console.clear();
    console.log('📊 ÚLTIMA CONSULTA SALVA');
    console.log('========================');
    
    const fs = require('fs');
    const path = require('path');
    
    try {
        const resultadoPath = path.join(__dirname, 'screenshots', 'ultima_consulta', 'resultado.json');
        
        if (fs.existsSync(resultadoPath)) {
            const dados = JSON.parse(fs.readFileSync(resultadoPath, 'utf8'));
            console.log('\n📄 Dados da última consulta:');
            console.log(JSON.stringify(dados, null, 2));
            
            console.log('\n📸 Screenshots disponíveis:');
            const screenshotDir = path.join(__dirname, 'screenshots', 'ultima_consulta');
            const arquivos = fs.readdirSync(screenshotDir).filter(f => f.endsWith('.png'));
            arquivos.forEach(arquivo => {
                console.log(`   - ${arquivo}`);
            });
            
        } else {
            console.log('\n❌ Nenhuma consulta anterior encontrada.');
            console.log('Execute um teste primeiro para gerar dados.');
        }
        
    } catch (error) {
        console.log('\n❌ Erro ao ler dados:', error.message);
    }
    
    await pergunta('\nPressione Enter para voltar ao menu...');
    await menuPrincipal();
}

async function testarAPI() {
    console.clear();
    console.log('🌐 TESTE DO SERVIDOR API');
    console.log('========================');
    
    console.log('Para testar a API:');
    console.log('');
    console.log('1. Abra outro terminal');
    console.log('2. Execute: cd receita-scraper && node server.js');
    console.log('3. Acesse: http://localhost:3000/health');
    console.log('4. Para consultar via API:');
    console.log('');
    console.log('curl -X POST http://localhost:3000/consultar-cpf \\');
    console.log('  -H "Content-Type: application/json" \\');
    console.log('  -d \'{"cpf":"45083784807","birthDate":"29/03/1995"}\'');
    console.log('');
    console.log('5. Ver resultado: http://localhost:3000/ultima-consulta');
    
    await pergunta('\nPressione Enter para voltar ao menu...');
    await menuPrincipal();
}

// Iniciar aplicação
if (require.main === module) {
    console.log('🎯 Iniciando sistema de testes...\n');
    menuPrincipal().catch(console.error);
}

module.exports = { menuPrincipal };
