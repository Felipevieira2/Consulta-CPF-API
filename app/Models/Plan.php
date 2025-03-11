<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    use HasFactory;

    /**
     * Os atributos que são atribuíveis em massa.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'price',
        'credits',
        'features',
        'active',
    ];

    /**
     * Os atributos que devem ser convertidos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price' => 'float',
        'credits' => 'integer',
        'active' => 'boolean',
    ];

    /**
     * Obter os usuários que possuem este plano.
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }

    /**
     * Relacionamento com UserPlan
     */
    public function userPlans()
    {
        return $this->hasMany(UserPlan::class);
    }

    /**
     * Relacionamento com Transaction
     */
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * Formata o preço para exibição
     */
    public function getFormattedPriceAttribute()
    {
        return 'R$ ' . number_format($this->price, 2, ',', '.');
    }
} 