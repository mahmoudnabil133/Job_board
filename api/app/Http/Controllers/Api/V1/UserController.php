<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @OA\Get(
 *     path="/v1/user/me",
 *     operationId="getMe",
 *     tags={"User Profile"},
 *     summary="Get current user profile",
 *     description="Retrieve the authenticated user's profile information",
 *     security={{"sanctum":{}}},
 *     @OA\Response(
 *         response=200,
 *         description="User profile retrieved successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(
 *                 property="data",
 *                 type="object",
 *                 @OA\Property(property="id", type="integer"),
 *                 @OA\Property(property="name", type="string"),
 *                 @OA\Property(property="email", type="string", format="email"),
 *                 @OA\Property(property="role", type="string", enum={"employer", "candidate", "admin"})
 *             )
 *         )
 *     ),
 *     @OA\Response(response=401, description="Unauthorized")
 * )
 * 
 * @OA\Post(
 *     path="/v1/user/change-password",
 *     operationId="changePassword",
 *     tags={"User Profile"},
 *     summary="Change user password",
 *     description="Update the authenticated user's password",
 *     security={{"sanctum":{}}},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"current_password","password","password_confirmation"},
 *             @OA\Property(property="current_password", type="string", format="password"),
 *             @OA\Property(property="password", type="string", format="password"),
 *             @OA\Property(property="password_confirmation", type="string", format="password")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Password changed successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="Password changed successfully")
 *         )
 *     ),
 *     @OA\Response(response=401, description="Unauthorized"),
 *     @OA\Response(response=422, description="Validation error")
 * )
 */
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
