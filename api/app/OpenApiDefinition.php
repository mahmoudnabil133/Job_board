<?php

namespace App;

/**
 * @OA\Info(
 *     title="HireITian Job Board API",
 *     version="1.0.0",
 *     description="Complete API documentation for HireITian - A job board platform connecting employers and candidates",
 *     termsOfService="https://hireitian.com/terms",
 *     @OA\Contact(
 *         name="HireITian Support",
 *         email="support@hireitian.com",
 *         url="https://hireitian.com"
 *     ),
 *     @OA\License(
 *         name="MIT",
 *         url="https://opensource.org/licenses/MIT"
 *     )
 * )
 * 
 * @OA\Server(
 *     url="http://localhost:8000/api",
 *     description="Local Development Server"
 * )
 * 
 * @OA\Server(
 *     url="https://api.hireitian.com/api",
 *     description="Production Server"
 * )
 * 
 * @OA\SecurityScheme(
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     securityScheme="sanctum",
 *     description="Sanctum JWT token for authentication. Get token from /api/v1/auth/login or /api/v1/auth/register"
 * )
 * 
 * @OA\Tag(
 *     name="Authentication",
 *     description="User authentication endpoints (login, register, logout)"
 * )
 * 
 * @OA\Tag(
 *     name="User Profile",
 *     description="User profile and account management"
 * )
 * 
 * @OA\Tag(
 *     name="Jobs",
 *     description="Job listing and search endpoints"
 * )
 * 
 * @OA\Tag(
 *     name="Applications",
 *     description="Job applications management"
 * )
 * 
 * @OA\Tag(
 *     name="Employer",
 *     description="Employer-specific endpoints for job and application management"
 * )
 * 
 * @OA\Tag(
 *     name="Candidate",
 *     description="Candidate-specific endpoints for profile and saved jobs"
 * )
 * 
 * @OA\Tag(
 *     name="Admin",
 *     description="Admin-only endpoints for managing categories, skills, and job approvals"
 * )
 * 
 * @OA\Tag(
 *     name="Notifications",
 *     description="Notification management endpoints"
 * )
 * 
 * @OA\Tag(
 *     name="Conversations",
 *     description="Messaging between employers and candidates"
 * )
 */
class OpenApiDefinition
{
    // Container for OpenAPI annotations
}
