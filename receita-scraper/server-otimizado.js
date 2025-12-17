const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { consultarCPF } = require('./scraper-otimizado');

const app = express();
const PORT = process.env.PORT || 3001; // Porta diferente para não conflitar

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/screenshots', express.static(path.join(__dirname, 'screenshots')));

// Cache simples para evitar consultas repetidas
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Rota de saúde
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        servidor: 'otimizado',
        timestamp: new Date().toISOString()
    });
});

// Rota principal de consulta
app.post('/consultar-cpf', async (req, res) => {
    const startTime = Date.now();
    
    try {
        const { cpf, birthDate } = req.body;
        
        if (!cpf || !birthDate) {
            return res.status(400).json({
                erro: true,
                mensagem: 'CPF e data de nascimento são obrigatórios'
            });
        }

        const cpfLimpo = cpf.replace(/[^0-9]/g, '');
        const chaveCache = `${cpfLimpo}_${birthDate}`;
        
        // Verificar cache
        if (cache.has(chaveCache)) {
            const dadosCache = cache.get(chaveCache);
            if (Date.now() - dadosCache.timestamp < CACHE_DURATION) {
                console.log('📦 Retornando dados do cache para:', cpfLimpo);
                return res.json({
                    ...dadosCache.resultado,
                    cache: true,
                    tempo_resposta: Date.now() - startTime
                });
            } else {
                cache.delete(chaveCache);
            }
        }

        console.log(`🔍 Nova consulta para CPF: ${cpfLimpo}`);
        
        // Realizar consulta
        const resultado = await consultarCPF(cpf, birthDate);
        
        // Salvar no cache se sucesso
        if (!resultado.erro) {
            cache.set(chaveCache, {
                resultado,
                timestamp: Date.now()
            });
        }
        
        // Salvar resultado em arquivo
        const resultadoCompleto = {
            ...resultado,
            cpf_consultado: cpfLimpo,
            data_nascimento_consultada: birthDate,
            timestamp: new Date().toISOString(),
            tempo_resposta: Date.now() - startTime,
            servidor: 'otimizado'
        };
        
        const resultadoPath = path.join(__dirname, 'screenshots', 'ultima_consulta', 'resultado.json');
        fs.writeFileSync(resultadoPath, JSON.stringify(resultadoCompleto, null, 2));
        
        res.json({
            ...resultado,
            tempo_resposta: Date.now() - startTime
        });
        
    } catch (error) {
        console.error('❌ Erro na API:', error);
        res.status(500).json({
            erro: true,
            mensagem: `Erro interno: ${error.message}`,
            tempo_resposta: Date.now() - startTime
        });
    }
});

// Rota para visualizar última consulta
app.get('/ultima-consulta', (req, res) => {
    try {
        const resultadoPath = path.join(__dirname, 'screenshots', 'ultima_consulta', 'resultado.json');
        
        if (!fs.existsSync(resultadoPath)) {
            return res.send(`
                <html>
                    <head><title>Nenhuma Consulta</title></head>
                    <body>
                        <h1>🔍 Nenhuma consulta realizada ainda</h1>
                        <p>Execute uma consulta primeiro via POST /consultar-cpf</p>
                        <a href="/health">Status do Servidor</a>
                    </body>
                </html>
            `);
        }
        
        const dados = JSON.parse(fs.readFileSync(resultadoPath, 'utf8'));
        
        // Listar screenshots disponíveis
        const screenshotDir = path.join(__dirname, 'screenshots', 'ultima_consulta');
        const screenshots = fs.readdirSync(screenshotDir)
            .filter(f => f.endsWith('.png'))
            .sort();
        
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Última Consulta CPF - Servidor Otimizado</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
                .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
                .dados { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0; }
                .screenshot { margin: 10px; display: inline-block; }
                .screenshot img { max-width: 300px; border: 2px solid #ddd; border-radius: 8px; }
                .success { color: #28a745; }
                .error { color: #dc3545; }
                .info { color: #17a2b8; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🚀 Consulta CPF - Servidor Otimizado</h1>
                    <p>Última consulta realizada em: ${new Date(dados.timestamp).toLocaleString('pt-BR')}</p>
                </div>
                
                <div class="dados">
                    <h2>${dados.erro ? '❌ Erro na Consulta' : '✅ Consulta Realizada'}</h2>
                    <pre>${JSON.stringify(dados, null, 2)}</pre>
                </div>
                
                ${screenshots.length > 0 ? `
                <h2>📸 Screenshots do Processo</h2>
                <div class="screenshots">
                    ${screenshots.map(screenshot => `
                        <div class="screenshot">
                            <h4>${screenshot}</h4>
                            <img src="/screenshots/ultima_consulta/${screenshot}" alt="${screenshot}">
                        </div>
                    `).join('')}
                </div>
                ` : ''}
                
                <div style="margin-top: 20px;">
                    <a href="/health" style="padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">Status do Servidor</a>
                </div>
            </div>
        </body>
        </html>
        `;
        
        res.send(html);
        
    } catch (error) {
        console.error('❌ Erro ao exibir última consulta:', error);
        res.status(500).send(`
            <html>
                <head><title>Erro</title></head>
                <body>
                    <h1>Erro ao carregar consulta</h1>
                    <p>${error.message}</p>
                </body>
            </html>
        `);
    }
});

// Rota para limpar cache
app.post('/limpar-cache', (req, res) => {
    const tamanhoAnterior = cache.size;
    cache.clear();
    
    res.json({
        sucesso: true,
        mensagem: `Cache limpo. ${tamanhoAnterior} entradas removidas.`
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('🚀 SERVIDOR OTIMIZADO INICIADO!');
    console.log('================================');
    console.log(`🌐 Servidor rodando em: http://localhost:${PORT}`);
    console.log(`🔍 Consultar CPF: POST http://localhost:${PORT}/consultar-cpf`);
    console.log(`📊 Última consulta: http://localhost:${PORT}/ultima-consulta`);
    console.log(`💚 Status: http://localhost:${PORT}/health`);
    console.log(`🧹 Limpar cache: POST http://localhost:${PORT}/limpar-cache`);
    console.log('================================');
});

// Limpeza automática do cache a cada hora
setInterval(() => {
    const agora = Date.now();
    for (const [chave, dados] of cache.entries()) {
        if (agora - dados.timestamp > CACHE_DURATION) {
            cache.delete(chave);
        }
    }
    console.log(`🧹 Limpeza automática: ${cache.size} entradas no cache`);
}, 60 * 60 * 1000); // 1 hora
