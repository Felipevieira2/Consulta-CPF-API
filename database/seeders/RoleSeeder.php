<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run()
    {
        // Criar papéis apenas se não existirem
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $customerRole = Role::firstOrCreate(['name' => 'customer']);
        
        // Criar nova role (se necessário)
        $novaRole = Role::firstOrCreate(['name' => 'nome_da_sua_nova_role']);
        
        // Criar permissões apenas se não existirem
        $manageUsers = Permission::firstOrCreate(['name' => 'manage users']);
        $viewDashboard = Permission::firstOrCreate(['name' => 'view dashboard']);
        
        // Nova permissão (se necessário)
        $novaPermissao = Permission::firstOrCreate(['name' => 'nova permissao']);
        
        // Atribuir permissões aos papéis (syncPermissions não duplica)
        $adminRole->syncPermissions([
            'manage users',
            'view dashboard',
            'nova permissao'
        ]);
        
        $customerRole->syncPermissions([
            'view dashboard'
        ]);
        
        $novaRole->syncPermissions([
            'nova permissao',
            'view dashboard'
        ]);
    }
} 