<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CpfConsultaController extends Controller
{
    private $nodeServerUrl = 'http://localhost:3000';
    private $screenshotsPath;
    
    public function __construct()
    {
        // Caminho para os screenshots do Node.js
        $this->screenshotsPath = base_path('receita-scraper/screenshots/ultima_consulta');
    }
    
    /**
     * Exibe a última consulta CPF com screenshots
     */
    public function ultimaConsulta()
    {
        try {
            // Ler resultado JSON se existir
            $resultadoPath = $this->screenshotsPath . '/resultado.json';
            $resultado = null;
            
            if (file_exists($resultadoPath)) {
                $data = file_get_contents($resultadoPath);
                $resultado = json_decode($data, true);
            }
            
            // Listar screenshots se existir
            $screenshots = [];
            if (is_dir($this->screenshotsPath)) {
                $files = scandir($this->screenshotsPath);
                $screenshots = collect($files)
                    ->filter(function($file) {
                        return pathinfo($file, PATHINFO_EXTENSION) === 'png';
                    })
                    ->sort()
                    ->map(function($file) {
                        return [
                            'nome' => $file,
                            'url' => route('cpf.screenshot', ['filename' => $file]),
                            'titulo' => $this->getTituloScreenshot($file)
                        ];
                    })
                    ->values()
                    ->toArray();
            }
            
            // Gerar HTML (mesmo da rota Node.js)
            $html = $this->gerarHtmlUltimaConsulta($resultado, $screenshots);
            
            return response($html)->header('Content-Type', 'text/html; charset=utf-8');
            
        } catch (\Exception $error) {
            return response()->view('errors.cpf-consulta', [
                'error' => $error->getMessage()
            ], 500);
        }
    }
    
    /**
     * Serve screenshots diretamente
     */
    public function screenshot($filename)
    {
        $filepath = $this->screenshotsPath . '/' . $filename;
        
        if (!file_exists($filepath) || pathinfo($filename, PATHINFO_EXTENSION) !== 'png') {
            abort(404, 'Screenshot não encontrado');
        }
        
        return response()->file($filepath, [
            'Content-Type' => 'image/png',
            'Cache-Control' => 'public, max-age=3600'
        ]);
    }
    
    /**
     * API para obter dados da última consulta
     */
    public function apiUltimaConsulta()
    {
        try {
            $resultadoPath = $this->screenshotsPath . '/resultado.json';
            
            if (!file_exists($resultadoPath)) {
                return response()->json([
                    'sucesso' => false,
                    'mensagem' => 'Nenhuma consulta encontrada'
                ], 404);
            }
            
            $data = file_get_contents($resultadoPath);
            $resultado = json_decode($data, true);
            
            // Listar screenshots
            $screenshots = [];
            if (is_dir($this->screenshotsPath)) {
                $files = scandir($this->screenshotsPath);
                $screenshots = collect($files)
                    ->filter(function($file) {
                        return pathinfo($file, PATHINFO_EXTENSION) === 'png';
                    })
                    ->map(function($file) {
                        return [
                            'nome' => $file,
                            'url' => route('cpf.screenshot', ['filename' => $file]),
                            'titulo' => $this->getTituloScreenshot($file)
                        ];
                    })
                    ->values()
                    ->toArray();
            }
            
            return response()->json([
                'resultado' => $resultado,
                'screenshots' => $screenshots,
                'total_screenshots' => count($screenshots)
            ]);
            
        } catch (\Exception $error) {
            return response()->json([
                'sucesso' => false,
                'mensagem' => 'Erro ao carregar dados: ' . $error->getMessage()
            ], 500);
        }
    }
    
    /**
     * Função auxiliar para obter título do screenshot
     */
    private function getTituloScreenshot($filename)
    {
        $titulos = [
            '01_inicial.png' => '1. Página Inicial Carregada',
            '02_apos_preenchimento.png' => '2. Formulário Preenchido',
            '03_antes_captcha.png' => '3. Captcha Carregado',
            '04_depois_do_clique_captcha.png' => '4. Depois do Clique no Captcha',
            '04_erro_deteccao_hcaptcha.png' => '4. Erro na Detecção do Captcha',
            '05_resultado.png' => '5. Resultado da Consulta',
            '06_final_sucesso.png' => '6. Consulta Finalizada com Sucesso',
            '07_erro.png' => '7. Erro na Consulta'
        ];
        
        return $titulos[$filename] ?? str_replace(['.png', '_'], ['', ' '], $filename);
    }
    
    /**
     * Gerar HTML da última consulta (mesmo do Node.js)
     */
    private function gerarHtmlUltimaConsulta($resultado, $screenshots)
    {
        $timestamp = $resultado ? date('d/m/Y H:i:s', strtotime($resultado['timestamp'])) : 'N/A';
        
        ob_start();
        ?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Última Consulta CPF - Laravel Integration</title>
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
            background: <?= $resultado && ($resultado['sucesso'] ?? false) ? '#d4edda' : '#f8d7da' ?>;
            border: 1px solid <?= $resultado && ($resultado['sucesso'] ?? false) ? '#c3e6cb' : '#f5c6cb' ?>;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
        }
        
        .resultado-card h3 {
            color: <?= $resultado && ($resultado['sucesso'] ?? false) ? '#155724' : '#721c24' ?>;
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
        
        .laravel-badge {
            position: absolute;
            top: 10px;
            left: 10px;
            background: #ff2d20;
            color: white;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 0.8em;
            font-weight: bold;
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
    <div class="laravel-badge">Laravel Integration</div>
    
    <div class="container">
        <div class="header">
            <h1>📊 Última Consulta CPF</h1>
            <p>Resultado detalhado com screenshots do processo</p>
            <p><strong>Última atualização:</strong> <?= $timestamp ?></p>
            <p><small>🚀 Integrado com Laravel</small></p>
        </div>
        
        <div class="content">
            <div class="resultado-section">
                <?php if ($resultado): ?>
                    <div class="resultado-card">
                        <h3><?= ($resultado['sucesso'] ?? false) ? '✅ Consulta Realizada com Sucesso' : '❌ Erro na Consulta' ?></h3>
                        
                        <?php if ($resultado['sucesso'] ?? false): ?>
                            <div class="info-grid">
                                <div class="info-item">
                                    <strong>CPF Consultado:</strong>
                                    <?= htmlspecialchars($resultado['cpf'] ?? $resultado['cpf_consultado'] ?? 'N/A') ?>
                                </div>
                                <div class="info-item">
                                    <strong>Nome:</strong>
                                    <?= htmlspecialchars($resultado['nome'] ?? 'N/A') ?>
                                </div>
                                <div class="info-item">
                                    <strong>Data de Nascimento:</strong>
                                    <?= htmlspecialchars($resultado['data_nascimento'] ?? $resultado['data_nascimento_consultada'] ?? 'N/A') ?>
                                </div>
                                <div class="info-item">
                                    <strong>Situação Cadastral:</strong>
                                    <?= htmlspecialchars($resultado['situacao_cadastral'] ?? 'N/A') ?>
                                </div>
                                <div class="info-item">
                                    <strong>Data da Inscrição:</strong>
                                    <?= htmlspecialchars($resultado['data_inscricao'] ?? 'N/A') ?>
                                </div>
                                <div class="info-item">
                                    <strong>Dígito Verificador:</strong>
                                    <?= htmlspecialchars($resultado['digito_verificador'] ?? 'N/A') ?>
                                </div>
                                <div class="info-item">
                                    <strong>Hora da Emissão:</strong>
                                    <?= htmlspecialchars($resultado['hora_emissao'] ?? 'N/A') ?>
                                </div>
                                <div class="info-item">
                                    <strong>Data da Emissão:</strong>
                                    <?= htmlspecialchars($resultado['data_emissao'] ?? 'N/A') ?>
                                </div>
                                <div class="info-item">
                                    <strong>Código de Controle:</strong>
                                    <?= htmlspecialchars($resultado['codigo_controle'] ?? 'N/A') ?>
                                </div>
                            </div>
                        <?php else: ?>
                            <div class="info-grid">
                                <div class="info-item">
                                    <strong>CPF Consultado:</strong>
                                    <?= htmlspecialchars($resultado['cpf_consultado'] ?? 'N/A') ?>
                                </div>
                                <div class="info-item">
                                    <strong>Data de Nascimento:</strong>
                                    <?= htmlspecialchars($resultado['data_nascimento_consultada'] ?? 'N/A') ?>
                                </div>
                                <div class="info-item">
                                    <strong>Erro:</strong>
                                    <?= htmlspecialchars($resultado['mensagem'] ?? 'Erro desconhecido') ?>
                                </div>
                            </div>
                        <?php endif; ?>
                    </div>
                <?php else: ?>
                    <div class="no-data">
                        <h3>Nenhuma consulta realizada ainda</h3>
                        <p>Execute uma consulta CPF para ver os resultados aqui</p>
                    </div>
                <?php endif; ?>
            </div>
            
            <div class="screenshots-section">
                <h3>📸 Screenshots do Processo</h3>
                
                <?php if (count($screenshots) > 0): ?>
                    <div class="screenshots-grid">
                        <?php foreach ($screenshots as $screenshot): ?>
                            <div class="screenshot-card">
                                <h4><?= htmlspecialchars($screenshot['titulo']) ?></h4>
                                <img src="<?= htmlspecialchars($screenshot['url']) ?>" 
                                     alt="<?= htmlspecialchars($screenshot['titulo']) ?>" 
                                     onclick="openModal('<?= htmlspecialchars($screenshot['url']) ?>')">
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php else: ?>
                    <div class="no-data">
                        <h3>Nenhum screenshot disponível</h3>
                        <p>Os screenshots aparecerão aqui após uma consulta</p>
                    </div>
                <?php endif; ?>
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
        <?php
        return ob_get_clean();
    }
}
