<?php

namespace App\Services;


use GuzzleHttp\Client;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
class ReceitaFederalService
{
    public function postReceitaFederal($cpf, $birthDate = null)
    {
        $client = new \GuzzleHttp\Client();
        $headers = [
            'Content-Type' => 'application/json',
            
        ];
        
        $host = env('RECEITA_SCRAPER_HOST', 'consulta-cpf-api_receita-scraper_1');
        $url = "http://{$host}:3000/consultar-cpf";
        
        $body = json_encode([
            'cpf' => $cpf,
            'birthDate' => $birthDate ?? ''
        ]);
        
        try {
            $request = new \GuzzleHttp\Psr7\Request('POST', $url, $headers, $body);
            $response = $client->sendAsync($request)->wait();
            $responseData = json_decode($response->getBody(), true);
            
            Log::info('Resposta da Receita Federal: ' . json_encode($responseData));
           
            if($response->getStatusCode() != 200){
                return [
                    
                    'error' => 'Erro ao consultar Receita Federal'
                ];
            }

            if (isset($responseData['error']) || isset($responseData['erro'])) {
                // Determinar a mensagem de erro de forma robusta
                $errorMessage = 'Erro desconhecido ao consultar Receita Federal';
                
                if (isset($responseData['message']) && is_string($responseData['message'])) {
                    $errorMessage = $responseData['message'];
                } elseif (isset($responseData['mensagem']) && is_string($responseData['mensagem'])) {
                    $errorMessage = $responseData['mensagem'];
                } elseif (isset($responseData['error']) && is_string($responseData['error'])) {
                    $errorMessage = $responseData['error'];
                } elseif (isset($responseData['erro']) && is_string($responseData['erro'])) {
                    $errorMessage = $responseData['erro'];
                }
                
                return [
                    'error' => $errorMessage,
                    'type' => $responseData['type'] ?? $responseData['tipo'] ?? 'default'
                ];
            }
            
            return $responseData;
        } catch (\Exception $e) {
            Log::error('Erro ao consultar Receita Federal: ' . $e->getMessage(). '-' . $e->getFile(). '-' . $e->getLine());
            return ['error' => $e->getMessage()];
        }
    }
}
