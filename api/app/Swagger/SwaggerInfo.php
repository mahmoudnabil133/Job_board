<?php

namespace App\Swagger;

/**
 * @OA\Info(
 *     title="HireITIan Job Portal API",
 *     version="1.0.0",
 *     description="Complete REST API documentation for the HireITIan job portal platform. This API provides endpoints for user authentication, job management, applications, and candidate profiles.",
 *     contact={
 *         "name": "HireITIan Support",
 *         "email": "support@hireititan.com"
 *     },
 *     license={
 *         "name": "MIT",
 *         "url": "https://opensource.org/licenses/MIT"
 *     }
 * )
 * 
 * @OA\Server(
 *     url="http://localhost:8000/api",
 *     description="Local development server"
 * )
 * 
 * @OA\Server(
 *     url="https://api.hireititan.com/api",
 *     description="Production server"
 * )
 * 
 * @OA\SecurityScheme(
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="token",
 *     securityScheme="sanctum",
 *     description="Laravel Sanctum token authentication. Include the token in the Authorization header as: Bearer {token}"
 * )
 * 
 * @OA\SecurityScheme(
 *     type="apiKey",
 *     in="header",
 *     securityScheme="api_key",
 *     name="X-API-Key",
 *     description="API Key authentication"
 * )
 */
class SwaggerInfo
{
    /**
     * API Response Success Example
     * 
     * @OA\Schema(
     *     schema="SuccessResponse",
     *     type="object",
     *     @OA\Property(property="success", type="boolean", example=true),
     *     @OA\Property(property="message", type="string", example="Operation successful"),
     *     @OA\Property(property="data", type="object")
     * )
     */

    /**
     * API Response Error Example
     * 
     * @OA\Schema(
     *     schema="ErrorResponse",
     *     type="object",
     *     @OA\Property(property="success", type="boolean", example=false),
     *     @OA\Property(property="message", type="string", example="Error message"),
     *     @OA\Property(property="error", type="string"),
     *     @OA\Property(property="errors", type="object")
     * )
     */

    /**
     * Pagination Schema
     * 
     * @OA\Schema(
     *     schema="Pagination",
     *     type="object",
     *     @OA\Property(property="data", type="array", items=@OA\Items()),
     *     @OA\Property(property="current_page", type="integer"),
     *     @OA\Property(property="per_page", type="integer"),
     *     @OA\Property(property="total", type="integer"),
     *     @OA\Property(property="last_page", type="integer")
     * )
     */
}
