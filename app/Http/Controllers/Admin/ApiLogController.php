<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ApiLog; // Supondo que você tenha um modelo ApiLog
use Illuminate\Http\Request;

class ApiLogController extends Controller
{
    /**
     * Exibe a lista de logs de API.
     */
    public function index()
    {
        $logs = ApiLog::all(); // Obtenha todos os logs
        return view('admin.api-logs.index', compact('logs')); // Retorne a view com os logs
    }
} 