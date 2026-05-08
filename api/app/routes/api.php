<?php

use App\Http\Controllers\Api\V1\Employer\JobController as EmployerJobController;
use App\Http\Controllers\Api\V1\Candidate\JobSearchController;
use App\Http\Controllers\Api\V1\Admin\JobApprovalController;

// Public routes
Route::get('/jobs', [JobSearchController::class, 'index']);
Route::get('/jobs/{slug}', [JobSearchController::class, 'show']);

// Employer routes – TODO: uncomment auth:sanctum middleware later
Route::prefix('employer')->group(function () {
    // Route::middleware('auth:sanctum')->group(function () { ... });
    Route::apiResource('jobs', EmployerJobController::class)->except(['show']);
});

// Admin routes – same, eventually protect with auth:sanctum + role:admin
// Route::prefix('admin')->group(function () {
//     // Route::middleware(['auth:sanctum', 'role:admin'])->group(...);
//     Route::get('jobs/pending', [JobApprovalController::class, 'pending']);
//     Route::patch('jobs/{job}/approve', [JobApprovalController::class, 'approve']);
//     Route::patch('jobs/{job}/reject', [JobApprovalController::class, 'reject']);
// });

?>