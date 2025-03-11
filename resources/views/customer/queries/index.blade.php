@extends('layouts.customer')

@section('content')
<div class="container mx-auto px-4">
    <!-- Cabeçalho -->
    <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">Histórico de Consultas</h1>
        <p class="text-gray-600 dark:text-gray-400">Visualize e filtre todas as suas consultas de CPF</p>
    </div>
    
    <!-- Filtros -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <h3 class="text-lg font-semibold mb-4">Filtros</h3>
        <form action="{{ route('api-log.index') }}" method="GET" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label for="cpf" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">CPF</label>
                    <input type="text" id="cpf" name="cpf" value="{{ request('cpf') }}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Digite o CPF">
                </div>
                <div>
                    <label for="status" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Status</label>
                    <select id="status" name="status" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option value="">Todos</option>
                        <option value="success" {{ request('status') == 'success' ? 'selected' : '' }}>Sucesso</option>
                        <option value="error" {{ request('status') == 'error' ? 'selected' : '' }}>Erro</option>
                    </select>
                </div>
                <div>
                    <label for="date_from" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Data Inicial</label>
                    <input type="date" id="date_from" name="date_from" value="{{ request('date_from') }}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                </div>
                <div>
                    <label for="date_to" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Data Final</label>
                    <input type="date" id="date_to" name="date_to" value="{{ request('date_to') }}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                </div>
            </div>
            <div class="flex justify-end">
                <a href="{{ route('api-log.index') }}" class="px-4 py-2 mr-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600">Limpar</a>
                <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700">Filtrar</button>
            </div>
        </form>
    </div>
    
    <!-- Tabela de Consultas -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="p-6">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="text-left border-b dark:border-gray-700">
                            <th class="pb-3">CPF</th>
                            <th class="pb-3">Data</th>
                            <th class="pb-3">Status</th>
                            <th class="pb-3">Origem</th>
                            <th class="pb-3">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($queries as $query)
                        <tr class="border-b dark:border-gray-700">
                            <td class="py-4">{{ mask($query->cpf, '###.###.###-##') }}</td>
                            <td class="py-4">{{ $query->created_at->format('d/m/Y H:i') }}</td>
                            <td class="py-4">
                                <span class="px-3 py-1 text-sm rounded-full {{ $query->status === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-white' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' }}">
                                    {{ $query->status === 'success' ? 'Sucesso' : 'Erro' }}
                                </span>
                            </td>
                            <td class="py-4">{{ $query->source }}</td>
                            <td class="py-4">
                                <a href="{{ route('customer.api-log.show', $query->id) }}" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                    <i class="fas fa-eye"></i> Ver detalhes
                                </a>
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="5" class="py-4 text-center text-gray-500 dark:text-gray-400">
                                Nenhuma consulta encontrada.
                            </td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
            
            <!-- Paginação -->
            <div class="mt-6">
                {{ $queries->withQueryString()->links() }}
            </div>
        </div>
    </div>
</div>
@endsection 