<?php

namespace App\Http\Controllers\Admin;

use Carbon\Carbon;
use App\Models\Plan;
use App\Models\User;
use App\Models\Query;
use App\Models\ApiLog;
use App\Models\Payment;
use App\Models\Transaction;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class DashboardController extends Controller
{
    public function index()
    {
        // Estatísticas para os cards
        $totalUsers = User::count();
        $totalQueries = ApiLog::count();
        $activePlans = Plan::where('is_active', 1)->count();
        $monthlyRevenue = Transaction::whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year)
            ->sum('amount');

        // Dados para o gráfico de consultas dos últimos 7 dias
        $chartLabels = [];
        $chartData = [];
        
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $chartLabels[] = $date->format('d/m');
            
            $count = ApiLog::whereDate('created_at', $date->toDateString())->count();
            $chartData[] = $count;
        }

        // Últimas consultas realizadas com paginação
        $latestQueries = ApiLog::with('user')
            ->latest()
            ->paginate(5);
        
        // Lista de usuários paginada
        $users = User::latest()->paginate(10);
      
        return view('admin.dashboard.index', compact(
            'totalUsers',
            'totalQueries',
            'activePlans',
            'monthlyRevenue',
            'chartLabels',
            'chartData',
            'latestQueries',
            'users'
        ));
    }
} 