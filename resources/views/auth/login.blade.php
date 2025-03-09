@extends('layouts.home')

@section('content')
<div class="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100 dark:bg-gray-900 transition-colors duration-200 dark:bg-gray-900 transition-colors duration-200">
    <x-card class="w-full sm:max-w-md ">
        <div class="text-center">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Login</h2>
        </div>

        <form method="POST" action="{{ route('login') }}">
            @csrf

            <x-forms.input
                type="email"
                name="email"
                label="E-mail"
                required
                autofocus
                autocomplete="email"
            />

            <x-forms.input
                type="password"
                name="password"
                label="Senha"
                required
                autocomplete="current-password"
            />

            <x-forms.checkbox
                name="remember"
                id="remember"
                label="Lembrar-me"
                :checked="old('remember')"
            />

            <div class="flex items-center justify-between mt-4">
                @if (Route::has('password.request'))
                    <a class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200" href="{{ route('password.request') }}">
                        Esqueceu sua senha?
                    </a>
                @endif

                <x-forms.button class="cursor-pointer" type="submit" variant="primary">
                    Entrar
                </x-forms.button>
            </div>

            <div class="text-center mt-4">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                    Não tem uma conta? 
                    <a href="{{ route('register') }}" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 transition-colors duration-200">
                        Registre-se
                    </a>
                </p>
            </div>
        </form>
    </x-card>
</div>
@endsection
