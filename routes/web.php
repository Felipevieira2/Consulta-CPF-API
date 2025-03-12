<?php

use App\Models\Plan;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsageController;
use App\Http\Controllers\ApiKeyController;
use App\Http\Controllers\Admin\PlanController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\Admin\ApiLogController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Customer\DashboardController as CustomerDashboardController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\PermissionController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Customer\CustomerDocumentationController;
use App\Http\Controllers\Customer\CustomerApiLogController;
use App\Http\Controllers\Customer\CustomerProfileController;
use App\Http\Controllers\Customer\CustomerSettingsController;
use App\Http\Controllers\Customer\BillingController as CustomerBillingController;

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

// Adicione esta rota no início do seu arquivo de rotas
Route::get('/debug-role', function() {
    if (auth()->check()) {
        dd([
            'user' => auth()->user(),
            'roles' => auth()->user()->roles,
            'permissions' => auth()->user()->permissions ?? 'N/A',
            'is_admin' => auth()->user()->hasRole('admin'),
            'is_customer' => auth()->user()->hasRole('customer'),
            'all_roles' => auth()->user()->getRoleNames(),
        ]);
    } else {
        return "Usuário não está autenticado";
    }
});

// Rotas públicas
Route::get('/', function () {
    if (Auth::check()) {
        $user = Auth::user();
        
        if ($user->hasRole('admin')) {
            return redirect()->route('admin.dashboard');
        }
        
        return redirect()->route('customer.dashboard');
    }
    
    return view('home');
})->name('landing');

Route::get('/home', function () {
    if (Auth::check()) {
        $user = Auth::user();
        
        if ($user->hasRole('admin')) {
            return redirect()->route('admin.dashboard');
        }
        
        return redirect()->route('customer.dashboard');
    }
  
})->name('home');

Route::get('/features', function () {
    return view('features');
})->name('features');

Route::get('/pricing', function () {
    $plans = Plan::where('is_active', true)->get();
    return view('pricing', compact('plans'));
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
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
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

    // Gerenciamento de roles
    Route::resource('roles', RoleController::class);
    Route::get('users/{user}/roles', [UserController::class, 'editRoles'])->name('users.roles');
    Route::put('users/{user}/roles', [UserController::class, 'updateRoles'])->name('users.roles.update');

    // Gerenciamento de permissões
    Route::resource('permissions', PermissionController::class);

    // Rotas de planos
    Route::resource('plans', PlanController::class);
});

// Rotas da Área do Cliente (protegidas por autenticação)
Route::middleware(['auth', 'verified', 'role:customer'])->prefix('customer')->name('customer.')->group(function () {
    Route::get('/dashboard', [CustomerDashboardController::class, 'index'])->name('dashboard');
    Route::get('/documentation', [CustomerDocumentationController::class, 'index'])->name('documentation');
    Route::get('/api-log', [CustomerApiLogController::class, 'index'])->name('api-log.index');
    Route::get('/api-log/{log}', [CustomerApiLogController::class, 'show'])->name('api-log.show');
    Route::get('/profile', [CustomerProfileController::class, 'index'])->name('profile');
    Route::get('/settings', [CustomerSettingsController::class, 'index'])->name('settings');
    
    // Gerenciamento de API Keys
    Route::resource('api-keys', ApiKeyController::class)->except(['edit', 'update']);
    Route::get('api-keys/{apiKey}/toggle', [ApiKeyController::class, 'toggleStatus'])->name('api-keys.toggle');
    Route::get('api-documentation', [ApiKeyController::class, 'documentation'])->name('api-documentation');
    
    // Faturamento e assinatura
    Route::prefix('billing')->name('billing.')->group(function () {
        Route::get('/', [CustomerBillingController::class, 'index'])->name('index');
        Route::get('/transactions', [CustomerBillingController::class, 'transactions'])->name('transactions');
        Route::get('/current-plan', [CustomerBillingController::class, 'currentPlan'])->name('current-plan');
        Route::get('/plans', [CustomerBillingController::class, 'plans'])->name('plans');
        Route::get('/checkout/{plan}', [CustomerBillingController::class, 'checkout'])->name('checkout');
        Route::post('/process-payment/{plan}', [CustomerBillingController::class, 'processPayment'])->name('process-payment');
        Route::post('/cancel-subscription', [TransactionController::class, 'cancelSubscription'])->name('cancel-subscription');
    });
});




