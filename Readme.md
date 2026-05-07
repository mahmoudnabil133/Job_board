# Job Board Platform

A comprehensive job board application built with a decoupled architecture, featuring a **Laravel API** backend and a **React** frontend. This platform connects employers looking for talent with candidates seeking opportunities, moderated by administrators.

## 🚀 Overview

The Job Board project is designed to streamline the recruitment process. Employers can post and manage job listings, candidates can search and apply for positions, and administrators ensure the quality of content by approving or rejecting postings.

---

## 🛠️ Tech Stack

* **Backend:** Laravel (PHP)

* **Frontend:** React.js

* **Database:** MySQL / PostgreSQL

* **Authentication:** Laravel Sanctum (Recommended for API/SPA)

---

## 📁 Project Structure

```text
Job_board/
├── api/          # Laravel Backend
└── web/          # React Frontend

```

---

## 🏁 Getting Started

### Prerequisites

* PHP >= 8.1

* Composer

* Node.js & NPM

* MySQL or any preferred database engine

### 1. Clone the Repository

```bash
git clone https://github.com/mahmoudnabil133/Job_board
cd Job_board

```

### 2. Backend Setup (API)

```bash
cd api

# Install PHP dependencies
composer install

# Create environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Create db with name => DB_DATABASE in .env file,
# Handle database configuration as on your local setup

# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=job_board
# DB_USERNAME=root
# DB_PASSWORD=

# Run migrations and seeders
php artisan migrate --seed

# Start the Laravel server
php artisan serve

```

### 3. Frontend Setup (Web)

```bash
cd ../web

# Install NPM dependencies
npm install

# Create environment file (if needed for API URL)
# Example: REACT_APP_API_URL=http://localhost:8000/api
cp .env.example .env

# Start the React development server
npm start

```

---

## 🚀 Running the Application

1. Ensure your local database server is running.

2. Start the Laravel API: `php artisan serve` (usually runs on `http://localhost:8000`).

3. Start the React app: `npm start` (usually runs on `http://localhost:3000`).

4. Open your browser and navigate to `http://localhost:3000`.