@props([
    'name',
    'id' => null,
    'label' => '',
    'checked' => false,
    'value' => '1',
    'disabled' => false,
    'helper' => '',
    'error' => ''
])

@php
    $id = $id ?? $name;
    $hasError = $errors->has($name) || $error;
    $errorMessage = $errors->first($name) ?? $error;
    $isChecked = old($name, $checked);
@endphp

<div class="mb-4">
    <div class="flex items-start">
        <div class="flex items-center h-5">
            <input 
                type="checkbox" 
                name="{{ $name }}" 
                id="{{ $id }}" 
                value="{{ $value }}" 
                {{ $isChecked ? 'checked' : '' }} 
                {{ $disabled ? 'disabled' : '' }} 
                {{ $attributes->merge([
                    'class' => 'h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 dark:text-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors duration-200' . 
                    ($hasError ? ' border-red-500 dark:border-red-400' : '')
                ]) }}
            >
        </div>
        
        @if($label)
            <div class="ml-3 text-sm">
                <label for="{{ $id }}" class="font-medium text-gray-700 dark:text-gray-300">{{ $label }}</label>
                
                @if($helper && !$hasError)
                    <p class="text-gray-500 dark:text-gray-400">{{ $helper }}</p>
                @endif
            </div>
        @endif
    </div>

    @if($hasError)
        <p class="mt-1 text-sm text-red-500 dark:text-red-400">{{ $errorMessage }}</p>
    @endif
</div> 