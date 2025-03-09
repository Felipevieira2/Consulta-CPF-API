@extends('layouts.admin')

@section('content')
<div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
        
        <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <!-- Card de Estatísticas - Usuários -->
            <x-card class="bg-gradient-to-br from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-800">
                <div class="flex items-center">
                    <div class="flex-shrink-0 bg-white dark:bg-gray-800 rounded-md p-3">
                        <i class="fas fa-users text-indigo-600 dark:text-indigo-400 text-xl"></i>
                    </div>
                    <div class="ml-5">
                        <p class="text-sm font-medium text-white truncate">Total de Usuários</p>
                        <p class="mt-1 text-3xl font-semibold text-white">{{ $totalUsers }}</p>
                    </div>
                </div>
            </x-card>
            
            <!-- Card de Estatísticas - Consultas -->
            <x-card class="bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-800">
                <div class="flex items-center">
                    <div class="flex-shrink-0 bg-white dark:bg-gray-800 rounded-md p-3">
                        <i class="fas fa-search text-green-600 dark:text-green-400 text-xl"></i>
                    </div>
                    <div class="ml-5">
                        <p class="text-sm font-medium text-white truncate">Consultas Realizadas</p>
                        <p class="mt-1 text-3xl font-semibold text-white">{{ $totalQueries }}</p>
                    </div>
                </div>
            </x-card>
            
            <!-- Card de Estatísticas - Planos -->
            <x-card class="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-800">
                <div class="flex items-center">
                    <div class="flex-shrink-0 bg-white dark:bg-gray-800 rounded-md p-3">
                        <i class="fas fa-tags text-purple-600 dark:text-purple-400 text-xl"></i>
                    </div>
                    <div class="ml-5">
                        <p class="text-sm font-medium text-white truncate">Planos Ativos</p>
                        <p class="mt-1 text-3xl font-semibold text-white">{{ $activePlans }}</p>
                    </div>
                </div>
            </x-card>
            
            <!-- Card de Estatísticas - Receita -->
            <x-card class="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-800">
                <div class="flex items-center">
                    <div class="flex-shrink-0 bg-white dark:bg-gray-800 rounded-md p-3">
                        <i class="fas fa-dollar-sign text-blue-600 dark:text-blue-400 text-xl"></i>
                    </div>
                    <div class="ml-5">
                        <p class="text-sm font-medium text-white truncate">Receita Mensal</p>
                        <p class="mt-1 text-3xl font-semibold text-white">R$ {{ number_format($monthlyRevenue, 2, ',', '.') }}</p>
                    </div>
                </div>
            </x-card>
        </div>
        
        <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <!-- Gráfico de Consultas -->
            <x-card title="Consultas nos Últimos 7 Dias">
                <div class="h-80">
                    <canvas id="queriesChart"></canvas>
                </div>
            </x-card>
            
            <!-- Últimas Consultas -->
            <x-card title="Últimas Consultas">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead class="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Usuário</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">CPF</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Data</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                            @foreach($latestQueries as $query)
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ $query->user->name }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ $query->cpf }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ $query->created_at->format('d/m/Y H:i') }}</td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </x-card>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        const ctx = document.getElementById('queriesChart').getContext('2d');
        
        // Dados do gráfico (substitua por dados reais do backend)
        const labels = {!! json_encode($chartLabels) !!};
        const data = {!! json_encode($chartData) !!};
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Consultas',
                    data: data,
                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                    borderColor: 'rgba(99, 102, 241, 1)',
                    borderWidth: 2,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }
            }
        });
    });
</script>
@endsection 