@extends('layouts.customer')

@section('content')
<div class="py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Cabeçalho -->
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Criar Nova Chave API</h1>
            <p class="text-gray-600 dark:text-gray-400">Preencha os campos abaixo para gerar uma nova chave de API</p>
        </div>

        <!-- Formulário -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div class="p-6">
                <form method="POST" action="{{ route('customer.api-keys.store') }}">
                    @csrf
                    
                    <div class="mb-6">
                        <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome da Chave</label>
                        <input type="text" id="name" name="name" value="{{ old('name') }}" placeholder="Ex: Integração Website" class="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required>
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Um nome descritivo para identificar esta chave.</p>
                        @error('name')
                            <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
                        @enderror
                    </div>
                    
                    <div class="mb-6">
                        <label for="expires_at" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data de Expiração (opcional)</label>
                        <input type="date" id="expires_at" name="expires_at" value="{{ old('expires_at') }}" class="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Deixe em branco para uma chave sem data de expiração.</p>
                        @error('expires_at')
                            <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
                        @enderror
                    </div>
                    
                    <div class="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg mb-6">
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <i class="fas fa-exclamation-triangle text-yellow-500 dark:text-yellow-400"></i>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm text-yellow-700 dark:text-yellow-300">
                                    <strong>Importante:</strong> A chave API será exibida apenas uma vez após a criação. 
                                    Certifique-se de copiá-la e armazená-la em um local seguro.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex justify-between">
                        <a href="{{ route('customer.api-keys.index') }}" class="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:text-gray-500 dark:hover:text-gray-200 focus:outline-none focus:border-blue-300 focus:ring ring-blue-200 dark:focus:ring-blue-800 disabled:opacity-25 transition ease-in-out duration-150">
                            Cancelar
                        </a>
                        
                        <button type="submit" class="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 disabled:opacity-25 transition ease-in-out duration-150">
                            Gerar Chave API
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection 