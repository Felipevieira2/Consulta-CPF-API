@extends('layouts.home')

@section('content')
<div class="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100 dark:bg-gray-900 transition-colors duration-200 dark:bg-gray-900 transition-colors duration-200">
    <x-card class="w-full sm:max-w-md mt-6">
        <div class="mb-4 text-center">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Recuperar Senha</h2>
        </div>

        @if (session('status'))
            <div class="mb-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded relative" role="alert">
                <span class="block sm:inline">{{ session('status') }}</span>
            </div>
        @endif

        <form method="POST" action="{{ route('password.email') }}">
            @csrf

            <x-forms.input
                type="email"
                name="email"
                label="E-mail"
                required
                autofocus
                autocomplete="email"
            />

            <div class="flex items-center justify-end mt-4">
                <x-forms.button type="submit" variant="primary">
                    Enviar Link de Recuperação
                </x-forms.button>
            </div>
        </form>
    </x-card>
</div>
@endsection
