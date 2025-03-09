<nav class="bg-white shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
            <div class="flex items-center">
                <div class="flex-shrink-0 flex items-center">
                    <a href="{{ route('home') }}">
                        <span class="text-indigo-600 text-xl font-bold">CPF API</span>
                    </a>
                </div>
                <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <a href="{{ route('home') }}" class="{{ request()->routeIs('home') ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700' }} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                        Início
                    </a>
                    <a href="{{ route('features') }}" class="{{ request()->routeIs('features') ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700' }} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                        Recursos
                    </a>
                    <a href="{{ route('pricing') }}" class="{{ request()->routeIs('pricing') ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700' }} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                        Preços
                    </a>
                    <a href="{{ route('contact') }}" class="{{ request()->routeIs('contact') ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700' }} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                        Contato
                    </a>
                </div>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
                @auth
                    <a href="{{ route('admin.dashboard') }}" class="text-gray-700 hover:text-indigo-600">Minha Conta</a>
                @else
                    <a href="{{ route('login') }}" class="text-gray-700 hover:text-indigo-600">Entrar</a>
                    <a href="{{ route('register') }}" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                        Começar Agora
                    </a>
                @endauth
            </div>
            <div class="-mr-2 flex items-center sm:hidden">
                <button type="button" class="mobile-menu-button inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <span class="sr-only">Abrir menu</span>
                    <i class="fas fa-bars"></i>
                </button>
            </div>
        </div>
    </div>
    
    <!-- Mobile menu -->
    <div class="hidden mobile-menu sm:hidden">
        <div class="pt-2 pb-3 space-y-1">
            <a href="{{ route('home') }}" class="{{ request()->routeIs('home') ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700' }} block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                Início
            </a>
            <a href="{{ route('features') }}" class="{{ request()->routeIs('features') ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700' }} block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                Recursos
            </a>
            <a href="{{ route('pricing') }}" class="{{ request()->routeIs('pricing') ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700' }} block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                Preços
            </a>
            <a href="{{ route('contact') }}" class="{{ request()->routeIs('contact') ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700' }} block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                Contato
            </a>
        </div>
        <div class="pt-4 pb-3 border-t border-gray-200">
            @auth
                <a href="{{ route('admin.dashboard') }}" class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                    Minha Conta
                </a>
            @else
                <a href="{{ route('login') }}" class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                    Entrar
                </a>
                <a href="{{ route('register') }}" class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                    Registrar
                </a>
            @endauth
        </div>
    </div>
</nav> 