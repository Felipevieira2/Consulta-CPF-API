@extends('layouts.customer')

@section('content')
<div class="container mx-auto px-4">
    <!-- Cabeçalho -->
    <div class="mb-8">
        <div class="flex items-center justify-between">
            <h1 class="text-3xl font-bold">Detalhes da Consulta</h1>
            <a href="{{ route('customer.api-log.index') }}" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600">
                <i class="fas fa-arrow-left mr-2"></i> Voltar
            </a>
        </div>
        <p class="text-gray-600 dark:text-gray-400 mt-2">Informações detalhadas sobre a consulta de CPF</p>
    </div>
    
    <!-- Informações da Consulta -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Status da Consulta -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Status</h3>
            <div class="flex items-center">
                @if($query->status === 'success')
                    <div class="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-4">
                        <i class="fas fa-check text-2xl text-green-600 dark:text-green-300"></i>
                    </div>
                    <div>
                        <p class="font-semibold text-green-600 dark:text-green-300">Sucesso</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Consulta realizada com sucesso</p>
                    </div>
                @else
                    <div class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mr-4">
                        <i class="fas fa-times text-2xl text-red-600 dark:text-red-300"></i>
                    </div>
                    <div>
                        <p class="font-semibold text-red-600 dark:text-red-300">Erro</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">{{ $query->error_message ?? 'Ocorreu um erro na consulta' }}</p>
                    </div>
                @endif
            </div>
        </div>
        
        <!-- Informações Básicas -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Informações Básicas</h3>
            <ul class="space-y-3">
                <li class="flex items-start">
                    <span class="text-gray-600 dark:text-gray-400 w-24">CPF:</span>
                    <span class="font-medium">{{ mask($query->cpf, '###.###.###-##') }}</span>
                </li>
                <li class="flex items-start">
                    <span class="text-gray-600 dark:text-gray-400 w-24">Data:</span>
                    <span class="font-medium">{{ $query->created_at->format('d/m/Y H:i:s') }}</span>
                </li>
                <li class="flex items-start">
                    <span class="text-gray-600 dark:text-gray-400 w-24">Origem:</span>
                    <span class="font-medium">{{ $query->source }}</span>
                </li>
                <li class="flex items-start">
                    <span class="text-gray-600 dark:text-gray-400 w-24">IP:</span>
                    <span class="font-medium">{{ $query->ip_address }}</span>
                </li>
            </ul>
        </div>
        
        <!-- Informações Adicionais -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Informações Adicionais</h3>
            <ul class="space-y-3">
                <li class="flex items-start">
                    <span class="text-gray-600 dark:text-gray-400 w-24">Método:</span>
                    <span class="font-medium">{{ $query->method }}</span>
                </li>
                <li class="flex items-start">
                    <span class="text-gray-600 dark:text-gray-400 w-24">Endpoint:</span>
                    <span class="font-medium">{{ $query->endpoint }}</span>
                </li>
                <li class="flex items-start">
                    <span class="text-gray-600 dark:text-gray-400 w-24">Duração:</span>
                    <span class="font-medium">{{ $query->duration ?? '-' }} ms</span>
                </li>
                <li class="flex items-start">
                    <span class="text-gray-600 dark:text-gray-400 w-24">Código:</span>
                    <span class="font-medium">{{ $query->status_code ?? '-' }}</span>
                </li>
            </ul>
        </div>
    </div>
    
    <!-- Resposta da API -->
    @if($query->status === 'success' && $query->response)
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <h3 class="text-lg font-semibold mb-4">Resposta da API</h3>
        <div class="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
            <pre class="text-sm">{{ json_encode(json_decode($query->response), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) }}</pre>
        </div>
    </div>
    @endif
    
    <!-- Payload da Requisição -->
    @if($query->request_payload)
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-4">Payload da Requisição</h3>
        <div class="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
            <pre class="text-sm">{{ json_encode(json_decode($query->request_payload), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) }}</pre>
        </div>
    </div>
    @endif
</div>
@endsection 