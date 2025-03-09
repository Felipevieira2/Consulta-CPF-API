<?php

namespace App\Http\Controllers\Admin;

use App\Models\Plan;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    /**
     * Exibe a página de perfil do usuário.
     */
    public function index()
    {
        $user = Auth::user(); // Obtém o usuário autenticado
        return view('admin.profile.index', compact('user')); // Retorna a view com os dados do usuário
    }

    public function update(Request $request)
    {
        $user = Auth::user();
        $user->update($request->all());
        return redirect()->route('admin.profile.index')->with('success', 'Perfil atualizado com sucesso');
    }

    public function edit()
    {
        $user = Auth::user();
        return view('admin.profile.edit', compact('user'));
    }

    public function password()
    {
        $user = Auth::user();
        return view('admin.profile.password', compact('user'));
    }

    public function updatePassword(Request $request)
    {
        $user = Auth::user();
        $user->update($request->all());
        return redirect()->route('admin.profile.index')->with('success', 'Senha atualizada com sucesso');
    }
    
} 