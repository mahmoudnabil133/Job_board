<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Employer\JobController as EmployerJobController;
use App\Http\Controllers\Api\V1\Candidate\JobSearchController;
use App\Http\Controllers\Api\V1\Admin\JobApprovalController;

// Public routes for authentication
Route::prefix('v1/auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])->name('auth.register');
    Route::post('/login', [AuthController::class, 'login'])->name('auth.login');
});

// Protected authentication routes
Route::prefix('v1/auth')->middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me'])->name('auth.me');
    Route::post('/logout', [AuthController::class, 'logout'])->name('auth.logout');
    Route::post('/refresh', [AuthController::class, 'refresh'])->name('auth.refresh');
    Route::post('/change-password', [AuthController::class, 'changePassword'])->name('auth.change-password');
});

// Public routes - Job search
Route::prefix('v1')->group(function () {
    Route::get('/jobs', [JobSearchController::class, 'index']);
    Route::get('/jobs/{slug}', [JobSearchController::class, 'show']);
});

// Employer routes
Route::prefix('v1/employer')->middleware('auth:sanctum')->group(function () {
    Route::apiResource('jobs', EmployerJobController::class)->except(['show']);
});

// Admin routes
// TODO: Uncomment when role middleware is fully implemented
// Route::prefix('v1/admin')->middleware(['auth:sanctum', 'role:admin'])->group(function () {
//     Route::get('jobs/pending', [JobApprovalController::class, 'pending']);
//     Route::patch('jobs/{job}/approve', [JobApprovalController::class, 'approve']);
//     Route::patch('jobs/{job}/reject', [JobApprovalController::class, 'reject']);
// });
