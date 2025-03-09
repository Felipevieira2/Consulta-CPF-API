@extends('layouts.home')

@section('content')
<div class="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100 dark:bg-gray-900 transition-colors duration-200 dark:bg-gray-900 transition-colors duration-200">
    <x-card class="w-full sm:max-w-md mt-6">
        <div class="mb-4 text-center">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Redefinir Senha</h2>
        </div>

        <form method="POST" action="{{ route('password.update') }}">
            @csrf

            <input type="hidden" name="token" value="{{ $token }}">

            <x-forms.input
                type="email"
                name="email"
                label="E-mail"
                value="{{ $email ?? old('email') }}"
                required
                autocomplete="email"
                autofocus
            />

            <x-forms.input
                type="password"
                name="password"
                label="Nova Senha"
                required
                autocomplete="new-password"
            />

            <x-forms.input
                type="password"
                name="password_confirmation"
                label="Confirmar Nova Senha"
                required
                autocomplete="new-password"
            />

            <div class="flex items-center justify-end mt-4">
                <x-forms.button type="submit" variant="primary">
                    Redefinir Senha
                </x-forms.button>
            </div>
        </form>
    </x-card>
</div>
@endsection
