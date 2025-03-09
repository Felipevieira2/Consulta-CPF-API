<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UsageController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    /**
     * Exibe a página de uso
     */
    public function index()
    {
        $user = auth()->user();
        
        $logs = $user->apiLogs()
            ->with('apiKey')
            ->orderBy('created_at', 'desc')
            ->paginate(20);
            
        // Estatísticas de uso por endpoint
        $endpointStats = $user->apiLogs()
            ->select('endpoint', DB::raw('COUNT(*) as count'))
            ->groupBy('endpoint')
            ->orderBy('count', 'desc')
            ->get();
            
        return view('admin.usage.index', compact('logs', 'endpointStats'));
    }
}
