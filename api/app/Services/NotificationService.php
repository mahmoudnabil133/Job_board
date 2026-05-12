<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

class NotificationService
{
    /**
     * Create a new notification for a user.
     *
     * @param User $user
     * @param string $title
     * @param string $message
     * @param string $type
     * @return Notification
     */
    public function notify(User $user, string $title, string $message, string $type = 'info'): Notification
    {
        return Notification::create([
            'user_id' => $user->id,
            'title'   => $title,
            'message' => $message,
            'type'    => $type,
            'is_read' => false,
        ]);
    }

    /**
     * Get paginated notifications for a user.
     *
     * @param User $user
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getUserNotifications(User $user, int $perPage = 10): LengthAwarePaginator
    {
        return Notification::where('user_id', $user->id)
            ->latest()
            ->paginate($perPage);
    }

    /**
     * Mark a specific notification as read.
     *
     * @param Notification $notification
     * @return Notification
     */
    public function markAsRead(Notification $notification): Notification
    {
        $notification->update(['is_read' => true]);
        return $notification;
    }

    /**
     * Mark all notifications as read for a user.
     *
     * @param User $user
     * @return int
     */
    public function markAllAsRead(User $user): int
    {
        return Notification::where('user_id', $user->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);
    }

    /**
     * Get unread notification count for a user.
     *
     * @param User $user
     * @return int
     */
    public function getUnreadCount(User $user): int
    {
        return Notification::where('user_id', $user->id)
            ->where('is_read', false)
            ->count();
    }
}
