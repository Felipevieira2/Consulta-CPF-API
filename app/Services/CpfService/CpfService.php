<?php

namespace App\Services\CpfService;

use App\DTOs\CpfResponseDTO;
use Illuminate\Support\Facades\Log;
use App\Services\ReceitaFederalService;
use App\Repositories\CpfRepository\CpfRepositoryInterface;

class CpfService implements CpfServiceInterface
{

    protected $receitaFederalService;

    /**
     * @param CpfRepositoryInterface $cpfRepository
     * @param ReceitaFederalService $receitaFederalService
     */
    public function __construct(
        private readonly CpfRepositoryInterface $cpfRepository,
        ReceitaFederalService $receitaFederalService
    ) {
        $this->receitaFederalService = $receitaFederalService;
    }
    
    /**
     * Consulta dados de um CPF
     *
     * @param string $cpf
     * @param string|null $birthDate
     * 
     */
    public function getDadosCpf(string $cpf, ?string $birthDate = null)
    {
        // Valida o CPF antes de consultar
        if (!$this->validarCpf($cpf)) {
            Log::warning('Tentativa de consulta com CPF inválido', ['cpf' => $cpf]);
            return null;
        }
        
        // Remove formatação do CPF
        $cpf = preg_replace('/[^0-9]/', '', $cpf);
        
        // Consulta os dados
        // $result = $this->cpfRepository->consultarCpf($cpf, $birthDate);
        $result = $this->receitaFederalService->postReceitaFederal($cpf, $birthDate);

       
        if(isset($result['error'])){
            Log::error('Erro ao consultar CPF: ' . $result['error']);
        }
       
        // Converte para DTO
        return $result;
    }
    
    /**
     * Valida um CPF
     *
     * @param string $cpf
     * @return bool
     */
    public function validarCpf(string $cpf): bool
    {
        // Remove caracteres não numéricos
        $cpf = preg_replace('/[^0-9]/', '', $cpf);
        
        // Verifica se o CPF tem 11 dígitos
        if (strlen($cpf) != 11) {
            return false;
        }
        
        // Verifica se todos os dígitos são iguais
        if (preg_match('/(\d)\1{10}/', $cpf)) {
            return false;
        }
        
        // Calcula o primeiro dígito verificador
        $soma = 0;
        for ($i = 0; $i < 9; $i++) {
            $soma += $cpf[$i] * (10 - $i);
        }
        $resto = $soma % 11;
        $dv1 = ($resto < 2) ? 0 : 11 - $resto;
        
        // Verifica o primeiro dígito verificador
        if ($cpf[9] != $dv1) {
            return false;
        }
        
        // Calcula o segundo dígito verificador
        $soma = 0;
        for ($i = 0; $i < 10; $i++) {
            $soma += $cpf[$i] * (11 - $i);
        }
        $resto = $soma % 11;
        $dv2 = ($resto < 2) ? 0 : 11 - $resto;
        
        // Verifica o segundo dígito verificador
        if ($cpf[10] != $dv2) {
            return false;
        }
        
        return true;
    }
} 