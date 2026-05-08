<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobListResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'location' => $this->location,
            'work_type' => $this->work_type,
            'employment_type' => $this->employment_type,
            'salary_min' => $this->salary_min,
            'salary_max' => $this->salary_max,
            'salary_currency' => $this->salary_currency,
            'application_deadline' => $this->application_deadline?->toDateString(),
            'status' => $this->status->value,
            'created_at' => $this->created_at->toIso8601String(),
            'company' => [
                'id' => $this->company->id,
                'name' => $this->company->name,
                'logo_url' => $this->company->logo_url,
            ],
            'category' => [
                'id' => $this->category->id,
                'name' => $this->category->name,
            ],
            'skills' => $this->skills->pluck('name'),
        ];
    }}
