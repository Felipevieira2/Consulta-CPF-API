@extends('layouts.home')

@section('content')
<div class="py-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <x-card>
            <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Documentação da API</h1>
            
            <div class="prose dark:prose-invert max-w-none">
                <h2 class="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">Introdução</h2>
                <p class="text-gray-700 dark:text-gray-300">
                    A API de Consulta CPF permite que você verifique informações associadas a um CPF de forma rápida e segura.
                    Esta documentação fornece todas as informações necessárias para integrar nossa API ao seu sistema.
                </p>
                
                <h2 class="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">Autenticação</h2>
                <p class="text-gray-700 dark:text-gray-300">
                    Todas as requisições à API devem incluir o token de API válida.
                </p>
                
                <div class="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4 my-4">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                            </svg>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm text-yellow-700 dark:text-yellow-200">
                                Nunca compartilhe seu token de API. Mantenha-a segura e não a inclua em código-fonte público.
                            </p>
                        </div>
                    </div>
                </div>
                
                <h2 class="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">Endpoints</h2>
                
                <h3 class="text-xl font-medium mt-6 mb-3 text-gray-900 dark:text-white">Consultar CPF</h3>
                <p class="text-gray-700 dark:text-gray-300"><strong>URL:</strong> <code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">https://api.consultacpf.com.br/v1/cpf?cpf={cpf}&date_birth={date_birth}&token={token}</code></p>
                <p class="text-gray-700 dark:text-gray-300"><strong>Método:</strong> GET</p>
                <p class="text-gray-700 dark:text-gray-300"><strong>Parâmetros:</strong></p>
                <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                    <li><code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">cpf</code> (obrigatório) - CPF a ser consultado (apenas números)</li>
                    <li><code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">date_birth</code> (obrigatório) - Data de nascimento (formato: YYYYMMDD)</li>
                    <li><code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">token</code> (obrigatório) - Token de API válido</li>
                </ul>
                
                <p class="text-gray-700 dark:text-gray-300"><strong>Exemplo de Requisição:</strong></p>
                <pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto text-gray-800 dark:text-gray-200">
                    <code>curl -X GET "https://api.consultacpf.com.br/v1/cpf?cpf=12345678909&date_birth=19800101&token=SUA_CHAVE_API"</code></pre>
                
                <p class="text-gray-700 dark:text-gray-300"><strong>Exemplo de Resposta:</strong></p>
                <pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto text-gray-800 dark:text-gray-200"><code>{
  "status": "success",
  "data": {
    "cpf": "123.456.789-09",
    "nome": "João da Silva",
    "data_nascimento": "1980-01-01",
    "situacao_cadastral": "Regular",
    "data_inscricao": "1995-05-10",
    "digito_verificador": "09"
  }
}</code></pre>
                
                <h3 class="text-xl font-medium mt-6 mb-3 text-gray-900 dark:text-white">Verificar Status da API</h3>
                <p class="text-gray-700 dark:text-gray-300"><strong>URL:</strong> <code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">https://api.consultacpf.com.br/v1/status</code></p>
                <p class="text-gray-700 dark:text-gray-300"><strong>Método:</strong> GET</p>
                
                <p class="text-gray-700 dark:text-gray-300"><strong>Exemplo de Requisição:</strong></p>
                <pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto text-gray-800 dark:text-gray-200"><code>curl -X GET "https://api.consultacpf.com.br/v1/status" \
-H "Authorization: Bearer SUA_CHAVE_API"</code></pre>
                
                <p class="text-gray-700 dark:text-gray-300"><strong>Exemplo de Resposta:</strong></p>
                <pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto text-gray-800 dark:text-gray-200"><code>{
  "status": "online",
  "version": "1.0.0",
  "message": "API funcionando normalmente"
}</code></pre>
                
                <h2 class="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">Códigos de Status</h2>
                <p class="text-gray-700 dark:text-gray-300">Nossa API retorna os seguintes códigos de status HTTP:</p>
                <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                    <li><code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">200 OK</code> - Requisição bem-sucedida</li>
                    <li><code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">400 Bad Request</code> - Parâmetros inválidos</li>
                    <li><code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">401 Unauthorized</code> - Chave de API inválida ou ausente</li>
                    <li><code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">404 Not Found</code> - CPF não encontrado</li>
                    <li><code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">429 Too Many Requests</code> - Limite de requisições excedido</li>
                    <li><code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">500 Internal Server Error</code> - Erro interno do servidor</li>
                </ul>
                
                <h2 class="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">Limites de Uso</h2>
                <p class="text-gray-700 dark:text-gray-300">
                    Os limites de uso dependem do seu plano. Consulte a página de 
                    <a href="{{ route('pricing') }}" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors duration-200">preços</a> 
                    para mais informações.
                </p>
                
                <h2 class="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">Suporte</h2>
                <p class="text-gray-700 dark:text-gray-300">
                    Se você tiver dúvidas ou precisar de ajuda, entre em 
                    <a href="{{ route('contact') }}" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors duration-200">contato</a> 
                    com nossa equipe de suporte.
                </p>
            </div>
        </x-card>
    </div>
</div>
@endsection 