# 🔧 HireITIan Backend API

<div align="center">

[![Laravel](https://img.shields.io/badge/Laravel-11.x-FF2D20?style=flat-square&logo=laravel)](https://laravel.com)
[![PHP](https://img.shields.io/badge/PHP-8.3-777BB4?style=flat-square&logo=php)](https://www.php.net)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql)](https://www.mysql.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](../LICENSE)

RESTful API backend for the HireITIan job board platform, built with Laravel 11 and optimized for modern web applications.

</div>

---

## 📋 Overview

This is the backend API service for HireITIan, providing a complete RESTful interface for job listings, applications, user management, and admin operations. Built on Laravel 11 with token-based authentication via Laravel Sanctum.

### Key Highlights
- ✅ **RESTful API** with comprehensive endpoints
- ✅ **Token Authentication** with Laravel Sanctum
- ✅ **Role-Based Access Control** (Admin, Employer, Candidate)
- ✅ **OpenAPI/Swagger Documentation** 
- ✅ **Request Validation** with custom form requests
- ✅ **Comprehensive Logging** for debugging and auditing
- ✅ **Database Seeders** with realistic sample data
- ✅ **Clean Architecture** with Services and Repositories

---

## 🚀 Quick Start

### Prerequisites
- PHP 8.3+
- Composer
- MySQL 8.0+

### Installation

```bash
# 1. Install dependencies
composer install

# 2. Setup environment
cp .env.example .env
php artisan key:generate

# 3. Configure database
# Edit .env and set:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_DATABASE=job_board
# DB_USERNAME=root
# DB_PASSWORD=

# 4. Run migrations and seeders
php artisan migrate --seed

# 5. Generate API documentation
php artisan l5-swagger:generate

# 6. Start development server
php artisan serve
```

API available at: `http://localhost:8000`

---

## 🔐 Authentication

### System: Laravel Sanctum

Token-based authentication perfect for SPAs and mobile apps.

#### Login Flow
```bash
# 1. Register (optional)
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "candidate"
}

# 2. Login
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}

# Response:
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": { ... }
}

# 3. Use token in requests
Authorization: Bearer <token>
GET /api/jobs
```

#### User Roles
| Role | Capabilities |
|------|--------------|
| **Admin** | Full platform access, content moderation, user management |
| **Employer** | Post jobs, manage applications, company profile |
| **Candidate** | Search jobs, apply, manage profile |

For detailed documentation: [AUTHENTICATION.md](AUTHENTICATION.md)

---

## 📁 Project Structure

```
api/
├── app/
│   ├── Contracts/              # Interfaces & Abstract Classes
│   ├── Enum/                   # Enumerations (JobStatus, etc)
│   ├── Exceptions/             # Custom Exceptions
│   ├── Http/
│   │   ├── Controllers/        # API Controllers (V1)
│   │   ├── Middleware/         # Request/Response Middleware
│   │   ├── Requests/           # Form Validation Rules
│   │   ├── Resources/          # API Response Formatters
│   │   └── Kernel.php          # Middleware Registration
│   ├── Models/                 # Eloquent Models
│   ├── Repositories/           # Data Access Layer
│   ├── Services/               # Business Logic Layer
│   │   ├── ActivityLogService.php
│   │   ├── ApiResponseService.php
│   │   ├── ApplicationService.php
│   │   ├── AuthService.php
│   │   ├── JobService.php
│   │   └── ...
│   ├── Providers/              # Service Providers
│   └── Traits/                 # Reusable Trait Classes
├── database/
│   ├── migrations/             # Database Schema
│   ├── seeders/
│   │   └── DatabaseSeeder.php  # Main seeder with all data
│   └── factories/              # Model Factories
├── routes/
│   └── api.php                 # API Route Definitions
├── tests/
│   ├── Feature/                # Feature Tests
│   ├── Unit/                   # Unit Tests
│   └── TestCase.php
├── storage/
│   └── logs/                   # Application Logs
├── config/                     # Configuration Files
├── bootstrap/                  # Application Bootstrap
├── public/
│   └── index.php               # Entry Point
├── composer.json               # PHP Dependencies
├── artisan                     # CLI Entry Point
└── phpunit.xml                 # Test Configuration
```

---

## 🗄️ Database Models

### Relationships

```
User (1) ──────────→ (many) Job
     ├──→ Company (employer_id)
     ├──→ CandidatesProfile
     ├──→ Application
     ├──→ SavedJob
     ├──→ Conversation
     ├──→ Notification
     └──→ ActivityLog

Job (1) ──────────→ (many) Application
    ├──→ Company
    ├──→ Category
    ├──→ (many) Skill (pivot)
    ├──→ (many) ApplicationQuestion
    └──→ (many) SavedJob

Application (1) ──────────→ (many) ApplicationAnswer
    └──→ (many) ApplicationQuestion
```

### Core Models

| Model | Purpose |
|-------|---------|
| **User** | System users with roles |
| **Job** | Job listings |
| **Application** | Job applications |
| **Company** | Employer company profiles |
| **CandidatesProfile** | Candidate profiles with resume |
| **Category** | Job categories |
| **Skill** | Technology/skill database |
| **SavedJob** | Bookmarked jobs |
| **Conversation** | Direct messaging |
| **Message** | Chat messages |
| **Notification** | User notifications |
| **ActivityLog** | Audit trail |

---

## 📚 API Endpoints

### Authentication Endpoints
```
POST   /api/auth/register           Register new user
POST   /api/auth/login              User login
POST   /api/auth/logout             User logout
POST   /api/auth/change-password    Change password
GET    /api/auth/profile            Get current user
```

### Job Endpoints
```
GET    /api/jobs                    List all jobs
POST   /api/jobs                    Create job (employer)
GET    /api/jobs/{id}               Get job details
PUT    /api/jobs/{id}               Update job (owner)
DELETE /api/jobs/{id}               Delete job (owner)
GET    /api/jobs/{id}/applications  List applications (employer)
```

### Application Endpoints
```
POST   /api/applications             Submit application
GET    /api/applications             List user applications
GET    /api/applications/{id}        Application details
PUT    /api/applications/{id}/status Update status
```

### Profile Endpoints
```
GET    /api/profile                  Current user profile
PUT    /api/profile                  Update profile
POST   /api/profile/avatar           Upload avatar
```

### Admin Endpoints
```
GET    /api/admin/users              List users
GET    /api/admin/jobs               List all jobs for approval
PUT    /api/admin/jobs/{id}/approve  Approve job
PUT    /api/admin/jobs/{id}/reject   Reject job
```

**Full documentation available at:** `/api/documentation` (Swagger UI)

---

## 🛠️ Key Features

### 🔒 Security
- Bcrypt password hashing
- CSRF protection
- SQL injection prevention via Eloquent
- Token-based authentication
- Role-based authorization
- Input validation on all endpoints

### 📊 Logging & Monitoring
- Comprehensive HTTP request logging
- Authentication event logging
- Database query logging (debug mode)
- Application error logging
- Dedicated log channels (auth.log, etc)

### 📋 API Documentation
- OpenAPI/Swagger specs
- Interactive API explorer
- Request/response examples
- Error documentation
- Automatically generated from code annotations

### 🔄 Data Validation
- Request validation with custom rules
- Model validation constraints
- Database unique constraints
- Email verification
- Password strength requirements

---

## 💾 Database Seeders

Comprehensive seeders populate the database with realistic data:

```bash
# Run all seeders
php artisan migrate --seed

# Seed specific table
php artisan db:seed --class=UserSeeder
```

**Seeded Data:**
- 1 Admin user
- 3 Employer users with companies
- 5 Candidate users with profiles
- 10 Job listings
- 25+ Job applications
- 40+ Skills
- 10 Job categories
- Activity logs and notifications

**Demo Credentials:**
```
Admin:     admin@jobboard.com / password
Employer:  hr@techcorp.com / password
Candidate: john@example.com / password
```

---

## 🧪 Testing

### Run Tests
```bash
# All tests
php artisan test

# Specific test file
php artisan test tests/Feature/AuthTest.php

# With coverage report
php artisan test --coverage

# Specific test method
php artisan test --filter=testUserCanLogin
```

### Test Structure
```
tests/
├── Feature/
│   ├── AuthTest.php
│   ├── JobTest.php
│   └── ApplicationTest.php
└── Unit/
    ├── UserTest.php
    └── JobServiceTest.php
```

---

## 🔧 Development Commands

### Artisan Commands
```bash
# Database
php artisan migrate              # Run migrations
php artisan migrate:rollback     # Rollback last batch
php artisan migrate:refresh      # Refresh database
php artisan db:seed              # Run seeders

# Cache
php artisan cache:clear          # Clear cache
php artisan config:cache         # Cache configuration

# API Documentation
php artisan l5-swagger:generate  # Generate Swagger docs

# Development
php artisan serve                # Start dev server
php artisan tinker               # Interactive shell
php artisan make:model Job       # Generate model
php artisan make:controller JobController  # Generate controller
```

---

## 📖 Documentation

- **[Authentication Guide](AUTHENTICATION.md)** - Detailed auth implementation
- **[Quick Start Guide](QUICK_START.md)** - API quick reference
- **[Parent Project README](../README.md)** - Full project overview
- **[Laravel Docs](https://laravel.com/docs)** - Framework documentation

---

## 🌍 Environment Configuration

### Required Variables
```env
APP_NAME=HireITIan
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000
APP_KEY=<generated by artisan key:generate>

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=job_board
DB_USERNAME=root
DB_PASSWORD=

MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.maildocker.local
MAIL_PORT=1025

SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost
```

---

## 🚀 Deployment

### Production Setup
```bash
# Install dependencies
composer install --optimize-autoloader --no-dev

# Cache configuration
php artisan config:cache
php artisan route:cache

# Run migrations
php artisan migrate --force

# Set proper permissions
chmod -R 775 storage bootstrap/cache
```

---

## 🤝 Contributing

1. Create a feature branch
2. Write tests for new features
3. Follow PSR-12 coding standards
4. Submit a pull request

---

## 📄 License

This project is open source under the MIT License.

---

<div align="center">

Built with ❤️ using Laravel | [View Full Project](../README.md)

</div>

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
