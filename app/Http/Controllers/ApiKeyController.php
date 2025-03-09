<?php

namespace App\Http\Controllers;

use App\Models\ApiKey;
use Illuminate\Http\Request;

class ApiKeyController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function index()
    {
        $user = auth()->user();
        $apiKeys = $user->apiKeys;
        
        return view('admin.api-keys.index', compact('apiKeys'));
    }
    
    public function create()
    {
        return view('admin.api-keys.create');
    }
    
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);
        
        $apiKey = new ApiKey([
            'user_id' => auth()->id(),
            'key' => ApiKey::generateUniqueKey(),
            'name' => $request->name,
            'is_active' => true,
        ]);
        
        $apiKey->save();
        
        return redirect()->route('admin.api-keys.index')
            ->with('success', 'Chave de API criada com sucesso. Guarde-a em um local seguro: ' . $apiKey->key);
    }
    
    public function edit(ApiKey $apiKey)
    {
        $this->authorize('update', $apiKey);
        
        return view('admin.api-keys.edit', compact('apiKey'));
    }
    
    public function update(Request $request, ApiKey $apiKey)
    {
        $this->authorize('update', $apiKey);
        
        $request->validate([
            'name' => 'required|string|max:255',
            'is_active' => 'boolean',
        ]);
        
        $apiKey->update([
            'name' => $request->name,
            'is_active' => $request->has('is_active'),
        ]);
        
        return redirect()->route('admin.api-keys.index')
            ->with('success', 'Chave de API atualizada com sucesso.');
    }
    
    public function destroy(ApiKey $apiKey)
    {
        $this->authorize('delete', $apiKey);
        
        $apiKey->delete();
        
        return redirect()->route('admin.api-keys.index')
            ->with('success', 'Chave de API excluída com sucesso.');
    }
} 