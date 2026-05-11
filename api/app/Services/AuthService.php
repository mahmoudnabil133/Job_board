<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\Interfaces\AuthRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    protected $authRepository;

    public function __construct(AuthRepositoryInterface $authRepository)
    {
        $this->authRepository = $authRepository;
    }

    public function register(array $data): array
    {
        $validated = validator($data, [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:candidate,employer,admin',
        ])->validate();

        $user = $this->authRepository->create($validated);
        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    public function login(array $data): array
    {
        $validated = validator($data, [
            'email' => 'required|email',
            'password' => 'required|string',
        ])->validate();

        $user = $this->authRepository->findByEmail($validated['email']);

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => 'The provided credentials are incorrect.',
            ]);
        }

        $user->tokens()->delete();
        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    public function logout(User $user): bool
    {
        return $user->tokens()->delete();
    }

    public function changePassword(User $user, array $data): bool
    {
        $validated = validator($data, [
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ])->validate();

        if (!Hash::check($validated['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => 'The provided current password is incorrect.',
            ]);
        }

        $this->authRepository->updatePassword($user, $validated['new_password']);
        $user->tokens()->delete();

        return true;
    }
}
