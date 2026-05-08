<?php

namespace App\Http\Controllers\Api\V1\Candidate;

use App\Http\Controllers\Controller;
use App\Http\Resources\JobListResource;
use App\Http\Resources\JobResource;
use App\Models\Job;
use Illuminate\Http\Request;

class JobSearchController extends Controller
{
    //query => title, location, work_type, employment_type, experience_level, category_id, salary_min, salary_max
    public function index(Request $request)
    {
        $jobs = Job::query()
            ->where('status', JobStatus::APPROVED)   // only approved jobs
            ->with(['company', 'category', 'skills'])
            ->when($request->q, fn($q, $search) => $q->where('title', 'like', "%{$search}%"))
            ->when($request->work_type, fn($q, $type) => $q->where('work_type', $type))
            ->when($request->employment_type, fn($q, $type) => $q->where('employment_type', $type))
            ->when($request->experience_level, fn($q, $level) => $q->where('experience_level', $level))
            ->when($request->category_id, fn($q, $id) => $q->where('category_id', $id))
            ->when($request->location, fn($q, $loc) => $q->where('location', 'like', "%{$loc}%"))
            ->when($request->salary_min, fn($q, $min) => $q->where('salary_min', '>=', $min))
            ->when($request->salary_max, fn($q, $max) => $q->where('salary_max', '<=', $max))
            ->latest()
            ->paginate($request->per_page ?? 15);

        return JobListResource::collection($jobs);
    }
    public function show(string $slug)
    {
        $job = Job::where('slug', $slug)->firstOrFail();
        return new JobResource($job);
    }

}
