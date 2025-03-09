@extends('layouts.home')

@section('content')
<div class="py-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div class="text-center mb-12">
            <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
                <span class="block">Recursos Poderosos</span>
                <span class="block text-indigo-600 dark:text-indigo-400">para suas Consultas de CPF</span>
            </h1>
            <p class="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
                Conheça as ferramentas e funcionalidades que tornam nossa API a escolha ideal para sua empresa.
            </p>
        </div>

        <!-- Cards de recursos com ícones -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            <!-- Consulta Rápida -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transform transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
                <div class="p-6">
                    <div class="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mb-4">
                        <svg class="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                    </div>
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Consulta Rápida</h2>
                    <p class="text-gray-600 dark:text-gray-300">
                        Obtenha resultados de consulta de CPF em milissegundos, com alta disponibilidade e baixa latência. Nossa infraestrutura garante respostas instantâneas mesmo em momentos de pico.
                    </p>
                </div>
            </div>

            <!-- Dados Completos -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transform transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
                <div class="p-6">
                    <div class="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mb-4">
                        <svg class="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                    </div>
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Dados Completos</h2>
                    <p class="text-gray-600 dark:text-gray-300">
                        Receba informações detalhadas associadas ao CPF consultado, incluindo nome completo, data de nascimento, situação cadastral e muito mais para validações precisas.
                    </p>
                </div>
            </div>

            <!-- API RESTful -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transform transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
                <div class="p-6">
                    <div class="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mb-4">
                        <svg class="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                        </svg>
                    </div>
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">API RESTful</h2>
                    <p class="text-gray-600 dark:text-gray-300">
                        Interface simples e padronizada seguindo os princípios REST, fácil de integrar em qualquer plataforma, linguagem ou framework de sua preferência.
                    </p>
                </div>
            </div>

            <!-- Segurança Avançada -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transform transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
                <div class="p-6">
                    <div class="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mb-4">
                        <svg class="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                    </div>
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Segurança Avançada</h2>
                    <p class="text-gray-600 dark:text-gray-300">
                        Autenticação via API keys e HTTPS para garantir a segurança das suas consultas e dados. Todas as informações são criptografadas e protegidas conforme as melhores práticas.
                    </p>
                </div>
            </div>

            <!-- Dashboard Intuitivo -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transform transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
                <div class="p-6">
                    <div class="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mb-4">
                        <svg class="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                    </div>
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Dashboard Intuitivo</h2>
                    <p class="text-gray-600 dark:text-gray-300">
                        Acompanhe seu uso, gerencie suas chaves de API e visualize estatísticas em um painel administrativo completo. Tenha controle total sobre suas consultas e gastos.
                    </p>
                </div>
            </div>

            <!-- Suporte Técnico -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transform transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
                <div class="p-6">
                    <div class="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mb-4">
                        <svg class="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
                        </svg>
                    </div>
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Suporte Técnico</h2>
                    <p class="text-gray-600 dark:text-gray-300">
                        Conte com nossa equipe de suporte para ajudar em qualquer dúvida ou problema durante a integração. Atendimento rápido e especializado para resolver suas questões.
                    </p>
                </div>
            </div>
        </div>

        <!-- Seção de destaques adicionais - Corrigido o espaçamento -->
        <div class="pt-16 pb-8" style="margin-top: 4rem;">
            <div class="bg-indigo-700 dark:bg-indigo-900 rounded-2xl shadow-xl overflow-hidden">
                <div class="px-6 py-12 sm:px-12 lg:px-16">
                    <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        <div class="lg:self-center">
                            <h2 class="text-3xl font-extrabold text-white sm:text-4xl">
                                <span class="block">Pronto para começar?</span>
                                <span class="block">Experimente nossa API hoje mesmo.</span>
                            </h2>
                            <p class="mt-4 text-lg leading-6 text-indigo-200">
                                Escolha o plano que melhor atende às suas necessidades e comece a utilizar nossa API de consulta de CPF em minutos.
                            </p>
                            <div class="mt-8 flex space-x-4">
                                <a href="{{ route('pricing') }}" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 transition-colors duration-200 cursor-pointer">
                                    Ver planos
                                </a>
                                <a href="{{ route('register') }}" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 bg-opacity-60 hover:bg-opacity-70 transition-colors duration-200 cursor-pointer">
                                    Criar conta
                                </a>
                            </div>
                        </div>
                        <div class="lg:self-center">
                            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Exemplo de Resposta da API</h3>
                                <pre class="bg-gray-100 dark:bg-gray-900 p-4 rounded text-sm overflow-x-auto text-gray-800 dark:text-gray-300">
{
  "status": "success",
  "data": {
    "cpf": "123.456.789-00",
    "nome": "João da Silva",
    "data_nascimento": "01/01/1980",
    "situacao_cadastral": "Regular",
    "data_consulta": "2023-06-15T14:30:45Z"
  }
}</pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Seção de FAQ - Corrigido o espaçamento -->
        <div class="pt-8 pb-8" style="margin-top: 4rem;">
            <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white text-center mb-8">
                Perguntas Frequentes
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-100 dark:border-gray-700">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Como integrar a API ao meu sistema?</h3>
                    <p class="text-gray-600 dark:text-gray-300">
                        A integração é simples e pode ser feita em qualquer linguagem de programação que suporte requisições HTTP. Fornecemos bibliotecas para as principais linguagens e documentação detalhada.
                    </p>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-100 dark:border-gray-700">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Quais dados são retornados na consulta?</h3>
                    <p class="text-gray-600 dark:text-gray-300">
                        Dependendo do seu plano, você pode receber nome completo, data de nascimento, situação cadastral, endereço e outras informações associadas ao CPF consultado.
                    </p>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-100 dark:border-gray-700">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">A API é segura para dados sensíveis?</h3>
                    <p class="text-gray-600 dark:text-gray-300">
                        Sim, utilizamos criptografia de ponta a ponta e seguimos todas as normas de segurança e privacidade. Seus dados e consultas estão protegidos em nossa plataforma.
                    </p>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-100 dark:border-gray-700">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Posso testar a API antes de contratar?</h3>
                    <p class="text-gray-600 dark:text-gray-300">
                        Oferecemos um período de teste gratuito para que você possa avaliar a qualidade e a velocidade do nosso serviço antes de escolher um plano.
                    </p>
                </div>
            </div>
        </div>

        <!-- CTA Final - Corrigido o espaçamento -->
        <div class="pt-8 pb-8 text-center" style="margin-top: 4rem;">
            <a href="{{ route('pricing') }}" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-200 cursor-pointer">
                Ver Planos e Preços
            </a>
        </div>
    </div>
</div>
@endsection
