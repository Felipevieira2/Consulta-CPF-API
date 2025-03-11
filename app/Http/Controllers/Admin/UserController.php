<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Exibe a lista de usuários.
     */
    public function index()
    {
        // Lista de usuários paginada
        $users = User::latest()->paginate(10);
        return view('admin.users.index', compact('users')); // Retorne a view com os usuários
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id); // Obtém o usuário pelo ID

        // Validação dos dados (opcional, mas recomendado)
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
        ]);

        $user->update($request->all()); // Atualiza os dados do usuário

        return redirect()->route('admin.users.index')->with('success', 'Usuário atualizado com sucesso!'); // Redireciona para a lista de usuários
    }

    /**
     * Exibe o formulário para editar as roles de um usuário
     */
    public function editRoles(User $user)
    {
        $roles = Role::all();
        $userRoles = $user->roles->pluck('id')->toArray();
        
        return view('admin.users.roles', compact('user', 'roles', 'userRoles'));
    }

    /**
     * Atualiza as roles de um usuário
     */
    public function updateRoles(Request $request, User $user)
    {
        $request->validate([
            'roles' => 'array',
        ]);

        // Buscar as roles pelos IDs e pegar os nomes
        $roleNames = Role::whereIn('id', $request->roles ?? [])->pluck('name')->toArray();
        $user->syncRoles($roleNames);

        return redirect()->route('admin.users.index')
            ->with('success', 'Roles do usuário atualizadas com sucesso.');
    }
}
