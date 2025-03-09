@props([
    'name',
    'id' => null,
    'value' => '',
    'label' => '',
    'placeholder' => '',
    'required' => false,
    'disabled' => false,
    'rows' => 4,
    'helper' => '',
    'error' => ''
])

@php
    $id = $id ?? $name;
    $hasError = $errors->has($name) || $error;
    $errorMessage = $errors->first($name) ?? $error;
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

    <textarea 
        name="{{ $name }}" 
        id="{{ $id }}" 
        placeholder="{{ $placeholder }}" 
        {{ $required ? 'required' : '' }} 
        {{ $disabled ? 'disabled' : '' }} 
        rows="{{ $rows }}"
        {{ $attributes->merge([
            'class' => 'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus-visible:outline-none transition-colors duration-200 ' . 
            ($hasError 
                ? 'border-red-500 dark:border-red-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white' 
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white')
        ]) }}
    >{{ old($name, $value) }}</textarea>

    @if($helper && !$hasError)
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ $helper }}</p>
    @endif

    @if($hasError)
        <p class="mt-1 text-sm text-red-500 dark:text-red-400">{{ $errorMessage }}</p>
    @endif
</div> 