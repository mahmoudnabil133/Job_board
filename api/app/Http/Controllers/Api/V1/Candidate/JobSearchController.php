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

/**
 * @OA\Get(
 *     path="/v1/jobs",
 *     operationId="searchJobs",
 *     tags={"Jobs"},
 *     summary="Search approved jobs",
 *     description="Search and filter through available job listings",
 *     @OA\Parameter(name="q", in="query", @OA\Schema(type="string"), description="Search query by job title"),
 *     @OA\Parameter(name="work_type", in="query", @OA\Schema(type="string"), description="Filter by work type"),
 *     @OA\Parameter(name="employment_type", in="query", @OA\Schema(type="string"), description="Filter by employment type"),
 *     @OA\Parameter(name="experience_level", in="query", @OA\Schema(type="string"), description="Filter by experience level"),
 *     @OA\Parameter(name="category_id", in="query", @OA\Schema(type="integer"), description="Filter by category ID"),
 *     @OA\Parameter(name="location", in="query", @OA\Schema(type="string"), description="Filter by location"),
 *     @OA\Parameter(name="salary_min", in="query", @OA\Schema(type="number"), description="Minimum salary filter"),
 *     @OA\Parameter(name="salary_max", in="query", @OA\Schema(type="number"), description="Maximum salary filter"),
 *     @OA\Parameter(name="per_page", in="query", @OA\Schema(type="integer", default=15), description="Items per page"),
 *     @OA\Response(
 *         response=200,
 *         description="Jobs retrieved successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean"),
 *             @OA\Property(property="data", type="array", items={}),
 *             @OA\Property(
 *                 property="meta",
 *                 @OA\Property(property="total", type="integer"),
 *                 @OA\Property(property="per_page", type="integer"),
 *                 @OA\Property(property="current_page", type="integer"),
 *                 @OA\Property(property="last_page", type="integer")
 *             )
 *         )
 *     )
 * )
 * 
 * @OA\Get(
 *     path="/v1/jobs/{slug}",
 *     operationId="getJobBySlug",
 *     tags={"Jobs"},
 *     summary="Get job details",
 *     description="Retrieve detailed information about a specific job",
 *     @OA\Parameter(name="slug", in="path", required=true, @OA\Schema(type="string")),
 *     @OA\Response(
 *         response=200,
 *         description="Job retrieved successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean"),
 *             @OA\Property(property="data", type="object")
 *         )
 *     ),
 *     @OA\Response(response=404, description="Job not found")
 * )
 */
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
        ->when($request->q, function ($q) use ($request) {
            return $q->where('title', 'like', '%' . $request->q . '%');
        })
        ->when($request->work_type, function ($q) use ($request) {
            return $q->where('work_type', $request->work_type);
        })
        ->when($request->employment_type, function ($q) use ($request) {
            return $q->where('employment_type', $request->employment_type);
        })
        ->when($request->experience_level, function ($q) use ($request) {
            return $q->where('experience_level', $request->experience_level);
        })
        ->when($request->category_id, function ($q) use ($request) {
            return $q->where('category_id', $request->category_id);
        })
        ->when($request->location, function ($q) use ($request) {
            return $q->where('location', 'like', '%' . $request->location . '%');
        })
        ->when($request->salary_min, function ($q) use ($request) {
            return $q->where('salary_min', '>=', $request->salary_min);
        })
        ->when($request->salary_max, function ($q) use ($request) {
            return $q->where('salary_max', '<=', $request->salary_max);
        })
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