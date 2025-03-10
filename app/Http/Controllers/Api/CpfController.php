<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CpfService\CpfServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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
        
     
        // Consulta os dados
        $result = $this->cpfService->getDadosCpf($cpf, $birthDate);
        
        if (!$result) {
            return response()->json([
                'success' => false,
                'message' => __('messages.cpf_not_found'),
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $result->toArray(),
        ]);
    }
} 