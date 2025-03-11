<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    /**
     * Exibe a lista de permissões
     */
    public function index()
    {
        $permissions = Permission::all();
        return view('admin.permissions.index', compact('permissions'));
    }

    /**
     * Exibe o formulário para criar uma nova permissão
     */
    public function create()
    {
        return view('admin.permissions.create');
    }

    /**
     * Armazena uma nova permissão
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:permissions,name',
        ]);

        Permission::create(['name' => $request->name]);

        return redirect()->route('admin.permissions.index')
            ->with('success', 'Permissão criada com sucesso.');
    }

    /**
     * Exibe o formulário para editar uma permissão
     */
    public function edit(Permission $permission)
    {
        return view('admin.permissions.edit', compact('permission'));
    }

    /**
     * Atualiza uma permissão
     */
    public function update(Request $request, Permission $permission)
    {
        $request->validate([
            'name' => 'required|unique:permissions,name,' . $permission->id,
        ]);

        $permission->update(['name' => $request->name]);

        return redirect()->route('admin.permissions.index')
            ->with('success', 'Permissão atualizada com sucesso.');
    }

    /**
     * Remove uma permissão
     */
    public function destroy(Permission $permission)
    {
        // Verificar se a permissão está em uso
        if ($permission->roles()->count() > 0) {
            return redirect()->route('admin.permissions.index')
                ->with('error', 'Esta permissão está em uso por uma ou mais roles e não pode ser excluída.');
        }
        
        $permission->delete();

        return redirect()->route('admin.permissions.index')
            ->with('success', 'Permissão excluída com sucesso.');
    }
} 