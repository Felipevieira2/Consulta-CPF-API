@extends('layouts.customer')

@section('content')
<div class="container mx-auto px-4">
    <!-- Cabeçalho -->
    <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">Detalhes do Log</h1>
        <p class="text-gray-600 dark:text-gray-400">Informações detalhadas da requisição</p>
    </div>
    
    <!-- Detalhes -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="grid grid-cols-1 gap-6">
            <div class="border-b dark:border-gray-700 pb-4">
                <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">ID</h4>
                <p class="text-lg">{{ $query->id }}</p>
            </div>
            
            <div class="border-b dark:border-gray-700 pb-4">
                <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Método</h4>
                <p class="text-lg">{{ $query->method }}</p>
            </div>
            
            <div class="border-b dark:border-gray-700 pb-4">
                <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">URL</h4>
                <p class="text-lg">{{ $query->url }}</p>
            </div>
            
            <div class="border-b dark:border-gray-700 pb-4">
                <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Status</h4>
                <p class="text-lg">{{ $query->status }}</p>
            </div>
            
            <div class="border-b dark:border-gray-700 pb-4">
                <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Data</h4>
                <p class="text-lg">{{ $query->created_at }}</p>
            </div>
        </div>
        
        <div class="mt-6">
            <a href="{{ route('customer.api-log.index') }}" 
               class="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700">
                Voltar
            </a>
        </div>
    </div>
</div>
@endsection 