@extends('layouts.admin')

@section('content')
<div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
            <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Novo Plano</h1>
            <x-forms.button variant="secondary" class="cursor-pointer" onclick="window.location.href='{{ route('admin.plans.index') }}'">
                <i class="fas fa-arrow-left mr-2"></i> Voltar
            </x-forms.button>
        </div>
        
        <x-card class="mt-6">
            <form action="{{ route('admin.plans.store') }}" method="POST">
                @csrf
                
                <x-forms.input
                    name="name"
                    label="Nome do Plano"
                    placeholder="Ex: Plano Básico"
                    required
                    autofocus
                />
                
                <x-forms.input
                    type="number"
                    name="price"
                    label="Preço Mensal (R$)"
                    placeholder="Ex: 49.90"
                    step="0.01"
                    min="0"
                    required
                />
                
                <x-forms.input
                    type="number"
                    name="queries_limit"
                    label="Limite de Consultas"
                    placeholder="Ex: 1000"
                    min="1"
                    required
                />
                
                <x-forms.textarea
                    name="description"
                    label="Descrição"
                    placeholder="Descreva os benefícios e características do plano"
                    rows="4"
                />
                
                <div class="mt-4">
                    <x-forms.checkbox
                        name="is_featured"
                        id="is_featured"
                        label="Plano em Destaque"
                        helper="Marque esta opção para destacar este plano na página de preços"
                    />
                </div>
                
                <div class="mt-4">
                    <x-forms.checkbox
                        name="is_active"
                        id="is_active"
                        label="Plano Ativo"
                        checked
                    />
                </div>
                
                <div class="mt-6">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">Recursos do Plano</h3>
                    
                    <div class="space-y-2">
                        <x-forms.checkbox
                            name="features[]"
                            id="feature_api_access"
                            value="api_access"
                            label="Acesso à API REST"
                            checked
                        />
                        
                        <x-forms.checkbox
                            name="features[]"
                            id="feature_detailed_data"
                            value="detailed_data"
                            label="Dados detalhados de CPF"
                        />
                        
                        <x-forms.checkbox
                            name="features[]"
                            id="feature_priority_support"
                            value="priority_support"
                            label="Suporte prioritário"
                        />
                        
                        <x-forms.checkbox
                            name="features[]"
                            id="feature_dashboard"
                            value="dashboard"
                            label="Dashboard de análise"
                        />
                        
                        <x-forms.checkbox
                            name="features[]"
                            id="feature_multiple_users"
                            value="multiple_users"
                            label="Múltiplos usuários"
                        />
                    </div>
                </div>
                
                <div class="mt-6 flex justify-end">
                    <x-forms.button type="submit" variant="primary" class="cursor-pointer">
                        Criar Plano
                    </x-forms.button>
                </div>
            </form>
        </x-card>
    </div>
</div>
@endsection 