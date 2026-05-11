<?php

use App\Http\Controllers\Api\V1\Candidate\CandidateProfileController;
use App\Http\Controllers\Api\V1\Employer\CompanyController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Auth\LoginController;
use App\Http\Controllers\Api\V1\Auth\RegisterController;
use App\Http\Controllers\Api\V1\Auth\LogoutController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\Employer\JobController as EmployerJobController;
use App\Http\Controllers\Api\V1\Candidate\JobSearchController;
use App\Http\Controllers\Api\V1\Admin\JobApprovalController;

// Public routes for authentication
Route::prefix('v1/auth')->group(function () {
    Route::post('/register', RegisterController::class)->name('auth.register');
    Route::post('/login', LoginController::class)->name('auth.login');
});




// Protected routes
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/auth/logout', LogoutController::class)->name('auth.logout');
    
    // User / Profile
    Route::get('/user/me', [UserController::class, 'me'])->name('user.me');
    Route::post('/user/change-password', [UserController::class, 'changePassword'])->name('user.change-password');

    // Employer routes
    Route::prefix('employer')->middleware('role:employer')->group(function () {
        Route::apiResource('jobs', EmployerJobController::class)->except(['show']);
    });

    // Admin routes
    Route::prefix('admin')->middleware('role:admin')->group(function () {
        Route::get('jobs/pending', [JobApprovalController::class, 'pending']);
        Route::patch('jobs/{job}/approve', [JobApprovalController::class, 'approve']);
        Route::patch('jobs/{job}/reject', [JobApprovalController::class, 'reject']);
    });
});

// Public routes - Job search
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    Route::get('/jobs', [JobSearchController::class, 'index']);
    Route::get('/jobs/{slug}', [JobSearchController::class, 'show']);
});

// Employer routes
Route::prefix('v1/employer')->middleware('auth:sanctum')->group(function () {
    Route::apiResource('jobs', EmployerJobController::class)->except(['show']);

    Route::get('company', [CompanyController::class, 'show']);
    Route::post('company', [CompanyController::class, 'store']);
    Route::put('company', [CompanyController::class, 'update']);
    Route::delete('company', [CompanyController::class, 'destroy']);

});

Route::prefix('v1/candidate')->middleware('auth:sanctum')->group(function () {
    Route::get('profile', [CandidateProfileController::class, 'show']);
    Route::post('profile', [CandidateProfileController::class, 'store']);
    Route::put('profile', [CandidateProfileController::class, 'update']);
    Route::delete('profile', [CandidateProfileController::class, 'destroy']);
});


// Admin routes
// TODO: Uncomment when role middleware is fully implemented
Route::prefix('v1/admin')->middleware(['auth:sanctum', \App\Http\Middleware\EnsureRole::class . ':admin'])->group(function () {
    Route::get('jobs/pending', [JobApprovalController::class, 'pending']);
    Route::patch('jobs/{job}/approve', [JobApprovalController::class, 'approve']);
    Route::patch('jobs/{job}/reject', [JobApprovalController::class, 'reject']);
});
