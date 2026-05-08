<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ApplicationQuestionResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'question' => $this->question,
            'input_type' => $this->input_type,
            'is_required' => (bool) $this->is_required,
        ];
    }
}