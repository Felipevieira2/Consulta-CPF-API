<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Plan;
use App\Models\UserPlan;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class BillingController extends Controller
{
    /**
     * Exibe a página principal de cobrança
     */
    public function index()
    {
        $user = Auth::user();
        $userPlan = UserPlan::where('user_id', $user->id)
            ->with('plan')
            ->first();
            
        $transactions = Transaction::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);
            
        $availablePlans = Plan::where('is_active', true)
            ->orderBy('price', 'asc')
            ->get();
            
        return view('customer.billing.index', compact('userPlan', 'transactions', 'availablePlans'));
    }
    
    /**
     * Exibe a página de histórico de transações
     */
    public function transactions()
    {
        $user = Auth::user();
        $transactions = Transaction::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(15);
            
        return view('customer.billing.transactions', compact('transactions'));
    }
    
    /**
     * Exibe a página de detalhes do plano atual
     */
    public function currentPlan()
    {
        $user = Auth::user();
        $userPlan = UserPlan::where('user_id', $user->id)
            ->with('plan')
            ->first();
            
        if (!$userPlan) {
            return redirect()->route('customer.billing.plans');
        }
        
        $nextBillingDate = Carbon::parse($userPlan->next_billing_date);
        $daysRemaining = now()->diffInDays($nextBillingDate, false);
        
        $recentTransactions = Transaction::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);
            
        return view('customer.billing.current-plan', compact('userPlan', 'daysRemaining', 'recentTransactions'));
    }
    
    /**
     * Exibe a página de seleção de planos
     */
    public function plans()
    {
        $user = Auth::user();
        $userPlan = UserPlan::where('user_id', $user->id)
            ->with('plan')
            ->first();
            
        $plans = Plan::where('is_active', true)
            ->orderBy('price', 'asc')
            ->get();
            
        return view('customer.billing.plans', compact('plans', 'userPlan'));
    }
    
    /**
     * Exibe a página de checkout para um plano específico
     */
    public function checkout($planId)
    {
        $plan = Plan::findOrFail($planId);
        $user = Auth::user();
        
        return view('customer.billing.checkout', compact('plan', 'user'));
    }
    
    /**
     * Processa o pagamento e atualiza o plano do usuário
     */
    public function processPayment(Request $request, $planId)
    {
        $request->validate([
            'payment_method' => 'required|in:credit_card,pix,boleto',
            'card_number' => 'required_if:payment_method,credit_card',
            'card_expiry' => 'required_if:payment_method,credit_card',
            'card_cvc' => 'required_if:payment_method,credit_card',
        ]);
        
        $plan = Plan::findOrFail($planId);
        $user = Auth::user();
        
        // Aqui você implementaria a integração com o gateway de pagamento
        // Por enquanto, vamos simular um pagamento bem-sucedido
        
        // Criar transação
        $transaction = new Transaction();
        $transaction->user_id = $user->id;
        $transaction->plan_id = $plan->id;
        $transaction->amount = $plan->price;
        $transaction->payment_method = $request->payment_method;
        $transaction->payment_details = json_encode($request->all());
        $transaction->status = 'completed';
        $transaction->credits = $plan->credits;
   
        $transaction->transaction_id = 'sim_' . uniqid();
        $transaction->save();
        
        // Atualizar ou criar plano do usuário
        $userPlan = UserPlan::updateOrCreate(
            ['user_id' => $user->id],
            [
                'plan_id' => $plan->id,
                'is_active' => true,
                'starts_at' => now(),
                'expires_at' => now()->addMonth(),
                'credits_remaining' => $plan->credits,
            ]
        );
     
        return redirect()->route('customer.billing.current-plan')
            ->with('success', 'Pagamento processado com sucesso! Seu plano foi atualizado.');
    }
    
    /**
     * Cancela a assinatura do plano atual
     */
    public function cancelSubscription(Request $request)
    {
        $user = Auth::user();
        $userPlan = UserPlan::where('user_id', $user->id)->first();
        
        if ($userPlan) {
            $userPlan->status = 'cancelled';
            $userPlan->cancelled_at = now();
            $userPlan->save();
            
            // Criar transação de cancelamento
            $transaction = new Transaction();
            $transaction->user_id = $user->id;
            $transaction->plan_id = $userPlan->plan_id;
            $transaction->amount = 0;
            $transaction->payment_method = 'system';
            $transaction->status = 'completed';
            $transaction->transaction_id = 'cancel_' . uniqid();
            $transaction->description = 'Cancelamento de assinatura';
            $transaction->save();
        }
        
        return redirect()->route('customer.billing.index')
            ->with('success', 'Sua assinatura foi cancelada com sucesso.');
    }
} 