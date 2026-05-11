<?php

namespace App\Http\Requests\Job;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateJobRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Company & Category
            'company_id' => 'sometimes|exists:companies,id',
            'category_id' => 'sometimes|exists:categories,id',

            // Basic Job Info
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string|min:50',
            'responsibilities' => 'nullable|string',
            'requirements' => 'nullable|string',
            'benefits' => 'nullable|string',
            'location' => 'sometimes|string|max:255',

            // Job Type Enums
            'work_type' => ['sometimes', Rule::in(['remote', 'onsite', 'hybrid'])],
            'employment_type' => ['sometimes', Rule::in(['full_time', 'part_time', 'contract', 'freelance', 'internship'])],
            'experience_level' => ['nullable', Rule::in(['entry', 'mid', 'senior', 'lead'])],

            // Salary
            'salary_min' => 'nullable|numeric|min:0',
            'salary_max' => 'nullable|numeric|gte:salary_min',
            'salary_currency' => 'nullable|string|in:EGP,USD,EUR,SAR',

            // Deadline
            'application_deadline' => 'nullable|date|after:today',

            // Skills
            'skill_ids' => 'nullable|array|max:20',
            'skill_ids.*' => 'exists:skills,id',

            // Custom Questions
            'questions' => 'nullable|array|max:10',
            'questions.*.question' => 'required_with:questions|string|max:500',
            'questions.*.input_type' => 'required_with:questions|in:text,textarea,select',
            'questions.*.is_required' => 'boolean',
        ];
    }
}
