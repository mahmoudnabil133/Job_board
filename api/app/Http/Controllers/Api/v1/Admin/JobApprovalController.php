<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\JobResource;
use App\Models\Job;
use App\Services\JobService;
use Illuminate\Http\Request;
use PHPUnit\Framework\TestStatus\Success;

class JobApprovalController extends Controller
{
    public function __construct(private JobService $jobService)
    {
    }

    public function pending()
    {
        $user = auth()->user();
        $jobs = $this->jobService->getPendingJobs($user);
        return response()->json([
            'success' => true,
            'data' => $jobs,
            'meta' => [
                'total' => $jobs->total(),
                'per_page' => $jobs->perPage(),
                'current_page' => $jobs->currentPage(),
                'last_page' => $jobs->lastPage(),
            ],
        ]);
    }

    public function approve(Job $job)  // ← Laravel does Job::findOrFail(id) automatically
    {
        try {
            $admin = auth()->user();
            $this->jobService->approveJob($job, $admin);
            return response()->json([
                'success' => true,
                'message' => 'Job approved successfully',
                'data' => new JobResource($job->fresh()->load([
                    'company',
                    'category',
                    'skills',
                ])),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function reject(Job $job)
    {
        try {
            $admin = auth()->user();
            $this->jobService->rejectJob($job, $admin);
            return response()->json([
                'success' => true,
                'message' => 'Job rejected successfully',
                'data' => new JobResource($job->fresh()->load([
                    'company',
                    'category',
                    'skills',
                    'employer'
                ])),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
