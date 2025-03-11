@extends('layouts.customer')

@section('content')
<div class="py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Cabeçalho -->
        <div class="mb-8 flex justify-between items-center">
            <div>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Detalhes da Chave API</h1>
                <p class="text-gray-600 dark:text-gray-400">Informações e estatísticas de uso da chave</p>
            </div>
            
            <div>
                <a href="{{ route('customer.api-keys.index') }}" class="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:text-gray-500 dark:hover:text-gray-200 focus:outline-none focus:border-blue-300 focus:ring ring-blue-200 dark:focus:ring-blue-800 disabled:opacity-25 transition ease-in-out duration-150">
                    <i class="fas fa-arrow-left mr-2"></i> Voltar
                </a>
            </div>
        </div>

        <!-- Informações da Chave -->
        <div class="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <h3 class="text-xl font-semibold text-gray-800 dark:text-white">Informações da Chave</h3>
            </div>
            
            <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Detalhes</h4>
                        
                        <div class="space-y-4">
                            <div>
                                <p class="text-sm text-gray-500 dark:text-gray-400">Nome</p>
                                <p class="text-lg font-medium text-gray-900 dark:text-white">{{ $apiKey->name }}</p>
                            </div>
                            
                            <div>
                                <p class="text-sm text-gray-500 dark:text-gray-400">Chave API</p>
                                <div class="flex items-center">
                                    <p class="font-mono text-lg font-medium text-gray-900 dark:text-white">{{ substr($apiKey->key, 0, 8) }}...{{ substr($apiKey->key, -8) }}</p>
                                    <button onclick="copyToClipboard('{{ $apiKey->key }}')" class="ml-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
                                        <i class="fas fa-copy"></i>
                                    </button>
                                </div>
                            </div>
                            
                            <div>
                                <p class="text-sm text-gray-500 dark:text-gray-400">Status</p>
                                <div>
                                    @if($apiKey->isExpired())
                                        <span class="px-3 py-1 text-sm rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                            Expirada
                                        </span>
                                    @elseif($apiKey->active)
                                        <span class="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-white">
                                            Ativa
                                        </span>
                                    @else
                                        <span class="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                            Inativa
                                        </span>
                                    @endif
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Estatísticas de Uso</h4>
                        <p class="text-gray-600 dark:text-gray-400 mb-2">
                            Uso da chave nos últimos 30 dias:
                        </p>
                        <ul class="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                            <li>{{ $usageStats['today'] }} consultas hoje</li>
                            <li>{{ $usageStats['week'] }} consultas na semana</li>
                            <li>{{ $usageStats['month'] }} consultas no mês</li>
                            <li>{{ $usageStats['total'] }} consultas totais</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <!-- Últimos Logs de Uso -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <h3 class="text-xl font-semibold text-gray-800 dark:text-white">Últimos Logs de Uso</h3>
            </div>
            
            <div class="overflow-x-auto">
                @if($recentLogs->count() > 0)
                    <table class="w-full">
                        <thead>
                            <tr class="text-left bg-gray-50 dark:bg-gray-900">
                                <th class="py-3 px-6 text-gray-600 dark:text-gray-400 font-medium">Data</th>
                                <th class="py-3 px-6 text-gray-600 dark:text-gray-400 font-medium">Detalhes</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($recentLogs as $log)
                                <tr class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                                    <td class="py-4 px-6">{{ $log->created_at->format('d/m/Y H:i') }}</td>
                                    <td class="py-4 px-6">{{ $log->details }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                @else
                    <div class="py-8 px-6 text-center text-gray-500 dark:text-gray-400">
                        <i class="fas fa-clock text-4xl mb-3 opacity-30"></i>
                        <p class="mb-4">Nenhum log de uso recente para esta chave.</p>
                    </div>
                @endif
            </div>
        </div>
    </div>
</div>
@endsection 