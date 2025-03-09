@props([
    'type' => 'button',
    'variant' => 'primary',
    'size' => 'md',
    'disabled' => false
])

@php
    $baseClasses = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 cursor-pointer hover:scale-105 ';
    
    $variants = [
        'primary' => 'bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:focus:ring-offset-gray-800',
        'secondary' => 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white focus:ring-gray-500 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-800',
        'success' => 'bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600 text-white focus:ring-green-500 dark:focus:ring-green-400 dark:focus:ring-offset-gray-800',
        'danger' => 'bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-600 text-white focus:ring-red-500 dark:focus:ring-red-400 dark:focus:ring-offset-gray-800',
        'warning' => 'bg-yellow-500 dark:bg-yellow-600 hover:bg-yellow-600 dark:hover:bg-yellow-500 text-white focus:ring-yellow-500 dark:focus:ring-yellow-400 dark:focus:ring-offset-gray-800',
        'info' => 'bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500 text-white focus:ring-blue-500 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-800',
        'light' => 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-gray-500 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-800',
        'dark' => 'bg-gray-800 dark:bg-gray-900 hover:bg-gray-900 dark:hover:bg-black text-white focus:ring-gray-500 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-800',
        'link' => 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:focus:ring-offset-gray-800',
    ];
    
    $sizes = [
        'xs' => 'px-2.5 py-1.5 text-xs',
        'sm' => 'px-3 py-2 text-sm',
        'md' => 'px-4 py-2 text-sm',
        'lg' => 'px-4 py-2 text-base',
        'xl' => 'px-6 py-3 text-base',
    ];
    
    $classes = $baseClasses . ' ' . $variants[$variant] . ' ' . $sizes[$size];
    
    if ($disabled) {
        $classes .= ' opacity-50 cursor-not-allowed';
    }
@endphp

<button 
    style="cursor: pointer;"
    type="{{ $type }}" 
    {{ $disabled ? 'disabled' : '' }} 
    {{ $attributes->merge(['class' => $classes]) }}
>
    {{ $slot }}
</button> 