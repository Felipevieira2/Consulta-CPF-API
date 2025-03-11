@extends('layouts.customer')

@section('content')
<div class="py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Cabeçalho -->
        <div class="mb-10">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Histórico de Transações</h1>
            <p class="text-gray-600 dark:text-gray-400">Visualize todas as suas transações e pagamentos</p>
        </div>

        <!-- Filtros -->
        <div class="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <form action="{{ route('customer.billing.transactions') }}" method="GET" class="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
                <div class="flex-1">
                    <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                    <select id="status" name="status" class="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                        <option value="">Todos</option>
                        <option value="completed" {{ request('status') === 'completed' ? 'selected' : '' }}>Concluído</option>
                        <option value="pending" {{ request('status') === 'pending' ? 'selected' : '' }}>Pendente</option>
                        <option value="failed" {{ request('status') === 'failed' ? 'selected' : '' }}>Falhou</option>
                        <option value="refunded" {{ request('status') === 'refunded' ? 'selected' : '' }}>Reembolsado</option>
                    </select>
                </div>
                
                <div class="flex-1">
                    <label for="date_from" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data Inicial</label>
                    <input type="date" id="date_from" name="date_from" value="{{ request('date_from') }}" class="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                
                <div class="flex-1">
                    <label for="date_to" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data Final</label>
                    <input type="date" id="date_to" name="date_to" value="{{ request('date_to') }}" class="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                
                <div>
                    <button type="submit" class="w-full md:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors duration-200">
                        <i class="fas fa-filter mr-2"></i> Filtrar
                    </button>
                </div>
            </form>
        </div>

        <!-- Tabela de Transações -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <h3 class="text-xl font-semibold text-gray-800 dark:text-white">Todas as Transações</h3>
            </div>
            
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="text-left bg-gray-50 dark:bg-gray-900">
                            <th class="py-3 px-6 text-gray-600 dark:text-gray-400 font-medium">ID</th>
                            <th class="py-3 px-6 text-gray-600 dark:text-gray-400 font-medium">Data</th>
                            <th class="py-3 px-6 text-gray-600 dark:text-gray-400 font-medium">Plano</th>
                            <th class="py-3 px-6 text-gray-600 dark:text-gray-400 font-medium">Descrição</th>
                            <th class="py-3 px-6 text-gray-600 dark:text-gray-400 font-medium">Valor</th>
                            <th class="py-3 px-6 text-gray-600 dark:text-gray-400 font-medium">Método</th>
                            <th class="py-3 px-6 text-gray-600 dark:text-gray-400 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($transactions as $transaction)
                            <tr class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                                <td class="py-4 px-6 text-gray-500 dark:text-gray-400">{{ $transaction->id }}</td>
                                <td class="py-4 px-6">{{ $transaction->created_at->format('d/m/Y H:i') }}</td>
                                <td class="py-4 px-6 font-medium">{{ $transaction->plan->name ?? 'N/A' }}</td>
                                <td class="py-4 px-6">{{ $transaction->description ?: 'Pagamento - ' . ($transaction->plan->name ?? 'N/A') }}</td>
                                <td class="py-4 px-6 font-medium">{{ $transaction->formatted_amount }}</td>
                                <td class="py-4 px-6">{{ $transaction->payment_method_name }}</td>
                                <td class="py-4 px-6">
                                    <span class="px-3 py-1 text-sm rounded-full inline-flex items-center 
                                        {{ $transaction->status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-white' : 
                                           ($transaction->status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                                           'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200') }}">
                                        {{ $transaction->status_name }}
                                    </span>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="7" class="py-8 px-6 text-center text-gray-500 dark:text-gray-400">
                                    <i class="fas fa-receipt text-4xl mb-3 opacity-30"></i>
                                    <p>Nenhuma transação encontrada.</p>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
            
            <!-- Paginação -->
            @if($transactions->hasPages())
                <div class="px-6 py-4">
                    {{ $transactions->appends(request()->query())->links() }}
                </div>
            @endif
        </div>
    </div>
</div>
@endsection 