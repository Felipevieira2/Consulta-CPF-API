<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\Transaction;
use App\Models\UserPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TransactionController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    /**
     * Exibe a lista de transações do usuário.
     */
    public function index()
    {
        $transactions = auth()->user()->transactions()
            ->with('plan')
            ->orderBy('created_at', 'desc')
            ->paginate(10);
            
        return view('admin.transactions.index', compact('transactions'));
    }
    
    /**
     * Exibe os detalhes de uma transação específica.
     */
    public function show(Transaction $transaction)
    {
        $this->authorize('view', $transaction);
        
        return view('admin.transactions.show', compact('transaction'));
    }
    
    public function checkout(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id',
        ]);
        
        $plan = Plan::findOrFail($request->plan_id);
        
        // Aqui você integraria com um gateway de pagamento real
        // Este é apenas um exemplo simulado
        
        $transaction = new Transaction([
            'user_id' => auth()->id(),
            'plan_id' => $plan->id,
            'transaction_id' => 'TRX-' . Str::random(10),
            'payment_method' => 'credit_card',
            'status' => 'pending',
            'amount' => $plan->price,
            'credits' => $plan->credits,
        ]);
        
        $transaction->save();
        
        // Redirecionar para uma página de pagamento simulada
        return view('admin.checkout.payment', compact('transaction', 'plan'));
    }
    
    public function processPayment(Request $request, Transaction $transaction)
    {
        $this->authorize('update', $transaction);
        
        // Simulação de processamento de pagamento
        // Em um cenário real, você receberia um callback do gateway de pagamento
        
        $transaction->update([
            'status' => 'completed',
            'paid_at' => now(),
            'payment_details' => [
                'card_last4' => '4242',
                'payment_id' => 'PAY-' . Str::random(10),
            ],
        ]);
        
        // Adicionar créditos ao usuário
        $user = auth()->user();
        $activePlan = $user->activePlan();
        
        if ($activePlan && $activePlan->id === $transaction->plan_id) {
            // Adicionar créditos ao plano existente
            $user->plans()->updateExistingPivot($activePlan->id, [
                'credits_remaining' => $activePlan->pivot->credits_remaining + $transaction->credits,
            ]);
        } else {
            // Criar novo plano para o usuário
            $user->plans()->attach($transaction->plan_id, [
                'credits_remaining' => $transaction->credits,
                'starts_at' => now(),
                'is_active' => true,
            ]);
        }
        
        return redirect()->route('admin.billing')
            ->with('success', 'Pagamento processado com sucesso! ' . $transaction->credits . ' créditos foram adicionados à sua conta.');
    }
    
    public function history()
    {
        $transactions = auth()->user()->transactions()
            ->with('plan')
            ->orderBy('created_at', 'desc')
            ->paginate(10);
            
        return view('dashboard.transactions', compact('transactions'));
    }
} 