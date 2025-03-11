<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ config('app.name', 'API de Consulta CPF') }} - Painel Administrativo</title>
    @vite('resources/css/app.css')
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
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
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <style>
        [x-cloak] { display: none !important; }
    </style>
</head>
<body class="bg-gray-100 dark:bg-gray-900 min-h-screen font-sans antialiased text-gray-900 dark:text-gray-100 transition-colors duration-200">
    <div class="flex flex-col min-h-screen">
        <!-- Navbar -->
        @include('components.admin.navbar')
        
        <!-- Conteúdo Principal -->
        <main class="flex-grow py-6">
            @yield('content')
        </main>
        
        <!-- Footer -->
        @include('components.admin.footer')
    </div>
    
    <!-- Scripts -->
    <script>
        // Adicione aqui scripts globais para o painel administrativo
    </script>
</body>
</html>

