<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Http\Resources\ActivityLogResource;
use App\Services\ActivityLogService;
use App\Services\ApiResponseService;
use Illuminate\Http\JsonResponse;

class ActivityLogController extends BaseController
{
    public function __construct(
        ApiResponseService $response,
        private ActivityLogService $activityLogService
    ) {
        parent::__construct($response);
    }

    /**
     * Get all activity logs (admin only).
     */
    public function index(): JsonResponse
    {
        $logs = $this->activityLogService->getAllActivityLogs(50);

        return $this->response->success(
            ActivityLogResource::collection($logs),
            'Activity logs retrieved successfully',
            200,
            [
                'total' => $logs->total(),
                'per_page' => $logs->perPage(),
                'current_page' => $logs->currentPage(),
                'last_page' => $logs->lastPage(),
            ]
        );
    }

    /**
     * Get authenticated user's activity logs.
     */
    public function myActivityLogs(): JsonResponse
    {
        $user = auth()->user();
        $logs = $this->activityLogService->getUserActivityLogs($user, 50);

        return $this->response->success(
            ActivityLogResource::collection($logs),
            'Your activity logs retrieved successfully',
            200,
            [
                'total' => $logs->total(),
                'per_page' => $logs->perPage(),
                'current_page' => $logs->currentPage(),
                'last_page' => $logs->lastPage(),
            ]
        );
    }
}