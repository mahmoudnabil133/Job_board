<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CompanyResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'logo_url' => $this->logo_url ?? $this->logo?->url ?? null,
            'description' => $this->description,
            'website' => $this->website,
            'industry' => $this->industry,
            'location' => $this->location,
            'contact_email' => $this->contact_email,
        ];
    }
}