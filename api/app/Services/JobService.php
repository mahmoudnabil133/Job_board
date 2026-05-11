<?php

namespace App\Services;

use App\Models\Job;
use App\Models\User;
use Illuminate\Support\Collection;

class JobService
{
    public function create(array $data, User $user): Job
    {
        // Placeholder logic
        return Job::create(array_merge($data, ['employer_id' => $user->id]));
    }

    public function update(Job $job, array $data, User $user): Job
    {
        // Placeholder logic
        $job->update($data);
        return $job;
    }

    public function delete(Job $job, User $user): bool
    {
        // Placeholder logic
        return $job->delete();
    }
}
