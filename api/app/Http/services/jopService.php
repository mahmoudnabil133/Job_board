<?php

use App\Models\Job;
use App\Models\User;
use App\Enum\JobStatus;
use Illuminate\Validation\UnauthorizedException;

class JobService{
    public function create(array $data, User $employer){
        $job = Job::create([
            ...$data,
            'employer_id'=>$employer->id,
            'status' => JobStatus::Pending,
            'expires_at' => now()->addDays(30),
        ]);

        if(!empty($data['skills'])){
            $job->skills()->sync($data['skills']);
        }

        // attach application questions if provided
        if(!empty($data['application_questions'])){
            foreach ($data['questions'] as $q) {
                $job->applicationQuestions()->create($q);
            }
        }
        Log::info('job.created', ['job_id' => $job->id, 'employer_id' => $employer->id]);
        return $job->load(['company', 'category', 'skills']);
    }

    public function update(Job $job, array $data, User $employer){
        $job->update($data);
        if($job->employer_id !== $employer->id){
            throw new UnauthorizedException('You are not authorized to update this job.');
        }
        if ($job->status === JobStatus::Approved) {
            throw new Exception('Cannot edit an approved job. Reset to draft first.');
        }
        if(isset($data['skills'])){
            $job->skills()->sync($data['skills']);
        }
        if(isset($data['questions'])){
            $job->applicationQuestions()->delete();
            foreach ($data['questions'] as $q) {
                $job->applicationQuestions()->create($q);
            }
        }
        Log::info('job.updated', ['job_id' => $job->id, 'employer_id' => $employer->id]);
        return $job->fresh()->load(['company', 'category', 'skills']);
    }

    public function delete(Job $job, User $employer){
        if($job->employer_id !== $employer->id){
            throw new UnauthorizedException('You are not authorized to delete this job.');
        }
        $job->delete();
        Log::info('job.deleted', ['job_id' => $job->id, 'employer_id' => $employer->id]);
        return true;
    }
}