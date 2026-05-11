<?php

namespace App\Http\Requests\Skill;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSkillRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $skillId = $this->route('skill')->id;

        return [
            'name' => [
                'sometimes',
                'string',
                'max:255',
                Rule::unique('skills', 'name')->ignore($skillId),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.unique' => 'This skill already exists.',
        ];
    }
}