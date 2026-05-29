<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Skill\StoreSkillRequest;
use App\Http\Requests\Skill\UpdateSkillRequest;
use App\Http\Resources\SkillResource;
use App\Models\Skill;
use App\Services\ApiResponseService;
use App\Services\SkillService;

class SkillController extends BaseController
{
    public function __construct(
        ApiResponseService $response,
        private SkillService $skillService
    ) {
        parent::__construct($response);
    }

    public function index()
    {
        $skills = $this->skillService->getAll();

        return $this->response->success(
            SkillResource::collection($skills),
            'Skills retrieved successfully',
            200,
            [
                'total' => $skills->total(),
                'per_page' => $skills->perPage(),
                'current_page' => $skills->currentPage(),
                'last_page' => $skills->lastPage(),
            ]
        );
    }

    public function store(StoreSkillRequest $request)
    {
        $skill = $this->skillService->create($request->validated());

        return $this->response->created(
            new SkillResource($skill),
            'Skill created successfully'
        );
    }

    public function show(Skill $skill)
    {
        $skill = $this->skillService->getById($skill);

        return $this->response->success(
            new SkillResource($skill),
            'Skill retrieved successfully'
        );
    }

    public function update(UpdateSkillRequest $request, Skill $skill)
    {
        $skill = $this->skillService->update($skill, $request->validated());

        return $this->response->updated(
            new SkillResource($skill),
            'Skill updated successfully'
        );
    }

    public function destroy(Skill $skill)
    {
        $this->skillService->delete($skill);

        return $this->response->deleted('Skill deleted successfully');
    }
}