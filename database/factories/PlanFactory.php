<?php

namespace Database\Factories;

use App\Models\Plan;
use Illuminate\Database\Eloquent\Factories\Factory;

class PlanFactory extends Factory
{
    protected $model = Plan::class;

    public function definition()
    {
        return [
            'name' => $this->faker->word,
            'description' => $this->faker->sentence,
            'price' => $this->faker->randomFloat(2, 19, 299),
            'credits' => $this->faker->randomElement([10, 50, 100, 500, 1000]),
            'is_active' => true,
            'is_featured' => $this->faker->boolean(20),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    public function featured()
    {
        return $this->state(function (array $attributes) {
            return [
                'is_featured' => true,
            ];
        });
    }
} 