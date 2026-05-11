<?php

namespace App\Http\Requests\Job;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreJobRequest extends FormRequest
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
            'company_id' => 'required|exists:companies,id',
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'responsibilities' => 'nullable|string',
            'requirements' => 'nullable|string',
            'benefits' => 'nullable|string',
            'location' => 'required|string|max:255',
            'work_type' => 'required|in:remote,onsite,hybrid',
            'employment_type' => 'required|in:full_time,part_time,contract,freelance,internship',
            'experience_level' => 'nullable|in:entry,mid,senior,lead',
            'salary_min' => 'nullable|numeric|min:0',
            'salary_max' => 'nullable|numeric|gte:salary_min',
            'salary_currency' => 'nullable|string|in:EGP,USD,EUR,SAR',
            'application_deadline' => 'nullable|date|after:today',
            'skill_ids' => 'nullable|array',
            'skill_ids.*' => 'exists:skills,id',
            'questions' => 'nullable|array',
            'questions.*.question' => 'required_with:questions|string|max:500',
            'questions.*.input_type' => 'required_with:questions|in:text,textarea,select',
            'questions.*.is_required' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'salary_max.gte' => 'Maximum salary must be greater than or equal to minimum salary.',
            'application_deadline.after' => 'Application deadline must be a future date.',
            'skill_ids.max' => 'You can only specify up to 20 skills.',
            'questions.max' => 'You can only add up to 10 custom questions.',
        ];
    }

}
