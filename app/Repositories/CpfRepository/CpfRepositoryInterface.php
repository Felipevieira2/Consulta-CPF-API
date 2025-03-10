<?php

namespace App\Repositories\CpfRepository;

interface CpfRepositoryInterface
{
    /**
     * Consulta dados de um CPF
     *
     * @param string $cpf
     * @param string|null $birthDate
     * @return array|null
     */
    public function consultarCpf(string $cpf, ?string $birthDate = null): ?array;
} 