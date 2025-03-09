<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    /**
     * Os atributos que são atribuíveis em massa.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'plan_id',
        'amount',
        'payment_method',
        'status',
        'transaction_id',
        'payment_date',
    ];

    /**
     * Os atributos que devem ser convertidos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'amount' => 'decimal:2',
        'payment_date' => 'datetime',
    ];

    /**
     * Obter o usuário que realizou o pagamento.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Obter o plano associado ao pagamento.
     */
    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }
} 