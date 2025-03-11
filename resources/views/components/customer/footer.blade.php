<footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
            <div class="text-center md:text-left mb-4 md:mb-0">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                    &copy; {{ date('Y') }} {{ config('app.name', 'API de Consulta CPF') }}. Todos os direitos reservados.
                </p>
            </div>
            <div class="flex space-x-6">
                <a href="{{ route('home') }}" class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                    <i class="fas fa-home"></i>
                </a>
                <a href="{{ route('contact') }}" class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                    <i class="fas fa-envelope"></i>
                </a>
                {{-- <a href="{{ route('privacy') }}" class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                    <span class="text-sm">Privacidade</span>
                </a> --}}
                {{-- <a href="{{ route('terms') }}" class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                    <span class="text-sm">Termos</span>
                </a> --}}
            </div>
        </div>
    </div>
</footer> 