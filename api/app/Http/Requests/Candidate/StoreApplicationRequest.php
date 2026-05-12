<?php

namespace App\Http\Requests\Candidate;

use Illuminate\Foundation\Http\FormRequest;

class StoreApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'job_id' => 'required|exists:jobs,id',
            'resume_file' => 'nullable|string|max:255',
            'cover_letter' => 'nullable|string|max:5000',
            'applicant_name' => 'nullable|string|max:255',
            'applicant_email' => 'nullable|email|max:255',
            'applicant_phone' => 'nullable|string|max:50',
            'answers' => 'nullable|array',
            'answers.*.question_id' => 'required_with:answers|exists:application_questions,id',
            'answers.*.answer' => 'required_with:answers|string|max:2000',
        ];
    }

    public function messages(): array
    {
        return [
            'job_id.required' => 'Job ID is required.',
            'job_id.exists' => 'The specified job does not exist.',
            'answers.*.question_id.exists' => 'One or more questions are invalid.',
        ];
    }
}