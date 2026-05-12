<?php

use Illuminate\Support\Facades\Route;

// Auth
use App\Http\Controllers\Api\V1\Auth\LoginController;
use App\Http\Controllers\Api\V1\Auth\RegisterController;
use App\Http\Controllers\Api\V1\Auth\LogoutController;

// Core
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\NotificationController;

// Employer
use App\Http\Controllers\Api\V1\Employer\JobController as EmployerJobController;
use App\Http\Controllers\Api\V1\Employer\CompanyController;

// Candidate
use App\Http\Controllers\Api\V1\Candidate\JobSearchController;
use App\Http\Controllers\Api\V1\Candidate\ApplicationController;
use App\Http\Controllers\Api\V1\Candidate\CandidateProfileController;
use App\Http\Controllers\Api\V1\Candidate\SavedJobController;

// Admin
use App\Http\Controllers\Api\V1\Admin\CategoryController;
use App\Http\Controllers\Api\V1\Admin\SkillController;
use App\Http\Controllers\Api\V1\Admin\JobApprovalController;

//
// =======================
// AUTH (PUBLIC)
// =======================
Route::prefix('v1/auth')->group(function () {
    Route::post('/register', RegisterController::class);
    Route::post('/login', LoginController::class);
});

//
// =======================
// AUTHENTICATED ROUTES
// =======================
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/auth/logout', LogoutController::class);

    // User
    Route::get('/user/me', [UserController::class, 'me']);
    Route::post('/user/change-password', [UserController::class, 'changePassword']);

    // Notifications
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::get('/unread-count', [NotificationController::class, 'unreadCount']);
        Route::patch('/{notification}/read', [NotificationController::class, 'markAsRead']);
        Route::post('/mark-all-read', [NotificationController::class, 'markAllAsRead']);
    });

    //
    // =======================
    // EMPLOYER
    // =======================
    Route::prefix('employer')->middleware('role:employer')->group(function () {

        // Jobs
        Route::apiResource('jobs', EmployerJobController::class);

        // Company
        Route::get('company', [CompanyController::class, 'show']);
        Route::post('company', [CompanyController::class, 'store']);
        Route::put('company', [CompanyController::class, 'update']);
        Route::delete('company', [CompanyController::class, 'destroy']);

        // Applications (employer side)
        Route::get('applications/stats', [ApplicationController::class, 'stats']);
        Route::get('applications', [ApplicationController::class, 'getEmployerApplications']);
        Route::get('jobs/{job}/applications', [ApplicationController::class, 'getJobApplications']);
        Route::get('applications/{application}', [ApplicationController::class, 'show']);
        Route::patch('applications/{application}/status', [ApplicationController::class, 'updateStatus']);
    });

    //
    // =======================
    // CANDIDATE
    // =======================
    Route::prefix('candidate')->middleware('role:candidate')->group(function () {

        // Profile
        Route::get('profile', [CandidateProfileController::class, 'show']);
        Route::post('profile', [CandidateProfileController::class, 'store']);
        Route::put('profile', [CandidateProfileController::class, 'update']);
        Route::delete('profile', [CandidateProfileController::class, 'destroy']);

        // Jobs search
        Route::get('jobs', [JobSearchController::class, 'index']);
        Route::get('jobs/{slug}', [JobSearchController::class, 'show']);

        // Applications
        Route::get('applications', [ApplicationController::class, 'index']);
        Route::post('applications', [ApplicationController::class, 'store']);
        Route::get('applications/{application}', [ApplicationController::class, 'show']);
        Route::patch('applications/{application}/withdraw', [ApplicationController::class, 'withdraw']);

        // Saved jobs
        Route::get('saved-jobs', [SavedJobController::class, 'index']);
        Route::post('jobs/{job}/save', [SavedJobController::class, 'save']);
        Route::delete('jobs/{job}/unsave', [SavedJobController::class, 'unsave']);
        Route::post('jobs/{job}/toggle', [SavedJobController::class, 'toggle']);
        Route::get('jobs/{job}/saved', [SavedJobController::class, 'check']);
    });

    //
    // =======================
    // ADMIN
    // =======================
    Route::prefix('admin')->middleware('role:admin')->group(function () {

        // Categories
        Route::apiResource('categories', CategoryController::class);

        // Skills
        Route::apiResource('skills', SkillController::class);

        // Job approval
        Route::get('jobs/pending', [JobApprovalController::class, 'pending']);
        Route::patch('jobs/{job}/approve', [JobApprovalController::class, 'approve']);
        Route::patch('jobs/{job}/reject', [JobApprovalController::class, 'reject']);
    });
});
