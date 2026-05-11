<?php

namespace App\Http\Requests\Company;

use Illuminate\Foundation\Http\FormRequest;

class UpdateApplicationStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'application_status' => 'required|string|in:shortlisted,accepted,rejected',
            'employer_notes' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'application_status.required' => 'Application status is required.',
            'application_status.in' => 'Status must be one of: shortlisted, accepted, rejected.',
            'employer_notes.max' => 'Notes cannot exceed 1000 characters.',
        ];
    }
}