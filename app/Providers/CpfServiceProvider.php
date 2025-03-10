<?php

namespace App\Providers;

use App\Repositories\CpfRepository\CpfRepository;
use App\Repositories\CpfRepository\CpfRepositoryInterface;
use App\Services\CpfService\CpfService;
use App\Services\CpfService\CpfServiceInterface;
use Illuminate\Support\ServiceProvider;

class CpfServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(CpfRepositoryInterface::class, CpfRepository::class);
        $this->app->bind(CpfServiceInterface::class, CpfService::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
} 