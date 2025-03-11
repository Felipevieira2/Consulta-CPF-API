@extends('layouts.customer')

@section('content')
<div class="py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Cabeçalho -->
        <div class="mb-8 flex justify-between items-center">
            <div>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Gerenciamento de API</h1>
                <p class="text-gray-600 dark:text-gray-400">Gerencie suas chaves de API para integração com nossos serviços</p>
            </div>
            
            <div class="flex space-x-4">
                <a href="{{ route('customer.api-documentation') }}" class="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:text-gray-500 dark:hover:text-gray-200 focus:outline-none focus:border-blue-300 focus:ring ring-blue-200 dark:focus:ring-blue-800 disabled:opacity-25 transition ease-in-out duration-150">
                    <i class="fas fa-book mr-2"></i> Documentação
                </a>
                
                <a href="{{ route('customer.api-keys.create') }}" class="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 disabled:opacity-25 transition ease-in-out duration-150">
                    <i class="fas fa-plus mr-2"></i> Nova Chave API
                </a>
            </div>
        </div>

        <!-- Alertas -->
        @if(session('success'))
        <div class="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 dark:bg-green-900 dark:text-white" role="alert">
            <p>{{ session('success') }}</p>
        </div>
        @endif

        <!-- Informações Gerais -->
        <div class="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <h3 class="text-xl font-semibold text-gray-800 dark:text-white">Informações da API</h3>
            </div>
            
            <div class="p-6">
                <div class="mb-6">
                    <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Endpoint Base</h4>
                    <div class="flex items-center">
                        <div class="bg-gray-100 dark:bg-gray-700 p-3 rounded font-mono text-sm flex-grow overflow-x-auto">
                            {{ config('app.url') }}/api/v1
                        </div>
                        <button onclick="copyToClipboard('{{ config('app.url') }}/api/v1')" class="ml-2 p-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Autenticação</h4>
                        <p class="text-gray-600 dark:text-gray-400 mb-2">
                            Todas as requisições à API devem incluir sua chave API no cabeçalho HTTP:
                        </p>
                        <div class="bg-gray-100 dark:bg-gray-700 p-3 rounded font-mono text-sm">
                            X-API-Key: sua_chave_api
                        </div>
                    </div>
                    
                    <div>
                        <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Limites de Uso</h4>
                        <p class="text-gray-600 dark:text-gray-400 mb-2">
                            Seu plano atual permite:
                        </p>
                        <ul class="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                            <li>{{ number_format(auth()->user()->credits_available, 0, ',', '.') }} consultas disponíveis</li>
                            <li>Máximo de 10 requisições por segundo</li>
                            <li>Suporte a consultas em lote (até 100 CPFs por requisição)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <!-- Lista de Chaves API -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <h3 class="text-xl font-semibold text-gray-800 dark:text-white">Suas Chaves API</h3>
            </div>
            
            <div class="overflow-x-auto">
                @if($apiKeys->count() > 0)
                    <table class="w-full">
                        <thead>
                            <tr class="text-left bg-gray-50 dark:bg-gray-900">
                                <th class="py-3 px-6 text-gray-600 dark:text-gray-400 font-medium">Nome</th>
                                <th class="py-3 px-6 text-gray-600 dark:text-gray-400 font-medium">Chave</th>
                                <th class="py-3 px-6 text-gray-600 dark:text-gray-400 font-medium">Status</th>
                                <th class="py-3 px-6 text-gray-600 dark:text-gray-400 font-medium">Criada em</th>
                                <th class="py-3 px-6 text-gray-600 dark:text-gray-400 font-medium">Último uso</th>
                                <th class="py-3 px-6 text-gray-600 dark:text-gray-400 font-medium">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($apiKeys as $key)
                                <tr class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                                    <td class="py-4 px-6 font-medium">{{ $key->name }}</td>
                                    <td class="py-4 px-6 font-mono">
                                        <div class="flex items-center">
                                            <span>{{ substr($key->key, 0, 8) }}...{{ substr($key->key, -8) }}</span>
                                            <button onclick="copyToClipboard('{{ $key->key }}')" class="ml-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
                                                <i class="fas fa-copy"></i>
                                            </button>
                                        </div>
                                    </td>
                                    <td class="py-4 px-6">
                                        @if($key->isExpired())
                                            <span class="px-3 py-1 text-sm rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                                Expirada
                                            </span>
                                        @elseif($key->is_active)
                                            <span class="px-3 py-1 text-sm rounded-full bg-green-100  dark:bg-green-900 dark:text-white">
                                                Ativa
                                            </span>
                                        @else
                                            <span class="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                                Inativa
                                            </span>
                                        @endif
                                    </td>
                                    <td class="py-4 px-6">{{ $key->created_at->format('d/m/Y H:i') }}</td>
                                    <td class="py-4 px-6">{{ $key->last_used_at ? $key->last_used_at->format('d/m/Y H:i') : 'Nunca usada' }}</td>
                                    <td class="py-4 px-6">
                                        <div class="flex space-x-4">
                                            <a href="{{ route('customer.api-keys.show', $key->id) }}" class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300" title="Detalhes">
                                                <i class="fas fa-eye"></i>
                                            </a>
                                            
                                            <a href="{{ route('customer.api-keys.toggle', $key->id) }}" class="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300" title="{{ $key->active ? 'Desativar' : 'Ativar' }}">
                                                <i class="fas {{ $key->active ? 'fa-toggle-on' : 'fa-toggle-off' }}"></i>
                                            </a>
                                            
                                            <form method="POST" action="{{ route('customer.api-keys.destroy', $key->id) }}" onsubmit="return confirm('Tem certeza que deseja excluir esta chave API?');" class="inline cursor-pointer">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" class="cursor-pointer text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" title="Excluir">
                                                    <i class="fas fa-trash-alt"></i>
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                @else
                    <div class="py-8 px-6 text-center text-gray-500 dark:text-gray-400">
                        <i class="fas fa-key text-4xl mb-3 opacity-30"></i>
                        <p class="mb-4">Você ainda não possui chaves API.</p>
                        <a href="{{ route('customer.api-keys.create') }}" class="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 disabled:opacity-25 transition ease-in-out duration-150">
                            <i class="fas fa-plus mr-2"></i> Criar Primeira Chave
                        </a>
                    </div>
                @endif
            </div>
        </div>
    </div>
</div>

@push('scripts')
<script>
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(function() {
            // Poderia mostrar uma notificação de sucesso aqui
            alert('Copiado para a área de transferência!');
        }, function(err) {
            console.error('Erro ao copiar texto: ', err);
        });
    }
</script>
@endpush
@endsection 