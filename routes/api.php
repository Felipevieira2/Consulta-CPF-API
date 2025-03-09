<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CpfController;
use App\Http\Controllers\ConsultaReceitaController;


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
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/cpf/validate', [CpfController::class, 'validateCpf'])->name('api.cpf.validate');
});


Route::get('/cpf', [ConsultaReceitaController::class, 'getHtml'])->name('api.cpf.validate');