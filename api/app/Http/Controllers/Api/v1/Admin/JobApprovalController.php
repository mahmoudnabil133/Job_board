<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\BaseController;
use App\Http\Resources\JobResource;
use App\Models\Job;
use App\Services\ApiResponseService;
use App\Services\JobService;
use Illuminate\Http\JsonResponse;

class JobApprovalController extends BaseController
{
    public function __construct(
        ApiResponseService $response,
        private JobService $jobService
    ) {
        parent::__construct($response);
    }

    public function pending(): JsonResponse
    {
        $user = auth()->user();
        $jobs = $this->jobService->getPendingJobs($user);

        return $this->response->success(
            JobResource::collection($jobs),
            'Pending jobs retrieved successfully',
            200,
            [
                'total' => $jobs->total(),
                'per_page' => $jobs->perPage(),
                'current_page' => $jobs->currentPage(),
                'last_page' => $jobs->lastPage(),
            ]
        );
    }

    public function approve(Job $job): JsonResponse
    {
        $admin = auth()->user();
        $this->jobService->approveJob($job, $admin);

        return $this->response->success(
            new JobResource($job->fresh()->load(['company', 'category', 'skills'])),
            'Job approved successfully'
        );
    }

    public function reject(Job $job): JsonResponse
    {
        $admin = auth()->user();
        $this->jobService->rejectJob($job, $admin);

        return $this->response->success(
            new JobResource($job->fresh()->load(['company', 'category', 'skills', 'employer'])),
            'Job rejected successfully'
        );
    }
}