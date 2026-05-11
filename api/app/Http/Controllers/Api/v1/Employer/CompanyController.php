<?php

namespace App\Http\Controllers\Api\V1\Employer;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Company\StoreCompanyRequest;
use App\Http\Requests\Company\UpdateCompanyRequest;
use App\Http\Resources\CompanyResource;
use App\Services\ApiResponseService;
use App\Services\CompanyService;
use Illuminate\Auth\Access\AuthorizationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
class CompanyController extends BaseController
{
    public function __construct(private CompanyService $companyService, ApiResponseService $response)
    {
        parent::__construct($response);    // ← Call parent constructor!
        $this->companyService = $companyService;
    }
    public function show()
    {
        $user = auth()->user();
        if(!$user->isEmployer()){
            throw new AuthorizationException('Unauthorized. Only employers can access this resource.');
        }
        $company = $user->company;

        if (!$company) {
            return $this->response->notFound('No company profile found.');
        }

        return $this->response->success(new CompanyResource($company), 'Company profile retrieved successfully.');
    }
    public function store(StoreCompanyRequest $request){
        $user = auth()->user();
        if(!$user->isEmployer()){
            throw new AuthorizationException('Unauthorized. Only employers can create a company profile.');
        }
        $company = $this->companyService->create($request->validated(), $user);
        return $this->response->success(new CompanyResource($company), 'Company profile created successfully.');
    }

    public function update(UpdateCompanyRequest $request){
        $user = auth()->user();
        if(!$user->isEmployer()){
            throw new AuthorizationException('Unauthorized. Only employers can update a company profile.');
        }
        $company = $user->company;
        if (!$company) {
            throw new NotFoundHttpException('No company profile found to update.');
        }
        $company = $this->companyService->update($company, $request->validated());
        return $this->response->success(new CompanyResource($company), 'Company profile updated successfully.');
    }

    public function destroy()
    {
        $user = auth()->user();
        if(!$user->isEmployer()){
            throw new AuthorizationException('Unauthorized. Only employers can delete a company profile.');
        }
        $company = $user->company;
        if (!$company) {
            throw new NotFoundHttpException('No company profile found to delete.');
        }
        $this->companyService->delete($company);
        return $this->response->deleted('Company profile deleted successfully.');
    }
}