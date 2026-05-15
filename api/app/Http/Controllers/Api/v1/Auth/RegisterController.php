<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;

/**
 * @OA\Post(
 *     path="/v1/auth/register",
 *     operationId="register",
 *     tags={"Authentication"},
 *     summary="User registration",
 *     description="Register a new user account with email and password",
 *     @OA\RequestBody(
 *         required=true,
 *         description="User registration data",
 *         @OA\JsonContent(
 *             required={"name","email","password","password_confirmation"},
 *             @OA\Property(property="name", type="string", example="John Doe"),
 *             @OA\Property(property="email", type="string", format="email", example="user@example.com"),
 *             @OA\Property(property="password", type="string", format="password", example="password123"),
 *             @OA\Property(property="password_confirmation", type="string", format="password", example="password123")
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="User registered successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="User registered successfully"),
 *             @OA\Property(
 *                 property="data",
 *                 @OA\Property(
 *                     property="user",
 *                     type="object",
 *                     @OA\Property(property="id", type="integer"),
 *                     @OA\Property(property="name", type="string"),
 *                     @OA\Property(property="email", type="string", format="email")
 *                 ),
 *                 @OA\Property(property="token", type="string", description="JWT Bearer token")
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=422,
 *         description="Validation error"
 *     )
 * )
 */
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
