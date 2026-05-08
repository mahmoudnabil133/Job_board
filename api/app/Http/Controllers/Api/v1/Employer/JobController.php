<?php

namespace App\Http\Controllers\Api\V1\Employer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Job\StoreJobRequest;
use App\Http\Requests\Job\UpdateJobRequest;
use App\Http\Resources\JobListResource;
use App\Http\Resources\JobResource;
use App\Models\Job;
use App\Models\User;
use Illuminate\Http\Request;
use JobService;

class JobController extends Controller
{
    public function __construct(private JobService $jobService){}
    
    public function index(){
        $user = User::firstOrFail(); // replace it with auth()->user() later
        $jobs = Job::where('employer_id', $user->id)->with(['company', 'category', 'skills'])->latest()->paginate(10);
        return JobListResource::collection($jobs);
    }

    public function store(StoreJobRequest $request){
        $user = User::firstOrFail(); // replace it with auth()->user() later
        $job = $this->jobService->create($request->validated(), $user);
        return new JobResource($job);
    }

    public function show(Job $job){
        $job->load(['company', 'category', 'skills', 'applicationQuestions']);
        return new JobResource($job);
    }

    public function update(UpdateJobRequest $request, Job $job){
        $user = User::firstOrFail(); // replace it with auth()->user() later
        $updatedJob = $this->jobService->update($job, $request->validated(), $user);
        return new JobResource($updatedJob);
    }

    public function destroy(Job $job){
        $user = User::firstOrFail(); // replace it with auth()->user() later
        $this->jobService->delete($job, $user);
        return response()->json(['message' => 'Job deleted successfully']);
    }
}
