<?php

namespace App\DTOs;

class CpfResponseDTO
{
    public function __construct(
        public readonly string $cpf,
        public readonly string $nome,
        public readonly string $data_nascimento,
        public readonly string $situacaoCadastral,
        public readonly string $dataConsulta,
        public readonly string $data_inscricao,
        public readonly string $digito_verificador,
        public readonly string $hora_emissao,
        public readonly string $data_emissao,
        public readonly string $codigo_controle
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
            cpf: $data['cpf'] ?? '',
            nome: $data['nome'] ?? '',
            data_nascimento: $data['data_nascimento'] ?? '',
            situacaoCadastral: $data['situacao_cadastral'] ?? '',
            dataConsulta: $data['data_consulta'] ?? now()->format('d/m/Y H:i:s'),
            data_inscricao: $data['data_inscricao'] ?? '',
            digito_verificador: $data['digito_verificador'] ?? '',
            hora_emissao: $data['hora_emissao'] ?? '',
            data_emissao: $data['data_emissao'] ?? '',
            codigo_controle: $data['codigo_controle'] ?? ''
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
            'cpf' => $this->cpf,
            'nome' => $this->nome,
            'data_nascimento' => $this->data_nascimento,
            'situacao_cadastral' => $this->situacaoCadastral,
            'data_consulta' => $this->dataConsulta,
            'data_inscricao' => $this->data_inscricao,
            'digito_verificador' => $this->digito_verificador,
            'hora_emissao' => $this->hora_emissao,
            'data_emissao' => $this->data_emissao,
            'codigo_controle' => $this->codigo_controle
        ];
    }
} 