<?php

namespace App\Services;

use App\Enum\JobStatus;
use App\Models\Job;
use App\Models\User;
use Exception;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\Log;          
use Str;// ✅ Add this

class JobService
{

    public function create(array $data, User $employer)
    {
        $job = Job::create([
            ...$data,
            'employer_id' => $employer->id,
            'slug' => Str::slug($data['title']),    // ✅ REQUIRED
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
        return $job->load(['company', 'category', 'skills']);
    }

    public function update(Job $job, array $data, User $employer)
    {
        $job->update($data);
        if ($job->employer_id !== $employer->id) {
            throw new AuthorizationException('You are not authorized to update this job.');
        }
        if ($job->status === JobStatus::Approved) {
            throw new Exception('Cannot edit an approved job. Reset to draft first.');
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
        return $job->fresh()->load(['company', 'category', 'skills']);
    }

    public function delete(Job $job, User $employer)
    {
        if ($job->employer_id !== $employer->id) {
            throw new AuthorizationException('You are not authorized to delete this job.');
        }
        $job->delete();
        Log::info('job.deleted', ['job_id' => $job->id, 'employer_id' => $employer->id]);
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
            throw new Exception('Only pending jobs can be approved.');
        }
        $job->update([
            'status' => JobStatus::Approved,
            'approved_by' => $admin->id,
            'approved_at' => now(),
        ]);
        Log::info('job.approved', ['job_id' => $job->id, 'admin_id' => $admin->id]);

        return $job->fresh()->load(['company', 'category', 'skills']);
    }

    public function rejectJob(Job $job, User $admin){
        if ($job->status !== JobStatus::Pending->value) {
            throw new Exception('Only pending jobs can be rejected.');
        }
        $job->update([
            'status' => JobStatus::Rejected,
            'approved_by' => $admin->id,
            'approved_at' => now(),
        ]);
        Log::info('job.rejected', ['job_id' => $job->id, 'admin_id' => $admin->id]);

        return $job->fresh()->load(['company', 'category', 'skills']);
    }
}