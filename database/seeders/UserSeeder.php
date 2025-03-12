<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Verificar se a role admin existe, se não, criá-la
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $userRole = Role::firstOrCreate(['name' => 'user']);
        
        // Criar usuário admin
        $admin = User::factory()->create([
            'name' => 'Administrador',
            'email' => 'admin@fcati.com.br',
            'password' => bcrypt('12121212'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);
        
        // Atribuir role admin
        $admin->assignRole('admin');

        // Criar usuário normal
        $user = User::factory()->create([
            'name' => 'Usuário Normal',
            'email' => 'user@fcati.com.br',
            'password' => bcrypt('12121212'),
            'role' => 'user',
            'email_verified_at' => now(),
        ]);
        
        // Atribuir role user
        $user->assignRole('user');

        // // Criar mais alguns usuários aleatórios para teste
        // User::factory()->count(5)->create(); // 5 usuários normais
        // User::factory()->admin()->count(2)->create(); // 2 admins adicionais
    }
} 