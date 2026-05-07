<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    // Relationships
    public function company()
    {
        return $this->hasOne(Company::class, 'employer_id');
    }

    public function candidateProfile()
    {
        return $this->hasOne(CandidatesProfile::class, 'user_id');
    }

    public function jobs()
    {
        return $this->hasMany(Job::class, 'approved_by');
    }

    public function applications()
    {
        return $this->hasMany(Application::class, 'candidate_id');
    }

    public function savedJobs()
    {
        return $this->hasMany(SavedJob::class, 'candidate_id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function activityLogs()
    {
        return $this->hasMany(ActivityLog::class);
    }

    // Role checks
    public function isCandidate()
    {
        return $this->role === 'candidate';
    }

    public function isEmployer()
    {
        return $this->role === 'employer';
    }

    public function isAdmin()
    {
        return $this->role === 'admin';
    }
}