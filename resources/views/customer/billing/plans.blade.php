@extends('layouts.customer')

@section('content')
<div class="py-8 bg-gray-50 dark:bg-gray-900 min-h-screen m-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Cabeçalho -->
        <div class="mb-10 text-center">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Escolha seu Plano</h1>
            <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Selecione o plano que melhor atende às suas necessidades. Todos os planos incluem acesso completo à nossa API de consulta de CPF.</p>
        </div>

        <!-- Alertas -->
        @if(session('success'))
        <div class="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 dark:bg-green-900 dark:text-white" role="alert">
            <p>{{ session('success') }}</p>
        </div>
        @endif

        <!-- Planos -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            @foreach($plans as $plan)
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 {{ $userPlan && $userPlan->plan_id === $plan->id ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-gray-900' : '' }}">
                    <div class="p-6">
                        @if($userPlan && $userPlan->plan_id === $plan->id)
                            <div class="absolute top-4 right-4">
                                <span class="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                    Plano Atual
                                </span>
                            </div>
                        @endif
                        
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ $plan->name }}</h3>
                        <p class="text-gray-600 dark:text-gray-400 mb-6 h-12">{{ $plan->description }}</p>
                        
                        <div class="mb-6">
                            <span class="text-4xl font-bold text-gray-900 dark:text-white">{{ $plan->formatted_price }}</span>
                            <span class="text-gray-600 dark:text-gray-400">/mês</span>
                        </div>
                        
                        <div class="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
                            <ul class="space-y-3">
                                <li class="flex items-start">
                                    <i class="fas fa-check-circle text-green-500 mt-1 mr-3"></i>
                                    <span class="text-gray-700 dark:text-gray-300">
                                        <strong>{{ number_format($plan->credits, 0, ',', '.') }}</strong> créditos mensais
                                    </span>
                                </li>
                                
                                @foreach(explode("\n", $plan->features) as $feature)
                                    @if(trim($feature))
                                        <li class="flex items-start">
                                            <i class="fas fa-check-circle text-green-500 mt-1 mr-3"></i>
                                            <span class="text-gray-700 dark:text-gray-300">{{ trim($feature) }}</span>
                                        </li>
                                    @endif
                                @endforeach
                            </ul>
                        </div>
                        
                        <div>
                            @if($userPlan && $userPlan->plan_id === $plan->id)
                                <button disabled class="w-full py-2 px-4 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-md text-center cursor-not-allowed">
                                    Plano Atual
                                </button>
                            @else
                                <a href="{{ route('customer.billing.checkout', $plan->id) }}" class="block w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md text-center transition-colors duration-200">
                                    {{ $userPlan ? 'Mudar para este Plano' : 'Escolher este Plano' }}
                                </a>
                            @endif
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
        
        <!-- FAQ -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden ">
            <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <h3 class="text-xl font-semibold text-gray-800 dark:text-white">Perguntas Frequentes</h3>
            </div>
            
            <div class="p-6">
                <div class="space-y-6">
                    <div>
                        <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">O que são créditos?</h4>
                        <p class="text-gray-700 dark:text-gray-300">
                            Créditos são utilizados para realizar consultas na nossa API. Cada consulta de CPF consome 1 crédito do seu plano.
                        </p>
                    </div>
                    
                    <div>
                        <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Os créditos expiram?</h4>
                        <p class="text-gray-700 dark:text-gray-300">
                            Sim, os créditos são renovados mensalmente na data de renovação do seu plano. Créditos não utilizados não são acumulados para o próximo mês.
                        </p>
                    </div>
                    
                    <div>
                        <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Posso cancelar a qualquer momento?</h4>
                        <p class="text-gray-700 dark:text-gray-300">
                            Sim, você pode cancelar sua assinatura a qualquer momento. Após o cancelamento, você continuará tendo acesso ao serviço até o final do período já pago.
                        </p>
                    </div>
                    
                    <div>
                        <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Como funciona a mudança de plano?</h4>
                        <p class="text-gray-700 dark:text-gray-300">
                            Ao mudar para um plano de valor superior, a diferença será cobrada proporcionalmente ao tempo restante do seu plano atual. Ao mudar para um plano de valor inferior, a alteração será efetivada na próxima renovação.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection 