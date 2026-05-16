<?php

namespace App\Http\Controllers\Api\V1\Employer;

use App\Http\Controllers\BaseController;
use App\Models\Application;
use App\Models\Job;
use App\Services\ApiResponseService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EmployerDashboardController extends BaseController
{
    public function __construct(ApiResponseService $response)
    {
        parent::__construct($response);
    }

    public function stats(Request $request): JsonResponse
    {
        $employerId = $request->user()->id;

        $totalJobs   = Job::where('employer_id', $employerId)->count();
        $activeJobs  = Job::where('employer_id', $employerId)->where('status', 'approved')->count();
        $pendingJobs = Job::where('employer_id', $employerId)->where('status', 'pending')->count();
        $rejectedJobs = Job::where('employer_id', $employerId)->where('status', 'rejected')->count();

        $jobIds = Job::where('employer_id', $employerId)->pluck('id');

        $totalApplications = Application::whereIn('job_id', $jobIds)->count();

        $statusBreakdown = Application::whereIn('job_id', $jobIds)
            ->select('application_status', DB::raw('count(*) as count'))
            ->groupBy('application_status')
            ->pluck('count', 'application_status')
            ->toArray();

        $jobsByWorkType = Job::where('employer_id', $employerId)
            ->select('work_type', DB::raw('count(*) as count'))
            ->groupBy('work_type')
            ->get()
            ->map(fn ($r) => ['type' => $r->work_type, 'count' => (int) $r->count]);

        $recentApplications = Application::whereIn('job_id', $jobIds)
            ->with(['job:id,title', 'candidate:id,name'])
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn ($a) => [
                'id'         => $a->id,
                'job_title'  => $a->job->title ?? '—',
                'candidate'  => $a->candidate->name ?? '—',
                'status'     => $a->application_status,
                'created_at' => $a->created_at?->toIso8601String(),
            ]);

        return $this->response->success([
            'total_jobs'          => $totalJobs,
            'active_jobs'         => $activeJobs,
            'pending_jobs'        => $pendingJobs,
            'rejected_jobs'       => $rejectedJobs,
            'total_applications'  => $totalApplications,
            'status_breakdown'    => $statusBreakdown,
            'jobs_by_work_type'   => $jobsByWorkType,
            'recent_applications' => $recentApplications,
        ], 'Dashboard stats retrieved successfully');
    }

    public function applicationsOverTime(Request $request): JsonResponse
    {
        $employerId = $request->user()->id;
        $days       = $this->parsePeriod($request->query('period', '30d'));

        $jobIds = Job::where('employer_id', $employerId)->pluck('id');
        $rows   = $this->dailyCounts(
            Application::whereIn('job_id', $jobIds),
            'created_at',
            $days
        );

        return $this->response->success($rows, 'Applications over time retrieved successfully');
    }

    public function topJobs(Request $request): JsonResponse
    {
        $employerId = $request->user()->id;

        $rows = Job::where('employer_id', $employerId)
            ->withCount('applications')
            ->orderByDesc('applications_count')
            ->limit(10)
            ->get()
            ->map(fn ($j) => [
                'id'                  => $j->id,
                'title'               => $j->title,
                'status'              => $j->status,
                'applications_count'  => $j->applications_count,
            ]);

        return $this->response->success($rows, 'Top jobs retrieved successfully');
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