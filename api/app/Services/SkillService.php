<?php

namespace App\Services;

use App\Models\Skill;
use Illuminate\Support\Facades\Log;

class SkillService
{
    public function getAll()
    {
        return Skill::withCount('jobs')->latest()->paginate(20);
    }

    public function getById(Skill $skill): Skill
    {
        return $skill->loadCount('jobs');
    }

    public function create(array $data): Skill
    {
        $skill = Skill::create($data);

        Log::info('skill.created', ['skill_id' => $skill->id, 'name' => $skill->name]);

        return $skill;
    }

    public function update(Skill $skill, array $data): Skill
    {
        $skill->update($data);

        Log::info('skill.updated', ['skill_id' => $skill->id]);

        return $skill->fresh();
    }

    public function delete(Skill $skill): void
    {
        $skill->jobs()->detach(); // Detach from pivot table before deleting
        $skill->delete();

        Log::info('skill.deleted', ['skill_id' => $skill->id, 'name' => $skill->name]);
    }
}