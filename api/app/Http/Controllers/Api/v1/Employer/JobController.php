<?php

namespace App\Http\Controllers\Api\V1\Employer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Job\StoreJobRequest;
use App\Http\Requests\Job\UpdateJobRequest;
use App\Http\Resources\JobListResource;
use App\Http\Resources\JobResource;
use App\Models\Job;
use App\Services\JobService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
class JobController extends Controller
{
    public function __construct(private JobService $jobService){}
    
    public function index(){
        $user = auth()->user();
        $jobs = Job::where('employer_id', $user->id)->with(['company', 'category', 'skills'])->latest()->paginate(10);
        return JobListResource::collection($jobs);
    }

    public function store(StoreJobRequest $request){
        $user = auth()->user();
        $job = $this->jobService->create($request->validated(), $user);
        return new JobResource($job);
    }

    public function show(Job $job){
        $job->load(['company', 'category', 'skills', 'applicationQuestions']);
        return new JobResource($job);
    }

    public function update(UpdateJobRequest $request, Job $job){
        $user = auth()->user();
        $updatedJob = $this->jobService->update($job, $request->validated(), $user);
        return new JobResource($updatedJob);
    }

    public function destroy(Job $job){
        $user = auth()->user();
        $this->jobService->delete($job, $user);
        return $this->success(null, 'Job deleted successfully');
    }
}
