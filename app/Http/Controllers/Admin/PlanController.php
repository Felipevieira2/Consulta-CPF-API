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
        $plan = Plan::create($request->all());
        return redirect()->route('admin.plans.index')->with('success', 'Plano criado com sucesso');
    }

    public function show($id)
    {
        $plan = Plan::find($id);
        return view('admin.plans.show', compact('plan'));
    }


    public function destroy($id)
    {
        $plan = Plan::find($id);
        $plan->delete();
        return redirect()->route('admin.plans.index')->with('success', 'Plano deletado com sucesso');
    }
    
} 