<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\BaseController;
use App\Models\Application;
use App\Models\Company;
use App\Models\Job;
use App\Models\User;
use App\Services\ApiResponseService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends BaseController
{
    public function __construct(ApiResponseService $response)
    {
        parent::__construct($response);
    }

    public function stats(): JsonResponse
    {
        $now = Carbon::now();
        $weekAgo = $now->copy()->subDays(7);

        $totalUsers      = User::count();
        $totalEmployers  = User::where('role', 'employer')->count();
        $totalCandidates = User::where('role', 'candidate')->count();
        $totalAdmins     = User::where('role', 'admin')->count();

        $totalJobs    = Job::count();
        $pendingJobs  = Job::where('status', 'pending')->count();
        $approvedJobs = Job::where('status', 'approved')->count();
        $rejectedJobs = Job::where('status', 'rejected')->count();

        $totalApplications = Application::count();
        $totalCompanies    = Company::count();

        $newUsersThisWeek = User::where('created_at', '>=', $weekAgo)->count();
        $newJobsThisWeek  = Job::where('created_at', '>=', $weekAgo)->count();
        $newAppsThisWeek  = Application::where('created_at', '>=', $weekAgo)->count();

        $appStatuses = Application::select('application_status', DB::raw('count(*) as count'))
            ->groupBy('application_status')
            ->pluck('count', 'application_status')
            ->toArray();

        return $this->response->success([
            'total_users'          => $totalUsers,
            'total_employers'      => $totalEmployers,
            'total_candidates'     => $totalCandidates,
            'total_admins'         => $totalAdmins,
            'total_jobs'           => $totalJobs,
            'pending_jobs'         => $pendingJobs,
            'approved_jobs'        => $approvedJobs,
            'rejected_jobs'        => $rejectedJobs,
            'total_applications'   => $totalApplications,
            'total_companies'      => $totalCompanies,
            'new_users_this_week'  => $newUsersThisWeek,
            'new_jobs_this_week'   => $newJobsThisWeek,
            'new_apps_this_week'   => $newAppsThisWeek,
            'application_statuses' => $appStatuses,
        ], 'Admin dashboard stats retrieved successfully');
    }

    public function registrationsOverTime(Request $request): JsonResponse
    {
        $days = $this->parsePeriod($request->query('period', '30d'));
        $rows = $this->dailyCounts(User::class, 'created_at', $days);
        return $this->response->success($rows, 'Registrations over time retrieved successfully');
    }

    public function jobsOverTime(Request $request): JsonResponse
    {
        $days = $this->parsePeriod($request->query('period', '30d'));
        $rows = $this->dailyCounts(Job::class, 'created_at', $days);
        return $this->response->success($rows, 'Jobs over time retrieved successfully');
    }

    public function applicationsOverTime(Request $request): JsonResponse
    {
        $days = $this->parsePeriod($request->query('period', '30d'));
        $rows = $this->dailyCounts(Application::class, 'created_at', $days);
        return $this->response->success($rows, 'Applications over time retrieved successfully');
    }

    public function usersByRole(): JsonResponse
    {
        $rows = User::select('role', DB::raw('count(*) as count'))
            ->groupBy('role')
            ->get()
            ->map(fn ($r) => ['role' => $r->role, 'count' => (int) $r->count]);
        return $this->response->success($rows, 'Users by role retrieved successfully');
    }

    public function jobsByStatus(): JsonResponse
    {
        $rows = Job::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->map(fn ($r) => ['status' => $r->status, 'count' => (int) $r->count]);
        return $this->response->success($rows, 'Jobs by status retrieved successfully');
    }

    public function topCategories(): JsonResponse
    {
        $rows = DB::table('jobs')
            ->join('categories', 'jobs.category_id', '=', 'categories.id')
            ->where('jobs.status', 'approved')
            ->select('categories.name', DB::raw('count(*) as count'))
            ->groupBy('categories.id', 'categories.name')
            ->orderByDesc('count')
            ->limit(8)
            ->get()
            ->map(fn ($r) => ['name' => $r->name, 'count' => (int) $r->count]);
        return $this->response->success($rows, 'Top categories retrieved successfully');
    }

    private function parsePeriod(string $period): int
    {
        return match ($period) {
            '7d'  => 7,
            '90d' => 90,
            default => 30,
        };
    }

    private function dailyCounts(string $modelClass, string $column, int $days): array
    {
        $start = Carbon::now()->subDays($days - 1)->startOfDay();
        $end   = Carbon::now()->endOfDay();

        $raw = $modelClass::select(
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
