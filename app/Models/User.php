<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_admin',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_admin' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function apiKeys()
    {
        return $this->hasMany(ApiKey::class);
    }

    public function plans()
    {
        return $this->belongsToMany(Plan::class, 'user_plans')
            ->withPivot('credits_remaining', 'starts_at', 'expires_at', 'is_active')
            ->withTimestamps();
    }

    public function activePlan()
    {
        return $this->plans()
            ->wherePivot('is_active', true)
            ->wherePivot('expires_at', '>', now())
            ->orWherePivot('expires_at', null)
            ->orderByPivot('created_at', 'desc')
            ->first();
    }

    public function apiLogs()
    {
        return $this->hasMany(ApiLog::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function getCreditsAttribute()
    {
        $activePlan = $this->activePlan();
        
        if (!$activePlan) {
            return 0;
        }
        
        return $activePlan->pivot->credits_remaining;
    }

    public function getInitialsAttribute()
    {
        $words = explode(' ', $this->name);
        $initials = '';
        
        foreach ($words as $word) {
            $initials .= strtoupper(substr($word, 0, 1));
        }
        
        return strlen($initials) > 2 ? substr($initials, 0, 2) : $initials;
    }

    /**
     * Obter as consultas do usuário.
     */
    public function queries()
    {
        return $this->hasMany(Query::class);
    }

    /**
     * Obter o plano do usuário.
     */
    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }

    /**
     * Obter os pagamentos do usuário.
     */
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
