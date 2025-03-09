<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApiKey extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'key',
        'name',
        'last_used_at',
        'expires_at',
        'is_active',
    ];

    protected $casts = [
        'last_used_at' => 'datetime',
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function logs()
    {
        return $this->hasMany(ApiLog::class);
    }

    public static function generateUniqueKey()
    {
        do {
            $key = bin2hex(random_bytes(32));
        } while (static::where('key', $key)->exists());

        return $key;
    }

    public function isExpired()
    {
        return $this->expires_at && $this->expires_at->isPast();
    }
} 