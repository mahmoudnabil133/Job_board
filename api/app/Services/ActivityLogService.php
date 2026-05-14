<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class ActivityLogService
{
    public function log(?User $user, string $action, ?string $description = null){
        $activityLog  = ActivityLog::create([
            'user_id' => $user ? $user->id : null,
            'action' => $action,
            'description' => $description,
        ]);
        Log::info('activity_log.created', [
            'activity_id' => $activityLog->id,
            'user_id' => $user ? $user->id : null,
            'action' => $action,
        ]);

        return $activityLog;
    }

    public function getUserActivityLogs(User $user, int $perPage = 10){
        return ActivityLog::where('user_id', $user->id)
            ->latest()
            ->paginate($perPage);
    }

    public function getAllActivityLogs(int $perPage = 10){
        return ActivityLog::with('user:id,name,email,role')
            ->latest()
            ->paginate($perPage);
    }
}