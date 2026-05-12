<?php

namespace App\Http\Controllers\Api\V1\Candidate;

use App\Http\Controllers\BaseController;
use App\Http\Resources\SavedJobResource;
use App\Models\Job;
use App\Services\ApiResponseService;
use App\Services\SavedJobService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Exception;

class SavedJobController extends BaseController
{
    public function __construct(
        ApiResponseService $response,
        private SavedJobService $savedJobService
    ) {
        parent::__construct($response);
    }

    /**
     * Get all saved jobs.
     */
    public function index(): JsonResponse
    {
        $user = auth()->user();
        $savedJobs = $this->savedJobService->getSavedJobs($user);
        return $this->response->success(
            SavedJobResource::collection($savedJobs),
            'Saved jobs retrieved successfully',
            200,
            [
                'total' => $savedJobs->total(),
                'per_page' => $savedJobs->perPage(),
                'current_page' => $savedJobs->currentPage(),
                'last_page' => $savedJobs->lastPage(),
            ]
        );
    }

    /**
     * Save a job.
     */
    public function save(Job $job): JsonResponse
    {
        $user = auth()->user();
        $savedJob = $this->savedJobService->saveJob($user, $job);
        return $this->response->success(
            new SavedJobResource($savedJob),
            'Job saved successfully',
            200
        );
    }

    /**
     * Unsave a job.
     */
    public function unsave(Job $job): JsonResponse
    {
        $user = auth()->user();
        $this->savedJobService->unsaveJob($user, $job);
            return $this->response->success(
                ['saved'=> false],
                'Job unsaved successfully'
            );
    }

    /**
     * Toggle save/unsave a job.
     */
    public function toggle(Job $job): JsonResponse
    {
        $user = auth()->user();
        $result = $this->savedJobService->toggle($job, $user);
        return $this->response->success(
            ['saved' => $result['saved']],
            $result['message']
        );
    }

    /**
     * Check if a job is saved.
     */
    public function check(Job $job): JsonResponse
    {
        $user = auth()->user();
        $isSaved = $this->savedJobService->isSaved($user, $job);
        return $this->response->success(
            ['saved' => $isSaved],
            $isSaved ? 'Job is saved' : 'Job is not saved'
        );
    }
}