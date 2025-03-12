<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Criar usuário admin
        $user = User::factory()->create([
            'name' => 'Administrador',
            'email' => 'admin@fcati.com.br',
            'password' => bcrypt('12121212'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        $user->assignRole('admin');

        // Criar usuário normal
        $user = User::factory()->create([
            'name' => 'Usuário Normal',
            'email' => 'user@fcati.com.br',
            'password' => bcrypt('12121212'),
            'role' => 'user',
            'email_verified_at' => now(),
        ]);

        $user->assignRole('user');

        // // Criar mais alguns usuários aleatórios para teste
        // User::factory()->count(5)->create(); // 5 usuários normais
        // User::factory()->admin()->count(2)->create(); // 2 admins adicionais
    }
} 