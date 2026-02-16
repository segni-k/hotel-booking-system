<?php

namespace App\DTO;

class RoomSearchDTO
{
    public function __construct(
        public readonly int $hotelId,
        public readonly string $checkInDate,
        public readonly string $checkOutDate,
        public readonly ?int $roomTypeId = null,
        public readonly ?int $adults = null,
        public readonly ?int $children = null,
        public readonly ?float $minPrice = null,
        public readonly ?float $maxPrice = null,
        public readonly ?array $amenities = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            hotelId: $data['hotel_id'],
            checkInDate: $data['check_in_date'],
            checkOutDate: $data['check_out_date'],
            roomTypeId: $data['room_type_id'] ?? null,
            adults: $data['adults'] ?? null,
            children: $data['children'] ?? null,
            minPrice: $data['min_price'] ?? null,
            maxPrice: $data['max_price'] ?? null,
            amenities: $data['amenities'] ?? null,
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'hotel_id' => $this->hotelId,
            'check_in_date' => $this->checkInDate,
            'check_out_date' => $this->checkOutDate,
            'room_type_id' => $this->roomTypeId,
            'adults' => $this->adults,
            'children' => $this->children,
            'min_price' => $this->minPrice,
            'max_price' => $this->maxPrice,
            'amenities' => $this->amenities,
        ], fn($value) => $value !== null);
    }
}
