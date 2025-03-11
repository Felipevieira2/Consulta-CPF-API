<?php

namespace App\Http\Controllers\Api;

use App\Models\ApiKey;
use App\Models\UserPlan;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use App\Services\CpfService\CpfServiceInterface;

class CpfController extends Controller
{
    /**
     * @param CpfServiceInterface $cpfService
     */
    public function __construct(
        private readonly CpfServiceInterface $cpfService
    ) {}
    
    /**
     * Consulta dados de um CPF
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getDadosCpf(Request $request): JsonResponse
    {
        // Validação dos parâmetros
        $validator = Validator::make($request->all(), [
            'cpf' => 'required|string|min:11|max:14',
            'birth_date' => 'nullable|string|min:8|max:8',
        ], [
            'cpf.required' => __('validation.required', ['attribute' => 'CPF']),
            'cpf.min' => __('validation.min.string', ['attribute' => 'CPF', 'min' => 11]),
            'cpf.max' => __('validation.max.string', ['attribute' => 'CPF', 'max' => 14]),
            'birth_date.min' => __('validation.min.string', ['attribute' => 'data de nascimento', 'min' => 8]),
            'birth_date.max' => __('validation.max.string', ['attribute' => 'data de nascimento', 'max' => 8]),
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => __('validation.failed'),
                'errors' => $validator->errors(),
            ], 422);
        }
        
        $cpf = $request->input('cpf');
        $birthDate = $request->input('birth_date');
        
        // Valida o CPF
        if (!$this->cpfService->validarCpf($cpf)) {
            return response()->json([
                'success' => false,
                'message' => __('validation.custom.cpf.invalid'),
            ], 422);
        }
        
     
        //verificar se o user tem saldo
        $user = auth()->user();
        $userPlan = UserPlan::where('user_id', $user->id)->first();

      
        if($userPlan->credits_remaining <= 0){
            return response()->json([
                'success' => false,
                'message' => "sem saldo"
            ], 400);
        }
        // Consulta os dados
        $result = $this->cpfService->getDadosCpf($cpf, $birthDate);
        
       
        
        if ($result->hasError()) {
            return response()->json([
                'error' => $result->error
            ], 400);
        }

        
        $apiKey = ApiKey::where('key', $request->api_token)->first();

        $user = auth()->user();
        $user->apiLogs()->create([
            'user_id' => $user->id,
            'api_key_id' => $apiKey->id,
            'endpoint' => 'get-cpf',
            'method' => 'GET',
            'ip_address' => $request->ip(),
            'request_data' => $request->all(),
            'response_data' => $result->toArray(),
            'status_code' => 200,
            'credits_used' => 1,

        ]);

        //descontar saldo do userPlan
        $userPlan = UserPlan::where('user_id', $user->id)->first();
        $userPlan->update([
            'balance' => $userPlan->credits_remaining - 1,
        ]);

       

        return response()->json([
            'success' => true,
            'data' => $result->toArray(),
        ]);
    }

    public function consultar(Request $request)
    {
        try {
            $cpf = $request->input('cpf');
            $result = $this->cpfService->consultarCpf($cpf);

            if ($result->hasError()) {
                return response()->json([
                    'error' => $result->error
                ], 400);
            }

            return response()->json([
                'success' => true,
                'data' => $result->toArray()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao consultar CPF: ' . $e->getMessage()
            ], 500);
        }
    }
} 