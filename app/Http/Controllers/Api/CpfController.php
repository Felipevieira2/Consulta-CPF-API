<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ApiLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CpfController extends Controller
{
    public function validateCpf(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'cpf' => 'required|string|size:11',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'CPF inválido',
                'errors' => $validator->errors(),
            ], 422);
        }
        
        $cpf = $request->cpf;
        
        // Verificar se o usuário tem créditos suficientes
        $user = auth()->user();
        if ($user->credits <= 0) {
            return response()->json([
                'success' => false,
                'message' => 'Saldo insuficiente. Por favor, adquira mais créditos.',
            ], 402);
        }
        
        // Validar o CPF (algoritmo simplificado)
        if (!$this->isValidCpf($cpf)) {
            // Registrar a tentativa, mas não cobrar créditos por CPF inválido
            $this->logApiRequest($request, [
                'success' => false,
                'message' => 'CPF com formato inválido',
            ], 422, 0);
            
            return response()->json([
                'success' => false,
                'message' => 'CPF com formato inválido',
            ], 422);
        }
        
        // Simular consulta a uma base de dados externa
        $cpfData = $this->simulateCpfLookup($cpf);
        
        // Deduzir crédito do usuário
        $activePlan = $user->activePlan();
        $user->plans()->updateExistingPivot($activePlan->id, [
            'credits_remaining' => $activePlan->pivot->credits_remaining - 1,
        ]);
        
        // Registrar a consulta
        $this->logApiRequest($request, $cpfData, 200, 1);
        
        return response()->json($cpfData);
    }
    
    private function isValidCpf($cpf)
    {
        // Elimina possível máscara
        $cpf = preg_replace('/[^0-9]/', '', $cpf);
        
        // Verifica se o número de dígitos é igual a 11
        if (strlen($cpf) != 11) {
            return false;
        }
        
        // Verifica se foi informada uma sequência de dígitos repetidos
        if (preg_match('/(\d)\1{10}/', $cpf)) {
            return false;
        }
        
        // Faz o cálculo para validar o CPF
        for ($t = 9; $t < 11; $t++) {
            for ($d = 0, $c = 0; $c < $t; $c++) {
                $d += $cpf[$c] * (($t + 1) - $c);
            }
            $d = ((10 * $d) % 11) % 10;
            if ($cpf[$c] != $d) {
                return false;
            }
        }
        
        return true;
    }
    
    private function simulateCpfLookup($cpf)
    {
        // Simulação de dados - em um ambiente real, isso seria uma consulta a uma API externa
        $names = [
            'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Souza', 
            'Carlos Ferreira', 'Juliana Costa', 'Roberto Almeida', 'Fernanda Lima'
        ];
        
        $situations = ['Regular', 'Regular', 'Regular', 'Irregular', 'Suspenso'];
        
        // Gerar data de nascimento aleatória entre 1950 e 2000
        $year = rand(1950, 2000);
        $month = rand(1, 12);
        $day = rand(1, 28);
        $birthDate = sprintf('%04d-%02d-%02d', $year, $month, $day);
        
        return [
            'success' => true,
            'data' => [
                'cpf' => $cpf,
                'nome' => $names[array_rand($names)],
                'data_nascimento' => $birthDate,
                'situacao_cadastral' => $situations[array_rand($situations)],
                'data_consulta' => now()->toIso8601String(),
            ]
        ];
    }
    
    private function logApiRequest(Request $request, $responseData, $statusCode, $creditsUsed)
    {
        ApiLog::create([
            'user_id' => auth()->id(),
            'api_key_id' => $request->user()->currentAccessToken()->id ?? null,
            'endpoint' => $request->path(),
            'method' => $request->method(),
            'ip_address' => $request->ip(),
            'request_data' => $request->except(['api_token']),
            'response_data' => $responseData,
            'status_code' => $statusCode,
            'credits_used' => $creditsUsed,
        ]);
    }
} 