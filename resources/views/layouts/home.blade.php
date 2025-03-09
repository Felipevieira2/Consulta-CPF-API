<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="scroll-smooth">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Consulta CPF API1') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    
    <!-- Styles -->
    <style>
        [x-cloak] { display: none !important; }
        body {
            font-family: 'Inter', sans-serif;
        }
    </style>
    
    @stack('styles')

    <!-- Script para inicializar o tema -->
    <script>
        // Verifica se há tema salvo no localStorage
        if (localStorage.getItem('color-theme') === 'dark' || 
            (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    </script>
</head>
<body class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen font-sans antialiased text-gray-900 dark:text-gray-100 transition-colors duration-200">
    <div class="min-h-screen bg-gray-50">
        <!-- Navigation -->
        <nav class="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors duration-200">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 flex items-center">
                            <a href="{{ route('home') }}" class="text-2xl font-bold text-indigo-600 dark:text-indigo-400 transition duration-300 hover:text-indigo-800 dark:hover:text-indigo-300">
                                Consulta CPF API
                            </a>
                        </div>
                        <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <a href="{{ route('features') }}" class="border-indigo-500 text-gray-900 dark:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition duration-200">
                                Recursos
                            </a>
                            <a href="{{ route('pricing') }}" class="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition duration-200">
                                Preços
                            </a>
                            <a href="{{ route('documentation') }}" class="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition duration-200">
                                Documentação
                            </a>
                            <a href="{{ route('contact') }}" class="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition duration-200">
                                Contato
                            </a>
                        </div>
                    </div>
                    <div class="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
                        <!-- Botão de alternância de tema -->
                        @include('components.theme-toggle')
                        
                        @auth
                            <a href="{{ route('admin.dashboard') }}" class="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition duration-200">
                                Dashboard
                            </a>
                            <div class="ml-3 relative">
                                <div>
                                    <button type="button" class="bg-white dark:bg-gray-800 rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                                        <span class="sr-only">Abrir menu do usuário</span>
                                        <img class="h-8 w-8 rounded-full" src="https://ui-avatars.com/api/?name={{ Auth::user()->name }}&color=7F9CF5&background=EBF4FF" alt="{{ Auth::user()->name }}">
                                    </button>
                                </div>
                                <div class="hidden origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1" id="user-menu">
                                    <a href="{{ route('admin.profile.edit') }}" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600" role="menuitem" tabindex="-1">
                                        Seu Perfil
                                    </a>
                                    <form method="POST" action="{{ route('logout') }}">
                                        @csrf
                                        <button type="submit" class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600" role="menuitem" tabindex="-1">
                                            Sair
                                        </button>
                                    </form>
                                </div>
                            </div>
                        @else
                            <a href="{{ route('login') }}" class="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition duration-200">
                                Login
                            </a>
                            <a href="{{ route('register') }}" class="bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
                                Registrar
                            </a>
                        @endauth
                    </div>
                    <div class="-mr-2 flex items-center sm:hidden">
                        <!-- Botão de alternância de tema para mobile -->
                        <div class="mr-2">
                            @include('components.theme-toggle')
                        </div>
                        
                        <button type="button" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition duration-200" id="mobile-menu-button">
                            <span class="sr-only">Abrir menu</span>
                            <i class="fas fa-bars"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Menu Mobile -->
            <div class="hidden sm:hidden" id="mobile-menu">
                <div class="pt-2 pb-3 space-y-1">
                    <a href="{{ route('home') }}" class="bg-indigo-50 dark:bg-indigo-900 border-indigo-500 text-indigo-700 dark:text-indigo-300 block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition duration-200">
                        Início
                    </a>
                    <a href="{{ route('features') }}" class="border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200 block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition duration-200">
                        Recursos
                    </a>
                    <a href="{{ route('pricing') }}" class="border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200 block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition duration-200">
                        Preços
                    </a>
                    <a href="{{ route('documentation') }}" class="border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200 block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition duration-200">
                        Documentação
                    </a>
                    <a href="{{ route('contact') }}" class="border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200 block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition duration-200">
                        Contato
                    </a>
                </div>
                <div class="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                    @auth
                        <div class="flex items-center px-4">
                            <div class="flex-shrink-0">
                                <img class="h-10 w-10 rounded-full" src="https://ui-avatars.com/api/?name={{ Auth::user()->name }}&color=7F9CF5&background=EBF4FF" alt="{{ Auth::user()->name }}">
                            </div>
                            <div class="ml-3">
                                <div class="text-base font-medium text-gray-800 dark:text-white">{{ Auth::user()->name }}</div>
                                <div class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ Auth::user()->email }}</div>
                            </div>
                        </div>
                        <div class="mt-3 space-y-1">
                            <a href="{{ route('admin.dashboard') }}" class="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200">
                                Dashboard
                            </a>
                            <a href="{{ route('admin.profile.edit') }}" class="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200">
                                Seu Perfil
                            </a>
                            <form method="POST" action="{{ route('logout') }}">
                                @csrf
                                <button type="submit" class="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200">
                                    Sair
                                </button>
                            </form>
                        </div>
                    @else
                        <div class="mt-3 space-y-1">
                            <a href="{{ route('login') }}" class="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200">
                                Login
                            </a>
                            <a href="{{ route('register') }}" class="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200">
                                Registrar
                            </a>
                        </div>
                    @endauth
                </div>
            </div>
        </nav>

        <!-- Page Content -->
        <main>
            @yield('content')
        </main>
    </div>

    <script>
        // Toggle do menu mobile
        document.getElementById('mobile-menu-button').addEventListener('click', function() {
            document.getElementById('mobile-menu').classList.toggle('hidden');
        });

        // Toggle do menu do usuário
        const userMenuButton = document.getElementById('user-menu-button');
        if (userMenuButton) {
            userMenuButton.addEventListener('click', function() {
                document.getElementById('user-menu').classList.toggle('hidden');
            });
        }
    </script>
    
    @stack('scripts')
</body>
</html>
