@extends('layouts.home')

@section('content')
<div class="py-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
            <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                Planos e Preços
            </h2>
            <p class="mt-4 text-xl text-gray-600 dark:text-gray-300">
                Escolha o plano ideal para suas necessidades de consulta de CPF
            </p>
        </div>

        <div class="mt-12 space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            @foreach($plans as $plan)
            <x-card class="flex flex-col border {{ $plan['is_featured'] ? 'border-2 border-indigo-500 dark:border-indigo-400 transform scale-105' : 'border-gray-200 dark:border-gray-700' }}" hover>
                <div class="p-6">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white">{{ $plan['name'] }}</h3>
                    <div class="mt-4 flex items-baseline">
                        <span class="text-4xl font-extrabold text-gray-900 dark:text-white">R$ {{ $plan['price'] }}</span>
                        <span class="ml-1 text-xl font-semibold text-gray-500 dark:text-gray-400">/mês</span>
                    </div>
                    <p class="mt-4 text-gray-600 dark:text-gray-300">
                        {{ $plan['description'] }}
                    </p>

                    <ul class="mt-6 space-y-4">
                       
                        <li class="flex items-start">
                            <div class="flex-shrink-0">
                                <i class="fas fa-check text-green-500 dark:text-green-400"></i>
                            </div>
                            <p class="ml-3 text-gray-700 dark:text-gray-300">{{ $plan['credits'] }} consultas por mês</p>
                        </li>
                   
                    </ul>
                </div>

                <div class="p-6 {{ !$plan['is_featured'] ? 'bg-gray-50 dark:bg-gray-800 rounded-b-xl' : '' }} mt-auto">
                    <x-forms.button variant="primary" class="w-full">
                        Escolher Plano
                    </x-forms.button>
                </div>
            </x-card>
            @endforeach
        </div>
        
        <div class="mt-12 text-center">
            <p class="text-gray-400 mb-4">Precisa de um plano personalizado?</p>
            <a href="{{ route('contact') }}" class="inline-flex items-center px-4 py-2 border border-indigo-600 rounded-md font-semibold text-xs text-indigo-600 uppercase tracking-widest hover:bg-indigo-50 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 disabled:opacity-25 transition ease-in-out duration-150">
                Entre em contato
            </a>
        </div>
    </div>
</div>
@endsection 