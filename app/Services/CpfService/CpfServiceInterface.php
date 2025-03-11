<?php

namespace App\Services\CpfService;

use App\DTOs\CpfResponseDTO;

interface CpfServiceInterface
{
    /**
     * Consulta dados de um CPF
     *
     * @param string $cpf
     * @param string|null $birthDate
     * @return @any
     */
    public function getDadosCpf(string $cpf, ?string $birthDate = null);
    
    /**
     * Valida um CPF
     *
     * @param string $cpf
     * @return bool
     */
    public function validarCpf(string $cpf): bool;
} 