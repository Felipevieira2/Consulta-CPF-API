@extends('layouts.customer')

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Cabeçalho -->
    <div class="mb-8 ">
        <h1 class="text-3xl font-bold mb-2">Logs da API</h1>
        <p class="text-gray-600 dark:text-gray-400">Visualize e monitore todas as chamadas realizadas à API</p>
    </div>
    
    <!-- Tabela de Logs -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow mt-5">
        <div class="p-6">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="text-left border-b dark:border-gray-700">
                            <th class="pb-3">ID</th>
                            <th class="pb-3">Método</th>
                            <th class="pb-3">Endpoint</th>
                            <th class="pb-3">Status</th>
                            <th class="pb-3">IP</th>
                            <th class="pb-3">Créditos usado</th>
                            <th class="pb-3">Data</th>
                            {{-- <th class="pb-3">Ações</th> --}}
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($queries as $query)
                            <tr class="border-b dark:border-gray-700">
                                <td class="py-4">{{ $query->id }}</td>
                                <td class="py-4">{{ $query->method }}</td>
                                <td class="py-4">{{ $query->endpoint }}</td>
                                <td class="py-4">{{ $query->status_code }}</td>
                                <td class="py-4">{{ $query->ip_address }}</td>
                                <td class="py-4">{{ $query->credits_used }}</td>
                                <td class="py-4">{{ $query->created_at }}</td>
                              
                                {{-- <td class="py-4">
                                    <a href="{{ route('customer.api-log.show', $query->id) }}" 
                                       class="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700">
                                        Detalhes
                                    </a>
                                </td> --}}
                            </tr>
                        @empty
                            <tr>
                                <td colspan="6" class="py-4 text-center text-gray-500 dark:text-gray-400">
                                    Nenhum log encontrado.
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
            
            <!-- Paginação -->
            <div class="mt-6">
                {{ $queries->links() }}
            </div>
        </div>
    </div>
</div>
@endsection 