<footer class="bg-gray-800">
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div class="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
                <h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase">Empresa</h3>
                <ul class="mt-4 space-y-4">
                    <li><a href="{{ route('about') }}" class="text-base text-gray-300 hover:text-white">Sobre</a></li>
                    <li><a href="{{ route('blog') }}" class="text-base text-gray-300 hover:text-white">Blog</a></li>
                    <li><a href="{{ route('careers') }}" class="text-base text-gray-300 hover:text-white">Empregos</a></li>
                    <li><a href="{{ route('partners') }}" class="text-base text-gray-300 hover:text-white">Parceiros</a></li>
                </ul>
            </div>
            <div>
                <h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase">API</h3>
                <ul class="mt-4 space-y-4">
                    <li><a href="{{ route('documentation') }}" class="text-base text-gray-300 hover:text-white">Documentação</a></li>
                    <li><a href="{{ route('pricing') }}" class="text-base text-gray-300 hover:text-white">Preços</a></li>
                    <li><a href="{{ route('usage-limits') }}" class="text-base text-gray-300 hover:text-white">Limites de Uso</a></li>
                    <li><a href="{{ route('changelog') }}" class="text-base text-gray-300 hover:text-white">Changelog</a></li>
                </ul>
            </div>
            <div>
                <h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase">Suporte</h3>
                <ul class="mt-4 space-y-4">
                    <li><a href="{{ route('help-center') }}" class="text-base text-gray-300 hover:text-white">Central de Ajuda</a></li>
                    <li><a href="{{ route('contact') }}" class="text-base text-gray-300 hover:text-white">Contato</a></li>
                    <li><a href="{{ route('status') }}" class="text-base text-gray-300 hover:text-white">Status</a></li>
                    <li><a href="{{ route('community') }}" class="text-base text-gray-300 hover:text-white">Comunidade</a></li>
                </ul>
            </div>
            <div>
                <h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
                <ul class="mt-4 space-y-4">
                    <li><a href="{{ route('privacy') }}" class="text-base text-gray-300 hover:text-white">Privacidade</a></li>
                    <li><a href="{{ route('terms') }}" class="text-base text-gray-300 hover:text-white">Termos</a></li>
                    <li><a href="{{ route('lgpd') }}" class="text-base text-gray-300 hover:text-white">LGPD</a></li>
                    <li><a href="{{ route('licenses') }}" class="text-base text-gray-300 hover:text-white">Licenças</a></li>
                </ul>
            </div>
        </div>
        <div class="mt-12 border-t border-gray-700 pt-8">
            <p class="text-base text-gray-300">Todos os direitos reservados.</p>
        </div>
    </div>
</footer> 