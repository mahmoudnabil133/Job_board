<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'employer_id',
        'name',
        'description',
        'website',
        'logo',
        'industry',
        'location',
        'contact_email',
        'contact_phone'
    ];

    public function employer()
    {
        return $this->belongsTo(User::class, 'employer_id');
    }

    public function jobs()
    {
        return $this->hasMany(Job::class);
    }
}