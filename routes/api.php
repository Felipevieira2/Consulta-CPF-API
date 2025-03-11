<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CpfController;
use App\Http\Controllers\ConsultaReceitaController;
use Laravel\Sanctum\PersonalAccessToken;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Rotas da API de consulta de CPF
Route::prefix('v1')->group(function () {
    Route::get('/get-cpf', [CpfController::class, 'getDadosCpf'])
        ->middleware('api.token')
        ->name('api.cpf');
});

// Route::post('/generate-token', function (Request $request) {
//     // Validar a requisição
//     $request->validate([
//         'user_id' => 'required|exists:users,id',
//         'token_name' => 'required|string',
//     ]);
    
//     // Buscar o usuário
//     $user = \App\Models\User::find($request->user_id);
    
//     // Gerar um token permanente (sem expiração)
//     $token = $user->createToken($request->token_name)->plainTextToken;
    
//     return response()->json([
//         'token' => $token,
//         'message' => 'Token gerado com sucesso'
//     ]);
// })->middleware('auth:sanctum'); // Proteger este endpoint

Route::get('/test-token', function (Request $request) {
    $tokenFromRequest = $request->query('api_token') ?? $request->bearerToken();
    
    if (!$tokenFromRequest) {
        return response()->json(['message' => 'Token não fornecido'], 400);
    }
    
    // Tentar encontrar o token no formato completo
    $accessToken = PersonalAccessToken::findToken($tokenFromRequest);
    
    if (!$accessToken) {
        // Tentar encontrar o token apenas pelo hash
        $hashedToken = hash('sha256', $tokenFromRequest);
        $accessToken = PersonalAccessToken::where('token', $hashedToken)->first();
     
        if (!$accessToken) {
            return response()->json([
                'message' => 'Token não encontrado',
                'token_provided' => $tokenFromRequest,
                'hashed_token' => $hashedToken
            ], 404);
        }
    }
    
    return response()->json([
        'message' => 'Token válido',
        'token_id' => $accessToken->id,
        'token_name' => $accessToken->name,
        'user_id' => $accessToken->tokenable_id,
        'user_type' => $accessToken->tokenable_type
    ]);
});


