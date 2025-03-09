<footer class="bg-white dark:bg-gray-800 shadow-inner transition-colors duration-200">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
            <div class="text-center md:text-left mb-4 md:mb-0">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                    &copy; {{ date('Y') }} API de Consulta CPF. Todos os direitos reservados.
                </p>
            </div>
            <div class="flex space-x-6">
                <a href="#" class="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 transition-colors duration-200">
                    <span class="sr-only">Facebook</span>
                    <i class="fab fa-facebook-f"></i>
                </a>
                <a href="#" class="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 transition-colors duration-200">
                    <span class="sr-only">Instagram</span>
                    <i class="fab fa-instagram"></i>
                </a>
                <a href="#" class="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 transition-colors duration-200">
                    <span class="sr-only">Twitter</span>
                    <i class="fab fa-twitter"></i>
                </a>
                <a href="#" class="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 transition-colors duration-200">
                    <span class="sr-only">LinkedIn</span>
                    <i class="fab fa-linkedin-in"></i>
                </a>
            </div>
        </div>
        <div class="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
            <p>Versão 1.0.0 | <a href="{{ route('admin.dashboard') }}" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors duration-200">Painel Administrativo</a></p>
        </div>
    </div>
</footer> 