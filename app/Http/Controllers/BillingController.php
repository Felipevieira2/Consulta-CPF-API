<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\Transaction;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BillingController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    /**
     * Exibe a página de faturamento para o admin
     */
    public function index()
    {
        $user = Auth::user();
        $transactions = Transaction::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);
            
        return view('admin.billing.index', compact('transactions'));
    }
    
    /**
     * Exibe a página de faturamento para o cliente
     */
    public function customerBilling()
    {
        $user = Auth::user();
        $transactions = Transaction::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);
            
        $subscription = $user->subscription;
        $plan = $subscription ? $subscription->plan : null;
        
        return view('customer.billing', compact('transactions', 'subscription', 'plan'));
    }
    
    /**
     * Exibe a página de assinatura para o cliente
     */
    public function subscription()
    {
        $user = Auth::user();
        $subscription = $user->subscription;
        $plan = $subscription ? $subscription->plan : null;
        $availablePlans = Plan::where('is_active', true)->get();
        
        return view('customer.subscription', compact('subscription', 'plan', 'availablePlans'));
    }
    
    /**
     * Altera o plano da assinatura do cliente
     */
    public function changeSubscription(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id',
        ]);
        
        $user = Auth::user();
        $newPlan = Plan::findOrFail($request->plan_id);
        
        // Verificar se o usuário já tem uma assinatura
        $subscription = $user->subscription;
        
        if ($subscription) {
            // Atualizar assinatura existente
            $subscription->plan_id = $newPlan->id;
            $subscription->next_billing_date = now()->addMonth();
            $subscription->save();
            
            $message = 'Seu plano foi alterado com sucesso para ' . $newPlan->name;
        } else {
            // Criar nova assinatura
            $subscription = new Subscription();
            $subscription->user_id = $user->id;
            $subscription->plan_id = $newPlan->id;
            $subscription->status = 'active';
            $subscription->next_billing_date = now()->addMonth();
            $subscription->save();
            
            // Adicionar créditos iniciais ao usuário
            $user->credits = $newPlan->credits;
            $user->save();
            
            $message = 'Assinatura realizada com sucesso no plano ' . $newPlan->name;
        }
        
        // Registrar transação
        $transaction = new Transaction();
        $transaction->user_id = $user->id;
        $transaction->plan_id = $newPlan->id;
        $transaction->amount = $newPlan->price;
        $transaction->status = 'completed';
        $transaction->description = 'Assinatura do plano ' . $newPlan->name;
        $transaction->save();
        
        return redirect()->route('customer.billing')->with('success', $message);
    }
    
    /**
     * Cancela a assinatura do cliente
     */
    public function cancelSubscription()
    {
        $user = Auth::user();
        $subscription = $user->subscription;
        
        if ($subscription) {
            $subscription->status = 'cancelled';
            $subscription->save();
            
            return redirect()->route('customer.billing')->with('success', 'Sua assinatura foi cancelada com sucesso. Você ainda terá acesso aos serviços até o final do período atual.');
        }
        
        return redirect()->route('customer.billing')->with('error', 'Você não possui uma assinatura ativa.');
    }
}
