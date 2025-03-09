@props([
    'name',
    'label' => '',
    'options' => [],
    'selected' => '',
    'required' => false,
    'inline' => false,
    'helper' => '',
    'error' => ''
])

@php
    $hasError = $errors->has($name) || $error;
    $errorMessage = $errors->first($name) ?? $error;
    $selected = old($name, $selected);
@endphp

<div class="mb-4">
    @if($label)
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $label }}
            @if($required)
                <span class="text-red-500 dark:text-red-400">*</span>
            @endif
        </label>
    @endif

    <div class="{{ $inline ? 'flex flex-wrap gap-4' : 'space-y-2' }}">
        @foreach($options as $value => $optionLabel)
            <x-forms.radio 
                name="{{ $name }}" 
                id="{{ $name }}_{{ $value }}" 
                value="{{ $value }}" 
                label="{{ $optionLabel }}" 
                :checked="$selected == $value"
            />
        @endforeach
    </div>

    @if($helper && !$hasError)
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ $helper }}</p>
    @endif

    @if($hasError)
        <p class="mt-1 text-sm text-red-500 dark:text-red-400">{{ $errorMessage }}</p>
    @endif
</div> 