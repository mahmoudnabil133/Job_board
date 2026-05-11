<?php
namespace App\Services;

use App\Models\CandidatesProfile;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpKernel\Exception\HttpException;

class CandidateProfileService{
    public function create(array $data, User $user){
        if(isset($user->candidateProfile)){
            throw new HttpException(400, 'Candidate profile already exists for this user.');
        }
        $profile = CandidatesProfile::create([
            ...$data,
            'user_id' => $user->id
        ]);
        Log::info('candidate_profile.created', [
            'profile_id' => $profile->id,
            'candidate_id' => $user->id,
        ]);
    
        return $profile->load('user');
    }

    public function update(CandidatesProfile $profile, array $data): CandidatesProfile
    {
        $profile->update($data);

        Log::info('candidate_profile.updated', [
            'profile_id' => $profile->id,
            'candidate_id' => $profile->user_id,
        ]);

        return $profile->fresh()->load('user');
    }

    public function delete(CandidatesProfile $profile): void
    {
        $profile->delete();

        Log::info('candidate_profile.deleted', [
            'profile_id' => $profile->id,
            'candidate_id' => $profile->user_id,
        ]);
    }


}