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
        'query_limit',
        'status',
        'features',
    ];

    /**
     * Os atributos que devem ser convertidos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'features' => 'array',
        'price' => 'decimal:2',
    ];

    /**
     * Obter os usuários que possuem este plano.
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
} 