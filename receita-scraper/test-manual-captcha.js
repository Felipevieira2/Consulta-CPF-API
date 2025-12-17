const { PlaywrightWebKitCPFConsultor } = require('./scraper');

async function testeManualCaptcha() {
    console.log('🎯 Teste Manual do Captcha - Modo Visual');
    console.log('Você poderá resolver o captcha manualmente!');
    
    const consultor = new PlaywrightWebKitCPFConsultor();
    
    try {
        // Forçar modo visual
        process.env.VISUAL_MODE = 'true';
        
        await consultor.launch();
        await consultor.navigateTo('https://servicos.receita.fazenda.gov.br/servicos/cpf/consultasituacao/consultapublica.asp');
        
        console.log('\n🖥️ NAVEGADOR ABERTO!');
        console.log('📋 INSTRUÇÕES:');
        console.log('1. O CPF e data já foram preenchidos automaticamente');
        console.log('2. RESOLVA O CAPTCHA manualmente (clique na caixinha)');
        console.log('3. CLIQUE em "Consultar" quando o captcha estiver resolvido');
        console.log('4. Aguarde o resultado aparecer');
        console.log('5. Pressione CTRL+C aqui no terminal para fechar\n');
        
        // Executar a consulta (vai parar no captcha para resolução manual)
        const resultado = await consultor.consultarCPF('45083784807', '29/03/1995');
        
        console.log('\n✅ RESULTADO DA CONSULTA:');
        console.log(JSON.stringify(resultado, null, 2));
        
        console.log('\n🎉 Consulta finalizada! Pressione CTRL+C para sair.');
        
        // Manter aberto para visualização
        await new Promise(() => {});
        
    } catch (error) {
        console.error('❌ Erro:', error.message);
    } finally {
        await consultor.close();
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    testeManualCaptcha().catch(console.error);
}

module.exports = { testeManualCaptcha };
