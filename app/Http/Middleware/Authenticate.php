<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        // Verifica se a requisição é para a API
        if ($request->is('api/*')) {
            // Retorna null para que o middleware retorne um erro 401
            return null;
        }
        
        // Para requisições web normais, redireciona para o login
        if (! $request->expectsJson()) {
            return route('login');
        }
        
        return null;
    }
}
