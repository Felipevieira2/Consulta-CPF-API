<?php

namespace App\Http\Controllers\Customer;

use Carbon\Carbon;
use App\Models\User;
use App\Models\ApiLog;
use App\Models\Subscription;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    /**
     * Exibe o dashboard do cliente
     */
    public function index()
    {
        $user = Auth::user();
        
        // Obter a assinatura ativa do usuário
        $subscription = $user->subscription;
        
        // Calcular créditos disponíveis
        $credits_available = $user->credits ?? 0;
        
        // Obter data da próxima cobrança
        $next_billing_date = $subscription ? $subscription->next_billing_date : null;
        
        // Consultas de hoje
        $today_queries = ApiLog::where('user_id', $user->id)
            ->whereDate('created_at', Carbon::today())
            ->count();
            
        // Consultas do mês atual
        $month_queries = ApiLog::where('user_id', $user->id)
            ->whereYear('created_at', Carbon::now()->year)
            ->whereMonth('created_at', Carbon::now()->month)
            ->count();
            
        // Dados para o gráfico de uso (últimos 30 dias)
        $usage_data = $this->getUsageChartData($user->id);
        $usage_chart_data = $usage_data['usage_chart_data'];
        $usage_chart_labels = $usage_data['usage_chart_labels'];
        
        // Últimas consultas
        $recent_queries = ApiLog::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();
            
        return view('customer.dashboard', compact(
            'credits_available',
            'next_billing_date',
            'today_queries',
            'month_queries',
            'usage_chart_data',
            'usage_chart_labels',
            'recent_queries'
        ));
    }
    
    /**
     * Obter dados para o gráfico de uso
     */
    private function getUsageChartData($userId)
    {
        $startDate = Carbon::now()->subDays(30);
        $endDate = Carbon::now();
        
        // Inicializar arrays para dados e labels
        $usageData = [];
        $labels = [];
        
        // Preencher o array com datas e contagens zeradas
        for ($date = $startDate->copy(); $date <= $endDate; $date->addDay()) {
            $labels[] = $date->format('Y-m-d');
            $usageData[$date->format('Y-m-d')] = 0;
        }
        
        // Obter contagens reais do banco de dados
        $apiLogs = ApiLog::where('user_id', $userId)
            ->whereDate('created_at', '>=', $startDate)
            ->whereDate('created_at', '<=', $endDate)
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->get();
            
        // Preencher o array com os dados reais
        foreach ($apiLogs as $log) {
            $usageData[$log->date] = $log->count;
        }
        
        return [
            'usage_chart_data' => array_values($usageData),
            'usage_chart_labels' => $labels
        ];
    }
    
    
    /**
     * Exibe o histórico de consultas do cliente
     */
    public function queries(Request $request)
    {
        $user = Auth::user();
        
        $query = ApiLog::where('user_id', $user->id);
        
        // Filtros
        if ($request->has('cpf') && !empty($request->cpf)) {
            $query->where('cpf', 'like', '%' . $request->cpf . '%');
        }
        
        if ($request->has('status') && !empty($request->status)) {
            $query->where('status', $request->status);
        }
        
        if ($request->has('date_from') && !empty($request->date_from)) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        
        if ($request->has('date_to') && !empty($request->date_to)) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }
        
        // Ordenação
        $query->orderBy('created_at', 'desc');
        
        // Paginação
        $queries = $query->paginate(15);
        
        return view('customer.api-log.index', compact('queries'));
    }
    
    /**
     * Exibe os detalhes de uma consulta específica
     */
    public function showQuery($id)
    {
        $user = Auth::user();
        $query = ApiLog::where('user_id', $user->id)
            ->where('id', $id)
            ->firstOrFail();
            
        return view('customer.api-log.show', compact('query'));
    }
} 