<?php

namespace Database\Factories;

use App\Models\Subject;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Subject>
 */
class SubjectFactory extends Factory
{

    protected $model = Subject::class;

    public function definition()
    {
        return [
            'name' => ucfirst($this->faker->unique()->word()),
            'weekly_hours' => $this->faker->numberBetween(1, 5),
        ];
    }
}
