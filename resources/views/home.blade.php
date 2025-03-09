@extends('layouts.home')

@section('content')
<div class="relative min-h-screen bg-gradient-to-b from-indigo-100 to-white dark:from-gray-900 dark:to-gray-800 dark:text-white transition-colors duration-300">
  
    <!-- Hero Section -->
    <div class="pt-16 pb-20 md:pt-24 md:pb-32">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                    <span class="block">Consulta CPF API</span>
                    <span class="block text-indigo-600 dark:text-indigo-400">Rápida, Segura e Confiável</span>
                </h1>
                <p class="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                    Acesse dados de CPF em tempo real com nossa API de alta performance. Integração simples, dados precisos.
                </p>
                <div class="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8 space-y-4 sm:space-y-0 sm:space-x-4">
                    <a href="{{ route('register') }}" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 md:py-4 md:text-lg md:px-10 transition duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                        Começar Agora
                    </a>
                    <a href="{{ route('documentation') }}" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 md:py-4 md:text-lg md:px-10 transition duration-300 shadow-md">
                        Documentação
                    </a>
                </div>
            </div>
        </div>
    </div>

    <!-- Features Section -->
    <div class="py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="lg:text-center">
                <h2 class="text-base text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide uppercase">Recursos</h2>
                <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                    Tudo que você precisa para validar CPFs
                </p>
                <p class="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
                    Nossa API oferece uma solução completa para consulta e validação de CPF.
                </p>
            </div>

            <div class="mt-12">
                <dl class="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-12">
                    <div class="relative p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-300">
                        <dt>
                            <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white shadow-lg">
                                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <p class="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">Alta Performance</p>
                        </dt>
                        <dd class="mt-2 ml-16 text-base text-gray-500 dark:text-gray-300">
                            Respostas em milissegundos, com alta disponibilidade e baixa latência.
                        </dd>
                    </div>

                    <div class="relative p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-300">
                        <dt>
                            <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white shadow-lg">
                                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <p class="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">Segurança Avançada</p>
                        </dt>
                        <dd class="mt-2 ml-16 text-base text-gray-500 dark:text-gray-300">
                            Autenticação via API keys e HTTPS para garantir a segurança das suas consultas.
                        </dd>
                    </div>

                    <div class="relative p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-300">
                        <dt>
                            <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white shadow-lg">
                                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                            </div>
                            <p class="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">Suporte Técnico</p>
                        </dt>
                        <dd class="mt-2 ml-16 text-base text-gray-500 dark:text-gray-300">
                            Conte com nossa equipe de suporte para ajudar em qualquer dúvida ou problema.
                        </dd>
                    </div>

                    <div class="relative p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-300">
                        <dt>
                            <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white shadow-lg">
                                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <p class="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">Dados Confiáveis</p>
                        </dt>
                        <dd class="mt-2 ml-16 text-base text-gray-500 dark:text-gray-300">
                            Informações precisas e atualizadas para suas consultas de CPF.
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    </div>

    <!-- API Demo Section -->
    <div class="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="lg:text-center mb-12">
                <h2 class="text-base text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide uppercase">Demonstração</h2>
                <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                    Veja como é fácil usar nossa API
                </p>
                <p class="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
                    Consulte CPFs com apenas algumas linhas de código.
                </p>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div class="flex flex-col md:flex-row">
                    <div class="w-full md:w-1/2 p-6 md:p-8">
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Exemplo de Requisição</h3>
                        <div class="bg-gray-800 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto">
                            <pre class="text-sm text-gray-300"><code>
curl -X GET 
"https://api.cpfapi.com.br/v1/cpf?cpf=12345678900&date_birth=19800101" \
-H "Authorization: Bearer seu_token"</code></pre>
                        </div>
                    </div>
                    <div class="p-6 md:p-8 bg-gray-50 dark:bg-gray-700">
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Resposta</h3>
                        <div class="bg-gray-800 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto">
                            <pre class="text-sm text-gray-300"><code>{
  "status": "success",
  "data": {
    "cpf": "123.456.789-00",
    "situacao": "regular",
    "nome": "João da Silva",
    "data_nascimento": "1980-01-01"
  }
}</code></pre>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-10 text-center">
                <a href="{{ route('documentation') }}" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 transition duration-300 shadow-md">
                    Ver Documentação Completa
                    <svg class="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </a>
            </div>
        </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-indigo-700 dark:bg-indigo-800 transition-colors duration-300">
        <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 class="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                <span class="block">Pronto para começar?</span>
                <span class="block text-indigo-200">Teste nossa API de CPF gratuitamente por 7 dias.</span>
            </h2>
            <div class="mt-8 flex flex-col sm:flex-row lg:mt-0 lg:flex-shrink-0 space-y-4 sm:space-y-0 sm:space-x-4">
                <a href="{{ route('register') }}" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 dark:hover:bg-gray-100 transition duration-300 shadow-md">
                    Testar Grátis
                </a>
                <a href="{{ route('documentation') }}" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 transition duration-300 shadow-md">
                    Ver Documentação
                </a>
            </div>
        </div>
    </div>
</div>

<!-- Script para alternar entre os temas -->
<script>
    document.addEventListener('DOMContentLoaded', function() {
        const themeToggle = document.getElementById('theme-toggle');
        
        // Verifica se há preferência salva
        if (localStorage.getItem('theme') === 'dark' || 
            (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        
        // Adiciona evento de clique para alternar o tema
        themeToggle.addEventListener('click', function() {
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    });
</script>
@endsection 