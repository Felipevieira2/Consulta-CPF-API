@props([
    'title' => '',
    'footer' => false,
    'padding' => 'p-6',
    'rounded' => 'rounded-xl',
    'shadow' => 'shadow-lg',
    'border' => '',
    'hover' => false,
    'width' => '',    // Nova propriedade
    'height' => ''          // Nova propriedade
])

@php
    $hoverClasses = $hover ? 'hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1' : '';
    $classes = "bg-white dark:bg-gray-800 {$rounded} {$shadow} {$border} {$hoverClasses} transition-colors duration-200";
    if ($width) {
        $classes .= " {$width}";
    }
@endphp


<div {{ $attributes->merge(['class' => $classes]) }}>
    @if($title)
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ $title }}</h3>
        </div>
    @endif
    
    <div class="{{ $padding }}">
        {{ $slot }}
    </div>
    
    @if($footer)
        <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 {{ $rounded ? 'rounded-b-xl' : '' }}">
            {{ $footer }}
        </div>
    @endif
</div> 