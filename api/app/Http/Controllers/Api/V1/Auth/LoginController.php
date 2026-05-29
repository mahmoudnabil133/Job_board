<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use App\Services\ApiResponseService;

/**
 * @OA\Post(
 *     path="/v1/auth/login",
 *     operationId="login",
 *     tags={"Authentication"},
 *     summary="User login",
 *     description="Authenticate user with email and password to get JWT token",
 *     @OA\RequestBody(
 *         required=true,
 *         description="User login credentials",
 *         @OA\JsonContent(
 *             required={"email","password"},
 *             @OA\Property(property="email", type="string", format="email", example="user@example.com"),
 *             @OA\Property(property="password", type="string", format="password", example="password123")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Login successful",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="Logged in successfully"),
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
 *         response=401,
 *         description="Invalid credentials"
 *     )
 * )
 */
class LoginController extends Controller
{
    public function __construct(private AuthService $authService, private ApiResponseService $apiResponseService) {}

    public function __invoke(LoginRequest $request): JsonResponse
    {
        try{
            $data = $this->authService->login($request->validated());
        }catch(\Exception $e){
        return $this->apiResponseService->invalidCredintials();    
        }
        
        return $this->apiResponseService->loggedin([
            'user' => new UserResource($data['user']),
            'token' => $data['token']
        ]);
    }
}
