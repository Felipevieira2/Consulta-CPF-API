const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { consultarCPF } = require('./scraper-ip-rotation');
const ProxyManager = require('./proxy-manager');

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/screenshots', express.static(path.join(__dirname, 'screenshots')));

// Instância do gerenciador de proxies
const proxyManager = new ProxyManager();

// Cache com TTL mais longo para evitar muitas consultas
const cache = new Map();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos

// Rate limiting mais rigoroso
const rateLimiter = new Map();
const RATE_LIMIT = 2; // Apenas 2 consultas por IP por hora
const RATE_WINDOW = 60 * 60 * 1000; // 1 hora

// Estatísticas globais
const stats = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    proxiesUsed: new Set(),
    startTime: Date.now()
};

function checkRateLimit(ip) {
    const now = Date.now();
    const userRequests = rateLimiter.get(ip) || [];
    
    const recentRequests = userRequests.filter(time => now - time < RATE_WINDOW);
    
    if (recentRequests.length >= RATE_LIMIT) {
        return false;
    }
    
    recentRequests.push(now);
    rateLimiter.set(ip, recentRequests);
    return true;
}

// Middleware de rate limiting
app.use((req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
    
    if (req.path === '/consultar-cpf' && !checkRateLimit(ip)) {
        return res.status(429).json({
            erro: true,
            mensagem: `Rate limit excedido. Máximo ${RATE_LIMIT} consultas por hora.`,
            tipo: 'rate_limit',
            retry_after: 3600
        });
    }
    
    next();
});

// Rota de saúde com estatísticas de proxy
app.get('/health', (req, res) => {
    const proxyStats = proxyManager.getStats();
    const uptime = Date.now() - stats.startTime;
    
    res.json({ 
        status: 'ok', 
        servidor: 'ip-rotation',
        timestamp: new Date().toISOString(),
        uptime_ms: uptime,
        uptime_readable: `${Math.floor(uptime / 60000)} minutos`,
        cache_size: cache.size,
        rate_limiter_size: rateLimiter.size,
        proxy_stats: proxyStats,
        global_stats: {
            ...stats,
            proxiesUsed: stats.proxiesUsed.size,
            success_rate: stats.totalRequests > 0 ? 
                (stats.successfulRequests / stats.totalRequests * 100).toFixed(2) + '%' : '0%'
        }
    });
});

// Rota principal com rotação de IP
app.post('/consultar-cpf', async (req, res) => {
    const startTime = Date.now();
    const clientIP = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
    
    stats.totalRequests++;
    
    try {
        const { cpf, birthDate } = req.body;
        
        if (!cpf || !birthDate) {
            stats.failedRequests++;
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
                console.log(`📦 Cache hit para CPF: ${cpfLimpo} (Cliente: ${clientIP})`);
                return res.json({
                    ...dadosCache.resultado,
                    cache: true,
                    tempo_resposta: Date.now() - startTime
                });
            } else {
                cache.delete(chaveCache);
            }
        }

        console.log(`🌐 Nova consulta com rotação IP para CPF: ${cpfLimpo} (Cliente: ${clientIP})`);
        
        // Delay anti-detecção mais longo
        const delayAntiDeteccao = 5000 + Math.random() * 10000; // 5-15 segundos
        console.log(`⏳ Delay anti-detecção: ${Math.round(delayAntiDeteccao/1000)}s`);
        await new Promise(resolve => setTimeout(resolve, delayAntiDeteccao));
        
        // Realizar consulta com rotação de IP
        const resultado = await consultarCPF(cpf, birthDate);
        
        // Atualizar estatísticas
        if (resultado.erro) {
            stats.failedRequests++;
        } else {
            stats.successfulRequests++;
            
            // Registrar proxy usado
            if (resultado.proxy_usado && resultado.proxy_usado !== 'IP direto') {
                stats.proxiesUsed.add(resultado.proxy_usado);
            }
        }
        
        // Salvar no cache apenas se sucesso
        if (!resultado.erro) {
            cache.set(chaveCache, {
                resultado,
                timestamp: Date.now()
            });
        }
        
        // Salvar resultado detalhado
        const resultadoCompleto = {
            ...resultado,
            cpf_consultado: cpfLimpo,
            data_nascimento_consultada: birthDate,
            timestamp: new Date().toISOString(),
            tempo_resposta: Date.now() - startTime,
            servidor: 'ip-rotation',
            cliente_ip_hash: require('crypto').createHash('md5').update(clientIP).digest('hex').substr(0, 8),
            proxy_stats: proxyManager.getStats()
        };
        
        const resultadoPath = path.join(__dirname, 'screenshots', 'ultima_consulta', 'resultado.json');
        fs.writeFileSync(resultadoPath, JSON.stringify(resultadoCompleto, null, 2));
        
        console.log(`✅ Consulta concluída em ${Date.now() - startTime}ms`);
        
        res.json({
            ...resultado,
            tempo_resposta: Date.now() - startTime,
            servidor: 'ip-rotation'
        });
        
    } catch (error) {
        stats.failedRequests++;
        console.error('❌ Erro na API com rotação IP:', error);
        res.status(500).json({
            erro: true,
            mensagem: `Erro interno: ${error.message}`,
            tempo_resposta: Date.now() - startTime,
            servidor: 'ip-rotation'
        });
    }
});

// Rota para testar proxies
app.get('/test-proxies', async (req, res) => {
    try {
        console.log('🧪 Iniciando teste de todos os proxies...');
        const results = await proxyManager.testAllProxies();
        
        const working = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);
        
        res.json({
            sucesso: true,
            total_proxies: results.length,
            funcionando: working.length,
            com_falha: failed.length,
            taxa_sucesso: `${(working.length / results.length * 100).toFixed(1)}%`,
            resultados: results,
            proxies_funcionando: working.map(r => ({
                proxy: `${r.proxy.host}:${r.proxy.port}`,
                ip_obtido: r.ip,
                pais: r.proxy.country || 'N/A'
            }))
        });
        
    } catch (error) {
        res.status(500).json({
            erro: true,
            mensagem: `Erro ao testar proxies: ${error.message}`
        });
    }
});

// Rota para estatísticas de proxy
app.get('/proxy-stats', (req, res) => {
    const proxyStats = proxyManager.getStats();
    
    res.json({
        proxy_manager: proxyStats,
        global_stats: stats,
        cache_info: {
            size: cache.size,
            entries: Array.from(cache.keys())
        },
        rate_limiter: {
            active_ips: rateLimiter.size,
            entries: Array.from(rateLimiter.entries()).map(([ip, requests]) => ({
                ip_hash: require('crypto').createHash('md5').update(ip).digest('hex').substr(0, 8),
                requests_count: requests.length,
                last_request: new Date(Math.max(...requests)).toISOString()
            }))
        }
    });
});

// Rota para visualizar última consulta
app.get('/ultima-consulta', (req, res) => {
    try {
        const resultadoPath = path.join(__dirname, 'screenshots', 'ultima_consulta', 'resultado.json');
        
        if (!fs.existsSync(resultadoPath)) {
            return res.send(`
                <html>
                    <head>
                        <title>Servidor IP Rotation</title>
                        <style>
                            body { font-family: Arial, sans-serif; margin: 40px; background: #1a1a2e; color: #eee; }
                            .container { max-width: 800px; margin: 0 auto; }
                            .header { background: linear-gradient(135deg, #0f3460 0%, #16537e 100%); padding: 20px; border-radius: 10px; }
                            h1 { color: #4fc3f7; margin: 0; }
                            .badge { background: #4fc3f7; color: #000; padding: 5px 10px; border-radius: 15px; font-size: 12px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>🌐 Servidor IP Rotation</h1>
                                <span class="badge">MULTI-IP</span>
                                <p>Nenhuma consulta realizada ainda</p>
                            </div>
                            <p>Execute uma consulta via POST /consultar-cpf</p>
                            <a href="/health" style="color: #4fc3f7;">Status do Servidor</a> |
                            <a href="/proxy-stats" style="color: #4fc3f7;">Estatísticas de Proxy</a> |
                            <a href="/test-proxies" style="color: #4fc3f7;">Testar Proxies</a>
                        </div>
                    </body>
                </html>
            `);
        }
        
        const dados = JSON.parse(fs.readFileSync(resultadoPath, 'utf8'));
        
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Consulta IP Rotation</title>
            <style>
                body { 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                    margin: 20px; 
                    background: #1a1a2e; 
                    color: #eee; 
                }
                .container { 
                    max-width: 1200px; 
                    margin: 0 auto; 
                    background: #16213e; 
                    padding: 20px; 
                    border-radius: 15px; 
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                }
                .header { 
                    background: linear-gradient(135deg, #4fc3f7 0%, #29b6f6 100%); 
                    color: #000; 
                    padding: 25px; 
                    border-radius: 15px; 
                    margin-bottom: 20px; 
                    text-align: center;
                }
                .badge { 
                    background: rgba(0,0,0,0.2); 
                    padding: 8px 15px; 
                    border-radius: 20px; 
                    font-size: 14px; 
                    font-weight: bold;
                    margin: 0 5px;
                }
                .dados { 
                    background: #0f3460; 
                    padding: 20px; 
                    border-radius: 10px; 
                    margin: 15px 0; 
                    border-left: 5px solid #4fc3f7;
                }
                .ip-info {
                    background: #1e4976;
                    padding: 15px;
                    border-radius: 8px;
                    margin: 10px 0;
                    border: 1px solid #4fc3f7;
                }
                pre { 
                    background: #0a1929; 
                    padding: 15px; 
                    border-radius: 8px; 
                    overflow-x: auto;
                    border: 1px solid #333;
                    font-size: 12px;
                }
                .success { color: #4caf50; }
                .error { color: #f44336; }
                .info { color: #4fc3f7; }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                    margin: 20px 0;
                }
                .stat-card {
                    background: #1e4976;
                    padding: 15px;
                    border-radius: 8px;
                    text-align: center;
                    border: 1px solid #4fc3f7;
                }
                .stat-number {
                    font-size: 24px;
                    font-weight: bold;
                    color: #4fc3f7;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🌐 CONSULTA COM ROTAÇÃO DE IP</h1>
                    <div>
                        <span class="badge">MULTI-IP</span>
                        <span class="badge">ANTI-DETECÇÃO</span>
                        <span class="badge">PROXY ROTATION</span>
                    </div>
                    <p style="margin: 15px 0 0 0;">Última consulta: ${new Date(dados.timestamp).toLocaleString('pt-BR')}</p>
                </div>
                
                ${dados.ip_info ? `
                <div class="ip-info">
                    <h3 style="color: #4fc3f7; margin-top: 0;">📍 Informações do IP Usado</h3>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-number">${dados.ip_info.ip || 'N/A'}</div>
                            <div>IP Address</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${dados.ip_info.location || 'N/A'}</div>
                            <div>Localização</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${dados.proxy_usado || 'IP Direto'}</div>
                            <div>Proxy Usado</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${dados.tentativa || 1}</div>
                            <div>Tentativa</div>
                        </div>
                    </div>
                </div>
                ` : ''}
                
                <div class="dados">
                    <h2>${dados.erro ? '❌ Erro na Consulta' : '✅ Consulta com IP Rotation Realizada'}</h2>
                    <pre>${JSON.stringify(dados, null, 2)}</pre>
                </div>
                
                <div style="margin-top: 30px; text-align: center;">
                    <a href="/health" style="padding: 12px 25px; background: #4fc3f7; color: #000; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 0 10px;">📊 Status</a>
                    <a href="/proxy-stats" style="padding: 12px 25px; background: #29b6f6; color: #000; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 0 10px;">📡 Proxy Stats</a>
                    <a href="/test-proxies" style="padding: 12px 25px; background: #0288d1; color: #fff; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 0 10px;">🧪 Testar Proxies</a>
                </div>
            </div>
        </body>
        </html>
        `;
        
        res.send(html);
        
    } catch (error) {
        console.error('❌ Erro ao exibir consulta:', error);
        res.status(500).send('Erro ao carregar consulta');
    }
});

// Rota para limpar sistema
app.post('/limpar-sistema', (req, res) => {
    const cacheSize = cache.size;
    const rateLimiterSize = rateLimiter.size;
    
    cache.clear();
    rateLimiter.clear();
    
    // Reset stats
    stats.totalRequests = 0;
    stats.successfulRequests = 0;
    stats.failedRequests = 0;
    stats.proxiesUsed.clear();
    stats.startTime = Date.now();
    
    res.json({
        sucesso: true,
        mensagem: `Sistema limpo. Cache: ${cacheSize}, Rate Limiter: ${rateLimiterSize}, Stats resetados.`
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('🌐 SERVIDOR IP ROTATION INICIADO!');
    console.log('==================================');
    console.log(`🌐 Servidor: http://localhost:${PORT}`);
    console.log(`🔍 Consultar: POST http://localhost:${PORT}/consultar-cpf`);
    console.log(`📊 Última consulta: http://localhost:${PORT}/ultima-consulta`);
    console.log(`💚 Status: http://localhost:${PORT}/health`);
    console.log(`📡 Proxy Stats: http://localhost:${PORT}/proxy-stats`);
    console.log(`🧪 Testar Proxies: http://localhost:${PORT}/test-proxies`);
    console.log('==================================');
    console.log('🛡️ Recursos IP Rotation:');
    console.log('   ✅ Rotação automática de IP');
    console.log('   ✅ Múltiplas tentativas com IPs diferentes');
    console.log('   ✅ Rate limiting por IP cliente');
    console.log('   ✅ Cache inteligente (30min)');
    console.log('   ✅ Estatísticas detalhadas');
    console.log('   ✅ Teste automático de proxies');
    console.log('==================================');
    
    // Testar proxies na inicialização
    setTimeout(() => {
        console.log('🧪 Testando proxies na inicialização...');
        proxyManager.testAllProxies().then(results => {
            const working = results.filter(r => r.success);
            console.log(`📊 Proxies testados: ${working.length}/${results.length} funcionando`);
        }).catch(error => {
            console.log('⚠️ Erro ao testar proxies:', error.message);
        });
    }, 5000);
});

// Limpeza automática a cada 4 horas
setInterval(() => {
    const now = Date.now();
    
    // Limpar cache expirado
    for (const [key, data] of cache.entries()) {
        if (now - data.timestamp > CACHE_DURATION) {
            cache.delete(key);
        }
    }
    
    // Limpar rate limiter antigo
    for (const [ip, requests] of rateLimiter.entries()) {
        const recentRequests = requests.filter(time => now - time < RATE_WINDOW);
        if (recentRequests.length === 0) {
            rateLimiter.delete(ip);
        } else {
            rateLimiter.set(ip, recentRequests);
        }
    }
    
    console.log(`🧹 Limpeza automática: Cache=${cache.size}, RateLimit=${rateLimiter.size}, Proxies=${stats.proxiesUsed.size}`);
}, 4 * 60 * 60 * 1000);




