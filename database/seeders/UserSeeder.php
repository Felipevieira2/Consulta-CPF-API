<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Criar usuário admin
        User::factory()->create([
            'name' => 'Administrador',
            'email' => 'admin@example.com',
            'password' => bcrypt('admin123'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Criar usuário normal
        User::factory()->create([
            'name' => 'Usuário Normal',
            'email' => 'user@example.com',
            'password' => bcrypt('user123'),
            'role' => 'user',
            'email_verified_at' => now(),
        ]);

        // Criar mais alguns usuários aleatórios para teste
        User::factory()->count(5)->create(); // 5 usuários normais
        User::factory()->admin()->count(2)->create(); // 2 admins adicionais
    }
} 