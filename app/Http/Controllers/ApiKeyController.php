<?php

namespace App\Http\Controllers;

use App\Models\ApiKey;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ApiKeyController extends Controller
{
    /**
     * Exibe a lista de chaves API do usuário
     */
    public function index()
    {
        $apiKeys = auth()->user()->apiKeys()->orderBy('created_at', 'desc')->get();
        
        return view('customer.api-keys.index', compact('apiKeys'));
    }
    
    /**
     * Exibe o formulário para criar uma nova chave API
     */
    public function create()
    {
        return view('customer.api-keys.create');
    }
    
    /**
     * Armazena uma nova chave API
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'expires_at' => 'nullable|date|after:today',
        ]);
        
        // Gerar uma chave API única
        $apiKey = new ApiKey();
        $apiKey->user_id = auth()->id();
        $apiKey->name = $request->name;
        $apiKey->key = 'cpf_' . Str::random(32);
        $apiKey->is_active = true;
        
  
        if ($request->filled('expires_at')) {
            $apiKey->expires_at = $request->expires_at;
        }
        
        $apiKey->save();
        
        return redirect()->route('customer.api-keys.index')
            ->with('success', 'Chave API criada com sucesso!');
    }
    
    /**
     * Exibe os detalhes de uma chave API específica
     */
    public function show(ApiKey $apiKey)
    {
        $this->authorize('view', $apiKey);
        
        // Obter estatísticas de uso para esta chave
        $usageStats = [
            'today' => $apiKey->logs()->whereDate('created_at', today())->count(),
            'week' => $apiKey->logs()->whereBetween('created_at', [now()->startOfWeek(), now()])->count(),
            'month' => $apiKey->logs()->whereBetween('created_at', [now()->startOfMonth(), now()])->count(),
            'total' => $apiKey->logs()->count(),
        ];
        
        // Obter os últimos logs de uso
        $recentLogs = $apiKey->logs()->with('apiKey')->orderBy('created_at', 'desc')->take(10)->get();
        
        return view('customer.api-keys.show', compact('apiKey', 'usageStats', 'recentLogs'));
    }
    
    /**
     * Ativa ou desativa uma chave API
     */
    public function toggleStatus(ApiKey $apiKey)
    {
        $this->authorize('update', $apiKey);
        
        $apiKey->is_active = !$apiKey->is_active;
        $apiKey->save();
        
        $status = $apiKey->is_active ? 'ativada' : 'desativada';
        
        return redirect()->route('customer.api-keys.index')
            ->with('success', "Chave API {$status} com sucesso!");
    }
    
    /**
     * Remove uma chave API
     */
    public function destroy(ApiKey $apiKey)
    {
        $this->authorize('delete', $apiKey);
        
        $apiKey->delete();
        
        return redirect()->route('customer.api-keys.index')
            ->with('success', 'Chave API removida com sucesso!');
    }
    
    /**
     * Exibe a documentação da API
     */
    public function documentation()
    {
        $apiKeys = auth()->user()->apiKeys()->where('active', true)->get();
        
        return view('customer.api-keys.documentation', compact('apiKeys'));
    }
} 