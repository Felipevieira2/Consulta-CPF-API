@extends('layouts.admin')

@section('content')
<div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Configurações do Sistema</h1>
        
        <div class="mt-6">
            <div class="hidden sm:block">
                <div class="border-b border-gray-200 dark:border-gray-700">
                    <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                        <button id="tab-general" class="tab-button border-indigo-500 text-indigo-600 dark:text-indigo-400 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer">
                            Geral
                        </button>
                        <button id="tab-api" class="tab-button border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer">
                            API
                        </button>
                        <button id="tab-email" class="tab-button border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer">
                            E-mail
                        </button>
                        <button id="tab-security" class="tab-button border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer">
                            Segurança
                        </button>
                    </nav>
                </div>
            </div>
            
            <!-- Configurações Gerais -->
            <div id="content-general" class="tab-content">
                <x-card class="mt-6">
                    <form action="{{ route('admin.settings.update') }}" method="POST">
                        @csrf
                        <input type="hidden" name="section" value="general">
                        
                        <x-forms.input
                            name="settings[site_name]"
                            label="Nome do Site"
                            value="{{ $settings['site_name'] ?? 'API de Consulta CPF' }}"
                            required
                        />
                        
                        <x-forms.input
                            name="settings[site_url]"
                            label="URL do Site"
                            value="{{ $settings['site_url'] ?? config('app.url') }}"
                            required
                        />
                        
                        <x-forms.textarea
                            name="settings[site_description]"
                            label="Descrição do Site"
                            value="{{ $settings['site_description'] ?? '' }}"
                            rows="4"
                        />
                        
                        <div class="mt-4">
                            <x-forms.button type="submit" variant="primary" class="cursor-pointer">
                                Atualizar Configurações
                            </x-forms.button>
                        </div>
                    </form>
                </x-card>
            </div>
        </div>
    </div>
</div>
@endsection 