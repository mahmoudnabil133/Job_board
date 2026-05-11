<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApplicationListResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'job_id' => $this->job_id,
            'application_status' => $this->application_status,
            'created_at' => $this->created_at->toIso8601String(),
            'job' => [
                'id' => $this->job->id,
                'title' => $this->job->title,
                'company' => $this->job->company?->name,
                'location' => $this->job->location,
                'work_type' => $this->job->work_type,
            ],
        ];
    }
}