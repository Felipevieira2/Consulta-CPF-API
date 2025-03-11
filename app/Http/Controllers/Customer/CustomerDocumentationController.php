<?php

namespace App\Http\Controllers\Customer;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class CustomerDocumentationController extends Controller
{
    /**
     * Exibe a página de documentação da API
     */
   
    public function index()
    {
        $user = Auth::user();
        
        // Obter a assinatura ativa do usuário
        $subscription = $user->subscription;
            
        // Obter limites de uso do plano
        $plan = $subscription ? $subscription->plan : null;
        
        $rate_limit_per_minute = $plan ? $plan->rate_limit_per_minute : 10;
        $rate_limit_per_day = $plan ? $plan->rate_limit_per_day : 1000;
        $rate_limit_per_month = $plan ? $plan->rate_limit_per_month : 10000;
        
        return view('customer.documentation', compact(
            'rate_limit_per_minute',
            'rate_limit_per_day',
            'rate_limit_per_month'
        ));
    }   
} 