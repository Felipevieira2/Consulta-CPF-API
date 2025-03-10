<?php

namespace Tests\Unit;

use App\Repositories\CpfRepository\CpfRepositoryInterface;
use App\Services\CpfService\CpfService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Mockery;

class ConsultaCpfControllerTest extends TestCase
{
    /**
     * Testa a consulta de CPF com dados válidos
     */
    public function test_obter_dados_cpf_validos(): void
    {
        $cpf = '45083784807';
        $birthDate = '29031995';
        
        $response = $this->get("/api/v1/get-cpf?cpf={$cpf}&birth_date={$birthDate}&api_token=f7947e5e7347b7f956be5e3d60d3332bc02d020ba6099bf3a81f11af41c57beb");
        
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data' => [
                'cpf',
                'nome',
                'data_nascimento',
                'situacao_cadastral',
                'data_consulta',
            ]
        ]);
    }
    
    /**
     * Testa a validação de CPF inválido
     */
    public function test_cpf_invalido(): void
    {
        $cpf = '12345678901'; // CPF inválido
        
        $response = $this->get("/api/v1/get-cpf?cpf={$cpf}&api_token=f7947e5e7347b7f956be5e3d60d3332bc02d020ba6099bf3a81f11af41c57beb");
        
        $response->assertStatus(422);
        $response->assertJson([
            'success' => false,
        ]);
    }
    
    /**
     * Testa a autenticação com token inválido
     */
    public function test_token_invalido(): void
    {
        $cpf = '45083784807';
        
        $response = $this->get("/api/v1/get-cpf?cpf={$cpf}&api_token=token_invalido");
        
        $response->assertStatus(401);
    }
    
    /**
     * Testa o serviço de CPF com mock do repositório
     */
    public function test_cpf_service(): void
    {
        // Mock do repositório
        $mockRepository = Mockery::mock(CpfRepositoryInterface::class);
        $mockRepository->shouldReceive('consultarCpf')
            ->once()
            ->with('45083784807', '29031995')
            ->andReturn([
                'cpf' => '45083784807',
                'nome' => 'Nome Teste',
                'data_nascimento' => '29/03/1995',
                'situacao_cadastral' => 'REGULAR',
                'data_consulta' => now()->format('d/m/Y H:i:s'),
            ]);
        
        // Cria o serviço com o mock
        $service = new CpfService($mockRepository);
        
        // Testa o serviço
        $result = $service->getDadosCpf('45083784807', '29031995');
        
        $this->assertNotNull($result);
        $this->assertEquals('45083784807', $result->cpf);
        $this->assertEquals('Nome Teste', $result->nome);
    }
}
