@extends('layouts.customer')

@section('content')
<style>
    @media (min-width: 1024px) {
        .sidebar-fixed {
            position: sticky;
            top: 20px;
            height: fit-content;
        }
        
        .content-container {
            display: flex;
            gap: 2rem;
        }
        
        .sidebar-container {
            width: 25%;
            flex-shrink: 0;
        }
        
        .main-content {
            width: 75%;
        }
    }
</style>

<div class="container mx-auto px-4 py-8">
    <!-- Cabeçalho com destaque -->
    <div class="mb-10 text-center">
        <h1 class="text-4xl font-bold mb-3">Documentação da API</h1>
        <p class="text-gray-600 dark:text-gray-400 text-xl max-w-3xl mx-auto">Guia completo para integração com nossa API de consulta de CPF</p>
        <div class="w-20 h-1 bg-blue-500 mx-auto mt-6"></div>
    </div>

    <!-- Navegação da Documentação com CSS personalizado -->
    <div class="content-container">
        <!-- Sidebar de Navegação -->
        <div class="sidebar-container">
            <div class="sidebar-fixed bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 class="text-lg font-bold mb-4 border-b pb-2 dark:border-gray-700">Conteúdo</h3>
                <nav class="space-y-1">
                    <a href="#autenticacao" class="block py-2 px-4 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 transition duration-150 border-l-4 border-transparent hover:border-blue-500">Autenticação</a>
                    <a href="#endpoints" class="block py-2 px-4 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 transition duration-150 border-l-4 border-transparent hover:border-blue-500">Endpoints</a>
                    <a href="#exemplos" class="block py-2 px-4 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 transition duration-150 border-l-4 border-transparent hover:border-blue-500">Exemplos</a>
                    <a href="#erros" class="block py-2 px-4 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 transition duration-150 border-l-4 border-transparent hover:border-blue-500">Códigos de Erro</a>
                    <a href="#limites" class="block py-2 px-4 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 transition duration-150 border-l-4 border-transparent hover:border-blue-500">Limites de Uso</a>
                </nav>
            </div>
        </div>

        <!-- Conteúdo Principal -->
        <div class="main-content">
            <div class="space-y-10">
                <!-- Autenticação -->
                <section id="autenticacao" style="padding: 24px;" class="bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-all hover:shadow-xl">
                    <div class="flex items-center mb-6">
                        <div
                            class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 dark:text-blue-300"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 class="text-2xl font-bold">Autenticação</h2>
                    </div>
                    <p class="mb-6 text-gray-700 dark:text-gray-300">Todas as requisições à API devem incluir sua chave de
                        API no cabeçalho de autorização:</p>
                    <div class="bg-gray-100 dark:bg-gray-900 p-5 rounded-lg mb-6 border-l-4 border-blue-500">
                        <code class="text-sm font-mono">Authorization: Bearer sua_chave_api</code>
                    </div>
                    <div class="flex items-start bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p class="text-sm text-gray-700 dark:text-gray-300">
                            Sua chave de API pode ser encontrada na página de configurações da sua conta.
                            Mantenha sua chave em segurança e não a compartilhe com terceiros.
                        </p>
                    </div>
                </section>

                <!-- Endpoints -->
                <section id="endpoints" style="padding: 24px;" 
                    class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-all hover:shadow-xl">
                    <div class="flex items-center mb-6">
                        <div
                            class="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600 dark:text-green-300"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 class="text-2xl font-bold">Endpoints</h2>
                    </div>

                    <!-- Consulta de CPF -->
                    <div class="mb-8">
                        <h3 class="text-xl font-semibold mb-4 text-green-700 dark:text-green-400">Consulta de CPF</h3>
                        <div class="bg-gray-100 dark:bg-gray-900 p-5 rounded-lg mb-6 border-l-4 border-green-500">
                            <p class="font-mono mb-2 font-bold">GET /api/v1/cpf/{cpf}</p>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Retorna informações detalhadas sobre o CPF
                                consultado</p>
                        </div>

                        <div class="mb-6">
                            <h4 class="font-semibold mb-3 flex items-center">
                                <span
                                    class="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-2 text-xs">P</span>
                                Parâmetros:
                            </h4>
                            <ul class="list-disc list-inside mb-4 space-y-2 ml-8 text-gray-700 dark:text-gray-300">
                                <li><code class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">cpf</code> (obrigatório) -
                                    CPF a ser consultado (apenas números)</li>
                            </ul>
                        </div>

                        <div>
                            <h4 class="font-semibold mb-3 flex items-center">
                                <span
                                    class="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-2 text-xs">R</span>
                                Resposta de Sucesso:
                            </h4>
                            <pre class="bg-gray-100 dark:bg-gray-900 p-5 rounded-lg overflow-x-auto border border-gray-200 dark:border-gray-700">
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
                    </div>
                </section>

                <!-- Exemplos -->
                <section id="exemplos" style="padding: 24px;"
                    class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-all hover:shadow-xl">
                    <div class="flex items-center mb-6">
                        <div
                            class="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600 dark:text-purple-300"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                        </div>
                        <h2 class="text-2xl font-bold">Exemplos de Integração</h2>
                    </div>

                    <!-- Tabs para exemplos -->
                    <div class="mb-6">
                        <div class="flex border-b dark:border-gray-700 mb-4">
                            <button
                                class="py-2 px-4 font-medium border-b-2 border-purple-500 text-purple-600 dark:text-purple-400">cURL</button>
                            <button class="py-2 px-4 font-medium text-gray-500 dark:text-gray-400">PHP</button>
                            <button class="py-2 px-4 font-medium text-gray-500 dark:text-gray-400">JavaScript</button>
                        </div>
                    </div>

                    <div class="flex items-start bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6 text-yellow-600 dark:text-yellow-400 mr-3 mt-0.5 flex-shrink-0" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p class="text-sm text-gray-700 dark:text-gray-300">
                            Caso necessite de limites maiores, entre em contato com nosso suporte ou considere fazer um
                            upgrade do seu plano.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    </div>
</div>
@endsection
