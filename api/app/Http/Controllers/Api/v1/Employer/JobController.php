<?php

namespace App\Http\Controllers\Api\V1\Employer;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Job\StoreJobRequest;
use App\Http\Requests\Job\UpdateJobRequest;
use App\Http\Resources\JobListResource;
use App\Http\Resources\JobResource;
use App\Models\Job;
use App\Services\ApiResponseService;
use App\Services\JobService;
use Illuminate\Http\JsonResponse;

class JobController extends BaseController
{
    public function __construct(
        ApiResponseService $response,
        private JobService $jobService
    ) {
        parent::__construct($response);
    }

    public function index(): JsonResponse
    {
        $user = auth()->user();
        $jobs = Job::where('employer_id', $user->id)
            ->with(['company', 'category', 'skills'])
            ->latest()
            ->paginate(10);

        return $this->response->success(
            JobListResource::collection($jobs),
            'Jobs retrieved successfully',
            200,
            [
                'total' => $jobs->total(),
                'per_page' => $jobs->perPage(),
                'current_page' => $jobs->currentPage(),
                'last_page' => $jobs->lastPage(),
            ]
        );
    }

    public function store(StoreJobRequest $request): JsonResponse
    {
        $user = auth()->user();
        $job = $this->jobService->create($request->validated(), $user);

        return $this->response->created(
            new JobResource($job),
            'Job created successfully'
        );
    }

    public function show(Job $job): JsonResponse
    {
        $job->load(['company', 'category', 'skills', 'applicationQuestions']);

        return $this->response->success(
            new JobResource($job),
            'Job retrieved successfully'
        );
    }

    public function update(UpdateJobRequest $request, Job $job): JsonResponse
    {
        $user = auth()->user();
        $updatedJob = $this->jobService->update($job, $request->validated(), $user);

        return $this->response->updated(
            new JobResource($updatedJob),
            'Job updated successfully'
        );
    }

    public function destroy(Job $job): JsonResponse
    {
        $user = auth()->user();
        $this->jobService->delete($job, $user);

        return $this->response->deleted('Job deleted successfully');
    }
}