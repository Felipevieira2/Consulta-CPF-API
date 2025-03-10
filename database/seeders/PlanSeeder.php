<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run()
    {
        // Planos pré-definidos baseados no seu HTML
        $plans = [
            [
                'name' => 'Básico',
                'description' => 'Ideal para pequenas empresas',
                'price' => 49.90,
                'credits' => 50,
                'is_active' => true,
                'is_featured' => false,
            ],
            [
                'name' => 'Profissional',
                'description' => 'Perfeito para empresas em crescimento',
                'price' => 99.90,
                'credits' => 200,
                'is_active' => true,
                'is_featured' => true,
            ],
            [
                'name' => 'Empresarial',
                'description' => 'Para grandes empresas com alto volume',
                'price' => 199.90,
                'credits' => 1000,
                'is_active' => true,
                'is_featured' => false,
            ],
        ];

        foreach ($plans as $plan) {
            Plan::create($plan);
        }

        // Criar mais alguns planos aleatórios para demonstração
        // Plan::factory()->count(3)->create();
        // Plan::factory()->featured()->count(1)->create();
    }
} 