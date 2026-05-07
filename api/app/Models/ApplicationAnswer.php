<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ApplicationAnswer extends Model
{
    use HasFactory;

    protected $fillable = ['application_id', 'job_id', 'question_id', 'answer'];

    public function application()
    {
        return $this->belongsTo(Application::class);
    }

    public function job()
    {
        return $this->belongsTo(Job::class);
    }

    public function question()
    {
        return $this->belongsTo(ApplicationQuestion::class, 'question_id');
    }
}