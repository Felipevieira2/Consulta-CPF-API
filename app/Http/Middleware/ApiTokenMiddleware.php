<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;
use Symfony\Component\HttpFoundation\Response;

class ApiTokenMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure $next
     * @return Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            // Verificar se há um token na requisição (query parameter ou header)
            $tokenFromRequest = $request->query('api_token') ?? $request->bearerToken();
            
            if (!$tokenFromRequest) {
                return response()->json([
                    'status' => 'erro',
                    'mensagem' => 'Token de API não fornecido',
                    'codigo' => 401
                ], 401);
            }
            
            // Verificar se o token está no formato ID|hash ou apenas hash
            $accessToken = null;
            
            if (strpos($tokenFromRequest, '|') !== false) {
                // Token completo (ID|hash)
                $accessToken = PersonalAccessToken::findToken($tokenFromRequest);
            } else {
                // Apenas hash - buscar diretamente na tabela
                // $hashedToken = hash('sha256', $tokenFromRequest);
                $accessToken = PersonalAccessToken::where('token', $tokenFromRequest)->first();
            }
            
            if (!$accessToken) {
                return response()->json([
                    'status' => 'erro',
                    'mensagem' => 'Token de API inválido ou expirado',
                    'codigo' => 401
                ], 401);
            }
            
            // Obter o usuário associado ao token
            $user = $accessToken->tokenable;
            
            if (!$user) {
                return response()->json([
                    'status' => 'erro',
                    'mensagem' => 'Usuário não encontrado ou desativado',
                    'codigo' => 401
                ], 401);
            }
            
            // Autenticar o usuário
            auth()->login($user);
            
            // Atualizar último uso do token
            $accessToken->last_used_at = now();
            $accessToken->save();
            
            return $next($request);
            
        } catch (\Exception $e) {
            // Log do erro para debug
            \Log::error('Erro no middleware de token:', [
                'error' => $e->getMessage(),
                'token' => $tokenFromRequest ?? 'não fornecido',
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'status' => 'erro',
                'mensagem' => 'Erro ao processar autenticação',
                'codigo' => 500
            ], 500);
        }
    }
} 