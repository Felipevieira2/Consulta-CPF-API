<!-- Teste de exibição -->
<nav class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
            <div class="flex">
                <!-- Logo -->
                <div class="flex-shrink-0 flex items-center">
                    <a href="{{ route('customer.dashboard') }}" class="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                        {{ env('APP_NAME', 'getcpf') }}
                    </a>
                </div>
                
                <!-- Links de Navegação -->
                <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <a href="{{ route('customer.dashboard') }}" class="{{ request()->routeIs('customer.dashboard') ? 'border-indigo-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200' }} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                        <i class="fas fa-tachometer-alt mr-2"></i> Dashboard
                    </a>
                    
                    <a href="{{ route('customer.documentation') }}" class="{{ request()->routeIs('customer.documentation') ? 'border-indigo-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200' }} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                        <i class="fas fa-book mr-2"></i> Documentação
                    </a>
                    
                    <a href="{{ route('customer.api-log.index') }}" class="{{ request()->routeIs('customer.api-log.index') ? 'border-indigo-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200' }} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                        <i class="fas fa-history mr-2"></i> Histórico de Consultas
                    </a>
                    
                    <a href="{{ route('customer.billing.index') }}" class="{{ request()->routeIs('customer.billing.*') ? 'border-indigo-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200' }} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                        <i class="fas fa-credit-card mr-2"></i> Cobrança
                    </a>
                </div>
            </div>
            
            <!-- Menu do Usuário -->
            <div class="hidden sm:ml-6 sm:flex sm:items-center cursor-pointer">
                {{-- <!-- Botão de Tema -->
                <button id="theme-toggle" type="button" class="text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 mr-2">
                    <i class="fas fa-sun" id="theme-toggle-light-icon"></i>
                    <i class="fas fa-moon hidden" id="theme-toggle-dark-icon"></i>
                </button> --}}
                
                <!-- Dropdown do Perfil -->
                <div class="ml-3 relative cursor-pointer">
                    <div>
                        <button type="button" class="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                            <span class="sr-only">Abrir menu do usuário</span>
                            <div class="h-8 w-8 rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white">
                                {{ substr(auth()->user()->name ?? 'U', 0, 1) }}
                            </div>
                        </button>
                    </div>
                    
                    <!-- Dropdown menu -->
                    <div class="hidden origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1" id="user-menu">
                        @auth
                            <div class="block px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                                <p class="font-medium">{{ auth()->user()->name }}</p>
                                <p class="text-xs">{{ auth()->user()->email }}</p>
                            </div>
                            
                            <a href="{{ route('customer.profile') }}" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">
                                <i class="fas fa-user-circle mr-2"></i> Meu Perfil
                            </a>
                            
                            <a href="{{ route('customer.settings') }}" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">
                                <i class="fas fa-cog mr-2"></i> Configurações
                            </a>
                            
                            <a href="{{ route('customer.billing.index') }}" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">
                                <i class="fas fa-credit-card mr-2"></i> Minha Assinatura
                            </a>
                            
                            <form method="POST" action="{{ route('logout') }}">
                                @csrf
                                <button type="submit" class="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">
                                    <i class="fas fa-sign-out-alt mr-2"></i> Sair
                                </button>
                            </form>
                        @endauth
                    </div>
                </div>
            </div>
            
            <!-- Botão do Menu Mobile -->
            <div class="-mr-2 flex items-center sm:hidden cursor-pointer">
                <button type="button" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500" aria-controls="mobile-menu" aria-expanded="false" id="mobile-menu-button">
                    <span class="sr-only">Abrir menu principal</span>
                    <i class="fas fa-bars"></i>
                </button>
            </div>
        </div>
    </div>
    
    <!-- Menu Mobile -->
    <div class="hidden sm:hidden" id="mobile-menu">
        <div class="pt-2 pb-3 space-y-1">
            <a href="{{ route('customer.dashboard') }}" class="{{ request()->routeIs('customer.dashboard') ? 'bg-indigo-50 dark:bg-gray-700 border-indigo-500 text-indigo-700 dark:text-white' : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-800 dark:hover:text-white' }} block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                <i class="fas fa-tachometer-alt mr-2"></i> Dashboard
            </a>
            
            <a href="{{ route('customer.documentation') }}" class="{{ request()->routeIs('customer.documentation') ? 'bg-indigo-50 dark:bg-gray-700 border-indigo-500 text-indigo-700 dark:text-white' : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-800 dark:hover:text-white' }} block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                <i class="fas fa-book mr-2"></i> Documentação
            </a>
            
            <a href="{{ route('customer.api-log.index') }}" class="{{ request()->routeIs('customer.api-log.index') ? 'bg-indigo-50 dark:bg-gray-700 border-indigo-500 text-indigo-700 dark:text-white' : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-800 dark:hover:text-white' }} block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                <i class="fas fa-history mr-2"></i> Histórico de Consultas
            </a>
            
            <a href="{{ route('customer.billing.index') }}" class="{{ request()->routeIs('customer.billing.*') ? 'bg-indigo-50 dark:bg-gray-700 border-indigo-500 text-indigo-700 dark:text-white' : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-800 dark:hover:text-white' }} block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                <i class="fas fa-credit-card mr-2"></i> Plano
            </a>
        </div>
        
        @auth
            <div class="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                <div class="flex items-center px-4">
                    <div class="flex-shrink-0">
                        <div class="h-10 w-10 rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white">
                            {{ substr(auth()->user()->name, 0, 1) }}
                        </div>
                    </div>
                    <div class="ml-3">
                        <div class="text-base font-medium text-gray-800 dark:text-white">{{ auth()->user()->name }}</div>
                        <div class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ auth()->user()->email }}</div>
                    </div>
                    <button id="theme-toggle-mobile" type="button" class="ml-auto text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5">
                        <i class="fas fa-sun" id="theme-toggle-light-icon-mobile"></i>
                        <i class="fas fa-moon hidden" id="theme-toggle-dark-icon-mobile"></i>
                    </button>
                </div>
                <div class="mt-3 space-y-1">
                    <a href="{{ route('customer.profile') }}" class="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                        <i class="fas fa-user-circle mr-2"></i> Meu Perfil
                    </a>
                    
                    <a href="{{ route('customer.settings') }}" class="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                        <i class="fas fa-cog mr-2"></i> Configurações
                    </a>
                    
                    <a href="{{ route('customer.billing.index') }}" class="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                        <i class="fas fa-credit-card mr-2"></i> Plano
                    </a>
                    
                    <form method="POST" action="{{ route('logout') }}">
                        @csrf
                        <button type="submit" class="w-full text-left block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                            <i class="fas fa-sign-out-alt mr-2"></i> Sair
                        </button>
                    </form>
                </div>
            </div>
        @endauth
    </div>
</nav>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Elementos
    const userMenuButton = document.getElementById('user-menu-button');
    const userMenu = document.getElementById('user-menu');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    
    // Toggle para o menu do usuário
    if (userMenuButton && userMenu) {
        userMenuButton.addEventListener('click', function() {
            userMenu.classList.toggle('hidden');
        });
    }
    
    // Toggle para o menu mobile
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            const isExpanded = mobileMenu.classList.contains('hidden');
            
            // Atualiza o estado do menu
            mobileMenu.classList.toggle('hidden');
            
            // Atualiza o atributo aria-expanded
            this.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        });
        
        // Inicializa o estado do menu mobile
        mobileMenu.classList.add('hidden');
        mobileMenuButton.setAttribute('aria-expanded', 'false');
    }
    
    // // Toggle para o tema (desktop)
    // if (themeToggle) {
    //     themeToggle.addEventListener('click', function() {
    //         toggleTheme();
    //     });
    // }
    
    // // Toggle para o tema (mobile)
    // if (themeToggleMobile) {
    //     themeToggleMobile.addEventListener('click', function() {
    //         toggleTheme();
    //     });
    // }
    
    // Inicializa o estado do menu do usuário
    if (userMenu) {
        userMenu.classList.add('hidden');
    }
    
    // Fecha os menus quando clicar fora deles
    document.addEventListener('click', function(event) {
        // Fecha menu mobile
        if (mobileMenu && mobileMenuButton && 
            !mobileMenuButton.contains(event.target) && 
            !mobileMenu.contains(event.target)) {
            mobileMenu.classList.add('hidden');
            mobileMenuButton.setAttribute('aria-expanded', 'false');
        }
        
        // Fecha menu usuário
        if (userMenu && userMenuButton && 
            !userMenuButton.contains(event.target) && 
            !userMenu.contains(event.target)) {
            userMenu.classList.add('hidden');
        }
    });
    
    // Inicializa os ícones do tema
    // updateThemeIcons();
});

// Função para alternar o tema
function toggleTheme() {
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
    } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
    }
    
    updateThemeIcons();
    
    // Dispara um evento personalizado para notificar outras partes da aplicação
    document.dispatchEvent(new CustomEvent('themeChanged'));
}

// Atualiza os ícones do tema
function updateThemeIcons() {
    const isDark = document.documentElement.classList.contains('dark');
    const lightIcon = document.getElementById('theme-toggle-light-icon');
    const darkIcon = document.getElementById('theme-toggle-dark-icon');
    const lightIconMobile = document.getElementById('theme-toggle-light-icon-mobile');
    const darkIconMobile = document.getElementById('theme-toggle-dark-icon-mobile');
    
    // Desktop
    if (lightIcon && darkIcon) {
        lightIcon.classList.toggle('hidden', isDark);
        darkIcon.classList.toggle('hidden', !isDark);
    }
    
    // Mobile
    if (lightIconMobile && darkIconMobile) {
        lightIconMobile.classList.toggle('hidden', isDark);
        darkIconMobile.classList.toggle('hidden', !isDark);
    }
}
</script> 