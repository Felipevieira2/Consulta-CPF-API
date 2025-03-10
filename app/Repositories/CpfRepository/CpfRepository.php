<?php

namespace App\Repositories\CpfRepository;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class CpfRepository implements CpfRepositoryInterface
{
    /**
     * Tempo de cache em minutos
     */
    protected const CACHE_TIME = 60;

    /**
     * Consulta dados de um CPF
     *
     * @param string $cpf
     * @param string|null $birthDate
     * @return array|null
     */
    public function consultarCpf(string $cpf, ?string $birthDate = null): ?array
    {
        $cacheKey = "cpf_{$cpf}";
        
        // Verifica se os dados estão em cache
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }
        
        try {
            // Em produção, aqui seria a chamada real para a API da Receita Federal
            // ou outro serviço de consulta de CPF
            // $result = $this->simulateCpfLookup($cpf, $birthDate);
            $result = $this->receitaFederalService->getDadosCpf($cpf, $birthDate);
            
            // Armazena em cache
            Cache::put($cacheKey, $result, self::CACHE_TIME);
            
            return $result;
        } catch (\Exception $e) {
            Log::error('Erro ao consultar CPF: ' . $e->getMessage(), [
                'cpf' => $cpf,
                'exception' => $e
            ]);
            
            return null;
        }
    }
    
    /**
     * Simula uma consulta de CPF para fins de teste
     * Em produção, este método seria substituído pela chamada real à API
     *
     * @param string $cpf
     * @param string|null $birthDate
     * @return array
     */
    private function simulateCpfLookup(string $cpf, ?string $birthDate = null): array
    {
        // Formata a data de nascimento se fornecida
        $formattedBirthDate = null;
        if ($birthDate) {
            // Assume formato ddmmyyyy
            $day = substr($birthDate, 0, 2);
            $month = substr($birthDate, 2, 2);
            $year = substr($birthDate, 4, 4);
            $formattedBirthDate = "{$day}/{$month}/{$year}";
        }
        
        return [
            'cpf' => $cpf,
            'nome' => 'Nome Simulado para Testes',
            'data_nascimento' => $formattedBirthDate ?? '01/01/1990',
            'situacao_cadastral' => 'REGULAR',
            'data_consulta' => now()->format('d/m/Y H:i:s'),
        ];
    }
} 