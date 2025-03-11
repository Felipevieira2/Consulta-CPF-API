<?php

namespace App\Providers;

use App\Services\MaskService;
use App\Services\TesteService;
use Illuminate\Support\ServiceProvider;

class HelperServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Registra os helpers aqui
        $this->app->bind('mask', function() {
            return new MaskService();
        });

        $this->app->bind('teste', function() {
            return new TesteService();
        });
    }

    public function boot()
    {
        // 
    }
} 