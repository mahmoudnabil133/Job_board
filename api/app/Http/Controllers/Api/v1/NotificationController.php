<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;
use App\Models\Notification;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function __construct(private NotificationService $notificationService) {}

    /**
     * Get all notifications for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $notifications = $this->notificationService->getUserNotifications($request->user());
        return $this->success(NotificationResource::collection($notifications), 'Notifications retrieved successfully');
    }

    /**
     * Get unread notification count.
     */
    public function unreadCount(Request $request): JsonResponse
    {
        $count = $this->notificationService->getUnreadCount($request->user());
        return $this->success(['unread_count' => $count], 'Unread notification count retrieved successfully');
    }

    /**
     * Mark a notification as read.
     */
    public function markAsRead(Notification $notification, Request $request): JsonResponse
    {
        if ($notification->user_id !== $request->user()->id) {
            return $this->error('Unauthorized', 403);
        }

        $this->notificationService->markAsRead($notification);
        return $this->success(new NotificationResource($notification), 'Notification marked as read');
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        $this->notificationService->markAllAsRead($request->user());
        return $this->success(null, 'All notifications marked as read');
    }
}
