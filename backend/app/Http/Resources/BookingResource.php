<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'booking_number' => $this->booking_number,
            'user' => new UserResource($this->whenLoaded('user')),
            'hotel' => new HotelResource($this->whenLoaded('hotel')),
            'room_type' => new RoomTypeResource($this->whenLoaded('roomType')),
            'room' => $this->when($this->relationLoaded('room'), [
                'id' => $this->room->id,
                'room_number' => $this->room->room_number,
            ]),
            'check_in_date' => $this->check_in_date->format('Y-m-d'),
            'check_out_date' => $this->check_out_date->format('Y-m-d'),
            'number_of_adults' => $this->number_of_adults,
            'number_of_children' => $this->number_of_children,
            'number_of_nights' => $this->number_of_nights,
            'price_per_night' => (float) $this->price_per_night,
            'subtotal' => (float) $this->subtotal,
            'tax_amount' => (float) $this->tax_amount,
            'total_amount' => (float) $this->total_amount,
            'status' => $this->status,
            'payment_method' => $this->payment_method,
            'expires_at' => $this->expires_at?->toIso8601String(),
            'special_requests' => $this->special_requests,
            'guests' => BookingGuestResource::collection($this->whenLoaded('guests')),
            'payments' => PaymentResource::collection($this->whenLoaded('payments')),
            'checked_in_at' => $this->checked_in_at?->toIso8601String(),
            'checked_out_at' => $this->checked_out_at?->toIso8601String(),
            'cancelled_at' => $this->cancelled_at?->toIso8601String(),
            'cancellation_reason' => $this->cancellation_reason,
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
