<?php

namespace App\DTOs;

class CpfResponseDTO
{
    public function __construct(
        public readonly string $cpf,
        public readonly string $nome,
        public readonly string $data_nascimento,
        public readonly string $situacao_cadastral,
        public readonly string $data_inscricao,
        public readonly string $digito_verificador,
        public readonly string $hora_emissao,
        public readonly string $data_emissao,
        public readonly string $codigo_controle,
        public readonly ?string $error = null,
        public readonly ?string $type = null,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            cpf: $data['cpf'] ?? '',
            nome: $data['nome'] ?? '',
            data_nascimento: $data['data_nascimento'] ?? '',
            situacao_cadastral: $data['situacao_cadastral'] ?? '',
            data_inscricao: $data['data_inscricao'] ?? '',
            digito_verificador: $data['digito_verificador'] ?? '',
            hora_emissao: $data['hora_emissao'] ?? '',
            data_emissao: $data['data_emissao'] ?? '',
            codigo_controle: $data['codigo_controle'] ?? '',
            error: $data['error'] ?? null,
            type: $data['type'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'cpf' => $this->cpf,
            'nome' => $this->nome,
            'data_nascimento' => $this->data_nascimento,
            'situacao_cadastral' => $this->situacao_cadastral,
            'data_inscricao' => $this->data_inscricao,
            'digito_verificador' => $this->digito_verificador,
            'hora_emissao' => $this->hora_emissao,
            'data_emissao' => $this->data_emissao,
            'codigo_controle' => $this->codigo_controle,
            'error' => $this->error,
            'type' => $this->type,
        ];
    }

    public function hasError(): bool
    {
        return !empty($this->error);
    }
} 