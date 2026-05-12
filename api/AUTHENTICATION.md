# HireITIan Authentication System Documentation

## Overview

The authentication system is built on **Laravel Sanctum**, providing token-based API authentication with role-based access control (RBAC). It handles user registration, login, password management, and token management.

## Architecture

### Components

1. **AuthService** (`app/Services/Auth/AuthService.php`)
   - Core business logic for authentication operations
   - Comprehensive logging of all auth events
   - Password hashing and validation
   - Token generation and management

2. **AuthController** (`app/Http/Controllers/Api/V1/Auth/AuthController.php`)
   - HTTP request handling
   - Request validation delegation
   - Response formatting
   - Controller-level logging

3. **Request Classes** (`app/Http/Requests/Auth/`)
   - `RegisterRequest.php` - Register validation rules
   - `LoginRequest.php` - Login validation rules
   - `ChangePasswordRequest.php` - Password change validation

4. **AuthResource** (`app/Http/Resources/AuthResource.php`)
   - Consistent response formatting
   - User data serialization

5. **Middleware**
   - `AuthenticationLogger.php` - Auth-specific request/response logging
   - `RequestLogger.php` - All request logging
   - Sanctum built-in middleware

## API Endpoints

### Public Endpoints

#### 1. Register User
```
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "password_confirmation": "securePassword123",
  "role": "candidate"  // or "employer", "admin"
}

Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "candidate"
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### 2. Login User
```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (200):
{
  "success": true,
  "message": "User logged in successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "candidate"
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Protected Endpoints (Require Authentication)

All protected endpoints require the Authorization header:
```
Authorization: Bearer {token}
```

#### 3. Get Authenticated User
```
GET /api/v1/auth/me
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "candidate",
    "email_verified_at": null,
    "created_at": "2026-05-09T10:30:00Z"
  }
}
```

#### 4. Logout User
```
POST /api/v1/auth/logout
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "User logged out successfully"
}
```

#### 5. Refresh Token
```
POST /api/v1/auth/refresh
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Token refreshed successfully",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### 6. Change Password
```
POST /api/v1/auth/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "current_password": "securePassword123",
  "new_password": "newPassword456",
  "new_password_confirmation": "newPassword456"
}

Response (200):
{
  "success": true,
  "message": "Password changed successfully. Please login again."
}
```

## User Roles

Three predefined roles for the job portal:

1. **candidate** - Job seekers who browse and apply for jobs
2. **employer** - Companies posting and managing job listings
3. **admin** - System administrators for moderation and approval

## Logging

The system logs all authentication events to provide complete audit trails.

### Log Channels

#### 1. General HTTP Logs (`storage/logs/laravel.log`)
All HTTP requests and responses including:
- Request method, path, and status
- Response time in milliseconds
- User ID and role (if authenticated)

Example:
```
[2026-05-09 10:30:45] local.INFO: http.request {"method":"POST","path":"api/v1/auth/login","status":200,"duration_ms":125.43,"user_id":1,"role":"candidate"}
```

#### 2. Authentication Logs (`storage/logs/auth.log`)
Dedicated authentication event logging including:
- Registration attempts and successes
- Login attempts and failures
- Logout events
- Password changes
- Token refreshes
- Invalid credentials

Examples:
```
[2026-05-09 10:30:45] local.INFO: auth.register_attempt {"email":"john@example.com","name":"John Doe"}
[2026-05-09 10:30:46] local.INFO: auth.register_success {"user_id":1,"email":"john@example.com","role":"candidate"}
[2026-05-09 10:31:00] local.INFO: auth.login_attempt {"email":"john@example.com"}
[2026-05-09 10:31:01] local.INFO: auth.login_success {"user_id":1,"email":"john@example.com","role":"candidate"}
[2026-05-09 10:31:15] local.WARNING: auth.login_failed {"email":"john@example.com","reason":"invalid_credentials"}
[2026-05-09 10:35:20] local.INFO: auth.logout {"user_id":1,"email":"john@example.com"}
```

### Log Events

All authentication events include:
- **Timestamp** - When the event occurred
- **User ID** - Associated user (if applicable)
- **Email** - User email address (if applicable)
- **IP Address** - Client IP
- **Reason** - Why an operation failed (for errors)

## Security Features

1. **Password Hashing** - Bcrypt hashing with Laravel's Hash facade
2. **Token Management** - Laravel Sanctum handles token creation and validation
3. **Rate Limiting** - API endpoint throttling (configured in middleware)
4. **CORS Support** - Cross-origin requests handled by middleware
5. **Token Revocation** - Old tokens revoked on logout or password change
6. **Email Validation** - Unique email constraints in database
7. **Password Requirements** - Minimum 8 characters, password confirmation required

## Error Responses

### Validation Errors (422)
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["This email is already registered."],
    "password": ["Password must be at least 8 characters."]
  }
}
```

### Invalid Credentials (422)
```json
{
  "success": false,
  "message": "Login failed",
  "error": "The provided credentials are incorrect."
}
```

### Unauthenticated (401)
```json
{
  "message": "Unauthenticated."
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Registration failed",
  "error": "Error message details"
}
```

## Implementation Details

### AuthService Methods

#### `register(array $data): array`
- Validates user input
- Creates new user with hashed password
- Generates authentication token
- Logs registration event
- Returns user and token

#### `login(array $data): array`
- Validates credentials
- Checks email and password combination
- Revokes previous tokens
- Generates new token
- Logs login event
- Returns user and token

#### `logout(User $user): array`
- Revokes all user tokens
- Logs logout event
- Returns success message

#### `getUser(User $user): array`
- Returns authenticated user details
- Includes account metadata

#### `refreshToken(User $user): array`
- Generates new token for existing session
- Logs token refresh
- Returns new token

#### `changePassword(User $user, array $data): array`
- Validates current password
- Updates password with hash
- Revokes all tokens (requires re-login)
- Logs password change

## Middleware Pipeline

All API requests follow this middleware pipeline:

```
Request
  ↓
ForceJsonResponse    (Ensure JSON responses)
  ↓
RequestLogger        (Log all HTTP requests)
  ↓
AuthenticationLogger (Log auth-specific events)
  ↓
EnsureFrontendRequestsAreStateful (Sanctum)
  ↓
Throttle             (Rate limiting)
  ↓
SubstituteBindings   (Route model binding)
  ↓
Controller
  ↓
Response
```

## Testing Authentication

### Using cURL

```bash
# Register
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "role": "candidate"
  }'

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Get authenticated user
curl -X GET http://localhost:8000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Logout
curl -X POST http://localhost:8000/api/v1/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman

1. Register user and copy the returned token
2. Create a new request
3. Go to "Authorization" tab
4. Select "Bearer Token" type
5. Paste your token
6. Make requests to protected endpoints

## API Documentation

Full interactive Swagger/OpenAPI documentation is available at:
```
http://localhost:8000/api/documentation
```

## Database Schema

The authentication system uses the `users` table with these fields:
- `id` - Primary key
- `name` - User name
- `email` - Unique email address
- `password` - Hashed password
- `role` - User role (candidate, employer, admin)
- `email_verified_at` - Email verification timestamp
- `created_at` - Account creation time
- `updated_at` - Last account update time

Token data is stored in the `personal_access_tokens` table created by Sanctum.

## Environment Configuration

Required `.env` variables:

```env
APP_NAME=HireITIan
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hireititian
DB_USERNAME=root
DB_PASSWORD=

LOG_CHANNEL=stack
LOG_LEVEL=debug

# Sanctum configuration
SANCTUM_STATEFUL_DOMAINS=localhost,127.0.0.1
```

## Best Practices

1. **Always use HTTPS in production** - Never send tokens over unencrypted connections
2. **Store tokens securely** - Use httpOnly cookies or secure storage
3. **Implement token expiration** - Set reasonable token lifetimes
4. **Log security events** - Monitor auth logs for suspicious activity
5. **Rate limit login attempts** - Prevent brute force attacks
6. **Validate input** - Use provided Request classes for validation
7. **Handle errors gracefully** - Never expose sensitive information in errors
8. **Regularly rotate tokens** - Refresh tokens periodically
9. **Monitor logs** - Review auth logs regularly for security incidents

## Troubleshooting

### "The given data was invalid" Error
- Verify email format is correct
- Ensure password meets length requirements
- Check password confirmation matches

### "The provided credentials are incorrect" Error
- Verify email address is correct
- Ensure password is typed correctly
- Check user exists in database

### "Unauthenticated" Error
- Verify token is included in Authorization header
- Check token hasn't expired
- Confirm token format: `Authorization: Bearer {token}`

### Logs Not Appearing
- Check `storage/logs/` directory exists and is writable
- Verify LOG_CHANNEL in `.env` is set correctly
- Check Laravel is configured for logging

