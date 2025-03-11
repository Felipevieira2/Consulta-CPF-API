<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run()
    {
        // Criar papéis
        $adminRole = Role::create(['name' => 'admin']);
        $customerRole = Role::create(['name' => 'customer']);
        
        // Opcionalmente, criar permissões
        $manageUsers = Permission::create(['name' => 'manage users']);
        $viewDashboard = Permission::create(['name' => 'view dashboard']);
        
        // Atribuir permissões aos papéis
        $adminRole->givePermissionTo([
            'manage users',
            'view dashboard'
        ]);
        
        $customerRole->givePermissionTo([
            'view dashboard'
        ]);
    }
} 