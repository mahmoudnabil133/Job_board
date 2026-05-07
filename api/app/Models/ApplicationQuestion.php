<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ApplicationQuestion extends Model
{
    use HasFactory;

    protected $fillable = ['job_id', 'question', 'input_type', 'is_required'];

    protected $casts = [
        'is_required' => 'boolean',
    ];

    public function job()
    {
        return $this->belongsTo(Job::class);
    }

    public function answers()
    {
        return $this->hasMany(ApplicationAnswer::class, 'question_id');
    }
}