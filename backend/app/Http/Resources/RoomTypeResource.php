<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoomTypeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'base_price' => (float) $this->base_price,
            'price_per_night' => isset($this->price_per_night) ? (float) $this->price_per_night : (float) $this->base_price,
            'total_nights' => $this->when(isset($this->total_nights), $this->total_nights),
            'total_price' => $this->when(isset($this->total_price), (float) $this->total_price),
            'max_adults' => $this->max_adults,
            'max_children' => $this->max_children,
            'size_sqm' => $this->size_sqm ? (float) $this->size_sqm : null,
            'bed_type' => $this->bed_type,
            'number_of_beds' => $this->number_of_beds,
            'images' => $this->images,
            'available_rooms' => $this->when(isset($this->available_rooms), $this->available_rooms),
            'amenities' => AmenityResource::collection($this->whenLoaded('amenities')),
            'hotel' => new HotelResource($this->whenLoaded('hotel')),
        ];
    }
}
