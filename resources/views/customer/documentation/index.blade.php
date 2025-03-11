@extends('layouts.customer')

@section('content')
<div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Documentação da API</h1>
                <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                    Guia completo para integração com a API de Consulta CPF
                </p>
            </div>
            
            <div class="px-4 py-5 sm:p-6">
                <!-- Navegação da Documentação -->
                <div class="flex flex-col md:flex-row gap-6">
                    <div class="md:w-64 flex-shrink-0">
                        <nav class="space-y-1" aria-label="Sidebar">
                            <a href="#introducao" class="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                                <i class="fas fa-info-circle mr-3 text-gray-500 dark:text-gray-400"></i>
                                Introdução
                            </a>
                            <a href="#autenticacao" class="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                                <i class="fas fa-key mr-3 text-gray-500 dark:text-gray-400"></i>
                                Autenticação
                            </a>
                            <a href="#endpoints" class="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                                <i class="fas fa-plug mr-3 text-gray-500 dark:text-gray-400"></i>
                                Endpoints
                            </a>
                            <a href="#exemplos" class="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                                <i class="fas fa-code mr-3 text-gray-500 dark:text-gray-400"></i>
                                Exemplos de Código
                            </a>
                            <a href="#erros" class="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                                <i class="fas fa-exclamation-triangle mr-3 text-gray-500 dark:text-gray-400"></i>
                                Tratamento de Erros
                            </a>
                            <a href="#limites" class="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                                <i class="fas fa-tachometer-alt mr-3 text-gray-500 dark:text-gray-400"></i>
                                Limites de Uso
                            </a>
                        </nav>
                    </div>
                    
                    <div class="flex-1">
                        <!-- Introdução -->
                        <div id="introducao" class="mb-10">
                            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Introdução</h2>
                            <p class="text-gray-700 dark:text-gray-300 mb-4">
                                Bem-vindo à documentação da API de Consulta CPF. Nossa API permite que você consulte informações de CPF de forma rápida e segura, integrando facilmente com seu sistema.
                            </p>
                            <p class="text-gray-700 dark:text-gray-300 mb-4">
                                A API utiliza o padrão REST e retorna dados no formato JSON, sendo compatível com qualquer linguagem de programação que suporte requisições HTTP.
                            </p>
                            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                                <p class="text-sm text-gray-700 dark:text-gray-300">
                                    <strong>URL Base:</strong> <code class="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded">{{ config('app.url') }}/api/v1</code>
                                </p>
                            </div>
                        </div>
                        
                        <!-- Autenticação -->
                        <div id="autenticacao" class="mb-10">
                            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Autenticação</h2>
                            <p class="text-gray-700 dark:text-gray-300 mb-4">
                                Todas as requisições à API devem ser autenticadas utilizando sua chave de API (API Key). A chave deve ser enviada no cabeçalho de cada requisição.
                            </p>
                            
                            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mb-4">
                                <p class="text-sm text-gray-700 dark:text-gray-300 mb-2">
                                    <strong>Sua API Key:</strong> 
                                </p>
                                <div class="flex items-center">
                                    <code id="api-key" class="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded flex-1 overflow-x-auto">{{ $apiKey }}</code>
                                    <button onclick="copyApiKey()" class="ml-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                                        <i class="fas fa-copy"></i>
                                    </button>
                                </div>
                            </div>
                            
                            <p class="text-gray-700 dark:text-gray-300 mb-4">
                                Exemplo de como incluir a chave no cabeçalho da requisição:
                            </p>
                            
                            <div class="bg-gray-800 text-gray-200 p-4 rounded-md overflow-x-auto">
<pre><code>curl -X GET "{{ config('app.url') }}/api/v1/cpf/12345678909" \
-H "Authorization: Bearer {{ $apiKey }}" \
-H "Accept: application/json"</code></pre>
                            </div>
                        </div>
                        
                        <!-- Endpoints -->
                        <div id="endpoints" class="mb-10">
                            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Endpoints</h2>
                            
                            <div class="mb-6">
                                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Consultar CPF</h3>
                                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mb-4">
                                    <p class="text-sm text-gray-700 dark:text-gray-300">
                                        <strong>GET</strong> <code class="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded">/api/v1/cpf/{cpf}</code>
                                    </p>
                                </div>
                                
                                <p class="text-gray-700 dark:text-gray-300 mb-2">
                                    Retorna informações detalhadas sobre o CPF consultado.
                                </p>
                                
                                <h4 class="text-md font-medium text-gray-900 dark:text-white mt-4 mb-2">Parâmetros:</h4>
                                <div class="overflow-x-auto">
                                    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead class="bg-gray-50 dark:bg-gray-800">
                                            <tr>
                                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Parâmetro</th>
                                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tipo</th>
                                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Descrição</th>
                                            </tr>
                                        </thead>
                                        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                            <tr>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">cpf</td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">string</td>
                                                <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">CPF a ser consultado (apenas números)</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                
                                <h4 class="text-md font-medium text-gray-900 dark:text-white mt-4 mb-2">Resposta:</h4>
                                <div class="bg-gray-800 text-gray-200 p-4 rounded-md overflow-x-auto">
<pre><code>{
  "status": "success",
  "data": {
    "cpf": "123.456.789-09",
    "nome": "NOME DO TITULAR",
    "situacao": "REGULAR",
    "data_nascimento": "01/01/1980",
    "data_inscricao": "01/01/2000",
    "digito_verificador": "00"
  }
}</code></pre>
                                </div>
                            </div>
                            
                            <div class="mb-6">
                                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Verificar Saldo</h3>
                                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mb-4">
                                    <p class="text-sm text-gray-700 dark:text-gray-300">
                                        <strong>GET</strong> <code class="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded">/api/v1/credits</code>
                                    </p>
                                </div>
                                
                                <p class="text-gray-700 dark:text-gray-300 mb-2">
                                    Retorna informações sobre o saldo de créditos disponível em sua conta.
                                </p>
                                
                                <h4 class="text-md font-medium text-gray-900 dark:text-white mt-4 mb-2">Resposta:</h4>
                                <div class="bg-gray-800 text-gray-200 p-4 rounded-md overflow-x-auto">
<pre><code>{
  "status": "success",
  "data": {
    "available_credits": 1000,
    "used_credits": 250,
    "total_credits": 1250,
    "plan": "Profissional",
    "next_billing_date": "2023-12-01"
  }
}</code></pre>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Exemplos de Código -->
                        <div id="exemplos" class="mb-10">
                            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Exemplos de Código</h2>
                            
                            <!-- PHP -->
                            <div class="mb-6">
                                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">PHP</h3>
                                <div class="bg-gray-800 text-gray-200 p-4 rounded-md overflow-x-auto">
<pre><code>$apiKey = '{{ $apiKey }}';
$cpf = '12345678909';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "{{ config('app.url') }}/api/v1/cpf/{$cpf}");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer {$apiKey}",
    "Accept: application/json"
]);

$response = curl_exec($ch);
$data = json_decode($response, true);

if (isset($data['status']) && $data['status'] === 'success') {
    // Processar os dados
    $nome = $data['data']['nome'];
    $situacao = $data['data']['situacao'];
    // ...
} else {
    // Tratar erro
    $erro = $data['message'] ?? 'Erro desconhecido';
}

curl_close($ch);</code></pre>
                                </div>
                            </div>
                            
                            <!-- JavaScript -->
                            <div class="mb-6">
                                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">JavaScript (Fetch API)</h3>
                                <div class="bg-gray-800 text-gray-200 p-4 rounded-md overflow-x-auto">
<pre><code>const apiKey = '{{ $apiKey }}';
const cpf = '12345678909';

fetch(`{{ config('app.url') }}/api/v1/cpf/${cpf}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Accept': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  if (data.status === 'success') {
    // Processar os dados
    const nome = data.data.nome;
    const situacao = data.data.situacao;
    // ...
  } else {
    // Tratar erro
    const erro = data.message || 'Erro desconhecido';
  }
})
.catch(error => {
  console.error('Erro na requisição:', error);
});</code></pre>
                                </div>
                            </div>
                            
                            <!-- Python -->
                            <div class="mb-6">
                                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Python (Requests)</h3>
                                <div class="bg-gray-800 text-gray-200 p-4 rounded-md overflow-x-auto">
<pre><code>import requests

api_key = '{{ $apiKey }}'
cpf = '12345678909'

headers = {
    'Authorization': f'Bearer {api_key}',
    'Accept': 'application/json'
}

response = requests.get(f'{{ config('app.url') }}/api/v1/cpf/{cpf}', headers=headers)
data = response.json()

if data.get('status') == 'success':
    # Processar os dados
    nome = data['data']['nome']
    situacao = data['data']['situacao']
    # ...
else:
    # Tratar erro
    erro = data.get('message', 'Erro desconhecido')</code></pre>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Tratamento de Erros -->
                        <div id="erros" class="mb-10">
                            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Tratamento de Erros</h2>
                            
                            <p class="text-gray-700 dark:text-gray-300 mb-4">
                                A API utiliza códigos de status HTTP padrão para indicar o sucesso ou falha de uma requisição. Em caso de erro, o corpo da resposta conterá informações detalhadas sobre o problema.
                            </p>
                            
                            <div class="overflow-x-auto">
                                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead class="bg-gray-50 dark:bg-gray-800">
                                        <tr>
                                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Código</th>
                                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Descrição</th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                        <tr>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">200 OK</td>
                                            <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">A requisição foi bem-sucedida.</td>
                                        </tr>
                                        <tr>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">400 Bad Request</td>
                                            <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">A requisição contém parâmetros inválidos ou está mal formatada.</td>
                                        </tr>
                                        <tr>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">401 Unauthorized</td>
                                            <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">Autenticação falhou ou não foi fornecida.</td>
                                        </tr>
                                        <tr>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">403 Forbidden</td>
                                            <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">Você não tem permissão para acessar este recurso.</td>
                                        </tr>
                                        <tr>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">404 Not Found</td>
                                            <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">O recurso solicitado não foi encontrado.</td>
                                        </tr>
                                        <tr>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">429 Too Many Requests</td>
                                            <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">Você excedeu o limite de requisições permitido.</td>
                                        </tr>
                                        <tr>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">500 Internal Server Error</td>
                                            <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">Ocorreu um erro no servidor.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            
                            <h3 class="text-lg font-medium text-gray-900 dark:text-white mt-6 mb-2">Exemplo de Resposta de Erro</h3>
                            <div class="bg-gray-800 text-gray-200 p-4 rounded-md overflow-x-auto">
<pre><code>{
  "status": "error",
  "message": "CPF inválido ou não encontrado",
  "error_code": "invalid_cpf"
}</code></pre>
                            </div>
                        </div>
                        
                        <!-- Limites de Uso -->
                        <div id="limites" class="mb-10">
                            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Limites de Uso</h2>
                            
                            <p class="text-gray-700 dark:text-gray-300 mb-4">
                                O número de requisições que você pode fazer à API depende do seu plano de assinatura. Cada consulta de CPF consome 1 crédito do seu saldo.
                            </p>
                            
                            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mb-4">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Seu plano atual:</p>
                                        <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ $plan->name }}</p>
                                    </div>
                                    <div>
                                        <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Créditos disponíveis:</p>
                                        <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ $availableCredits }}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <p class="text-gray-700 dark:text-gray-300 mb-4">
                                Caso você exceda o limite de requisições, receberá um erro 429 (Too Many Requests). Para aumentar seu limite, considere fazer upgrade do seu plano.
                            </p>
                            
                            <div class="mt-6">
                                <a href="{{ route('customer.plan') }}" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    <i class="fas fa-arrow-up mr-2"></i> Fazer Upgrade do Plano
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    function copyApiKey() {
        const apiKey = document.getElementById('api-key').textContent;
        navigator.clipboard.writeText(apiKey).then(() => {
            alert('API Key copiada para a área de transferência!');
        }).catch(err => {
            console.error('Erro ao copiar: ', err);
        });
    }
    
    // Scroll suave para as âncoras
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
</script>
@endsection 