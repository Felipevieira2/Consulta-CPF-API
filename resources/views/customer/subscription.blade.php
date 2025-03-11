@extends('layouts.customer')

@section('content')
<div class="container mx-auto px-4">
    <!-- Cabeçalho -->
    <div class="mb-8">
        <div class="flex items-center justify-between">
            <h1 class="text-3xl font-bold">Gerenciar Assinatura</h1>
            <a href="{{ route('customer.billing') }}" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600">
                <i class="fas fa-arrow-left mr-2"></i> Voltar
            </a>
        </div>
        <p class="text-gray-600 dark:text-gray-400 mt-2">Gerencie sua assinatura e plano atual</p>
    </div>
    
    <!-- Assinatura Atual -->
    @if($subscription)
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <h3 class="text-xl font-semibold mb-6">Assinatura Atual</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <div class="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                    <div class="flex justify-between items-center mb-4">
                        <h4 class="text-lg font-semibold">{{ $plan->name }}</h4>
                        <span class="px-3 py-1 text-sm rounded-full {{ $subscription->status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-white' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' }}">
                            {{ $subscription->status === 'active' ? 'Ativa' : 'Pendente' }}
                        </span>
                    </div>
                    
                    <p class="text-gray-600 dark:text-gray-400 mb-4">{{ $plan->description }}</p>
                    
                    <div class="mb-4">
                        <span class="text-3xl font-bold">R$ {{ number_format($plan->price, 2, ',', '.') }}</span>
                        <span class="text-gray-600 dark:text-gray-400">/mês</span>
                    </div>
                    
                    <ul class="space-y-2 mb-6">
                        <li class="flex items-center">
                            <i class="fas fa-check text-green-500 mr-2"></i>
                            <span>{{ number_format($plan->credits, 0, ',', '.') }} créditos por mês</span>
                        </li>
                        <li class="flex items-center">
                            <i class="fas fa-check text-green-500 mr-2"></i>
                            <span>{{ $plan->rate_limit_per_minute }} requisições por minuto</span>
                        </li>
                        <li class="flex items-center">
                            <i class="fas fa-check text-green-500 mr-2"></i>
                            <span>Suporte por e-mail</span>
                        </li>
                    </ul>
                    
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                        <p>Próxima cobrança: {{ \Carbon\Carbon::parse($subscription->next_billing_date)->format('d/m/Y') }}</p>
                        <p>ID da assinatura: {{ $subscription->id }}</p>
                    </div>
                </div>
            </div>
            
            <div class="flex flex-col justify-between">
                <div>
                    <h4 class="text-lg font-semibold mb-4">Ações</h4>
                    <p class="text-gray-600 dark:text-gray-400 mb-6">Gerencie sua assinatura atual ou mude para um plano diferente.</p>
                </div>
                
                <div class="space-y-4">
                    <a href="#planos" class="w-full block text-center px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700">
                        Mudar de Plano
                    </a>
                    
                    <form action="{{ route('customer.subscription.cancel') }}" method="POST" onsubmit="return confirm('Tem certeza que deseja cancelar sua assinatura? Você perderá o acesso aos serviços no final do período atual.')">
                        @csrf
                        <button type="submit" class="w-full px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50 dark:bg-gray-700 dark:text-red-400 dark:border-red-500 dark:hover:bg-gray-600">
                            Cancelar Assinatura
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    @endif
    
    <!-- Planos Disponíveis -->
    <div id="planos" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-xl font-semibold mb-6">Planos Disponíveis</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            @foreach($availablePlans as $availablePlan)
            <div class="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg {{ $subscription && $plan->id === $availablePlan->id ? 'border-2 border-blue-500 dark:border-blue-400' : '' }}">
                <div class="flex justify-between items-center mb-4">
                    <h4 class="text-lg font-semibold">{{ $availablePlan->name }}</h4>
                    @if($subscription && $plan->id === $availablePlan->id)
                    <span class="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        Plano Atual
                    </span>
                    @endif
                </div>
                
                <p class="text-gray-600 dark:text-gray-400 mb-4">{{ $availablePlan->description }}</p>
                
                <div class="mb-4">
                    <span class="text-3xl font-bold">R$ {{ number_format($availablePlan->price, 2, ',', '.') }}</span>
                    <span class="text-gray-600 dark:text-gray-400">/mês</span>
                </div>
                
                <ul class="space-y-2 mb-6">
                    <li class="flex items-center">
                        <i class="fas fa-check text-green-500 mr-2"></i>
                        <span>{{ number_format($availablePlan->credits, 0, ',', '.') }} créditos por mês</span>
                    </li>
                    <li class="flex items-center">
                        <i class="fas fa-check text-green-500 mr-2"></i>
                        <span>{{ $availablePlan->rate_limit_per_minute }} requisições por minuto</span>
                    </li>
                    <li class="flex items-center">
                        <i class="fas fa-check text-green-500 mr-2"></i>
                        <span>Suporte por e-mail</span>
                    </li>
                </ul>
                
                @if(!$subscription || $plan->id !== $availablePlan->id)
                <form action="{{ route('customer.subscription.change') }}" method="POST">
                    @csrf
                    <input type="hidden" name="plan_id" value="{{ $availablePlan->id }}">
                    <button type="submit" class="w-full px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700">
                        {{ $subscription ? 'Mudar para este Plano' : 'Assinar' }}
                    </button>
                </form>
                @else
                <button disabled class="w-full px-4 py-2 text-sm font-medium text-gray-400 bg-gray-200 rounded-lg cursor-not-allowed dark:bg-gray-600 dark:text-gray-500">
                    Plano Atual
                </button>
                @endif
            </div>
            @endforeach
        </div>
    </div>
</div>
@endsection 