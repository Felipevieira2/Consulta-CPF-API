@props([
    'name',
    'id' => null,
    'label' => '',
    'required' => false,
    'disabled' => false,
    'options' => [],
    'selected' => '',
    'placeholder' => 'Selecione uma opção',
    'helper' => '',
    'error' => ''
])

@php
    $id = $id ?? $name;
    $hasError = $errors->has($name) || $error;
    $errorMessage = $errors->first($name) ?? $error;
    $selected = old($name, $selected);
@endphp

<div class="mb-4">
    @if($label)
        <label for="{{ $id }}" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ $label }}
            @if($required)
                <span class="text-red-500 dark:text-red-400">*</span>
            @endif
        </label>
    @endif

    <div class="relative">
        <select 
            name="{{ $name }}" 
            id="{{ $id }}" 
            {{ $required ? 'required' : '' }} 
            {{ $disabled ? 'disabled' : '' }} 
            {{ $attributes->merge([
                'class' => 'block appearance-none w-full px-4 py-2 pr-8 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus-visible:outline-none transition-colors duration-200 ' . 
                ($hasError 
                    ? 'border-red-500 dark:border-red-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white' 
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white')
            ]) }}
        >
            @if($placeholder)
                <option value="" disabled {{ $selected ? '' : 'selected' }}>{{ $placeholder }}</option>
            @endif
            
            @foreach($options as $value => $label)
                <option value="{{ $value }}" {{ $selected == $value ? 'selected' : '' }}>{{ $label }}</option>
            @endforeach
        </select>
        
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
        </div>
    </div>

    @if($helper && !$hasError)
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ $helper }}</p>
    @endif

    @if($hasError)
        <p class="mt-1 text-sm text-red-500 dark:text-red-400">{{ $errorMessage }}</p>
    @endif
</div> 