@extends('layouts.home')

@section('content')
<div class="min-h-screen flex flex-col sm:justify-center items-center pt-5 sm:pt-0 bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
    <x-card class="w-full sm:max-w-md ">
        <div class=" text-center">
            <h2 class="text-2xl font-bold">Criar Conta</h2>
        </div>

        <form method="POST" action="{{ route('register') }}">
            @csrf

            <div class="space-y-2">
                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome</label>
                    <input type="text" id="name" name="name" 
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                        placeholder="Seu nome completo" value="{{ old('name') }}" required autocomplete="name" autofocus>
                        
                </div>
                
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-mail</label>
                    <input type="email" id="email" name="email" 
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                        placeholder="seu@email.com" value="{{ old('email') }}" required autocomplete="email">
                </div>
                
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Senha</label>
                    <input type="password" id="password" name="password" 
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                        required autocomplete="new-password">
                </div>
                
                <div>
                    <label for="password-confirm" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirmar Senha</label>
                    <input type="password" id="password-confirm" name="password_confirmation" 
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                        required autocomplete="new-password">
                </div>
                
                <div class="flex items-center">
                    <input id="terms" name="terms" type="checkbox" 
                        class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                    <label for="terms" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Concordo com os termos e condições
                    </label>
                </div>
            </div>
            <div class="flex items-center justify-between mt-4">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                    Já tem uma conta? 
                    <a href="{{ route('login') }}" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 transition-colors duration-200">
                        login
                    </a>
                </p>
                <x-forms.button type="submit" variant="primary">
                    Registrar
                </x-forms.button>
            </div>
        </form>

    </x-card>
</div>
@endsection
