const express = require('express');
const bodyParser = require('body-parser');
const { consultarCPF } = require('./scraper');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Adicione esta rota antes da inicialização do servidor
app.use('/screenshots', express.static(path.join(__dirname, 'screenshots')));

// Adicione uma rota para listar todos os screenshots
app.get('/listar-screenshots', (req, res) => {
  const fs = require('fs');
  const screenshotsDir = path.join(__dirname, 'screenshots');
  
  fs.readdir(screenshotsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ erro: true, mensagem: 'Erro ao listar screenshots' });
    }
    
    const screenshots = files
      .filter(file => file.endsWith('.png'))
      .map(file => ({
        nome: file,
        url: `/screenshots/${file}`,
        data: new Date(file.split('_')[1].split('.')[0].replace(/-/g, ':')).toLocaleString()
      }));
    
    res.json(screenshots);
  });
});

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

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 