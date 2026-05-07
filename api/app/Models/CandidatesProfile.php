<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CandidatesProfile extends Model
{
    use HasFactory;

    protected $table = 'candidates_profiles';

    protected $fillable = [
        'user_id',
        'headline',
        'bio',
        'location',
        'phone',
        'resume_file',
        'portfolio_url',
        'linkedin_url',
        'years_of_experience'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}