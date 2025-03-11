<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'plan_id',
        'amount',
        'payment_method',
        'status',
        'transaction_id',
        'description',
    ];

    protected $casts = [
        'amount' => 'float',
    ];

    /**
     * Relacionamento com User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relacionamento com Plan
     */
    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }

    /**
     * Formata o valor para exibição
     */
    public function getFormattedAmountAttribute()
    {
        return 'R$ ' . number_format($this->amount, 2, ',', '.');
    }

    /**
     * Retorna o nome do método de pagamento formatado
     */
    public function getPaymentMethodNameAttribute()
    {
        $methods = [
            'credit_card' => 'Cartão de Crédito',
            'pix' => 'PIX',
            'boleto' => 'Boleto',
            'system' => 'Sistema',
        ];
        
        return $methods[$this->payment_method] ?? $this->payment_method;
    }

    /**
     * Retorna o status formatado
     */
    public function getStatusNameAttribute()
    {
        $statuses = [
            'pending' => 'Pendente',
            'completed' => 'Concluído',
            'failed' => 'Falhou',
            'refunded' => 'Reembolsado',
        ];
        
        return $statuses[$this->status] ?? $this->status;
    }
} 