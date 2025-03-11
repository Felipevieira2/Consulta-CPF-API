<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Plan; // Supondo que você tenha um modelo Plan

class PlanController extends Controller
{
    /**
     * Exibe a lista de planos.
     */
    public function index()
    {
        $plans = Plan::orderBy('price', 'asc')->get();
        return view('admin.plans.index', compact('plans'));
    }

    /**
     * Exibe o formulário para criar um novo plano
     */
    public function create()
    {
        return view('admin.plans.create');
    }

    /**
     * Armazena um novo plano no banco de dados
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'credits' => 'required|integer|min:0',
            'features' => 'nullable|string',
            'active' => 'boolean',
        ]);
        
        $plan = new Plan();
        $plan->name = $request->name;
        $plan->description = $request->description;
        $plan->price = $request->price;
        $plan->credits = $request->credits;
        $plan->features = $request->features;
        $plan->active = $request->has('active');
        $plan->save();
        
        return redirect()->route('admin.plans.index')
            ->with('success', 'Plano criado com sucesso!');
    }

    public function show($id)
    {
        $plan = Plan::find($id);
        return view('admin.plans.show', compact('plan'));
    }

    /**
     * Exibe o formulário para editar um plano
     */
    public function edit($id)
    {
        $plan = Plan::findOrFail($id);
        return view('admin.plans.edit', compact('plan'));
    }

    /**
     * Atualiza um plano no banco de dados
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'credits' => 'required|integer|min:0',
            'features' => 'nullable|string',
            'active' => 'boolean',
        ]);
        
        $plan = Plan::findOrFail($id);
        $plan->name = $request->name;
        $plan->description = $request->description;
        $plan->price = $request->price;
        $plan->credits = $request->credits;
        $plan->features = $request->features;
        $plan->active = $request->has('active');
        $plan->save();
        
        return redirect()->route('admin.plans.index')
            ->with('success', 'Plano atualizado com sucesso!');
    }

    /**
     * Remove um plano do banco de dados
     */
    public function destroy($id)
    {
        $plan = Plan::findOrFail($id);
        
        // Verificar se há usuários usando este plano
        $usersCount = $plan->userPlans()->count();
        
        if ($usersCount > 0) {
            return redirect()->route('admin.plans.index')
                ->with('error', 'Este plano não pode ser excluído porque está sendo usado por ' . $usersCount . ' usuário(s).');
        }
        
        $plan->delete();
        
        return redirect()->route('admin.plans.index')
            ->with('success', 'Plano excluído com sucesso!');
    }
} 