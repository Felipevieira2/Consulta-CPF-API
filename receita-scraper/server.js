const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

// Detectar ambiente e usar scraper apropriado
let consultarCPF;

if (process.env.NODE_ENV === 'production' || process.env.USE_CHROMIUM === 'true') {
    console.log('🖥️ Usando Chromium para servidor...');
    const { consultarCPF: consultarCPFChromium } = require('./scraper-servidor');
    consultarCPF = consultarCPFChromium;
} else {
    console.log('🦊 Usando WebKit para desenvolvimento...');
    try {
        const scraperWebkit = require('./scraper');
        consultarCPF = scraperWebkit.consultarCPF;
    } catch (error) {
        console.log('⚠️ Fallback para Chromium devido a erro no WebKit:', error.message);
        const { consultarCPF: consultarCPFChromium } = require('./scraper-servidor');
        consultarCPF = consultarCPFChromium;
    }
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta screenshots
app.use('/screenshots', express.static(path.join(__dirname, 'screenshots')));

// Servir arquivos estáticos para CSS/JS se necessário
app.use('/static', express.static(path.join(__dirname, 'public')));


// Rota para verificar se o servidor está online
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
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
    '04_01_depois_do_clique_captcha_tentativa.png': '4.01 Depois do Clique no Captcha (Tentativa)',
    '05_resultado.png': '5. Resultado da Consulta',
    '06_final_sucesso.png': '6. Consulta Finalizada com Sucesso',
    '07_erro.png': '7. Erro na Consulta'
  };
  
  return titulos[filename] || filename.replace('.png', '').replace(/_/g, ' ');
}

// Função para gerar HTML da última consulta
function gerarHtmlUltimaConsulta(resultado, screenshots) {
  const timestamp = resultado ? new Date(resultado.timestamp).toLocaleString('pt-BR') : 'N/A';
  
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Última Consulta CPF - Resultado</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 1.1em;
            opacity: 0.9;
        }
        
        .content {
            padding: 30px;
        }
        
        .resultado-section {
            margin-bottom: 40px;
        }
        
        .resultado-card {
            background: ${resultado && resultado.sucesso ? '#d4edda' : '#f8d7da'};
            border: 1px solid ${resultado && resultado.sucesso ? '#c3e6cb' : '#f5c6cb'};
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
        }
        
        .resultado-card h3 {
            color: ${resultado && resultado.sucesso ? '#155724' : '#721c24'};
            margin-bottom: 15px;
            font-size: 1.3em;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 15px;
        }
        
        .info-item {
            background: rgba(255,255,255,0.7);
            padding: 10px 15px;
            border-radius: 5px;
            border-left: 4px solid #667eea;
        }
        
        .info-item strong {
            color: #333;
            display: block;
            margin-bottom: 5px;
        }
        
        .screenshots-section h3 {
            color: #333;
            margin-bottom: 20px;
            font-size: 1.5em;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
        }
        
        .screenshots-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 20px;
        }
        
        .screenshot-card {
            background: #f8f9fa;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        
        .screenshot-card:hover {
            transform: translateY(-5px);
        }
        
        .screenshot-card h4 {
            background: #667eea;
            color: white;
            padding: 15px;
            margin: 0;
            font-size: 1em;
        }
        
        .screenshot-card img {
            width: 100%;
            height: auto;
            display: block;
            cursor: pointer;
        }
        
        .no-data {
            text-align: center;
            padding: 40px;
            color: #666;
        }
        
        .no-data h3 {
            margin-bottom: 10px;
            color: #999;
        }
        
        .refresh-btn {
            background: #667eea;
            color: white;
            padding: 12px 25px;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1em;
            margin-top: 20px;
            transition: background 0.3s ease;
        }
        
        .refresh-btn:hover {
            background: #5a6fd8;
        }
        
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.9);
        }
        
        .modal-content {
            margin: auto;
            display: block;
            width: 90%;
            max-width: 1000px;
            max-height: 90%;
            object-fit: contain;
        }
        
        .close {
            position: absolute;
            top: 15px;
            right: 35px;
            color: #f1f1f1;
            font-size: 40px;
            font-weight: bold;
            cursor: pointer;
        }
        
        .close:hover {
            color: #bbb;
        }
        
        @media (max-width: 768px) {
            .container {
                margin: 10px;
            }
            
            .header {
                padding: 20px;
            }
            
            .header h1 {
                font-size: 2em;
            }
            
            .content {
                padding: 20px;
            }
            
            .screenshots-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Última Consulta CPF</h1>
            <p>Resultado detalhado com screenshots do processo</p>
            <p><strong>Última atualização:</strong> ${timestamp}</p>
        </div>
        
        <div class="content">
            <div class="resultado-section">
                ${resultado ? `
                    <div class="resultado-card">
                        <h3>${resultado.sucesso ? '✅ Consulta Realizada com Sucesso' : '❌ Erro na Consulta'}</h3>
                        
                        ${resultado.sucesso ? `
                            <div class="info-grid">
                                <div class="info-item">
                                    <strong>CPF Consultado:</strong>
                                    ${resultado.cpf || resultado.cpf_consultado || 'N/A'}
                                </div>
                                <div class="info-item">
                                    <strong>Nome:</strong>
                                    ${resultado.nome || 'N/A'}
                                </div>
                                <div class="info-item">
                                    <strong>Data de Nascimento:</strong>
                                    ${resultado.data_nascimento || resultado.data_nascimento_consultada || 'N/A'}
                                </div>
                                <div class="info-item">
                                    <strong>Situação Cadastral:</strong>
                                    ${resultado.situacao_cadastral || 'N/A'}
                                </div>
                                <div class="info-item">
                                    <strong>Data da Inscrição:</strong>
                                    ${resultado.data_inscricao || 'N/A'}
                                </div>
                                <div class="info-item">
                                    <strong>Dígito Verificador:</strong>
                                    ${resultado.digito_verificador || 'N/A'}
                                </div>
                                <div class="info-item">
                                    <strong>Hora da Emissão:</strong>
                                    ${resultado.hora_emissao || 'N/A'}
                                </div>
                                <div class="info-item">
                                    <strong>Data da Emissão:</strong>
                                    ${resultado.data_emissao || 'N/A'}
                                </div>
                                <div class="info-item">
                                    <strong>Código de Controle:</strong>
                                    ${resultado.codigo_controle || 'N/A'}
                                </div>
                            </div>
                        ` : `
                            <div class="info-grid">
                                <div class="info-item">
                                    <strong>CPF Consultado:</strong>
                                    ${resultado.cpf_consultado || 'N/A'}
                                </div>
                                <div class="info-item">
                                    <strong>Data de Nascimento:</strong>
                                    ${resultado.data_nascimento_consultada || 'N/A'}
                                </div>
                                <div class="info-item">
                                    <strong>Erro:</strong>
                                    ${resultado.mensagem || 'Erro desconhecido'}
                                </div>
                            </div>
                        `}
                    </div>
                ` : `
                    <div class="no-data">
                        <h3>Nenhuma consulta realizada ainda</h3>
                        <p>Execute uma consulta CPF para ver os resultados aqui</p>
                    </div>
                `}
            </div>
            
            <div class="screenshots-section">
                <h3>📸 Screenshots do Processo</h3>
                
                ${screenshots.length > 0 ? `
                    <div class="screenshots-grid">
                        ${screenshots.map(screenshot => `
                            <div class="screenshot-card">
                                <h4>${screenshot.titulo}</h4>
                                <img src="${screenshot.url}" alt="${screenshot.titulo}" onclick="openModal('${screenshot.url}')">
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="no-data">
                        <h3>Nenhum screenshot disponível</h3>
                        <p>Os screenshots aparecerão aqui após uma consulta</p>
                    </div>
                `}
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <button class="refresh-btn" onclick="window.location.reload()">🔄 Atualizar Página</button>
            </div>
        </div>
    </div>
    
    <!-- Modal para visualizar screenshots -->
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
        
        // Fechar modal ao clicar fora da imagem
        window.onclick = function(event) {
            const modal = document.getElementById('imageModal');
            if (event.target == modal) {
                closeModal();
            }
        }
        
        // Fechar modal com ESC
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeModal();
            }
        });
        
        // Auto-refresh a cada 30 segundos
        setTimeout(() => {
            window.location.reload();
        }, 30000);
    </script>
</body>
</html>
  `;
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM recebido, encerrando servidor...');
  await finalizarRecursos();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT recebido, encerrando servidor...');
  await finalizarRecursos();
  process.exit(0);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 