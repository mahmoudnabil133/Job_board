<?php

namespace App\Http\Controllers\Api\V1\Candidate;

use App\Http\Controllers\BaseController;
use App\Models\ActivityLog;
use App\Models\Application;
use App\Models\CandidatesProfile;
use App\Models\SavedJob;
use App\Services\ApiResponseService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CandidateDashboardController extends BaseController
{
    public function __construct(ApiResponseService $response)
    {
        parent::__construct($response);
    }

    public function stats(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $totalApplications = Application::where('candidate_id', $userId)->count();

        $statusBreakdown = Application::where('candidate_id', $userId)
            ->select('application_status', DB::raw('count(*) as count'))
            ->groupBy('application_status')
            ->pluck('count', 'application_status')
            ->toArray();

        $savedJobsCount = SavedJob::where('candidate_id', $userId)->count();

        $profileComplete = CandidatesProfile::where('user_id', $userId)->exists();

        $recentApplications = Application::where('candidate_id', $userId)
            ->with(['job:id,title,slug', 'job.company:id,name'])
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn ($a) => [
                'id'          => $a->id,
                'job_title'   => $a->job->title ?? '—',
                'job_slug'    => $a->job->slug ?? null,
                'company'     => $a->job->company->name ?? '—',
                'status'      => $a->application_status,
                'created_at'  => $a->created_at?->toIso8601String(),
            ]);

        $statusChart = collect(['pending', 'shortlisted', 'accepted', 'rejected', 'withdrawn'])
            ->map(fn ($s) => [
                'status' => $s,
                'count'  => (int) ($statusBreakdown[$s] ?? 0),
            ])
            ->filter(fn ($r) => $r['count'] > 0)
            ->values();

        return $this->response->success([
            'total_applications'  => $totalApplications,
            'status_breakdown'    => $statusBreakdown,
            'status_chart'        => $statusChart,
            'saved_jobs_count'    => $savedJobsCount,
            'profile_complete'    => $profileComplete,
            'recent_applications' => $recentApplications,
        ], 'Dashboard stats retrieved successfully');
    }

    public function applicationsOverTime(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $days   = $this->parsePeriod($request->query('period', '30d'));
        $rows   = $this->dailyCounts(
            Application::where('candidate_id', $userId),
            'created_at',
            $days
        );

        return $this->response->success($rows, 'Applications over time retrieved successfully');
    }

    public function activityTimeline(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $logs = ActivityLog::where('user_id', $userId)
            ->latest()
            ->limit(20)
            ->get()
            ->map(fn ($l) => [
                'id'          => $l->id,
                'action'      => $l->action ?? 'Activity',
                'description' => $l->description ?? '',
                'created_at'  => $l->created_at?->toIso8601String(),
            ]);

        return $this->response->success($logs, 'Activity timeline retrieved successfully');
    }

    private function parsePeriod(string $period): int
    {
        return match ($period) {
            '7d'  => 7,
            '90d' => 90,
            default => 30,
        };
    }

    private function dailyCounts($query, string $column, int $days): array
    {
        $start = Carbon::now()->subDays($days - 1)->startOfDay();
        $end   = Carbon::now()->endOfDay();

        $raw = (clone $query)
            ->select(
                DB::raw("DATE({$column}) as date"),
                DB::raw('count(*) as count')
            )
            ->whereBetween($column, [$start, $end])
            ->groupByRaw("DATE({$column})")
            ->orderBy('date')
            ->pluck('count', 'date')
            ->toArray();

        $result = [];
        $cursor = $start->copy();
        while ($cursor <= $end) {
            $key      = $cursor->toDateString();
            $result[] = ['date' => $key, 'count' => (int) ($raw[$key] ?? 0)];
            $cursor->addDay();
        }

        return $result;
    }
}