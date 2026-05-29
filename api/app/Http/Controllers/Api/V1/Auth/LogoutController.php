<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @OA\Post(
 *     path="/v1/auth/logout",
 *     operationId="logout",
 *     tags={"Authentication"},
 *     summary="User logout",
 *     description="Logout the authenticated user and invalidate token",
 *     security={{"sanctum":{}}},
 *     @OA\Response(
 *         response=200,
 *         description="User logged out successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="User logged out successfully"),
 *             @OA\Property(property="data", type="null")
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthorized"
 *     )
 * )
 */
class LogoutController extends Controller
{
    public function __construct(private AuthService $authService) {}

    public function __invoke(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());
        return $this->success(null, 'User logged out successfully');
    }
}
