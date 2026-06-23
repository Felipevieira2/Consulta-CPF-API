<?php

namespace App\Http\Controllers\Api;

use App\Models\ApiKey;
use App\Models\UserPlan;
use App\DTOs\CpfResponseDTO;
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
            ], 400);
        }

        $cpf = $request->input('cpf');
        $birthDate = $request->input('birth_date');

        // Valida o CPF
        if (!$this->cpfService->validarCpf($cpf)) {
            
            return response()->json([
                'success' => false,
                'message' => __('validation.custom.cpf.invalid'),
            ], 400);
        }


        //verificar se o user tem saldo
        $user = auth()->user();      
        $userPlan = UserPlan::where('user_id', $user->id)->first();
       
        if(!$userPlan){
            return response()->json([
                'success' => false,
                'message' => "Sem plano ativo"
            ], 400);
        }

        if ($userPlan->credits_remaining <= 0) {
            return response()->json([
                'success' => false,
                'message' => "sem saldo"
            ], 500);
        }
        // Consulta os dados
        $result = $this->cpfService->getDadosCpf($cpf, $birthDate);

        // Ensure $result is a CpfResponseDTO object
        if (is_array($result)) {
            $result = CpfResponseDTO::fromArray($result);
        }

        if ($result->hasError()) {
            $result->type ? $type = $result->type : $type = 'default';

            switch($type){
                case 'cpf_incorreto':
                    return response()->json([
                        'success' => false,
                        'message' => $result->error
                    ], 400);
                case 'data_divergente':
                    return response()->json([
                        'success' => false,
                        'message' => $result->error
                    ], 400);
                case 'cpf_nao_encontrado':
                    return response()->json([
                        'success' => false,
                        'message' => $result->error
                    ], 400);
                default:
                    return response()->json([
                        'success' => false,
                        'message' => $result->error
                    ], 500);
            }
          
        }

        

        $apiKey = ApiKey::where('key', $request->api_token)->first();
      

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

        $userPlan->update([
            'credits_remaining' => $userPlan->credits_remaining - 1,
        ]);

        return response()->json([
            'success' => true,
            'data' => $result->toArray(),
        ]);
    }

    
}
