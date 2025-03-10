import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true, // Garante o hot reload no Laravel
        }),
        tailwindcss(),
    ],
    server: {
        watch: {
            usePolling: true, // Essencial para mudanças em arquivos no Laravel
        },
    },
    css: {
        postcss: './postcss.config.js',
    },
    
});
