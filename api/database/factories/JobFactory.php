<?php

namespace Database\Factories;

use App\Models\Job;
use App\Models\User;
use App\Models\Company;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class JobFactory extends Factory
{
    protected $model = Job::class;

    public function definition(): array
    {
        return [
            'company_id' => Company::factory(),
            'employer_id' => User::factory(),
            'category_id' => Category::factory(),
            'title' => $this->faker->jobTitle,
            'slug' => $this->faker->unique()->slug,
            'description' => $this->faker->paragraph,
            'location' => $this->faker->city,
            'work_type' => 'remote',
            'employment_type' => 'full_time',
            'experience_level' => 'mid',
            'salary_min' => 50000,
            'salary_max' => 80000,
            'status' => 'approved',
        ];
    }
}
