<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConversationListResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = $request->user();
        $app = $this->application;
        $app->loadMissing('job.employer', 'candidate');

        $other = (int) $app->candidate_id === $user->id
            ? $app->job->employer
            : $app->candidate;

            return [
                'id' => $this->id,
                'application_id' => $this->application_id,
                'application_status' => $app->application_status,
                'unread_count' => (int) ($this->unread_count ?? 0),
                'last_message_at' => $this->last_message_at?->toIso8601String(),
                'job' => [
                    'id' => $app->job->id,
                    'title' => $app->job->title,
                ],
                'other_party' => [
                    'id' => $other->id,
                    'name' => $other->name,
                ],
                'latest_message' => $this->when(
                    $this->relationLoaded('latestMessage') && $this->latestMessage,
                    function () {
                        return [
                            'id' => $this->latestMessage->id,
                            'body' => $this->latestMessage->body,
                            'sender_id' => $this->latestMessage->sender_id,
                            'created_at' => $this->latestMessage->created_at->toIso8601String(),
                        ];
                    },
                ),
            ];
    }
}
