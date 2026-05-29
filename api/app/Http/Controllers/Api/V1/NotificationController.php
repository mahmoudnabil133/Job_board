<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;
use App\Models\Notification;
use App\Services\ApiResponseService;
use App\Services\NotificationService;
use Faker\Provider\Base;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @OA\Get(
 *     path="/v1/notifications",
 *     operationId="getNotifications",
 *     tags={"Notifications"},
 *     summary="Get user notifications",
 *     description="Retrieve all notifications for the authenticated user",
 *     security={{"sanctum":{}}},
 *     @OA\Response(
 *         response=200,
 *         description="Notifications retrieved successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string"),
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
 *     path="/v1/notifications/unread-count",
 *     operationId="getUnreadCount",
 *     tags={"Notifications"},
 *     summary="Get unread notification count",
 *     description="Get the count of unread notifications",
 *     security={{"sanctum":{}}},
 *     @OA\Response(
 *         response=200,
 *         description="Unread count retrieved successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="data", @OA\Property(property="unread_count", type="integer"))
 *         )
 *     )
 * )
 * 
 * @OA\Patch(
 *     path="/v1/notifications/{notification}/read",
 *     operationId="markNotificationAsRead",
 *     tags={"Notifications"},
 *     summary="Mark notification as read",
 *     description="Mark a specific notification as read",
 *     security={{"sanctum":{}}},
 *     @OA\Parameter(name="notification", in="path", required=true, @OA\Schema(type="integer")),
 *     @OA\Response(
 *         response=200,
 *         description="Notification marked as read",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string")
 *         )
 *     ),
 *     @OA\Response(response=403, description="Unauthorized")
 * )
 * 
 * @OA\Post(
 *     path="/v1/notifications/mark-all-read",
 *     operationId="markAllNotificationsAsRead",
 *     tags={"Notifications"},
 *     summary="Mark all notifications as read",
 *     description="Mark all notifications for the user as read",
 *     security={{"sanctum":{}}},
 *     @OA\Response(
 *         response=200,
 *         description="All notifications marked as read",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string")
 *         )
 *     )
 * )
 */
class NotificationController extends BaseController
{
    public function __construct(
        private NotificationService $notificationService,
        ApiResponseService $response,
    ) {
        parent::__construct($response);
    }

    /**
     * Get all notifications for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $notifications = $this->notificationService->getUserNotifications($request->user());
        return $this->response->success(
            NotificationResource::collection($notifications),
            'Notifications retrieved successfully',
            200,
            [
                'total' => $notifications->total(),
                'per_page' => $notifications->perPage(),
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
            ]
        );
    }

    /**
     * Get unread notification count.
     */
    public function unreadCount(Request $request): JsonResponse
    {
        $count = $this->notificationService->getUnreadCount($request->user());
        return $this->response->success(['unread_count' => $count], 'Unread notification count retrieved successfully');
    }

    /**
     * Mark a notification as read.
     */
    public function markAsRead(Notification $notification, Request $request): JsonResponse
    {
        if ($notification->user_id !== $request->user()->id) {
            return $this->response->error('Unauthorized', 403);
        }

        $this->notificationService->markAsRead($notification);
        return $this->response->success(new NotificationResource($notification), 'Notification marked as read');
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        $this->notificationService->markAllAsRead($request->user());
        return $this->response->success(null, 'All notifications marked as read');
    }
}
