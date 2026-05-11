<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApplicationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'job_id' => $this->job_id,
            'candidate_id' => $this->candidate_id,
            'resume_file' => $this->resume_file,
            'cover_letter' => $this->cover_letter,
            'applicant_name' => $this->applicant_name,
            'applicant_email' => $this->applicant_email,
            'applicant_phone' => $this->applicant_phone,
            'application_status' => $this->application_status,
            'employer_notes' => $this->employer_notes,
            'reviewed_at' => $this->reviewed_at?->toIso8601String(),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),

            // Relationships
            'job' => $this->whenLoaded('job', function () {
                return [
                    'id' => $this->job->id,
                    'title' => $this->job->title,
                    'company' => $this->job->company?->name,
                    'location' => $this->job->location,
                    'work_type' => $this->job->work_type,
                ];
            }),
            'answers' => ApplicationAnswerResource::collection(
                $this->whenLoaded('answers')
            ),
        ];
    }
}