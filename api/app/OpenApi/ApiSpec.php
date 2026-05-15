<?php

namespace App\OpenApi;

use OpenApi\Attributes as OA;

#[OA\Info(
    title: 'Posts Management API',
    version: '1.0.0',
    description: 'A RESTful API for managing posts with JWT authentication via Laravel Sanctum'
)]
#[OA\Server(
    url: 'http://localhost:8000',
    description: 'Local Development Server'
)]
#[OA\SecurityScheme(
    securityScheme: 'sanctum',
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    description: 'Enter your Sanctum token (Bearer <token>)'
)]
class ApiSpec
{
}