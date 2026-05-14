<?php
namespace App\Services;

use App\Enum\JobStatus;
use App\Models\Application;
use App\Models\Job;
use App\Models\User;
use Exception;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use App\Services\NotificationService;


class ApplicationService
{
    public function __construct(
        private NotificationService $notificationService,
        private ActivityLogService $activityLogService
    ) {
    }

    // - validate application data

    // - check if user has already applied to a job
    // - handle application submission, etc.

    public function apply(array $data, User $candidate){
        if(!$candidate->isCandidate()){
            throw new AuthorizationException('Only candidates can apply to jobs.');
        }
        
        // candidate can apply only:
        //         (1) if he he didnt applyed
        //         (2) if he applyed but application status is (rejected or withdrawn) 
        if
        (   $candidate->applications()->where('job_id', $data['job_id'])->exists() &&
            $candidate->applications()->where('job_id', $data['job_id'])
            ->whereIn('application_status', ['pending', 'shortlisted'])->exists())
        {
            throw new AuthorizationException('You have already applied to this job.');
        }

        $job = Job::findOrFail($data['job_id']);
        if($job->status !== JobStatus::Approved->value){
            throw new AuthorizationException('You cannot apply to a job that is not approved.');
        }
        if($job->application_deadline && now()->gt($job->application_deadline)){
            throw new HttpException(400, 'The application deadline for this job has passed.');
        }

        return DB::transaction(function() use ($data, $candidate, $job){
            $application = Application::create([
                'job_id'          => $job->id,
                'candidate_id'    => $candidate->id,
                'resume_file'     => $data['resume_file'] ?? null,
                'cover_letter'    => $data['cover_letter'] ?? null,
                'applicant_name'  => $data['applicant_name'] ?? $candidate->name,
                'applicant_email' => $data['applicant_email'] ?? $candidate->email,
                'applicant_phone' => $data['applicant_phone'] ?? null,
                'application_status' => 'pending',
            ]);
            if(!empty($data['answers'])){
                foreach($data['answers'] as $answer){
                    $application->answers()->create([
                        'question_id' => $answer['question_id'],
                        'job_id' => $job->id,
                        'answer' => $answer['answer'],
                    ]);
                }
            }
            Log::info('application.submitted', [
                'application_id' => $application->id,
                'job_id' => $job->id,
                'candidate_id' => $candidate->id,
            ]);

            $this->activityLogService->log($candidate, 'application_submitted', "Candidate {$candidate->id} submitted an application for job {$job->id}.");
            $this->notificationService->notify(
                $job->employer,
                'New Application received',
                "You have received a new application for '{$job->title}' from {$candidate->name}.",
                'info'
            );

            return $application->load(['job.company', 'answers.question']);
        });
    }

    public function getCandidateApplications(User $candidate){
        if(!$candidate->isCandidate()){
            throw new AuthorizationException('Only candidates can view their applications.');
        }
        return Application::where('candidate_id', $candidate->id)
            ->with(['job.company'])
            ->latest()
            ->paginate(10);
    }

    public function getApplication(Application $application, User $user){
        if($user->isCandidate() && $application->candidate_id !==$user->id){
            throw new AuthorizationException('You are not authorized to view this application.');
        }
        if($user->isEmployer() && $application->job->employer_id !== $user->id){
            throw new AuthorizationException('You are not authorized to view this application.');
        }

        return $application->load(['job.company', 'answers.question, job.category', 'job.skills']);
    }

    // withdraw you application
    public function withdraw (Application $application, User $user){
        if(!$user->isCandidate() || $application->candidate_id !== $user->id){
            throw new AuthorizationException('You are not authorized to withdraw this application.');
        }

        if($application->application_status === 'withdrawn'){
            throw new HttpException(400, 'This application has already been withdrawn.');
        }
        if(in_array($application->application_status, ['accepted', 'rejected'])){
            throw new HttpException(400, 'You cannot withdraw an application that has already been reviewed.');
        }
        $application->update(['application_status' => 'withdrawn']);
        Log::info('application.withdrawn', [
            'application_id' => $application->id,
            'job_id' => $application->job_id,
            'candidate_id' => $user->id,
        ]);
        $this->activityLogService->log($user, 'application_withdrawn', "Candidate {$user->id} withdrew their application for job {$application->job_id}.");
        $this->notificationService->notify(
            $application->job->employer,
            'Application Withdrawn',
            "The application for '{$application->job->title}' from {$user->name} has been withdrawn.",
            'warning'
        );
        return $application->load(['job.company', 'answers.question'])->fresh();
    }

    public function getJobApplications(Job $job, User $user){
        if(!$user->isEmployer() || $job->employer_id !== $user->id){
            throw new AuthorizationException('You are not authorized to view applications for this job.');
        }
        return Application::where('job_id', $job->id)
            ->with(['candidate.candidateProfile', 'answers.question'])
            ->latest()
            ->paginate(10);
    }

    // update application status (accept/reject, shortlist, etc.)
    // shortlist ==>  means : the employer has marked the application as a strong candidate for further consideration, but has not yet made a final decision to accept or reject the application. Shortlisting is often used as an intermediate step in the hiring process to identify candidates who meet the initial qualifications and are worth further evaluation, such as interviews or additional assessments.
    public function updateApplicationStatus(Application $application, string $status, ?string $notes, User $user){
        if(!$user->isEmployer() || $application->job->employer_id !== $user->id){
            throw new AuthorizationException('You are not authorized to update the status of this application.');
        }
        if(!in_array($status, ['accepted', 'rejected', 'shortlisted'])){
            throw new InvalidArgumentException('Invalid application status.');
        }
        if(in_array($application->application_status, ['accepted', 'rejected'])){
            throw new HttpException(400, 'You cannot update the status of an application that has already been reviewed');
        }

        $application->loadMissing(['job', 'candidate']);

        $updatedData = [
            'application_status' => $status,
            'reviewed_at' => now(),
        ];
        if($notes){
            $updatedData['employer_notes'] = $notes;
        }
        $application->update($updatedData);

        $this->activityLogService->log($application->job->employer, 'application_status_updated', "Application status updated TO {$status} for job {$application->job->id}.");
        // Notify candidate if application is accepted
        if ($status === 'accepted') {
            $this->notificationService->notify(
                $application->candidate,
                'Application Accepted!',
                "Congratulations! Your application for '{$application->job->title}' has been accepted.",
                'success'
            );
        } elseif ($status === 'shortlisted') {
            $this->notificationService->notify(
                $application->candidate,
                'Application Shortlisted',
                "Good news! You have been shortlisted for '{$application->job->title}'.",
                'info'
            );
        } elseif ($status === 'rejected') {
            $this->notificationService->notify(
                $application->candidate,
                'Application Update',
                "We regret to inform you that your application for '{$application->job->title}' was not successful this time.",
                'warning'
            );
        }

        Log::info('application.status_updated', [
            'application_id' => $application->id,
            'job_id' => $application->job_id,
            'employer_id' => $user->id,
            'new_status' => $status,
        ]);
        return $application->fresh()->load([
            'candidate.candidateProfile',
            'job',
            'answers.question'
        ]);

    }
    public function getEmployerApplications(User $user){
        if(!$user->isEmployer()){
            throw new AuthorizationException('Only employers can view applications for their jobs.');
        }
        $jobIds = Job::where('employer_id', $user->id)->pluck('id');
        
        // dd($jobIds);// Debugging line to check the retrieved job IDs

        return Application::whereIn('job_id', $jobIds)
            ->with([
                'job:id,title,company_id',
                'job.company:id,name',
                'candidate:id,name,email'
            ])            
            ->latest()
            ->paginate(10);
    }
    public function getApplicationStats(User $user){
        if(!$user->isEmployer()){
            throw new AuthorizationException('Only employers can view application statistics for their jobs.');
        }
        $jobIds = Job::where('employer_id', $user->id)->pluck('id');
        $total = Application::whereIn('job_id', $jobIds)->count();
        $pending = Application::whereIn('job_id', $jobIds)->where('application_status', 'pending')->count();
        $shortlisted = Application::whereIn('job_id', $jobIds)->where('application_status', 'shortlisted')->count();
        $accepted = Application::whereIn('job_id', $jobIds)->where('application_status', 'accepted')->count();
        $rejected = Application::whereIn('job_id', $jobIds)->where('application_status', 'rejected')->count();
        return [
            'total' => $total,
            'pending' => $pending,
            'shortlisted' => $shortlisted,
            'accepted' => $accepted,
            'rejected' => $rejected,
        ];
    }
}