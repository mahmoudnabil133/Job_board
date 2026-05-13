<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Job;
use App\Models\Company;
use App\Models\Application;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_candidate_receives_notification_when_application_is_accepted()
    {
        // 1. Setup: Create Employer, Company, Category, Job, and Candidate
        $employer = User::factory()->create(['role' => 'employer']);
        $company = Company::factory()->create(['employer_id' => $employer->id]);
        $category = Category::create(['name' => 'IT', 'slug' => 'it']);
        
        $candidate = User::factory()->create(['role' => 'candidate']);
        
        $job = Job::factory()->create([
            'employer_id' => $employer->id, 
            'company_id' => $company->id,
            'category_id' => $category->id,
            'status' => 'approved'
        ]);

        $application = Application::factory()->create([
            'job_id' => $job->id,
            'candidate_id' => $candidate->id,
            'application_status' => 'pending'
        ]);

        // 2. Action: Employer updates status to accepted
        $response = $this->actingAs($employer)
             ->patchJson("/api/v1/employer/applications/{$application->id}/status", [
                 'application_status' => 'accepted',
                 'employer_notes' => 'Looking forward to meeting you!'
             ]);

        $response->assertStatus(200);

        // 3. Assert: Check if notification exists in database
        $this->assertDatabaseHas('notifications', [
            'user_id' => $candidate->id,
            'title'   => 'Application Accepted!',
            'type'    => 'success'
        ]);

        // 4. Assert: Check if candidate can see it via API
        $this->actingAs($candidate)
             ->getJson('/api/v1/notifications')
             ->assertStatus(200)
             ->assertJsonFragment(['title' => 'Application Accepted!']);
             
        // 5. Assert: Check unread count
        $this->actingAs($candidate)
             ->getJson('/api/v1/notifications/unread-count')
             ->assertStatus(200)
             ->assertJson(['data' => ['unread_count' => 1]]);
    }

    public function test_candidate_can_mark_notification_as_read()
    {
        $candidate = User::factory()->create(['role' => 'candidate']);
        $notification = \App\Models\Notification::create([
            'user_id' => $candidate->id,
            'title' => 'Test Notification',
            'message' => 'Test Message',
            'type' => 'info',
            'is_read' => false
        ]);

        $this->actingAs($candidate)
             ->patchJson("/api/v1/notifications/{$notification->id}/read")
             ->assertStatus(200)
             ->assertJsonPath('data.is_read', true);

        $this->assertDatabaseHas('notifications', [
            'id' => $notification->id,
            'is_read' => true
        ]);
    }
}
