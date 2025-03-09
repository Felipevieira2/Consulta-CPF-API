<?php

namespace App\Http\Controllers;

use Laravel\Dusk\Browser;
use Illuminate\Http\Request;
use Facebook\WebDriver\Chrome\ChromeOptions;
use Facebook\WebDriver\Remote\RemoteWebDriver;
use Facebook\WebDriver\Remote\DesiredCapabilities;

class ConsultaReceitaController extends Controller
{
    public function getHtml(Request $request)
    {
        $startTime = microtime(true);
        \Log::info('Iniciando consulta de CPF');

        exec('chromedriver --port=9515 > /dev/null 2>&1 &');
        \Log::info('ChromeDriver iniciado');

        sleep(1);

        $options = new ChromeOptions();

        $options->addArguments([
            '--headless',          // Executa o Chrome sem interface gráfica
        ]);

        \Log::info('Configurando capacidades do Chrome');
        $capabilities = DesiredCapabilities::chrome();
        $capabilities->setCapability(ChromeOptions::CAPABILITY, $options);

        \Log::info('Iniciando RemoteWebDriver');
        $driver = RemoteWebDriver::create('http://localhost:9515', $capabilities);

        \Log::info('Criando instância do Browser');
        $browser = new Browser($driver);

        \Log::info('Iniciando navegação');
        $navigationStart = microtime(true);
        $browser->visit('https://servicos.receita.fazenda.gov.br/servicos/cpf/consultasituacao/consultapublica.asp')
            ->waitFor('#txtCPF', 10)
            ->type('txtCPF', '45083784807')
            ->type('txtDataNascimento', '29/03/1995')
            ->waitFor('iframe[title="Widget contendo caixa de seleção para desafio de segurança hCaptcha"]', 10)
            ->withinFrame('iframe[title="Widget contendo caixa de seleção para desafio de segurança hCaptcha"]', function (Browser $browser) {
                $browser->waitFor('#checkbox', 10)
                    ->script("document.getElementById('checkbox').click();");
            })
            ->pause(1000)
            ->press('Consultar')
            ->pause(500);

        $navigationTime = microtime(true) - $navigationStart;
        \Log::info('Navegação completa', ['tempo_navegacao' => $navigationTime]);

        \Log::info('Capturando HTML da página');
        $html = $driver->getPageSource();

        \Log::info('Encerrando driver');
        $driver->quit();

        $totalTime = microtime(true) - $startTime;
        \Log::info('Consulta finalizada', ['tempo_total' => $totalTime]);

        // Supondo que $html contenha o HTML retornado da consulta
        $dom = new \DOMDocument();

        // Evita warnings com HTML mal formado
        libxml_use_internal_errors(true);
        $dom->loadHTML($html);
        libxml_clear_errors();

        // Cria um objeto XPath para facilitar as buscas
        $xpath = new \DOMXPath($dom);

        // Inicializa array para armazenar os dados
        $resultado = [];

        // 1. Extrair dados do primeiro bloco (dados pessoais)
        $dadosPessoais = [];
        $spansDados = $xpath->query("//div[contains(@class, 'clConteudoEsquerda')][1]//span[contains(@class, 'clConteudoDados')]");

        foreach ($spansDados as $span) {
            // Extrai o texto completo do span (ex.: "N° do CPF: 450.837.848-07")
            $textoCompleto = trim($span->textContent);

            // Divide a string na primeira ocorrência de ":"
            $partes = explode(":", $textoCompleto, 2);
            if (count($partes) === 2) {
                // Label: remove espaços e quebras de linha
                $label = trim($partes[0]);
                // Valor: pode conter espaços extras, mas vamos limpar
                $valor = trim($partes[1]);
                $dadosPessoais[$label] = $valor;
            }
        }
        
        $resultado['dados_pessoais'] = $dadosPessoais;

        // 2. Extrair dados do segundo bloco (comprovante)
        $comprovante = [];
        // Busca pelos spans que contenham os dados do comprovante
        $spansComp = $xpath->query("//div[contains(@class, 'clConteudoEsquerda')][2]//span[contains(@class, 'clConteudoComp')]");
        foreach ($spansComp as $span) {
            $texto = trim($span->textContent);

            if (strpos($texto, 'Comprovante emitido às:') !== false) {
                // Exemplo: "Comprovante emitido às: 21:42:11 do dia 13/02/2025 (hora e data de Brasília)."
                // Remove a parte fixa para facilitar a extração
                $textoLimpo = str_replace('Comprovante emitido às:', '', $texto);
                // Separa a hora e a data usando "do dia" como delimitador
                $partes = explode("do dia", $textoLimpo);
                if (count($partes) === 2) {
                    $hora = trim($partes[0]);
                    // Remove o trecho "(hora e data de Brasília)."
                    $data = trim(str_replace(["(hora e data de Brasília).", ")"], "", $partes[1]));
                    $comprovante['hora'] = $hora;
                    $comprovante['data'] = $data;
                }
            } elseif (strpos($texto, 'Código de controle do comprovante:') !== false) {
                // Para o código de controle, podemos pegar o valor do <b>
                $bTag = $span->getElementsByTagName('b')->item(0);
                if ($bTag) {
                    $codigo = trim($bTag->nodeValue);
                    $comprovante['codigo_controle'] = $codigo;
                }
            }
        }
        
        $resultado['comprovante'] = $comprovante;

        // Exibe ou retorna os dados extraídos (por exemplo, em JSON)
        header('Content-Type: application/json');

        return json_encode($resultado);

    }
}
