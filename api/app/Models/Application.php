<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Application extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_id',
        'candidate_id',
        'resume_file',
        'cover_letter',
        'applicant_name',
        'applicant_email',
        'applicant_phone',
        'application_status',
        'employer_notes',
        'reviewed_at'
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
    ];

    public function job()
    {
        return $this->belongsTo(Job::class);
    }

    public function candidate()
    {
        return $this->belongsTo(User::class, 'candidate_id');
    }

    public function answers()
    {
        return $this->hasMany(ApplicationAnswer::class);
    }

    public function conversation()
    {
        return $this->hasOne(Conversation::class);
    }
}
