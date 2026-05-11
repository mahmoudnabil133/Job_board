<?php

namespace App\Http\Controllers\Api\V1\Candidate;

use App\Enum\JobStatus;
use App\Http\Controllers\BaseController;
use App\Http\Resources\JobListResource;
use App\Http\Resources\JobResource;
use App\Models\Job;
use App\Services\ApiResponseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JobSearchController extends BaseController
{
    public function __construct(ApiResponseService $response)
    {
        parent::__construct($response);
    }

    public function index(Request $request): JsonResponse
    {
        $jobs = Job::query()
            ->where('status', JobStatus::Approved)
            ->with(['company', 'category', 'skills'])
            ->when($request->q, fn($q, $search) => $q->where('title', 'like', "%{$search}%"))
            ->when($request->work_type, fn($q, $type) => $q->where('work_type', $type))
            ->when($request->employment_type, fn($q, $type) => $q->where('employment_type', $type))
            ->when($request->experience_level, fn($q, $level) => $q->where('experience_level', $level))
            ->when($request->category_id, fn($q, $id) => $q->where('category_id', $id))
            ->when($request->location, fn($q, $loc) => $q->where('location', 'like', "%{$loc}%"))
            ->when($request->salary_min, fn($q, $min) => $q->where('salary_min', '>=', $min))
            ->when($request->salary_max, fn($q, $max) => $q->where('salary_max', '<=', $max))
            ->latest()
            ->paginate($request->per_page ?? 15);

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

    public function show(string $slug): JsonResponse
    {
        $job = Job::where('slug', $slug)->firstOrFail();

        return $this->response->success(
            new JobResource($job),
            'Job retrieved successfully'
        );
    }
}