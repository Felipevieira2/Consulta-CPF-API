@extends('layouts.customer')

@section('content')
    <div class="py-8 bg-gray-50 dark:bg-gray-900 min-h-screen mt-5">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Cabeçalho com Gradiente -->
            <div class="mb-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-8 text-white ">
                {{-- <h1 class="text-3xl font-bold mb-2">Painel</h1> --}}
                {{-- <p class="text-indigo-100">Bem-vindo de volta, {{ auth()->user()->name }}</p> --}}
            </div>

            <!-- Cards Informativos com Animação Hover -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 mt-2">
                <!-- Créditos Disponíveis -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-t-4 border-yellow-500 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Créditos</h3>
                        <div class="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                            <i class="fas fa-coins text-yellow-500 text-xl"></i>
                        </div>
                    </div>
                    <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ number_format($credits_available, 0, ',', '.') }}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">Créditos restantes</p>
                </div>

                <!-- Consultas Hoje -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-t-4 border-blue-500 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Hoje</h3>
                        <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                            <i class="fas fa-search text-blue-500 text-xl"></i>
                        </div>
                    </div>
                    <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ $today_queries }}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">Consultas hoje</p>
                </div>

                <!-- Consultas Este Mês -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-t-4 border-green-500 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Mês</h3>
                        <div class="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                            <i class="fas fa-chart-bar text-green-500 text-xl"></i>
                        </div>
                    </div>
                    <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ $month_queries }}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">Consultas no mês</p>
                </div>

                <!-- Próxima Cobrança -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-t-4 border-purple-500 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Cobrança</h3>
                        <div class="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                            <i class="fas fa-calendar text-purple-500 text-xl"></i>
                        </div>
                    </div>
                    <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ \Carbon\Carbon::parse($next_billing_date)->format('d/m/Y') }}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">Próximo vencimento</p>
                </div>
            </div>

            <!-- Após os 4 cards existentes no dashboard, adicione: -->
            <div class="mt-10 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <h3 class="text-xl font-semibold text-gray-800 dark:text-white">Integração API</h3>
                </div>
                <div class="p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Integre sua aplicação</h4>
                            <p class="text-gray-600 dark:text-gray-400">
                                Acesse nossa API de consulta de CPF diretamente da sua aplicação. 
                                Gerencie suas chaves de API e veja exemplos de código.
                            </p>
                        </div>
                        <div>
                            <a href="{{ route('customer.api-keys.index') }}" class="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 disabled:opacity-25 transition ease-in-out duration-150">
                                Gerenciar API <i class="fas fa-arrow-right ml-2"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Gráfico de Uso com Design Melhorado -->
            <div class="mb-10 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <h3 class="text-xl font-semibold text-gray-800 dark:text-white">Histórico de Consultas</h3>
                </div>
                <div class="p-6">
                    <div class="h-80" id="usageChart"></div>
                </div>
            </div>

            <!-- Últimas Consultas com Design Melhorado -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
                    <h3 class="text-xl font-semibold text-gray-800 dark:text-white">Últimas Consultas</h3>
                    <a href="{{ route('customer.api-log.index') }}" class="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 disabled:opacity-25 transition ease-in-out duration-150">
                        Ver todas <i class="fas fa-arrow-right ml-2"></i>
                    </a>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="text-left bg-gray-50 dark:bg-gray-900">
                                <th class="py-3 px-6 text-gray-600 dark:text-gray-400 font-medium">CPF</th>
                                <th class="py-3 px-6 text-gray-600 dark:text-gray-400 font-medium">Data</th>
                                <th class="py-3 px-6 text-gray-600 dark:text-gray-400 font-medium">Status</th>
                                <th class="py-3 px-6 text-gray-600 dark:text-gray-400 font-medium">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($recent_queries as $query)
                                <tr class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                                    <td class="py-4 px-6 font-medium">{{ Mask::apply($query->cpf, '###.###.###-##') }}</td>
                                    <td class="py-4 px-6">{{ $query->created_at->format('d/m/Y H:i') }}</td>
                                    <td class="py-4 px-6">
                                        <span class="px-3 py-1 text-sm rounded-full inline-flex items-center {{ $query->status === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-white' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' }}">
                                            <i class="fas {{ $query->status === 'success' ? 'fa-check' : 'fa-times' }} mr-1"></i>
                                            {{ $query->status === 'success' ? 'Sucesso' : 'Erro' }}
                                        </span>
                                    </td>
                                    <td class="py-4 px-6">
                                        <a href="{{ route('customer.api-log.show', $query->id) }}" class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">
                                            <i class="fas fa-eye mr-1"></i> Ver detalhes
                                        </a>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="4" class="py-8 px-6 text-center text-gray-500 dark:text-gray-400">
                                        <i class="fas fa-search text-4xl mb-3 opacity-30"></i>
                                        <p>Nenhuma consulta realizada ainda.</p>
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
@endsection

@push('scripts')
<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
<script>
    // Configuração do gráfico com tema melhorado
    var options = {
        series: [{
            name: 'Consultas',
            data: @json($usage_chart_data)
        }],
        chart: {
            type: 'area',
            height: 320,
            fontFamily: 'Inter, sans-serif',
            toolbar: {
                show: false
            },
            foreColor: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#4b5563'
        },
        colors: ['#4f46e5'],
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        xaxis: {
            type: 'datetime',
            categories: @json($usage_chart_labels),
            labels: {
                style: {
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif'
                }
            }
        },
        yaxis: {
            labels: {
                formatter: function(val) {
                    return val.toFixed(0);
                }
            }
        },
        tooltip: {
            theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
            x: {
                format: 'dd/MM/yyyy'
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.3,
                stops: [0, 90, 100]
            }
        },
        grid: {
            borderColor: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb',
            strokeDashArray: 4,
            xaxis: {
                lines: {
                    show: true
                }
            }
        }
    };

    var chart = new ApexCharts(document.querySelector("#usageChart"), options);
    chart.render();

    // Atualiza o gráfico quando o tema muda
    document.addEventListener('themeChanged', function() {
        chart.updateOptions({
            chart: {
                foreColor: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#4b5563'
            },
            tooltip: {
                theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light'
            },
            grid: {
                borderColor: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb'
            }
        });
    });

   
    


</script>
@endpush
