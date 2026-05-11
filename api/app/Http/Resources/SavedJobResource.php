<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SavedJobResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'candidate_id' => $this->candidate_id,
            'saved_at' => $this->created_at->toIso8601String(),
            'job' => [
                'id' => $this->job->id,
                'title' => $this->job->title,
                'slug' => $this->job->slug,
                'location' => $this->job->location,
                'work_type' => $this->job->work_type,
                'employment_type' => $this->job->employment_type,
                'salary_min' => $this->job->salary_min,
                'salary_max' => $this->job->salary_max,
                'salary_currency' => $this->job->salary_currency,
                'application_deadline' => $this->job->application_deadline?->toDateString(),
                'status' => $this->job->status,
                'company' => [
                    'id' => $this->job->company->id,
                    'name' => $this->job->company->name,
                    'logo_url' => $this->job->company->logo,
                ],
                'category' => [
                    'id' => $this->job->category->id,
                    'name' => $this->job->category->name,
                ],
                'skills' => $this->job->skills->pluck('name'),
            ],
        ];
    }
}