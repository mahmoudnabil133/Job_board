<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
class RegisterController extends Controller
{
    public function __construct(private AuthService $authService) {}

    public function __invoke(RegisterRequest $request): JsonResponse
    {
        $data = $this->authService->register($request->validated());
        return $this->success([
            'user' => new UserResource($data['user']),
            'token' => $data['token']
        ], 'User registered successfully', 201);
    }
}
