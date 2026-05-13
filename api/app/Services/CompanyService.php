<?php

namespace App\Services;

use App\Models\Company;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpKernel\Exception\HttpException;

class CompanyService
{
    public function __construct(
        private ActivityLogService $activityLogService,
    ) {
    }
    public function create(array $data, User $employer)
    {
        // bug here , has employer->company always return true even if no company exists, because of the hasOne relationship, so we need to check if the company actually exists

        if($employer->company()->exists()){
            throw new HttpException(400, 'Employer already has a company profile.');
        }
        $company = Company::create([
            ...$data,
            'employer_id' => $employer->id,
        ]);
        Log::info('company.created', [
            'company_id' => $company->id,
            'employer_id' => $employer->id,
        ]);
        $this->activityLogService->log($employer, 'company.created', "Employer {$employer->id} created a new company profile with ID {$company->id}.");

        return $company;
    }
    public function update(Company $company, array $data)
    {
        $company->update($data);
        Log::info('company.updated', [
            'company_id' => $company->id,
            'employer_id' => $company->employer_id,
            'updated_fields' => array_keys($data),
        ]);
        $this->activityLogService->log($company->employer, 'company.updated', "Employer {$company->employer_id} updated company profile with ID {$company->id}. Updated fields: " . implode(', ', $data));
        return $company;
    }
    public function delete(Company $company): void
    {
        $company->delete();

        Log::info('company.deleted', [
            'company_id' => $company->id,
            'employer_id' => $company->employer_id,
        ]);
        $this->activityLogService->log($company->employer, 'company.deleted', "Employer {$company->employer_id} deleted company profile with ID {$company->id}.");
    }

} 