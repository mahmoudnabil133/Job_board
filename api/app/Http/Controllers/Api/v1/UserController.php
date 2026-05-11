<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
class UserController extends Controller
{
    public function __construct(private AuthService $authService) {}

    public function me(Request $request): JsonResponse
    {
        return $this->success(new UserResource($request->user()));
    }

    public function changePassword(Request $request): JsonResponse
    {
        $this->authService->changePassword($request->user(), $request->all());
        return $this->success(null, 'Password changed successfully');
    }
}
