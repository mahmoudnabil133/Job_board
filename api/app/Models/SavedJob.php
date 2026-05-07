<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SavedJob extends Model
{
    use HasFactory;

    protected $fillable = ['candidate_id', 'job_id'];

    public function candidate()
    {
        return $this->belongsTo(User::class, 'candidate_id');
    }

    public function job()
    {
        return $this->belongsTo(Job::class);
    }
}