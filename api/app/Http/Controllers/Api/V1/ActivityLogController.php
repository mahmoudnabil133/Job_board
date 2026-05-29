<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Http\Resources\ActivityLogResource;
use App\Services\ActivityLogService;
use App\Services\ApiResponseService;
use Illuminate\Http\JsonResponse;

/**
 * @OA\Get(
 *     path="/v1/logs/activity-logs",
 *     operationId="getAllActivityLogs",
 *     tags={"Admin"},
 *     summary="Get all activity logs",
 *     description="Retrieve activity logs for all users (admin only)",
 *     security={{"sanctum":{}}},
 *     @OA\Response(
 *         response=200,
 *         description="Activity logs retrieved successfully",
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
 *     path="/v1/logs/my-activity-logs",
 *     operationId="getMyActivityLogs",
 *     tags={"User Profile"},
 *     summary="Get my activity logs",
 *     description="Retrieve activity logs for the authenticated user",
 *     security={{"sanctum":{}}},
 *     @OA\Response(
 *         response=200,
 *         description="Activity logs retrieved successfully",
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
 */
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