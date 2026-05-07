<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ContactRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_id',
        'candidate_id',
        'candidate_name',
        'candidate_email',
        'candidate_phone',
        'message'
    ];

    public function job()
    {
        return $this->belongsTo(Job::class);
    }

    public function candidate()
    {
        return $this->belongsTo(User::class, 'candidate_id');
    }
}