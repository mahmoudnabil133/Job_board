<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Job;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JobApprovalController extends Controller
{
    public function pending(): JsonResponse
    {
        $jobs = Job::where('status', 'pending')->get();
        return $this->success($jobs);
    }

    public function approve(Job $job): JsonResponse
    {
        $job->update(['status' => 'approved']);
        return $this->success(null, 'Job approved successfully');
    }

    public function reject(Job $job): JsonResponse
    {
        $job->update(['status' => 'rejected']);
        return $this->success(null, 'Job rejected successfully');
    }
}
