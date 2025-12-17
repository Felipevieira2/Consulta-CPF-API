const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

// Usar sempre Chromium para servidor
const { consultarCPF } = require('./scraper-servidor');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta screenshots
app.use('/screenshots', express.static(path.join(__dirname, 'screenshots')));

// Rota para verificar se o servidor está online
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    engine: 'chromium',
    timestamp: new Date().toISOString()
  });
});

// Rota para consulta de CPF
app.post('/consultar-cpf', async (req, res) => {
  try {
    const { cpf, birthDate } = req.body;
    
    if (!cpf || !birthDate) {
      return res.status(400).json({
        erro: true,
        mensagem: 'CPF e data de nascimento são obrigatórios'
      });
    }
    
    console.log(`Recebida requisição para consultar CPF: ${cpf}`);
    const resultado = await consultarCPF(cpf, birthDate);
    
    return res.json(resultado);
  } catch (error) {
    console.error('Erro na API:', error);
    return res.status(500).json({
      erro: true,
      mensagem: `Erro interno do servidor: ${error.message}`
    });
  }
});

// Rota para consulta de CPF COM SCREENSHOTS
app.post('/consultar-cpf-com-prints', async (req, res) => {
  try {
    const { cpf, birthDate } = req.body;
    
    if (!cpf || !birthDate) {
      return res.status(400).json({
        erro: true,
        mensagem: 'CPF e data de nascimento são obrigatórios'
      });
    }
    
    console.log(`📸 Recebida requisição para consultar CPF COM SCREENSHOTS: ${cpf}`);
    const resultado = await consultarCPF(cpf, birthDate);
    
    // Listar screenshots gerados
    let screenshots = [];
    const screenshotDir = path.join(__dirname, 'screenshots', 'ultima_consulta');
    
    if (fs.existsSync(screenshotDir)) {
      const files = fs.readdirSync(screenshotDir);
      screenshots = files
        .filter(file => file.endsWith('.png'))
        .map(file => ({
          nome: file,
          url: `/screenshots/ultima_consulta/${file}`,
          caminho: path.join(screenshotDir, file)
        }));
    }
    
    return res.json({
      resultado: resultado,
      sucesso: !resultado.erro,
      screenshots: screenshots,
      totalScreenshots: screenshots.length,
      screenshotDir: screenshotDir
    });
    
  } catch (error) {
    console.error('❌ Erro na API com screenshots:', error);
    return res.status(500).json({
      erro: true,
      mensagem: `Erro interno do servidor: ${error.message}`
    });
  }
});

// Rota para listar todas as pastas de screenshots
app.get('/screenshots-list', (req, res) => {
  try {
    const screenshotsDir = path.join(__dirname, 'screenshots');
    
    if (!fs.existsSync(screenshotsDir)) {
      return res.json({ pastas: [], total: 0 });
    }
    
    const pastas = fs.readdirSync(screenshotsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => {
        const pastaPath = path.join(screenshotsDir, dirent.name);
        const arquivos = fs.readdirSync(pastaPath).filter(file => file.endsWith('.png'));
        
        return {
          nome: dirent.name,
          url: `/screenshots/${dirent.name}/`,
          totalArquivos: arquivos.length,
          arquivos: arquivos.map(arquivo => ({
            nome: arquivo,
            url: `/screenshots/${dirent.name}/${arquivo}`
          }))
        };
      })
      .sort((a, b) => b.nome.localeCompare(a.nome)); // Mais recentes primeiro
    
    return res.json({
      pastas: pastas,
      total: pastas.length
    });
    
  } catch (error) {
    console.error('❌ Erro ao listar screenshots:', error);
    return res.status(500).json({
      erro: true,
      mensagem: `Erro ao listar screenshots: ${error.message}`
    });
  }
});

// Rota HTML para exibir resultado da última consulta
app.get('/ultima-consulta', (req, res) => {
  try {
    const resultadoPath = path.join(__dirname, 'screenshots', 'ultima_consulta', 'resultado.json');
    const screenshotsDir = path.join(__dirname, 'screenshots', 'ultima_consulta');
    
    let resultado = null;
    let screenshots = [];
    
    // Ler resultado se existir
    if (fs.existsSync(resultadoPath)) {
      const data = fs.readFileSync(resultadoPath, 'utf8');
      resultado = JSON.parse(data);
    }
    
    // Listar screenshots se existir
    if (fs.existsSync(screenshotsDir)) {
      const files = fs.readdirSync(screenshotsDir);
      screenshots = files
        .filter(file => file.endsWith('.png'))
        .sort()
        .map(file => ({
          nome: file,
          url: `/screenshots/ultima_consulta/${file}`,
          titulo: getTituloScreenshot(file)
        }));
    }
    
    // Gerar HTML
    const html = gerarHtmlUltimaConsulta(resultado, screenshots);
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
    
  } catch (error) {
    console.error('❌ Erro ao exibir última consulta:', error);
    res.status(500).send(`
      <html>
        <head><title>Erro</title></head>
        <body>
          <h1>Erro ao carregar última consulta</h1>
          <p>${error.message}</p>
          <p><strong>Engine:</strong> Chromium (Servidor)</p>
        </body>
      </html>
    `);
  }
});

// Função auxiliar para obter título do screenshot
function getTituloScreenshot(filename) {
  const titulos = {
    '01_inicial.png': '1. Página Inicial Carregada',
    '02_apos_preenchimento.png': '2. Formulário Preenchido',
    '03_antes_captcha.png': '3. Captcha Carregado',
    '04_erro_deteccao_hcaptcha.png': '4. Erro na Detecção do Captcha',
    '05_resultado.png': '5. Resultado da Consulta',
    '06_final_sucesso.png': '6. Consulta Finalizada com Sucesso',
    '07_erro.png': '7. Erro na Consulta'
  };
  
  return titulos[filename] || filename.replace('.png', '').replace(/_/g, ' ');
}

// Função para gerar HTML da última consulta (simplificada)
function gerarHtmlUltimaConsulta(resultado, screenshots) {
  const timestamp = resultado ? new Date(resultado.timestamp).toLocaleString('pt-BR') : 'N/A';
  
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Última Consulta CPF - Chromium Server</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; }
        .header { text-align: center; margin-bottom: 30px; }
        .badge { background: #28a745; color: white; padding: 5px 10px; border-radius: 15px; font-size: 0.8em; }
        .resultado { background: ${resultado && resultado.sucesso ? '#d4edda' : '#f8d7da'}; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .screenshots { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .screenshot { border: 1px solid #ddd; border-radius: 5px; overflow: hidden; }
        .screenshot img { width: 100%; height: auto; cursor: pointer; }
        .screenshot h4 { background: #007bff; color: white; margin: 0; padding: 10px; }
        .modal { display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); }
        .modal-content { margin: auto; display: block; width: 90%; max-width: 1000px; }
        .close { position: absolute; top: 15px; right: 35px; color: #f1f1f1; font-size: 40px; cursor: pointer; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Última Consulta CPF</h1>
            <span class="badge">Chromium Server</span>
            <p><strong>Última atualização:</strong> ${timestamp}</p>
        </div>
        
        ${resultado ? `
            <div class="resultado">
                <h3>${resultado.sucesso ? '✅ Consulta Realizada com Sucesso' : '❌ Erro na Consulta'}</h3>
                ${resultado.sucesso ? `
                    <p><strong>CPF:</strong> ${resultado.cpf || 'N/A'}</p>
                    <p><strong>Nome:</strong> ${resultado.nome || 'N/A'}</p>
                    <p><strong>Situação:</strong> ${resultado.situacao_cadastral || 'N/A'}</p>
                ` : `
                    <p><strong>Erro:</strong> ${resultado.mensagem || 'Erro desconhecido'}</p>
                `}
            </div>
        ` : `
            <div class="resultado">
                <h3>Nenhuma consulta realizada ainda</h3>
            </div>
        `}
        
        <h3>📸 Screenshots do Processo</h3>
        ${screenshots.length > 0 ? `
            <div class="screenshots">
                ${screenshots.map(screenshot => `
                    <div class="screenshot">
                        <h4>${screenshot.titulo}</h4>
                        <img src="${screenshot.url}" alt="${screenshot.titulo}" onclick="openModal('${screenshot.url}')">
                    </div>
                `).join('')}
            </div>
        ` : `
            <p>Nenhum screenshot disponível</p>
        `}
    </div>
    
    <div id="imageModal" class="modal">
        <span class="close" onclick="closeModal()">&times;</span>
        <img class="modal-content" id="modalImage">
    </div>
    
    <script>
        function openModal(imageSrc) {
            document.getElementById('imageModal').style.display = 'block';
            document.getElementById('modalImage').src = imageSrc;
        }
        
        function closeModal() {
            document.getElementById('imageModal').style.display = 'none';
        }
        
        window.onclick = function(event) {
            const modal = document.getElementById('imageModal');
            if (event.target == modal) {
                closeModal();
            }
        }
        
        setTimeout(() => window.location.reload(), 30000);
    </script>
</body>
</html>
  `;
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM recebido, encerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT recebido, encerrando servidor...');
  process.exit(0);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor Chromium rodando na porta ${PORT}`);
  console.log(`🌐 Acesse: http://localhost:${PORT}/ultima-consulta`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
});


