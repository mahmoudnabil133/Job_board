<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use App\Services\ApiResponseService;
class LoginController extends Controller
{
    public function __construct(private AuthService $authService, private ApiResponseService $apiResponseService) {}

    public function __invoke(LoginRequest $request): JsonResponse
    {
        try{
            $data = $this->authService->login($request->validated());
        }catch(Exception $e){
        return $this->apiResponseService->invalidCredintials();    
        }
        
        return $this->apiResponseService->loggedin([
            'user' => new UserResource($data['user']),
            'token' => $data['token']
        ]);
    }
    }

