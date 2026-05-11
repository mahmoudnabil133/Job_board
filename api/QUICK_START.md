# Authentication System - Quick Start Guide

## What's Implemented

A complete, production-ready authentication system with:

### ✅ Core Features
- User registration with role selection (candidate/employer/admin)
- Secure login with token generation
- Protected endpoints with token validation
- Logout with token revocation
- Password change functionality
- Token refresh mechanism

### ✅ Security
- Bcrypt password hashing
- Token-based authentication (Laravel Sanctum)
- Email uniqueness validation
- Password confirmation validation
- Minimum password length (8 characters)
- Token revocation on logout/password change

### ✅ Logging & Monitoring
- All HTTP requests logged (method, path, status, duration, user)
- Dedicated authentication logs (auth.log)
- Events tracked: register attempts/success, login attempts/success/failures, logout, password changes
- Includes IP address, user ID, email in logs
- Error reasons logged for security analysis

### ✅ API Documentation
- OpenAPI/Swagger annotations on all endpoints
- Complete parameter and response documentation
- Interactive Swagger UI at `/api/documentation`
- Security scheme definitions
- Error response examples

## Directory Structure Created

```
api/
├── app/
│   ├── Services/Auth/
│   │   └── AuthService.php              ← Business logic
│   ├── Http/
│   │   ├── Controllers/Api/V1/Auth/
│   │   │   └── AuthController.php       ← Endpoints (with Swagger)
│   │   ├── Requests/Auth/
│   │   │   ├── RegisterRequest.php      ← Validation
│   │   │   ├── LoginRequest.php
│   │   │   └── ChangePasswordRequest.php
│   │   ├── Resources/
│   │   │   └── AuthResource.php         ← Response formatting
│   │   └── Middleware/
│   │       └── AuthenticationLogger.php ← Auth logging
│   └── Swagger/
│       └── SwaggerInfo.php              ← Swagger config & schemas
├── config/
│   ├── logging.php                      ← Added auth log channel
│   └── l5-swagger.php                   ← Updated with API info
├── routes/
│   └── api.php                          ← Restructured v1 routes
├── AUTHENTICATION.md                    ← Complete documentation
└── QUICK_START.md                       ← This file
```

## File Changes Summary

### New Files Created (8)
1. `app/Services/Auth/AuthService.php` - Core auth business logic
2. `app/Http/Requests/Auth/RegisterRequest.php` - Register validation
3. `app/Http/Requests/Auth/LoginRequest.php` - Login validation
4. `app/Http/Requests/Auth/ChangePasswordRequest.php` - Password change validation
5. `app/Http/Resources/AuthResource.php` - Response formatting
6. `app/Http/Middleware/AuthenticationLogger.php` - Auth-specific logging
7. `api/AUTHENTICATION.md` - Complete documentation
8. `api/QUICK_START.md` - This file

### Modified Files (4)
1. `app/Http/Controllers/Api/V1/Auth/AuthController.php`
   - Added 6 endpoints (register, login, me, logout, refresh, changePassword)
   - Added comprehensive Swagger annotations
   - Added controller-level logging

2. `routes/api.php`
   - Restructured with `/v1/` prefix
   - Separated public and protected auth routes
   - Organized other routes by version

3. `app/Http/Kernal.php`
   - Added `AuthenticationLogger` middleware to api group

4. `config/logging.php`
   - Added dedicated `auth` log channel (daily rotation, 30 days)

5. `config/l5-swagger.php`
   - Updated API title and description
   - Added contact and license info

6. `app/Swagger/SwaggerInfo.php`
   - Added OpenAPI servers
   - Added security schemes (Bearer token)
   - Added response schemas

## Quick Test

### 1. Register
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "role": "candidate"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {"id": 1, "name": "Test User", "email": "test@example.com", "role": "candidate"},
  "token": "1|u8jK9vL..."
}
```

### 2. Save the token and use it
```bash
TOKEN="1|u8jK9vL..."

# Get authenticated user
curl -X GET http://localhost:8000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"

# Logout
curl -X POST http://localhost:8000/api/v1/auth/logout \
  -H "Authorization: Bearer $TOKEN"
```

### 3. View Swagger UI
Open in browser:
```
http://localhost:8000/api/documentation
```

## Endpoints Reference

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/v1/auth/register` | No | Register new user |
| POST | `/api/v1/auth/login` | No | Login with email/password |
| GET | `/api/v1/auth/me` | Yes | Get current user |
| POST | `/api/v1/auth/logout` | Yes | Logout and revoke token |
| POST | `/api/v1/auth/refresh` | Yes | Generate new token |
| POST | `/api/v1/auth/change-password` | Yes | Change user password |

## Logs Location

```
storage/logs/
├── laravel.log      ← All requests/responses
└── auth.log         ← Authentication events only
```

## Next Steps

1. **Test the endpoints** - Use curl, Postman, or Swagger UI
2. **Review logs** - Check `storage/logs/auth.log` for events
3. **Implement other features** - Build on top of this auth system
4. **Add email verification** - Extend AuthService.register()
5. **Add password reset** - Create forgot/reset endpoints
6. **Add OAuth** - Integrate social login
7. **Add two-factor auth** - Enhance security

## Key Code Locations

- **Middleware pipeline**: `app/Http/Kernal.php` - Order: ForceJsonResponse → RequestLogger → AuthenticationLogger → Sanctum → Throttle → SubstituteBindings
- **Auth service**: `app/Services/Auth/AuthService.php` - All business logic methods
- **API controller**: `app/Http/Controllers/Api/V1/Auth/AuthController.php` - All endpoints
- **Routes**: `routes/api.php` - All route definitions
- **Logging config**: `config/logging.php` - Auth channel configuration

## Configuration Notes

- Default guard is set to 'web' in config/auth.php but Sanctum overrides this for API
- Sanctum is configured to treat requests as stateful (session-based CSRF protection disabled for API)
- Rate limiting is configured in middleware (throttle:api)
- CORS is handled by HandleCors middleware

