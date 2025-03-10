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
        $plans = Plan::latest()->paginate(10);
        return view('admin.plans.index', compact('plans')); // Retorne a view com os planos
    }

    public function create()
    {
        return view('admin.plans.create');
    }

    public function store(Request $request)
    {
        // dd($request->all());
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'credits' => 'required|integer|min:1',
            'description' => 'required|string',
        ]);
        
        $plan = Plan::create($validated);
        return redirect()->route('admin.plans.index')->with('success', 'Plano criado com sucesso');
    }

    public function show($id)
    {
        $plan = Plan::find($id);
        return view('admin.plans.show', compact('plan'));
    }
    public function edit($id)
    {
        $plan = Plan::find($id);
        return view('admin.plans.edit', compact('plan'));
    }
    public function update(Request $request, $id)
    {
        $plan = Plan::find($id);
        $plan->update($request->all());
        return redirect()->route('admin.plans.index')->with('success', 'Plano atualizado com sucesso');
    }


    public function destroy($id)
    {
        $plan = Plan::find($id);
        $plan->delete();
        return redirect()->route('admin.plans.index')->with('success', 'Plano deletado com sucesso');
    }
    
} 