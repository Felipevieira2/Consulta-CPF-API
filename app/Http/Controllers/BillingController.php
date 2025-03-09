<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\Request;

class BillingController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    /**
     * Exibe a página de faturamento
     */
    public function index()
    {
        $user = auth()->user();
        $transactions = $user->transactions()
            ->with('plan')
            ->orderBy('created_at', 'desc')
            ->paginate(10);
            
        $plans = Plan::where('is_active', true)->get();
        
        return view('admin.billing.index', compact('transactions', 'plans'));
    }
}
