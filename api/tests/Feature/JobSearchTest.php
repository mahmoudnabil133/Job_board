<?php

use App\Models\Job;
use App\Models\User;
use App\Models\Category;
use App\Models\Company;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('anyone can list approved jobs', function () {
    $employer = User::factory()->create(['role' => 'employer']);
    $company = Company::factory()->create(['employer_id' => $employer->id]);
    $category = Category::create(['name' => 'IT', 'slug' => 'it']);

    Job::factory()->count(3)->create([
        'employer_id' => $employer->id,
        'company_id' => $company->id,
        'category_id' => $category->id,
        'status' => 'approved',
    ]);

    $response = $this->getJson('/api/v1/jobs');

    $response->assertOk()
        ->assertJsonStructure([
            'status',
            'message',
            'data',
            'meta' => ['total', 'per_page', 'current_page', 'last_page'],
        ]);

    $response->assertJsonPath('meta.total', 3);
});

test('unapproved jobs are not listed', function () {
    $employer = User::factory()->create(['role' => 'employer']);
    $company = Company::factory()->create(['employer_id' => $employer->id]);
    $category = Category::create(['name' => 'IT', 'slug' => 'it']);

    Job::factory()->create([
        'employer_id' => $employer->id,
        'company_id' => $company->id,
        'category_id' => $category->id,
        'status' => 'pending',
    ]);

    $response = $this->getJson('/api/v1/jobs');

    $response->assertOk()
        ->assertJsonPath('meta.total', 0);
});

test('anyone can get a job by slug', function () {
    $employer = User::factory()->create(['role' => 'employer']);
    $company = Company::factory()->create(['employer_id' => $employer->id]);
    $category = Category::create(['name' => 'IT', 'slug' => 'it']);

    $job = Job::factory()->create([
        'employer_id' => $employer->id,
        'company_id' => $company->id,
        'category_id' => $category->id,
        'slug' => 'laravel-developer',
    ]);

    $response = $this->getJson('/api/v1/jobs/laravel-developer');

    $response->assertOk()
        ->assertJsonStructure([
            'status',
            'message',
            'data',
        ]);
});

test('get non-existent job returns 404', function () {
    $response = $this->getJson('/api/v1/jobs/does-not-exist');

    $response->assertStatus(404);
});
