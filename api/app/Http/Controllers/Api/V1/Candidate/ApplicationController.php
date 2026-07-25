<?php
namespace App\Http\Controllers\Api\V1\Candidate;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Candidate\StoreApplicationRequest;
use App\Http\Requests\Company\UpdateApplicationStatusRequest;
use App\Http\Resources\ApplicationListResource;
use App\Http\Resources\ApplicationResource;
use App\Models\Application;
use App\Models\Job;
use App\Services\ApiResponseService;
use App\Services\ApplicationService;
use Request;

class ApplicationController extends BaseController
{
    public function __construct(
        ApiResponseService $response,
        private ApplicationService $applicationService
    ) {
        parent::__construct($response);
    }

    // get applications for the authenticated candidate
    public function index(){
        $user = auth()->user();
        $applications = $this->applicationService->getCandidateApplications($user);
        return $this->response->success(
            ApplicationListResource::collection($applications),
            'Applications retrieved successfully.',
            200,
            [
                'total'       => $applications->total(),
                'per_page'    => $applications->perPage(),
                'current_page' => $applications->currentPage(),
                'last_page'   => $applications->lastPage(),
            ]
        );
    }
    // - submit application
    public function store (StoreApplicationRequest $data){
        $user = auth()->user();
        $application = $this->applicationService->apply($data->validated(), $user);
        return $this->response->created(new ApplicationResource($application), 'Application submitted successfully.');
    }
    // - view application status
    public function show(Application $application){
        $user = auth()->user();
        $application = $this->applicationService->getApplication($application, $user);
        return $this->response->success(new ApplicationResource($application), 'Application retrieved successfully.');
    }
    // - withdraw application, etc.
    public function withdraw(Application $application){
        $user = auth()->user();
        $application = $this->applicationService->withdraw($application, $user);
        return $this->response->success(new ApplicationResource($application), 'Application withdrawn successfully.');
    }

    // employer actions

    public function getEmployerApplications(){
        $user = auth()->user();
        $applications = $this->applicationService->getEmployerApplications($user);
        return $this->response->success(
            ApplicationListResource::collection($applications),
            'Applications retrieved successfully.',
            200,
            [
                'total'       => $applications->total(),
                'per_page'    => $applications->perPage(),
                'current_page' => $applications->currentPage(),
                'last_page'   => $applications->lastPage(),
            ]
        );
    }

    public function getJobApplications(Job $job){
        $user = auth()->user();
        $applications = $this->applicationService->getJobApplications($job, $user);
        return $this->response->success(
            ApplicationListResource::collection($applications),
            'Applications retrieved successfully.',
            200,
            [
                'total'       => $applications->total(),
                'per_page'    => $applications->perPage(),
                'current_page' => $applications->currentPage(),
                'last_page'   => $applications->lastPage(),
            ]
        );
    }

    public function stats(){
        $user = auth()->user();
        $stats = $this->applicationService->getApplicationStats($user);
        return $this->response->success($stats, 'Application statistics retrieved successfully.');
    }

    // update application status (employer action)
    public function updateStatus(Application $application, UpdateApplicationStatusRequest $request){
        $user = auth()->user();
        $notes = $request->validated()['employer_notes'] ?? null;
        $status = $request->validated()['application_status'];
        $application = $this->applicationService->updateApplicationStatus($application, $status, $notes, $user);
        return $this->response->success(new ApplicationResource($application), "Application status updated to {$status} successfully."); 
    }
}