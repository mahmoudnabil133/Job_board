<?php
namespace App\Http\Controllers\Api\V1\Candidate;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Candidate\StoreCandidateProfileRequest;
use App\Http\Requests\Candidate\UpdateCandidateProfileRequest;
use App\Http\Resources\CandidateProfileResource;
use App\Services\ApiResponseService;
use App\Services\CandidateProfileService;
use Illuminate\Auth\Access\AuthorizationException;

class CandidateProfileController extends BaseController
{
    public function __construct(private CandidateProfileService $candidateProfileService, ApiResponseService $response)
    {
        parent::__construct($response);
    }

    public function show()
    {
        $candidate = auth()->user();
        if (!$candidate->isCandidate()) {
            throw new AuthorizationException('Only candidates can view their profile.');
        }
        $profile = $candidate->candidateProfile;
        if (!$profile) {
            return $this->response->notFound('Candidate profile not found.');
        }
        return $this->response->success(
            new CandidateProfileResource($profile->load('user')),
            'Profile retrieved successfully'
        );

    }

    public function store(StoreCandidateProfileRequest $request){{
        $candidate = auth()->user();
        if (!$candidate->isCandidate()) {
            throw new AuthorizationException('Only candidates can create a profile.');
        }
        $profile = $this->candidateProfileService->create($request->validated(), $candidate);
        return $this->response->success(
            new CandidateProfileResource($profile),
            'Profile created successfully',
            201
        );
    }}

    public function update(UpdateCandidateProfileRequest $request){
        $candidate = auth()->user();
        if (!$candidate->isCandidate()) {
            throw new AuthorizationException('Only candidates can update their profile.');
        }
        $profile = $candidate->candidateProfile;
        if (!$profile) {
            return $this->response->notFound('Candidate profile not found.');
        }
        $updatedProfile = $this->candidateProfileService->update($profile, $request->validated());
        return $this->response->success(
            new CandidateProfileResource($updatedProfile),
            'Profile updated successfully'
        );
    }

    public  function destroy(){
        $candidate = auth()->user();
        if (!$candidate->isCandidate()) {
            throw new AuthorizationException('Only candidates can delete their profile.');
        }
        $profile = $candidate->candidateProfile;
        if (!$profile) {
            return $this->response->notFound('Candidate profile not found.');
        }
        $this->candidateProfileService->delete($profile);
        return $this->response->deleted('Profile deleted successfully');
    }
}