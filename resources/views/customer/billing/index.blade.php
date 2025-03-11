@extends('layouts.customer')

@section('content')
<div class="py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Cabeçalho com Gradiente -->
        <div class="mb-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
            <h1 class="text-3xl font-bold mb-2">Cobrança e Assinatura</h1>
            <p class="text-indigo-100">Gerencie seu plano, pagamentos e histórico de transações</p>
        </div>

        <!-- Alertas -->
        @if(session('success'))
        <div class="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 dark:bg-green-900 dark:text-white" role="alert">
            <p>{{ session('success') }}</p>
        </div>
        @endif

        @if(session('error'))
        <div class="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 dark:bg-red-900 dark:text-red-200" role="alert">
            <p>{{ session('error') }}</p>
        </div>
        @endif

        <!-- Seção do Plano Atual -->
        <div class="mb-10 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
                <h3 class="text-xl font-semibold text-gray-800 dark:text-white">Seu Plano Atual</h3>
                <a href="{{ route('customer.billing.current-plan') }}" class="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">
                    Ver detalhes
                </a>
            </div>
            
            <div class="p-6">
                @if($userPlan)
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h4 class="text-2xl font-bold text-gray-900 dark:text-white">{{ $userPlan->plan->name }}</h4>
                            <p class="text-gray-600 dark:text-gray-400 mt-1">{{ $userPlan->plan->description }}</p>
                            
                            <div class="mt-4 flex items-center">
                                <span class="px-3 py-1 text-sm rounded-full {{ $userPlan->status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-white' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' }}">
                                    {{ $userPlan->status === 'active' ? 'Ativo' : 'Cancelado' }}
                                </span>
                                
                                <span class="ml-4 text-gray-600 dark:text-gray-400">
                                    Próxima cobrança: {{ \Carbon\Carbon::parse($userPlan->next_billing_date)->format('d/m/Y') }}
                                </span>
                            </div>
                        </div>
                        
                        <div class="mt-6 md:mt-0">
                            <div class="text-3xl font-bold text-gray-900 dark:text-white">{{ $userPlan->plan->formatted_price }}<span class="text-sm text-gray-600 dark:text-gray-400">/mês</span></div>
                            
                            <div class="mt-4 flex space-x-3">
                                @if($userPlan->status === 'active')
                                    <a href="{{ route('customer.billing.plans') }}" class="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 disabled:opacity-25 transition ease-in-out duration-150">
                                        Mudar Plano
                                    </a>
                                    
                                    <form method="POST" action="{{ route('customer.billing.cancel-subscription') }}" onsubmit="return confirm('Tem certeza que deseja cancelar sua assinatura?');">
                                        @csrf
                                        <button type="submit" class="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:text-gray-500 dark:hover:text-gray-200 focus:outline-none focus:border-blue-300 focus:ring ring-blue-200 dark:focus:ring-blue-800 disabled:opacity-25 transition ease-in-out duration-150">
                                            Cancelar Assinatura
                                        </button>
                                    </form>
                                @else
                                    <a href="{{ route('customer.billing.plans') }}" class="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 disabled:opacity-25 transition ease-in-out duration-150">
                                        Reativar Assinatura
                                    </a>
                                @endif
                            </div>
                        </div>
                    </div>
                    
                    <!-- Barra de Progresso de Créditos -->
                    <div class="mt-8">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Créditos Disponíveis</span>
                            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ $userPlan->credits_available }} / {{ $userPlan->plan->credits }}</span>
                        </div>
                        
                        @php
                            $percentage = ($userPlan->credits_available / $userPlan->plan->credits) * 100;
                            $colorClass = $percentage > 50 ? 'bg-green-600' : ($percentage > 20 ? 'bg-yellow-500' : 'bg-red-600');
                        @endphp
                        
                        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div class="{{ $colorClass }} h-2.5 rounded-full" style="width: {{ $percentage }}%"></div>
                        </div>
                    </div>
                @else
                    <div class="text-center py-8">
                        <i class="fas fa-exclamation-circle text-4xl text-gray-400 mb-4"></i>
                        <h4 class="text-xl font-medium text-gray-900 dark:text-white mb-2">Você não possui um plano ativo</h4>
                        <p class="text-gray-600 dark:text-gray-400 mb-6">Escolha um plano para começar a usar nossos serviços</p>
                        <a href="{{ route('customer.billing.plans') }}" class="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 disabled:opacity-25 transition ease-in-out duration-150">
                            Ver Planos Disponíveis
                        </a>
                    </div>
                @endif
            </div>
        </div>

        <!-- Transações Recentes -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
                <h3 class="text-xl font-semibold text-gray-800 dark:text-white">Transações Recentes</h3>
                <a href="{{ route('customer.billing.transactions') }}" class="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">
                    Ver todas
                </a>
            </div>
            
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="text-left bg-gray-50 dark:bg-gray-900">
                            <th class="py-3 px-6 text-gray-600 dark:text-gray-400 font-medium">Data</th>
                            <th class="py-3 px-6 text-gray-600 dark:text-gray-400 font-medium">Plano</th>
                            <th class="py-3 px-6 text-gray-600 dark:text-gray-400 font-medium">Valor</th>
                            <th class="py-3 px-6 text-gray-600 dark:text-gray-400 font-medium">Método</th>
                            <th class="py-3 px-6 text-gray-600 dark:text-gray-400 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($transactions as $transaction)
                            <tr class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                                <td class="py-4 px-6">{{ $transaction->created_at->format('d/m/Y H:i') }}</td>
                                <td class="py-4 px-6 font-medium">{{ $transaction->plan->name ?? 'N/A' }}</td>
                                <td class="py-4 px-6">{{ $transaction->formatted_amount }}</td>
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
                                <td colspan="5" class="py-8 px-6 text-center text-gray-500 dark:text-gray-400">
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
                    {{ $transactions->links() }}
                </div>
            @endif
        </div>
    </div>
</div>
@endsection 