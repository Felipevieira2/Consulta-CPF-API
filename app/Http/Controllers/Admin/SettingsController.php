<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    /**
     * Exibe a página de configurações.
     */
    public function index()
    {
        return view('admin.settings.index'); // Retorne a view de configurações
    }
} 