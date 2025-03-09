@extends('layouts.admin')

@section('content')
<div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
            <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Novo Usuário</h1>
            <x-forms.button variant="secondary" class="cursor-pointer" onclick="window.location.href='{{ route('admin.users.index') }}'">
                <i class="fas fa-arrow-left mr-2"></i> Voltar
            </x-forms.button>
        </div>
        
        <x-card class="mt-6">
            <form action="{{ route('admin.users.store') }}" method="POST">
                @csrf
                
                <x-forms.input
                    name="name"
                    label="Nome"
                    required
                    autofocus
                />
                
                <x-forms.input
                    type="email"
                    name="email"
                    label="E-mail"
                    required
                />
                
                <x-forms.select
                    name="role"
                    label="Função"
                    :options="['user' => 'Usuário', 'admin' => 'Administrador']"
                    :selected="old('role', 'user')"
                    required
                />
                
                <x-forms.input
                    type="password"
                    name="password"
                    label="Senha"
                    required
                />
                
                <x-forms.input
                    type="password"
                    name="password_confirmation"
                    label="Confirmar Senha"
                    required
                />
                
                <div class="mt-6 flex justify-end">
                    <x-forms.button type="submit" variant="primary" class="cursor-pointer">
                        Criar Usuário
                    </x-forms.button>
                </div>
            </form>
        </x-card>
    </div>
</div>
@endsection 