<?php

namespace App\DTO;

class BookingDTO
{
    public function __construct(
        public readonly int $userId,
        public readonly int $hotelId,
        public readonly int $roomTypeId,
        public readonly string $checkInDate,
        public readonly string $checkOutDate,
        public readonly int $numberOfAdults,
        public readonly int $numberOfChildren,
        public readonly string $paymentMethod,
        public readonly ?string $specialRequests = null,
        public readonly ?array $guests = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            userId: $data['user_id'],
            hotelId: $data['hotel_id'],
            roomTypeId: $data['room_type_id'],
            checkInDate: $data['check_in_date'],
            checkOutDate: $data['check_out_date'],
            numberOfAdults: $data['number_of_adults'] ?? 1,
            numberOfChildren: $data['number_of_children'] ?? 0,
            paymentMethod: $data['payment_method'],
            specialRequests: $data['special_requests'] ?? null,
            guests: $data['guests'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'user_id' => $this->userId,
            'hotel_id' => $this->hotelId,
            'room_type_id' => $this->roomTypeId,
            'check_in_date' => $this->checkInDate,
            'check_out_date' => $this->checkOutDate,
            'number_of_adults' => $this->numberOfAdults,
            'number_of_children' => $this->numberOfChildren,
            'payment_method' => $this->paymentMethod,
            'special_requests' => $this->specialRequests,
            'guests' => $this->guests,
        ];
    }
}
