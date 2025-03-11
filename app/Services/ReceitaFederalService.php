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
        
        $host = env('RECEITA_SCRAPER_HOST', 'localhost');
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
                return ['error' => 'Erro ao consultar Receita Federal'];
            }

            if(isset($responseData['error'])){
                return ['error' => $responseData["message"]];
            }
            
            return $responseData;
        } catch (\Exception $e) {
            Log::error('Erro ao consultar Receita Federal: ' . $e->getMessage(). '-' . $e->getFile(). '-' . $e->getLine());
            return ['error' => $e->getMessage()];
        }
    }
}
