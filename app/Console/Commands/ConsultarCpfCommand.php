<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Process;

class ConsultarCpfCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cpf:consultar {cpf} {data_nascimento} {--visual : Executar em modo visual}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Consulta CPF usando o scraper Node.js integrado';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $cpf = $this->argument('cpf');
        $dataNascimento = $this->argument('data_nascimento');
        $visual = $this->option('visual');
        
        $this->info("🔍 Iniciando consulta CPF: {$cpf}");
        $this->info("📅 Data de nascimento: {$dataNascimento}");
        
        if ($visual) {
            $this->info("🖥️ Modo visual ativado - navegador será exibido");
        } else {
            $this->info("👻 Modo headless - navegador oculto");
        }
        
        // Caminho para o scraper
        $scraperPath = base_path('receita-scraper');
        
        if (!is_dir($scraperPath)) {
            $this->error("❌ Diretório do scraper não encontrado: {$scraperPath}");
            return 1;
        }
        
        // Comando para executar
        $nodeCommand = $visual ? 
            "cd {$scraperPath} && set VISUAL_MODE=true && node scraper.js {$cpf} {$dataNascimento}" :
            "cd {$scraperPath} && node scraper.js {$cpf} {$dataNascimento}";
        
        $this->info("🚀 Executando consulta...");
        $this->newLine();
        
        try {
            // Executar comando Node.js
            $result = Process::run($nodeCommand);
            
            // Mostrar output em tempo real
            $this->line($result->output());
            
            if ($result->failed()) {
                $this->error("❌ Erro na execução:");
                $this->line($result->errorOutput());
                return 1;
            }
            
            $this->newLine();
            $this->info("✅ Consulta finalizada com sucesso!");
            
            // Verificar se resultado foi salvo
            $resultadoPath = $scraperPath . '/screenshots/ultima_consulta/resultado.json';
            
            if (file_exists($resultadoPath)) {
                $this->info("📄 Resultado salvo em: {$resultadoPath}");
                
                // Mostrar dados básicos
                $dados = json_decode(file_get_contents($resultadoPath), true);
                
                if ($dados) {
                    $this->newLine();
                    $this->info("📊 Dados extraídos:");
                    
                    if ($dados['sucesso'] ?? false) {
                        $this->table(
                            ['Campo', 'Valor'],
                            [
                                ['CPF', $dados['cpf'] ?? 'N/A'],
                                ['Nome', $dados['nome'] ?? 'N/A'],
                                ['Data Nascimento', $dados['data_nascimento'] ?? 'N/A'],
                                ['Situação', $dados['situacao_cadastral'] ?? 'N/A'],
                                ['Data Inscrição', $dados['data_inscricao'] ?? 'N/A'],
                            ]
                        );
                    } else {
                        $this->error("❌ Erro na consulta: " . ($dados['mensagem'] ?? 'Erro desconhecido'));
                    }
                }
                
                // Informar sobre visualização web
                $this->newLine();
                $this->info("🌐 Para visualizar no navegador:");
                $this->line("   php artisan serve");
                $this->line("   Acesse: http://localhost:8000/cpf/ultima-consulta");
                
            } else {
                $this->warn("⚠️ Arquivo de resultado não encontrado");
            }
            
            return 0;
            
        } catch (\Exception $e) {
            $this->error("❌ Erro na execução: " . $e->getMessage());
            return 1;
        }
    }
}
