<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\BaseController;
use App\Models\User;
use App\Models\Job;
use App\Models\Application;
use App\Services\ApiResponseService;
use Illuminate\Http\JsonResponse;

class DashboardController extends BaseController
{
    public function __construct(ApiResponseService $response)
    {
        parent::__construct($response);
    }

    public function stats(): JsonResponse
    {
        $totalJobs = Job::count();
        $latestJobs = Job::with(['company', 'category'])
            ->latest()
            ->take(5)
            ->get();

        $totalEmployers = User::where('role', 'employer')->count();
        $totalCandidates = User::where('role', 'candidate')->count();

        $totalApplications = Application::count();

        return $this->response->success([
            'total_jobs' => $totalJobs,
            'latest_jobs' => $latestJobs,
            'total_employers' => $totalEmployers,
            'total_candidates' => $totalCandidates,
            'total_applications' => $totalApplications,
        ], 'Dashboard data retrieved successfully');
    }
}
