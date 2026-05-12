<?php

namespace App\Repositories\Contracts;

use App\Models\User;

interface AuthRepositoryInterface
{
    public function create(array $data): User;
    public function findByEmail(string $email): ?User;
    public function updatePassword(User $user, string $newPassword): bool;
}
