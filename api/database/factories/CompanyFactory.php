<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CompanyFactory extends Factory
{
    protected $model = Company::class;

    public function definition(): array
    {
        return [
            'employer_id' => User::factory(),
            'name' => $this->faker->company,
            'description' => $this->faker->catchPhrase,
            'industry' => $this->faker->word,
            'location' => $this->faker->city,
            'contact_email' => $this->faker->companyEmail,
        ];
    }
}
