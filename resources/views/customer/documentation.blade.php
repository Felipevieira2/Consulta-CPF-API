@extends('layouts.customer')

@section('content')
<div class="container mx-auto px-4">
    <!-- Cabeçalho -->
    <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">Documentação da API</h1>
        <p class="text-gray-600 dark:text-gray-400">Guia completo para integração com nossa API de consulta de CPF</p>
    </div>

    <!-- Navegação da Documentação -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Sidebar de Navegação -->
        <div class="lg:col-span-1">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-6">
                <nav class="space-y-2">
                    <a href="#autenticacao" class="block py-2 px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Autenticação</a>
                    <a href="#endpoints" class="block py-2 px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Endpoints</a>
                    <a href="#exemplos" class="block py-2 px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Exemplos</a>
                    <a href="#erros" class="block py-2 px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Códigos de Erro</a>
                    <a href="#limites" class="block py-2 px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Limites de Uso</a>
                </nav>
            </div>
        </div>

        <!-- Conteúdo Principal -->
        <div class="lg:col-span-3 space-y-8">
            <!-- Autenticação -->
            <section id="autenticacao" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 class="text-2xl font-bold mb-4">Autenticação</h2>
                <p class="mb-4">Todas as requisições à API devem incluir sua chave de API no cabeçalho de autorização:</p>
                <div class="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg mb-4">
                    <code class="text-sm">Authorization: Bearer sua_chave_api</code>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                    Sua chave de API pode ser encontrada na página de configurações da sua conta.
                    Mantenha sua chave em segurança e não a compartilhe com terceiros.
                </p>
            </section>

            <!-- Endpoints -->
            <section id="endpoints" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 class="text-2xl font-bold mb-4">Endpoints</h2>
                
                <!-- Consulta de CPF -->
                <div class="mb-6">
                    <h3 class="text-xl font-semibold mb-3">Consulta de CPF</h3>
                    <div class="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg mb-4">
                        <p class="font-mono mb-2">GET /api/v1/cpf/{cpf}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Retorna informações detalhadas sobre o CPF consultado</p>
                    </div>
                    
                    <h4 class="font-semibold mb-2">Parâmetros:</h4>
                    <ul class="list-disc list-inside mb-4 space-y-2">
                        <li><code>cpf</code> (obrigatório) - CPF a ser consultado (apenas números)</li>
                    </ul>

                    <h4 class="font-semibold mb-2">Resposta de Sucesso:</h4>
                    <pre class="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
{
    "status": "success",
    "data": {
        "cpf": "12345678900",
        "nome": "Nome do Titular",
        "situacao": "Regular",
        "data_consulta": "2024-03-10T15:30:00Z"
    }
}</pre>
                </div>
            </section>

            <!-- Exemplos -->
            <section id="exemplos" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 class="text-2xl font-bold mb-4">Exemplos de Integração</h2>

                <!-- cURL -->
                <div class="mb-6">
                    <h3 class="text-xl font-semibold mb-3">cURL</h3>
                    <pre class="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
curl -X GET \
  'https://api.exemplo.com/v1/cpf/12345678900' \
  -H 'Authorization: Bearer sua_chave_api'</pre>
                </div>

                <!-- PHP -->
                <div class="mb-6">
                    <h3 class="text-xl font-semibold mb-3">PHP</h3>
                    <pre class="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api.exemplo.com/v1/cpf/12345678900");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer sua_chave_api"
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);</pre>
                </div>
            </section>

            <!-- Códigos de Erro -->
            <section id="erros" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 class="text-2xl font-bold mb-4">Códigos de Erro</h2>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="text-left border-b dark:border-gray-700">
                                <th class="pb-3">Código</th>
                                <th class="pb-3">Descrição</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="border-b dark:border-gray-700">
                                <td class="py-3">400</td>
                                <td>CPF inválido ou mal formatado</td>
                            </tr>
                            <tr class="border-b dark:border-gray-700">
                                <td class="py-3">401</td>
                                <td>Chave de API inválida ou ausente</td>
                            </tr>
                            <tr class="border-b dark:border-gray-700">
                                <td class="py-3">403</td>
                                <td>Sem permissão para acessar este recurso</td>
                            </tr>
                            <tr class="border-b dark:border-gray-700">
                                <td class="py-3">429</td>
                                <td>Limite de requisições excedido</td>
                            </tr>
                            <tr>
                                <td class="py-3">500</td>
                                <td>Erro interno do servidor</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- Limites de Uso -->
            <section id="limites" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 class="text-2xl font-bold mb-4">Limites de Uso</h2>
                <p class="mb-4">Os limites de uso da API variam de acordo com seu plano:</p>
                <ul class="list-disc list-inside space-y-2">
                    <li>Máximo de requisições por minuto: {{ $rate_limit_per_minute }}</li>
                    <li>Máximo de requisições por dia: {{ $rate_limit_per_day }}</li>
                    <li>Máximo de requisições por mês: {{ $rate_limit_per_month }}</li>
                </ul>
                <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    Caso necessite de limites maiores, entre em contato com nosso suporte ou considere fazer um upgrade do seu plano.
                </p>
            </section>
        </div>
    </div>
</div>
@endsection 