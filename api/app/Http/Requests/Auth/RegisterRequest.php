<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:50',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'password_confirmation' => 'required|same:password',
            'role' => 'required|in:candidate,employer,admin',
        ];
    }
    protected function prepareForValidation(): void
    {
        Log::info('RegisterRequest - Before validation', [
            'all_data' => $this->all(),
            'password' => $this->password,
            'password_confirmation' => $this->password_confirmation,
            'has_confirmation' => $this->has('password_confirmation'),
        ]);
    }


    public function messages(): array
    {
        return [
            'name.required' => 'Name is required.',
            'email.required' => 'Email is required.',
            'email.email' => 'Please provide a valid email address.',
            'email.unique' => 'This email is already registered.',
            'password.required' => 'Password is required.',
            'password.min' => 'Password must be at least 8 characters.',
            'password.confirmed' => 'Password confirmation does not match.',
            'role.required' => 'Role is required.',
            'role.in' => 'Role must be one of: candidate, employer, admin.',
        ];
    }
}
