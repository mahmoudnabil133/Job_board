<?php

namespace App\Services\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AuthService
{
    /**
     * Register a new user
     *
     * @param array $data
     * @return array
     * @throws ValidationException
     */
    public function register(array $data): array
    {
        Log::info('auth.register_attempt', [
            'email' => $data['email'] ?? null,
            'name' => $data['name'] ?? null,
        ]);

        // Validate data
        $validated = validator($data, [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:candidate,employer,admin',
        ])->validate();

        // Create user
        try {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => $validated['role'],
            ]);

            Log::info('auth.register_success', [
                'user_id' => $user->id,
                'email' => $user->email,
                'role' => $user->role,
            ]);

            // Generate token
            $token = $user->createToken('auth_token')->plainTextToken;

            return [
                'success' => true,
                'message' => 'User registered successfully',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                ],
                'token' => $token,
            ];
        } catch (\Exception $e) {
            Log::error('auth.register_failed', [
                'email' => $validated['email'] ?? null,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    /**
     * Login user
     *
     * @param array $data
     * @return array
     * @throws ValidationException
     */
    public function login(array $data): array
    {
        Log::info('auth.login_attempt', [
            'email' => $data['email'] ?? null,
        ]);

        // Validate data
        $validated = validator($data, [
            'email' => 'required|email',
            'password' => 'required|string',
        ])->validate();

        // Find user
        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            Log::warning('auth.login_failed', [
                'email' => $validated['email'],
                'reason' => 'invalid_credentials',
            ]);

            throw ValidationException::withMessages([
                'email' => 'The provided credentials are incorrect.',
            ]);
        }

        Log::info('auth.login_success', [
            'user_id' => $user->id,
            'email' => $user->email,
            'role' => $user->role,
        ]);

        // Revoke old tokens
        $user->tokens()->delete();

        // Generate new token
        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'success' => true,
            'message' => 'User logged in successfully',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'token' => $token,
        ];
    }

    /**
     * Logout user
     *
     * @param User $user
     * @return array
     */
    public function logout(User $user): array
    {
        Log::info('auth.logout', [
            'user_id' => $user->id,
            'email' => $user->email,
        ]);

        // Revoke all tokens
        $user->tokens()->delete();

        return [
            'success' => true,
            'message' => 'User logged out successfully',
        ];
    }

    /**
     * Get authenticated user
     *
     * @param User $user
     * @return array
     */
    public function getUser(User $user): array
    {
        return [
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'email_verified_at' => $user->email_verified_at,
                'created_at' => $user->created_at,
            ],
        ];
    }

    /**
     * Refresh authentication token
     *
     * @param User $user
     * @return array
     */
    public function refreshToken(User $user): array
    {
        Log::info('auth.refresh_token', [
            'user_id' => $user->id,
            'email' => $user->email,
        ]);

        // Create new token
        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'success' => true,
            'message' => 'Token refreshed successfully',
            'token' => $token,
        ];
    }

    /**
     * Change user password
     *
     * @param User $user
     * @param array $data
     * @return array
     * @throws ValidationException
     */
    public function changePassword(User $user, array $data): array
    {
        Log::info('auth.change_password_attempt', [
            'user_id' => $user->id,
        ]);

        // Validate data
        $validated = validator($data, [
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ])->validate();

        // Check current password
        if (!Hash::check($validated['current_password'], $user->password)) {
            Log::warning('auth.change_password_failed', [
                'user_id' => $user->id,
                'reason' => 'invalid_current_password',
            ]);

            throw ValidationException::withMessages([
                'current_password' => 'The provided current password is incorrect.',
            ]);
        }

        // Update password
        $user->update([
            'password' => Hash::make($validated['new_password']),
        ]);

        Log::info('auth.change_password_success', [
            'user_id' => $user->id,
        ]);

        // Revoke all tokens
        $user->tokens()->delete();

        return [
            'success' => true,
            'message' => 'Password changed successfully. Please login again.',
        ];
    }
}
