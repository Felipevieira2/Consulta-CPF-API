<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserPlan extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'user_id',
        'plan_id',
        'credits_remaining',
        'starts_at',
        'expires_at',
        'is_active',
    ];
    
    protected $casts = [
        'starts_at' => 'datetime',
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
        'credits_remaining' => 'integer',
        'user_id' => 'integer',
        'plan_id' => 'integer',
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
     * Verifica se o plano está ativo
     */
    public function isActive()
    {
        return $this->status === 'active';
    }
    
    /**
     * Verifica se o plano está cancelado
     */
    public function isCancelled()
    {
        return $this->status === 'cancelled';
    }
    
    /**
     * Verifica se o plano está expirado
     */
    public function isExpired()
    {
        return $this->next_billing_date < now() && $this->status !== 'cancelled';
    }
} 