@extends('layouts.admin')

@section('content')
<div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
            <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Editar Plano</h1>
            <x-forms.button variant="secondary" class="cursor-pointer" onclick="window.location.href='{{ route('admin.plans.index') }}'">
                <i class="fas fa-arrow-left mr-2"></i> Voltar
            </x-forms.button>
        </div>
        
        <x-card class="mt-6">
            <form action="{{ route('admin.plans.update', $plan->id) }}" method="POST">
                @csrf
                @method('PUT')
                
                <x-forms.input
                    name="name"
                    label="Nome do Plano"
                    value="{{ old('name', $plan->name) }}"
                    required
                />
                
                <x-forms.input
                    type="number"
                    name="price"
                    label="Preço Mensal (R$)"
                    value="{{ old('price', $plan->price) }}"
                    step="0.01"
                    min="0"
                    required
                />
                
                <x-forms.input
                    type="number"
                    name="credits"
                    label="Limite de Consultas"
                    value="{{ old('credits', $plan->credits) }}"
                    min="1"
                    required
                />
                
                <x-forms.textarea
                    name="description"
                    label="Descrição"
                    value="{{ old('description', $plan->description) }}"
                    rows="4"
                />
                
                <div class="mt-4">
                    <x-forms.checkbox
                        name="is_featured"
                        id="is_featured"
                        label="Plano em Destaque"
                        helper="Marque esta opção para destacar este plano na página de preços"
                        :checked="old('is_featured', $plan->is_featured)"
                    />
                </div>
                
                <div class="mt-4">
                    <x-forms.checkbox
                        name="is_active"
                        id="is_active"
                        label="Plano Ativo"
                        :checked="old('is_active', $plan->is_active)"
                    />
                </div>
                
                <div class="mt-6">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">Recursos do Plano</h3>
                    
                    <div class="space-y-2">
                        @php
                            $features = old('features', $plan->features ?? []);
                            if (!is_array($features)) {
                                $features = json_decode($features, true) ?? [];
                            }
                        @endphp
                        
                        <x-forms.checkbox
                            name="features[]"
                            id="feature_api_access"
                            value="api_access"
                            label="Acesso à API REST"
                            :checked="in_array('api_access', $features)"
                        />
                        
                        <x-forms.checkbox
                            name="features[]"
                            id="feature_detailed_data"
                            value="detailed_data"
                            label="Dados detalhados de CPF"
                            :checked="in_array('detailed_data', $features)"
                        />
                        
                        <x-forms.checkbox
                            name="features[]"
                            id="feature_priority_support"
                            value="priority_support"
                            label="Suporte prioritário"
                            :checked="in_array('priority_support', $features)"
                        />
                        
                        <x-forms.checkbox
                            name="features[]"
                            id="feature_dashboard"
                            value="dashboard"
                            label="Dashboard de análise"
                            :checked="in_array('dashboard', $features)"
                        />
                        
                        <x-forms.checkbox
                            name="features[]"
                            id="feature_multiple_users"
                            value="multiple_users"
                            label="Múltiplos usuários"
                            :checked="in_array('multiple_users', $features)"
                        />
                    </div>
                </div>
                
                <div class="mt-6 flex justify-end">
                    <x-forms.button type="submit" variant="primary" class="cursor-pointer">
                        Atualizar Plano
                    </x-forms.button>
                </div>
            </form>
        </x-card>
    </div>
</div>
@endsection 