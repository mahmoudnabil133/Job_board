<?php
namespace App\Services;

use App\Models\Job;
use App\Models\SavedJob;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpKernel\Exception\HttpException;
class SavedJobService
{
    public function __construct(
        private ActivityLogService $activityLogService
    ) {
    }

    public function getSavedJobs(User $user){
        if(!$user->isCandidate()){
            throw new AuthorizationException('only candidates can have saved jobs');
        }
        return SavedJob::where('candidate_id', $user->id)->with('job.company', 'job.category', 'job.skills')->latest()->paginate(20);
    }

    public function saveJob(User $user, Job $job){
        if(!$user->isCandidate()){
            throw new AuthorizationException('only candidates can have saved jobs');
        }
        if($this->isSaved($user, $job)){
            throw new HttpException(400, 'Job is already saved.');
        }
        $savedJob = SavedJob::create([
            'candidate_id' => $user->id,
            'job_id' => $job->id,
        ]);
        Log::info('job.saved', [
            'job_id' => $job->id,
            'candidate_id' => $user->id,
        ]);
        $this->activityLogService->log($user, 'job.saved', "Candidate {$user->id} saved job with ID {$job->id}.");
        return $savedJob->load([
            'job.company',
            'job.category',
            'job.skills',
        ]);
    }
    public function unSaveJob(User $user, Job $job){
        if(!$user->isCandidate()){
            throw new AuthorizationException('only candidates can have saved jobs');
        }
        if(!$this->isSaved($user, $job)){
            throw new HttpException(400, 'Job is not saved.');
        }
        $savedJob = SavedJob::where('candidate_id', $user->id)->where('job_id', $job->id)->first();
        $savedJob->delete();
        Log::info('job.unsaved', [
            'job_id' => $job->id,
            'candidate_id' => $user->id,
        ]);
        $this->activityLogService->log($user, 'job.unsaved', "Candidate {$user->id} unsaved job with ID {$job->id}.");
        return $savedJob->load([
            'job.company',
            'job.category',
            'job.skills',
        ]);
    }

    public function toggle(Job $job, User $user): array
    {
        if ($this->isSaved($user, $job)) {
            $this->unsaveJob($user, $job);
            return ['saved' => false, 'message' => 'Job unsaved successfully'];
        }

        $this->saveJob($user, $job);
        return ['saved' => true, 'message' => 'Job saved successfully'];
    }





    public function isSaved(User $user, Job $job){
        if(!$user->isCandidate()){
            throw new AuthorizationException('only candidates can have saved jobs');
        }
        return SavedJob::where('candidate_id', $user->id)->where('job_id', $job->id)->exists();
    }
}