<?php

namespace App\Services;

use App\Enum\JobStatus;
use App\Models\Job;
use App\Models\User;
use Exception;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\Log;
use Str;
use Symfony\Component\HttpKernel\Exception\HttpException;

class JobService
{
    public function __construct(
        private ActivityLogService $activityLogService,
        private NotificationService $notificationService
    ) {
    }


    public function create(array $data, User $employer)
    {
        $job = Job::create([
            ...$data,
            'employer_id' => $employer->id,
            'slug' => Str::slug($data['title']),
            'status' => JobStatus::Pending,
            'expires_at' => now()->addDays(30), 
        ]);

        if (!empty($data['skill_ids'])) {
            $job->skills()->sync($data['skill_ids']);
        }

        // attach application questions if provided
        if (!empty($data['questions'])) {
            foreach ($data['questions'] as $q) {
                $job->questions()->create($q);
            }
        }
        Log::info('job.created', ['job_id' => $job->id, 'employer_id' => $employer->id]);
        $this->activityLogService->log($employer, 'job.created', "Employer {$employer->id} created a new job with ID {$job->id}.");
        return $job->load(['company', 'category', 'skills']);
    }

    public function update(Job $job, array $data, User $employer)
    {
        $job->update($data);
        if ($job->employer_id !== $employer->id) {
            throw new AuthorizationException('You are not authorized to update this job.');
        }
        if ($job->status === JobStatus::Approved) {
            throw new HttpException(400, 'Cannot edit an approved job. Reset to draft first.');
        }
        if (isset($data['skills'])) {
            $job->skills()->sync($data['skills']);
        }
        if (isset($data['questions'])) {
            $job->questions()->delete();
            foreach ($data['questions'] as $q) {
                $job->questions()->create($q);
            }
        }
        Log::info('job.updated', ['job_id' => $job->id, 'employer_id' => $employer->id]);
        $this->activityLogService->log($employer, 'job.updated', "Employer {$employer->id} updated job with ID {$job->id}.");
        return $job->fresh()->load(['company', 'category', 'skills']);
    }

    public function delete(Job $job, User $employer)
    {
        if ($job->employer_id !== $employer->id) {
            throw new AuthorizationException('You are not authorized to delete this job.');
        }
        $job->delete();
        Log::info('job.deleted', ['job_id' => $job->id, 'employer_id' => $employer->id]);
        $this->activityLogService->log($employer, 'job.deleted', "Employer {$employer->id} deleted job with ID {$job->id}.");
        return true;
    }

    // admin routes
    public function getPendingJobs(User $admin){
        if($admin->role !== 'admin'){
            throw new AuthorizationException('Only admins can view pending jobs.');
        }
        return Job::where('status', JobStatus::Pending)->with(['company', 'category', 'skills'])->latest()->paginate(10);
    }

    public function approveJob(Job $job, User $admin){
        if ($job->status !== 'pending') {
            throw new HttpException(400, 'Only pending jobs can be approved.');
        }
        $job->update([
            'status' => JobStatus::Approved,
            'approved_by' => $admin->id,
            'approved_at' => now(),
        ]);
        Log::info('job.approved', ['job_id' => $job->id, 'admin_id' => $admin->id]);
        $this->activityLogService->log($admin, 'job.approved', "Admin {$admin->id} approved job with ID {$job->id}.");
        // Notify employer about approval
        $this->notificationService->notify(
            $job->employer,
            'Job Approved',
            "Your job posting '{$job->title}' has been approved and is now live.",
            'success'
        );
        return $job->fresh()->load(['company', 'category', 'skills']);
    }

    public function rejectJob(Job $job, User $admin){
        if ($job->status !== JobStatus::Pending->value) {
            throw new HttpException(400, 'Only pending jobs can be rejected.');
        }
        $job->update([
            'status' => JobStatus::Rejected,
            'approved_by' => $admin->id,
            'approved_at' => now(),
        ]);
        Log::info('job.rejected', ['job_id' => $job->id, 'admin_id' => $admin->id]);
        $this->activityLogService->log($admin, 'job.rejected', "Admin {$admin->id} rejected job with ID {$job->id}.");
        $this->notificationService->notify(
            $job->employer,
            'Job Rejected',
            "Your job posting '{$job->title}' has been rejected. Please review our guidelines and try again.",
            'error'
        );
        return $job->fresh()->load(['company', 'category', 'skills']);
    }
}