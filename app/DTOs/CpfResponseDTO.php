<?php

namespace App\DTOs;

class CpfResponseDTO
{
    public function __construct(
        public readonly ?string $name = null,
        public readonly ?string $cpf = null,
        public readonly ?string $status = null,
        public readonly ?string $error = null
    ) {}
    
    /**
     * Cria um DTO a partir de um array
     *
     * @param array $data
     * @return self
     */
    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'] ?? null,
            cpf: $data['cpf'] ?? null,
            status: $data['status'] ?? null,
            error: $data['error'] ?? null
        );
    }
    
    /**
     * Converte o DTO para array
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'cpf' => $this->cpf,
            'status' => $this->status,
            'error' => $this->error,
        ];
    }

    public function hasError(): bool
    {
        return !empty($this->error);
    }
} 