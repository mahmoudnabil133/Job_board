<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApplicationAnswerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'application_id' => $this->application_id,
            'question_id' => $this->question_id,
            'answer' => $this->answer,
            'question' => $this->whenLoaded('question', function () {
                return [
                    'id' => $this->question->id,
                    'question' => $this->question->question,
                    'input_type' => $this->question->input_type,
                ];
            }),
        ];
    }
}