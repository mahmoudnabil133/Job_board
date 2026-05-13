<?php

use App\Http\Controllers\Api\V1\ActivityLogController;
use App\Http\Controllers\Api\V1\Admin\CategoryController;
use App\Http\Controllers\Api\V1\Admin\SkillController;
use App\Http\Controllers\Api\V1\Candidate\ApplicationController;
use App\Http\Controllers\Api\V1\Candidate\CandidateProfileController;
use App\Http\Controllers\Api\V1\Candidate\SavedJobController;
use App\Http\Controllers\Api\V1\Employer\CompanyController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Auth\LoginController;
use App\Http\Controllers\Api\V1\Auth\RegisterController;
use App\Http\Controllers\Api\V1\Auth\LogoutController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\Employer\JobController as EmployerJobController;
use App\Http\Controllers\Api\V1\Candidate\JobSearchController;
use App\Http\Controllers\Api\V1\Admin\JobApprovalController;
use App\Http\Controllers\Api\V1\NotificationController;
use App\Http\Controllers\Api\V1\ConversationController;
use App\Http\Controllers\Api\V1\ApplicationMessageController;

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

    // Notifications
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::get('/unread-count', [NotificationController::class, 'unreadCount']);
        Route::patch('/{notification}/read', [NotificationController::class, 'markAsRead']);
        Route::post('/mark-all-read', [NotificationController::class, 'markAllAsRead']);
    });

    // Activity logs for users
    Route::get('logs/my-activity-logs', [ActivityLogController::class, 'myActivityLogs']);

    // Employer ↔ candidate messaging (per application)
    Route::get('/conversations', [ConversationController::class, 'index']);
    Route::get('/conversations/{conversation}/messages', [ConversationController::class, 'messages']);
    Route::post('/conversations/{conversation}/messages', [ConversationController::class, 'store']);
    Route::patch('/conversations/{conversation}/read', [ConversationController::class, 'markRead']);

    // Application messaging (per application)
    Route::get('/applications/{application}/messages', [ApplicationMessageController::class, 'index']);
    Route::post('/applications/{application}/messages', [ApplicationMessageController::class, 'store']);

});



// Public routes - Job search
Route::prefix('v1')->group(function () {
    // Job search routes
    Route::get('/jobs', [JobSearchController::class, 'index']);
    Route::get('/jobs/{slug}', [JobSearchController::class, 'show']);
});

// Employer routes
Route::prefix('v1/employer')->middleware('auth:sanctum')->group(function () {

    // Job management routes
    Route::apiResource('jobs', EmployerJobController::class)->except(['show']);

    // Company profile routes
    Route::get('company', [CompanyController::class, 'show']);
    Route::post('company', [CompanyController::class, 'store']);
    Route::put('company', [CompanyController::class, 'update']);
    Route::delete('company', [CompanyController::class, 'destroy']);

    Route::get('applications/stats', [ApplicationController::class, 'stats']);
    Route::get('applications', [ApplicationController::class, 'getEmployerApplications']);
    Route::get('jobs/{job}/applications', [ApplicationController::class, 'getJobApplications']);
    Route::get('applications/{application}', [ApplicationController::class, 'show']);
    Route::patch('applications/{application}/status', [ApplicationController::class, 'updateStatus']);

});

// Candidate routes
Route::prefix('v1/candidate')->middleware('auth:sanctum')->group(function () {
    // Candidate profile routes
    Route::get('profile', [CandidateProfileController::class, 'show']);
    Route::post('profile', [CandidateProfileController::class, 'store']);
    Route::put('profile', [CandidateProfileController::class, 'update']);
    Route::delete('profile', [CandidateProfileController::class, 'destroy']);


    // Application routes
    Route::get('applications', [ApplicationController::class, 'index']);
    Route::post('applications', [ApplicationController::class, 'store']);
    Route::get('applications/{application}', [ApplicationController::class, 'show']);
    Route::patch('applications/{application}/withdraw', [ApplicationController::class, 'withdraw']);

    // save job
    Route::get('saved-jobs', [SavedJobController::class, 'index']);
    Route::post('jobs/{job}/save', [SavedJobController::class, 'save']);
    Route::delete('jobs/{job}/unsave', [SavedJobController::class, 'unsave']);
    Route::post('jobs/{job}/toggle', [SavedJobController::class, 'toggle']);
    Route::get('jobs/{job}/saved', [SavedJobController::class, 'check']);



});


// Admin routes
Route::prefix('v1/admin')->middleware(['auth:sanctum', \App\Http\Middleware\EnsureRole::class . ':admin'])->group(function () {

    // Job approval routes
    Route::get('jobs/pending', [JobApprovalController::class, 'pending']);
    Route::patch('jobs/{job}/approve', [JobApprovalController::class, 'approve']);
    Route::patch('jobs/{job}/reject', [JobApprovalController::class, 'reject']);

    // Category CRUD
    Route::apiResource('categories', CategoryController::class);

    // Skills CRUD
    Route::apiResource('skills', SkillController::class);

    // Admin dashboard stats route
    Route::get('logs/activity-logs', [ActivityLogController::class, 'index']);


});
