@extends('layouts.customer')

@section('content')
<div class="container mx-auto px-4">
    <!-- Cabeçalho -->
    <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">Faturamento</h1>
        <p class="text-gray-600 dark:text-gray-400">Gerencie suas informações de pagamento e histórico de transações</p>
    </div>
    
    <!-- Informações da Assinatura -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <div class="flex justify-between items-start mb-6">
            <h3 class="text-xl font-semibold">Assinatura Atual</h3>
            <a href="{{ route('customer.subscription') }}" class="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700">
                Gerenciar Assinatura
            </a>
        </div>
        
        @if($subscription)
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Plano</h4>
                    <p class="text-lg font-semibold">{{ $plan->name }}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ $plan->description }}</p>
                </div>
                <div>
                    <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Status</h4>
                    <p class="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full {{ $subscription->status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-white' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' }}">
                        {{ $subscription->status === 'active' ? 'Ativa' : 'Pendente' }}
                    </p>
                </div>
                <div>
                    <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Próxima Cobrança</h4>
                    <p class="text-lg font-semibold">{{ \Carbon\Carbon::parse($subscription->next_billing_date)->format('d/m/Y') }}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">R$ {{ number_format($plan->price, 2, ',', '.') }}</p>
                </div>
            </div>
        @else
            <div class="text-center py-8">
                <div class="mb-4">
                    <i class="fas fa-exclamation-circle text-4xl text-yellow-500"></i>
                </div>
                <h4 class="text-lg font-semibold mb-2">Você não possui uma assinatura ativa</h4>
                <p class="text-gray-600 dark:text-gray-400 mb-4">Escolha um plano para começar a usar nossa API</p>
                <a href="{{ route('pricing') }}" class="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700">
                    Ver Planos Disponíveis
                </a>
            </div>
        @endif
    </div>
    
    <!-- Histórico de Transações -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="p-6">
            <h3 class="text-xl font-semibold mb-6">Histórico de Transações</h3>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="text-left border-b dark:border-gray-700">
                            <th class="pb-3">ID</th>
                            <th class="pb-3">Data</th>
                            <th class="pb-3">Descrição</th>
                            <th class="pb-3">Valor</th>
                            <th class="pb-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($transactions as $transaction)
                        <tr class="border-b dark:border-gray-700">
                            <td class="py-4">{{ $transaction->id }}</td>
                            <td class="py-4">{{ $transaction->created_at->format('d/m/Y') }}</td>
                            <td class="py-4">{{ $transaction->description }}</td>
                            <td class="py-4">R$ {{ number_format($transaction->amount, 2, ',', '.') }}</td>
                            <td class="py-4">
                                <span class="px-3 py-1 text-sm rounded-full 
                                    @if($transaction->status === 'completed')
                                        bg-green-100 text-green-800 dark:bg-green-900 dark:text-white
                                    @elseif($transaction->status === 'pending')
                                        bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200
                                    @elseif($transaction->status === 'failed')
                                        bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200
                                    @else
                                        bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200
                                    @endif
                                ">
                                    @if($transaction->status === 'completed')
                                        Concluído
                                    @elseif($transaction->status === 'pending')
                                        Pendente
                                    @elseif($transaction->status === 'failed')
                                        Falhou
                                    @else
                                        {{ $transaction->status }}
                                    @endif
                                </span>
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="5" class="py-4 text-center text-gray-500 dark:text-gray-400">
                                Nenhuma transação encontrada.
                            </td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
            
            <!-- Paginação -->
            <div class="mt-6">
                {{ $transactions->links() }}
            </div>
        </div>
    </div>
</div>
@endsection 