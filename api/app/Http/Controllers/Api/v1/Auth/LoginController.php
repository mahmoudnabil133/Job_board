<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
class LoginController extends Controller
{
    public function __construct(private AuthService $authService) {}

    public function __invoke(LoginRequest $request): JsonResponse
    {
        $data = $this->authService->login($request->validated());
        return $this->success([
            'user' => new UserResource($data['user']),
            'token' => $data['token']
        ], 'User logged in successfully');
    }
}
