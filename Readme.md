# 🎯 HireITIan - Professional Job Board Platform

<div align="center">

[![Laravel](https://img.shields.io/badge/Laravel-11.x-FF2D20?style=flat-square&logo=laravel)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![PHP](https://img.shields.io/badge/PHP-8.3-777BB4?style=flat-square&logo=php)](https://www.php.net)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql)](https://www.mysql.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

A modern, full-stack job board platform connecting employers, candidates, and administrators in a seamless recruitment ecosystem.

[Features](#-features) • [Architecture](#-architecture) • [Quick Start](#-quick-start) • [Documentation](#-documentation)

</div>

---

## 📋 Overview

**HireITIan** is a comprehensive job board platform designed to streamline the recruitment process. It provides a robust infrastructure for:

- **Employers** to post job listings, manage applications, and communicate with candidates
- **Candidates** to discover opportunities, apply for positions, and manage their profiles
- **Administrators** to moderate content, approve listings, and maintain platform quality

Built with modern technologies using a decoupled architecture, the platform ensures scalability, maintainability, and excellent user experience.

---

## ✨ Features

### 👔 Employer Features
- ✅ Create and manage job postings with detailed requirements
- ✅ Post custom application questions
- ✅ Review candidate applications in real-time
- ✅ Manage application status (pending, shortlisted, accepted, rejected)
- ✅ Company profile management
- ✅ Communication with candidates
- ✅ Save and organize candidate profiles
- ✅ Activity tracking and analytics

### 👨‍💼 Candidate Features
- ✅ Advanced job search and filtering
- ✅ Save favorite job listings
- ✅ Apply for positions with cover letters
- ✅ Answer custom application questions
- ✅ Professional profile creation with portfolio links
- ✅ Track application status in real-time
- ✅ View company information and ratings
- ✅ Skill management and endorsements
- ✅ Notification system for updates

### 🛡️ Admin Features
- ✅ Approve or reject job postings
- ✅ Manage user accounts and roles
- ✅ Monitor platform activity
- ✅ Content moderation
- ✅ Analytics and reporting
- ✅ Manage categories and skills
- ✅ System health monitoring

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Client Layer (React)                       │
│  TypeScript • Vite • Modern UI Components                    │
└──────────────────┬──────────────────────────────────────────┘
                   │ HTTP/REST
┌──────────────────▼──────────────────────────────────────────┐
│            API Layer (Laravel 11)                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Authentication (Sanctum)  │  Authorization (RBAC)  │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌──────────────┬──────────────┬──────────────┐             │
│  │   Services   │ Controllers  │  Resources   │             │
│  └──────────────┴──────────────┴──────────────┘             │
└──────────────────┬──────────────────────────────────────────┘
                   │ Database
┌──────────────────▼──────────────────────────────────────────┐
│              Data Layer (MySQL)                              │
│  Users • Jobs • Applications • Companies • Messages          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Backend
- **Framework:** Laravel 11
- **PHP Version:** 8.3+
- **Authentication:** Laravel Sanctum
- **ORM:** Eloquent
- **Database:** MySQL 8.0+
- **API Documentation:** OpenAPI/Swagger

### Frontend
- **Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **HTTP Client:** Axios
- **Styling:** TailwindCSS
- **State Management:** React Context API

### DevOps & Tools
- **Containerization:** Docker & Docker Compose
- **Version Control:** Git
- **Package Managers:** Composer, npm
- **Task Runner:** Laravel Artisan

---

## 📊 Database Schema

### Core Models
- **User** - System users (admin, employer, candidate)
- **Job** - Job listings with details
- **Application** - Job applications from candidates
- **Company** - Employer company profiles
- **CandidatesProfile** - Candidate resume and portfolio info
- **Category** - Job categories
- **Skill** - Available skills database
- **SavedJob** - Bookmarked jobs
- **Conversation & Message** - Direct messaging
- **Notification** - User notifications
- **ActivityLog** - Audit trail
- **ContactRequest** - Contact inquiries

---

## 🚀 Quick Start

### Prerequisites

| Requirement | Version | Download |
|-------------|---------|----------|
| PHP | 8.3+ | [php.net](https://www.php.net/downloads) |
| Composer | Latest | [getcomposer.org](https://getcomposer.org) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| MySQL | 8.0+ | [mysql.com](https://www.mysql.com) |
| Docker | Latest | [docker.com](https://www.docker.com) *(Optional)* |

### Option 1: Docker Setup (Recommended)

```bash
# Clone the repository
git clone https://github.com/mahmoudnabil133/Job_board.git
cd Job_board

# Build and start containers
docker-compose up -d

# Run migrations and seeders
docker-compose exec backend php artisan migrate --seed

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000/api
# API Docs: http://localhost:8000/api/documentation
```

**Services:**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`
- MySQL Database: `localhost:3308`

### Option 2: Manual Setup

#### 1. Backend Setup

```bash
# Navigate to backend directory
cd api

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env
cat >> .env << EOF
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=job_board
DB_USERNAME=root
DB_PASSWORD=
EOF

# Run migrations and seed data
php artisan migrate --seed

# Generate Swagger documentation
php artisan l5-swagger:generate

# Start development server
php artisan serve
```

The backend will be available at `http://localhost:8000`

#### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd ../web

# Install dependencies
npm install

# Create environment file
cat > .env << EOF
VITE_API_URL=http://localhost:8000/api
EOF

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

---

## 🔐 Authentication

The application uses **Laravel Sanctum** for token-based API authentication with role-based access control (RBAC).

### User Roles
- **Admin** - Full platform access, content moderation, user management
- **Employer** - Post jobs, manage applications, company profile
- **Candidate** - Search jobs, apply, manage profile

### Authentication Flow

```bash
# Register
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "candidate"
}

# Login
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
# Response includes authentication token

# Access Protected Endpoints
Authorization: Bearer <token>
GET /api/jobs
```

For detailed authentication documentation, see [api/AUTHENTICATION.md](api/AUTHENTICATION.md)

---

## 📁 Project Structure

```
Job_board/
├── api/                          # Laravel Backend
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/      # API Controllers
│   │   │   ├── Middleware/       # Custom Middleware
│   │   │   ├── Requests/         # Form Validation
│   │   │   └── Resources/        # API Response Formatting
│   │   ├── Models/               # Eloquent Models
│   │   ├── Services/             # Business Logic
│   │   ├── Repositories/         # Data Access Layer
│   │   └── Traits/               # Reusable Trait Classes
│   ├── database/
│   │   ├── migrations/           # Database Migrations
│   │   ├── seeders/              # Database Seeders
│   │   └── factories/            # Model Factories
│   ├── routes/
│   │   └── api.php               # API Routes
│   ├── tests/                    # Unit & Feature Tests
│   └── composer.json             # PHP Dependencies
│
├── web/                          # React Frontend
│   ├── src/
│   │   ├── components/           # Reusable Components
│   │   ├── pages/                # Page Components
│   │   ├── services/             # API Service Layer
│   │   ├── context/              # React Context
│   │   ├── types/                # TypeScript Definitions
│   │   └── App.tsx               # Main App Component
│   ├── package.json              # NPM Dependencies
│   └── vite.config.ts            # Vite Configuration
│
├── docker-compose.yml            # Docker Services Configuration
└── README.md                      # This File
```

---

## 📚 API Documentation

The API is fully documented with OpenAPI/Swagger specifications.

### Access Documentation

**Interactive Swagger UI:**
```
http://localhost:8000/api/documentation
```

**API Endpoints Overview:**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/register` | POST | User registration |
| `/auth/login` | POST | User login |
| `/auth/logout` | POST | User logout |
| `/jobs` | GET | List all jobs |
| `/jobs` | POST | Create job (employer) |
| `/jobs/{id}` | GET | Job details |
| `/applications` | POST | Apply for job |
| `/applications` | GET | View applications |
| `/profile` | GET | User profile |
| `/profile` | PUT | Update profile |

For complete API reference, visit [api/AUTHENTICATION.md](api/AUTHENTICATION.md) and [api/QUICK_START.md](api/QUICK_START.md)

---

## 🗄️ Database Seeding

The application includes comprehensive seeders that populate the database with realistic sample data:

```bash
# Run all seeders
php artisan migrate --seed

# Or run specific seeder
php artisan db:seed --class=DatabaseSeeder
```

**Seeded Data Includes:**
- 1 Admin user
- 3 Employer users with companies
- 5 Candidate users with profiles
- 10 Job listings across categories
- 25+ Applications
- 40+ Sample skills and categories
- Activity logs and notifications

**Demo Credentials:**
```
Admin: admin@jobboard.com / password
Employer: hr@techcorp.com / password
Candidate: john@example.com / password
```

---

## 🔧 Development

### Environment Variables

#### Backend (.env)
```env
APP_NAME=HireITIan
APP_ENV=local
APP_DEBUG=true
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=job_board
DB_USERNAME=root
DB_PASSWORD=
SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api
```

### Available Commands

**Backend (Laravel)**
```bash
# Database
php artisan migrate              # Run migrations
php artisan migrate:rollback     # Rollback migrations
php artisan db:seed              # Run seeders

# Cache & Queue
php artisan cache:clear          # Clear cache
php artisan queue:work           # Start queue worker

# API Documentation
php artisan l5-swagger:generate  # Generate Swagger docs

# Testing
php artisan test                 # Run tests
php artisan test --filter=Auth   # Run specific tests
```

**Frontend (React)**
```bash
npm run dev                # Start dev server
npm run build              # Build for production
npm run preview            # Preview production build
npm run lint               # Run linting
```

---

## 🧪 Testing

### Backend Testing
```bash
cd api

# Run all tests
php artisan test

# Run with coverage
php artisan test --coverage

# Run specific test file
php artisan test tests/Feature/AuthTest.php
```

### Frontend Testing
```bash
cd web

# Run tests
npm run test

# Run with coverage
npm run test:coverage
```

---

## 🚢 Deployment

### Prerequisites
- Server with PHP 8.3+
- MySQL 8.0+
- Node.js 18+
- Composer and npm

### Deployment Steps

1. **Clone and setup backend:**
   ```bash
   git clone <repository-url>
   cd Job_board/api
   composer install --optimize-autoloader --no-dev
   php artisan config:cache
   php artisan route:cache
   php artisan migrate --force
   ```

2. **Build frontend:**
   ```bash
   cd ../web
   npm install
   npm run build
   ```

3. **Configure web server:**
   Point your web server to serve the `web/dist` directory for frontend
   and configure Laravel to handle API requests

---

## 📖 Documentation Files

- [API Authentication Guide](api/AUTHENTICATION.md) - Detailed auth implementation
- [Quick Start Guide](api/QUICK_START.md) - API quick reference
- [Backend README](api/README.md) - Laravel specific documentation
- [Frontend README](web/README.md) - React specific documentation

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Follow PSR-12 for PHP code
- Use TypeScript strict mode for frontend
- Write tests for new features
- Update documentation as needed

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 💬 Support & Contact

For questions, issues, or suggestions:
- Open an [Issue](https://github.com/mahmoudnabil133/Job_board/issues)
- Check existing [Discussions](https://github.com/mahmoudnabil133/Job_board/discussions)
- Contact the development team

---

## 🎉 Acknowledgments

Built with ❤️ using:
- [Laravel](https://laravel.com) - Powerful PHP Framework
- [React](https://react.dev) - Modern UI Library
- [Laravel Sanctum](https://laravel.com/docs/sanctum) - API Authentication
- [Docker](https://www.docker.com) - Container Platform

---

<div align="center">

**[⬆ Back to Top](#-hiretitian---professional-job-board-platform)**

Made with 💙 for the developer community

</div>

```

---

## 🚀 Running the Application

1. Ensure your local database server is running.

2. Start the Laravel API: `php artisan serve` (usually runs on `http://localhost:8000`).

3. Start the React app: `npm start` (usually runs on `http://localhost:3000`).

4. Open your browser and navigate to `http://localhost:3000`.