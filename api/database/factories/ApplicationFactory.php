<?php

namespace Database\Factories;

use App\Models\Application;
use App\Models\Job;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ApplicationFactory extends Factory
{
    protected $model = Application::class;

    public function definition(): array
    {
        return [
            'job_id' => Job::factory(),
            'candidate_id' => User::factory(),
            'application_status' => 'pending',
            'applicant_name' => $this->faker->name,
            'applicant_email' => $this->faker->safeEmail,
        ];
    }
}
