@extends('layouts.admin')

@section('content')
<div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
            <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Detalhes do Plano</h1>
            <div class="flex space-x-2">
                <x-forms.button variant="primary" class="cursor-pointer" onclick="window.location.href='{{ route('admin.plans.edit', $plan->id) }}'">
                    <i class="fas fa-edit mr-2"></i> Editar
                </x-forms.button>
                <x-forms.button variant="secondary" class="cursor-pointer" onclick="window.location.href='{{ route('admin.plans.index') }}'">
                    <i class="fas fa-arrow-left mr-2"></i> Voltar
                </x-forms.button>
            </div>
        </div>
        
        <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <x-card title="Informações do Plano">
                <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div class="sm:col-span-1">
                        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Nome</dt>
                        <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ $plan->name }}</dd>
                    </div>
                    
                    <div class="sm:col-span-1">
                        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Preço</dt>
                        <dd class="mt-1 text-sm text-gray-900 dark:text-white">R$ {{ number_format($plan->price, 2, ',', '.') }}</dd>
                    </div>
                    
                    <div class="sm:col-span-1">
                        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Limite de Consultas</dt>
                        <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ number_format($plan->queries_limit, 0, ',', '.') }}</dd>
                    </div>
                    
                    <div class="sm:col-span-1">
                        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                        <dd class="mt-1 text-sm">
                            @if($plan->is_active)
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                                    Ativo
                                </span>
                            @else
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                                    Inativo
                                </span>
                            @endif
                        </dd>
                    </div>
                    
                    <div class="sm:col-span-1">
                        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Destaque</dt>
                        <dd class="mt-1 text-sm">
                            @if($plan->is_featured)
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                                    Em Destaque
                                </span>
                            @else
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                                    Normal
                                </span>
                            @endif
                        </dd>
                    </div>
                    
                    <div class="sm:col-span-2">
                        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Descrição</dt>
                        <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ $plan->description ?? 'Sem descrição' }}</dd>
                    </div>
                    
                    <div class="sm:col-span-2">
                        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Data de Criação</dt>
                        <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ $plan->created_at->format('d/m/Y H:i') }}</dd>
                    </div>
                </dl>
            </x-card>
            
            <x-card title="Recursos Incluídos">
                <ul class="space-y-3">
                    @php
                        $features = $plan->features ?? [];
                        if (!is_array($features)) {
                            $features = json_decode($features, true) ?? [];
                        }
                        
                        $featureLabels = [
                            'api_access' => 'Acesso à API REST',
                            'detailed_data' => 'Dados detalhados de CPF',
                            'priority_support' => 'Suporte prioritário',
                            'dashboard' => 'Dashboard de análise',
                            'multiple_users' => 'Múltiplos usuários',
                        ];
                    @endphp
                    
                    @foreach($featureLabels as $key => $label)
                        <li class="flex items-start">
                            @if(in_array($key, $features))
                                <i class="fas fa-check-circle text-green-500 dark:text-green-400 mt-0.5 mr-2"></i>
                                <span class="text-gray-900 dark:text-white">{{ $label }}</span>
                            @else
                                <i class="fas fa-times-circle text-red-500 dark:text-red-400 mt-0.5 mr-2"></i>
                                <span class="text-gray-500 dark:text-gray-400">{{ $label }}</span>
                            @endif
                        </li>
                    @endforeach
                </ul>
            </x-card>
        </div>
        
        <x-card title="Assinantes Ativos" class="mt-6">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Usuário</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Data de Assinatura</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Consultas Usadas</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        @forelse($plan->subscriptions as $subscription)
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ $subscription->user->name }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ $subscription->user->email }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ $subscription->created_at->format('d/m/Y') }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ $subscription->queries_count }} / {{ $plan->queries_limit }}</td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="4" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">
                                Nenhum usuário assinante deste plano.
                            </td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </x-card>
    </div>
</div>
@endsection 