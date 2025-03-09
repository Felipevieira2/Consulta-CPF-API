@extends('layouts.admin')

@section('content')
<div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Meu Perfil</h1>
        
        <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <x-card title="Informações Pessoais">
                <form action="{{ route('admin.profile.update', $user->id) }}" method="POST">
                    @csrf
                    @method('PUT')
                    
                    <x-forms.input
                        name="name"
                        label="Nome"
                        value="{{ old('name', $user->name) }}"
                        required
                    />
                    
                    <x-forms.input
                        type="email"
                        name="email"
                        label="E-mail"
                        value="{{ old('email', $user->email) }}"
                        required
                        disabled
                        helper="O e-mail não pode ser alterado."
                    />
                    
                    <div class="mt-4">
                        <x-forms.button type="submit" variant="primary" class="cursor-pointer">
                            Atualizar Perfil
                        </x-forms.button>
                    </div>
                </form>
            </x-card>
            
            <x-card title="Alterar Senha">
                <form action="{{ route('admin.profile.password', $user->id) }}" method="POST">
                    @csrf
                    @method('PUT')
                    
                    <x-forms.input
                        type="password"
                        name="current_password"
                        label="Senha Atual"
                        required
                    />
                    
                    <x-forms.input
                        type="password"
                        name="password"
                        label="Nova Senha"
                        required
                    />
                    
                    <x-forms.input
                        type="password"
                        name="password_confirmation"
                        label="Confirmar Nova Senha"
                        required
                    />
                    
                    <div class="mt-4">
                        <x-forms.button type="submit" variant="primary" class="cursor-pointer">
                            Alterar Senha
                        </x-forms.button>
                    </div>
                </form>
            </x-card>
        </div>
        
        <div class="mt-6">
            <x-card title="Preferências">
                <form action="{{ route('admin.profile.preferences', $user->id) }}" method="POST">
                    @csrf
                    @method('PUT')
                    
                    <div class="space-y-4">
                        <x-forms.checkbox
                            name="preferences[email_notifications]"
                            id="email_notifications"
                            label="Receber notificações por e-mail"
                            :checked="$user->preferences['email_notifications'] ?? true"
                        />
                        
                        <x-forms.checkbox
                            name="preferences[two_factor_auth]"
                            id="two_factor_auth"
                            label="Ativar autenticação de dois fatores"
                            :checked="$user->preferences['two_factor_auth'] ?? false"
                        />
                        
                        <x-forms.select
                            name="preferences[language]"
                            label="Idioma"
                            :options="['pt_BR' => 'Português (Brasil)', 'en' => 'English', 'es' => 'Español']"
                            :selected="$user->preferences['language'] ?? 'pt_BR'"
                        />
                    </div>
                    
                    <div class="mt-4">
                        <x-forms.button type="submit" variant="primary" class="cursor-pointer">
                            Salvar Preferências
                        </x-forms.button>
                    </div>
                </form>
            </x-card>
        </div>
        
        <div class="mt-6">
            <x-card title="Atividade da Conta">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead class="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Atividade</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Data</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">IP</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                            @forelse($activities as $activity)
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ $activity->description }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ $activity->created_at->format('d/m/Y H:i') }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ $activity->ip_address }}</td>
                            </tr>
                            @empty
                            <tr>
                                <td colspan="3" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">
                                    Nenhuma atividade registrada.
                                </td>
                            </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </x-card>
        </div>
    </div>
</div>
@endsection 