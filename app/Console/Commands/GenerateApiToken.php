<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class GenerateApiToken extends Command
{
    protected $signature = 'api:token {user_id} {token_name}';
    protected $description = 'Gera um token de API para um usuário';

    public function handle()
    {
        $userId = $this->argument('user_id');
        $tokenName = $this->argument('token_name');
        
        $user = User::find($userId);
        
        if (!$user) {
            $this->error("Usuário com ID {$userId} não encontrado");
            return 1;
        }
        
        $token = $user->createToken($tokenName)->plainTextToken;
        
        $this->info("Token gerado com sucesso:");
        $this->line($token);
        
        return 0;
    }
} 