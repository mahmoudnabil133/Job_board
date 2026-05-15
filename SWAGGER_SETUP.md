# Swagger/OpenAPI Configuration Guide

## Overview
This document outlines the Swagger/OpenAPI setup for HireITian API.

## Configuration Files Updated

### 1. **app/OpenApi.php**
- Contains the main OpenAPI specification metadata
- Defines API info, servers, security schemes, and tags
- No environment constants (uses hardcoded URLs for flexibility)

### 2. **config/l5-swagger.php**
- L5-Swagger configuration file
- Annotation paths updated to scan:
  - `app/OpenApi.php` - Main specification file
  - `app/Http/Controllers/Api` - Controller annotations

### 3. **.env**
Added the following Swagger environment variables:
```
L5_SWAGGER_CONST_HOST=http://localhost:8000/api
L5_SWAGGER_USE_ABSOLUTE_PATH=true
L5_SWAGGER_UI_ASSETS_PATH=vendor/swagger-api/swagger-ui/dist/
L5_FORMAT_TO_USE_FOR_DOCS=json
L5_SWAGGER_BASE_PATH=/api
L5_SWAGGER_OPEN_API_SPEC_VERSION=3.0.0
```

## Swagger Annotations Added

### Authentication Endpoints
- **POST /v1/auth/register** - User registration
- **POST /v1/auth/login** - User login with JWT token
- **POST /v1/auth/logout** - User logout

### User/Profile Endpoints
- **GET /v1/user/me** - Get current user profile
- **POST /v1/user/change-password** - Change user password

### Public Job Endpoints
- **GET /v1/jobs** - Search and filter jobs with pagination
- **GET /v1/jobs/{slug}** - Get job details by slug

### Notification Endpoints
- **GET /v1/notifications** - Get user notifications
- **GET /v1/notifications/unread-count** - Get unread count
- **PATCH /v1/notifications/{notification}/read** - Mark as read
- **POST /v1/notifications/mark-all-read** - Mark all as read

### Conversation/Messaging Endpoints
- **GET /v1/conversations** - List conversations
- **GET /v1/conversations/{conversation}/messages** - Get messages
- **POST /v1/conversations/{conversation}/messages** - Send message
- **PATCH /v1/conversations/{conversation}/read** - Mark as read

### Application Messages
- **GET /v1/applications/{application}/messages** - Get app messages
- **POST /v1/applications/{application}/messages** - Send app message

### Activity Logs
- **GET /v1/logs/activity-logs** - Admin only: all logs
- **GET /v1/logs/my-activity-logs** - User's activity logs

## How to Generate Swagger Documentation

1. **Clear existing cache:**
   ```bash
   php artisan cache:clear
   php artisan config:clear
   ```

2. **Generate Swagger documentation:**
   ```bash
   php artisan l5-swagger:generate
   ```

3. **Access Swagger UI:**
   - Navigate to: `http://localhost:8000/api/documentation`
   - JSON spec: `http://localhost:8000/storage/api-docs/api-docs.json`

## Security Scheme

The API uses **Sanctum JWT Bearer Token** authentication:
- Token obtained from `/v1/auth/login` or `/v1/auth/register`
- Include token in request header: `Authorization: Bearer {token}`
- Secured endpoints require `security={{"sanctum":{}}}`

## Tag Organization

All endpoints are organized by tag:
- **Authentication** - Auth-related endpoints
- **User Profile** - User profile management
- **Jobs** - Job listings and search
- **Applications** - Job application management
- **Employer** - Employer-specific operations
- **Candidate** - Candidate-specific operations
- **Admin** - Admin-only operations
- **Notifications** - Notification management
- **Conversations** - Messaging endpoints

## Next Steps for Comprehensive Coverage

While core endpoints have been annotated, consider adding annotations to:
1. Employer job management (`Employer/JobController`)
2. Employer company management (`Employer/CompanyController`)
3. Candidate profile management (`Candidate/CandidateProfileController`)
4. Saved jobs operations (`Candidate/SavedJobController`)
5. Admin category/skill management (`Admin/CategoryController`, `Admin/SkillController`)
6. Admin job approval (`Admin/JobApprovalController`)
7. Candidate applications (`Candidate/ApplicationController`)
8. Employer application views (`Employer/ApplicationController`)

## Response Format

All API responses follow this format:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...},
  "meta": {
    "total": 100,
    "per_page": 15,
    "current_page": 1,
    "last_page": 7
  }
}
```

## Error Responses

Standard HTTP status codes are used:
- **200** - OK
- **201** - Created
- **400** - Bad Request
- **401** - Unauthorized
- **403** - Forbidden
- **404** - Not Found
- **422** - Unprocessable Entity
- **500** - Internal Server Error

## Troubleshooting

1. **Swagger UI not loading:**
   - Clear cache: `php artisan cache:clear`
   - Regenerate docs: `php artisan l5-swagger:generate`

2. **Annotations not appearing:**
   - Ensure controllers are in `app/Http/Controllers/Api`
   - Use proper OpenAPI annotation syntax
   - Run: `php artisan l5-swagger:generate`

3. **Token/Security not working:**
   - Verify `@OA\SecurityScheme` is defined in `app/OpenApi.php`
   - Use `security={{"sanctum":{}}}` on protected endpoints

## Documentation Links

- [OpenAPI 3.0 Specification](https://spec.openapis.org/oas/v3.0.3)
- [Swagger PHP Documentation](https://zircote.github.io/swagger-php/)
- [L5 Swagger Documentation](https://github.com/DarkaOnline/L5-Swagger)
