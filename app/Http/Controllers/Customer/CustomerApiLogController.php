<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\ApiLog;
use Illuminate\Http\Request;

class CustomerApiLogController extends Controller
{
    public function index()
    {
        $queries = auth()->user()->apiLogs()->latest()->paginate(10);
        
        return view('customer.api-log', compact('queries'));
    }

    public function show($log)
    {
        $query = auth()->user()->apiLogs()->findOrFail($log);
        return view('customer.api-log.show', compact('query'));
    }
} 