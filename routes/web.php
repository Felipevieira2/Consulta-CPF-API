<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsageController;
use App\Http\Controllers\ApiKeyController;
use App\Http\Controllers\BillingController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Admin\PlanController;
use App\Http\Controllers\Admin\ApiLogController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\ProfileController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Rotas públicas
Route::get('/', function () {
    return view('home');
})->name('home');

Route::get('/home', function () {
    return redirect()->route('admin.dashboard');    
})->name('home');

Route::get('/features', function () {
    return view('features');
})->name('features');

Route::get('/pricing', function () {
    return view('pricing');
})->name('pricing');

Route::get('/contact', function () {
    return view('contact');
})->name('contact');

Route::get('/documentation', function () {
    return view('documentation');
})->name('documentation');

// Rotas de Autenticação
Route::middleware('guest')->group(function () {
    // Autenticação
    Route::controller(LoginController::class)->group(function () {
        Route::get('/login', 'showLoginForm')->name('login');
        Route::post('/login', 'login');
        Route::post('/logout', 'logout')->name('logout')->withoutMiddleware('guest');
    });
    
    // Registro
    Route::controller(RegisterController::class)->group(function () {
        Route::get('/register', 'showRegistrationForm')->name('register');
        Route::post('/register', 'register');
    });
    
    // Recuperação de senha
    Route::controller(ForgotPasswordController::class)->group(function () {
        Route::get('/password/reset', 'showLinkRequestForm')->name('password.request');
        Route::post('/password/email', 'sendResetLinkEmail')->name('password.email');
    });
    
    Route::controller(ResetPasswordController::class)->group(function () {
        Route::get('/password/reset/{token}', 'showResetForm')->name('password.reset');
        Route::post('/password/reset', 'reset')->name('password.update');
    });
});

// Rotas do Dashboard (protegidas por autenticação)
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard principal
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Gerenciamento de API
    Route::get('/dashboard/api', [DashboardController::class, 'api'])->name('dashboard.api');
    
    // Gerenciamento de conta e faturamento
    Route::get('/billing', [BillingController::class, 'index'])->name('billing');
    Route::get('/usage', [UsageController::class, 'index'])->name('usage');
    
    // Checkout e pagamentos
    Route::post('/checkout', [TransactionController::class, 'checkout'])->name('checkout');
    Route::post('/process-payment/{transaction}', [TransactionController::class, 'processPayment'])->name('process-payment');
    
    // Gerenciamento de usuários
    Route::resource('users', UserController::class);
    
    // Gerenciamento de planos
    Route::get('/plans', [PlanController::class, 'index'])->name('plans.index');
    Route::get('/plans/create', [PlanController::class, 'create'])->name('plans.create');
    Route::post('/plans', [PlanController::class, 'store'])->name('plans.store');
    Route::get('/plans/{plan}', [PlanController::class, 'show'])->name('plans.show');
    Route::get('/plans/{plan}/edit', [PlanController::class, 'edit'])->name('plans.edit');
    Route::put('/plans/{plan}', [PlanController::class, 'update'])->name('plans.update');
    Route::delete('/plans/{plan}', [PlanController::class, 'destroy'])->name('plans.destroy');
    
    // Logs e configurações
    Route::get('/api-logs', [ApiLogController::class, 'index'])->name('api-logs.index');
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');

    // Gerenciamento de perfil
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile.index');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit'); 
    Route::get('/profile/password', [ProfileController::class, 'password'])->name('profile.password');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.updatePassword');
    // API Keys
    Route::resource('api-keys', ApiKeyController::class);
    
    // Transações
    Route::resource('transactions', TransactionController::class)->only(['index', 'show']);
});




