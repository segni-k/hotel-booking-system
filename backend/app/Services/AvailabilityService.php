<?php

namespace App\Services;

use App\Contracts\Repositories\AvailabilityRepositoryInterface;
use App\Contracts\Repositories\RoomRepositoryInterface;
use App\DTO\RoomSearchDTO;
use App\Models\PriceRule;
use App\Models\RoomType;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;

class AvailabilityService
{
    public function __construct(
        private readonly RoomRepositoryInterface $roomRepository,
        private readonly AvailabilityRepositoryInterface $availabilityRepository,
    ) {}

    public function searchAvailableRooms(RoomSearchDTO $searchDTO): Collection
    {
        $checkIn = Carbon::parse($searchDTO->checkInDate);
        $checkOut = Carbon::parse($searchDTO->checkOutDate);

        $rooms = $this->roomRepository->getAvailableRooms(
            $searchDTO->hotelId,
            $checkIn,
            $checkOut,
            $searchDTO->roomTypeId
        );

        // Group by room type to show unique room types
        $roomTypes = $rooms->groupBy('room_type_id')->map(function ($roomsGroup) use ($checkIn, $checkOut, $searchDTO) {
            $roomType = $roomsGroup->first()->roomType;
            
            // Calculate price for the stay
            $price = $this->calculatePrice($roomType, $checkIn, $checkOut);
            
            // Add availability count and price
            $roomType->available_rooms = $roomsGroup->count();
            $roomType->price_per_night = $price;
            $roomType->total_nights = $checkIn->diffInDays($checkOut);
            $roomType->total_price = $price * $roomType->total_nights;
            
            return $roomType;
        });

        // Apply filters
        if ($searchDTO->adults) {
            $roomTypes = $roomTypes->filter(fn($rt) => $rt->max_adults >= $searchDTO->adults);
        }

        if ($searchDTO->children) {
            $roomTypes = $roomTypes->filter(fn($rt) => $rt->max_children >= $searchDTO->children);
        }

        if ($searchDTO->minPrice) {
            $roomTypes = $roomTypes->filter(fn($rt) => $rt->total_price >= $searchDTO->minPrice);
        }

        if ($searchDTO->maxPrice) {
            $roomTypes = $roomTypes->filter(fn($rt) => $rt->total_price <= $searchDTO->maxPrice);
        }

        if ($searchDTO->amenities) {
            $roomTypes = $roomTypes->filter(function ($rt) use ($searchDTO) {
                $amenityIds = $rt->amenities->pluck('id')->toArray();
                return !empty(array_intersect($searchDTO->amenities, $amenityIds));
            });
        }

        return $roomTypes->values();
    }

    public function calculatePrice(RoomType $roomType, Carbon $checkIn, Carbon $checkOut): float
    {
        // Check for price rules in the date range
        $priceRule = PriceRule::where('room_type_id', $roomType->id)
            ->where('is_active', true)
            ->where('start_date', '<=', $checkIn)
            ->where('end_date', '>=', $checkOut)
            ->orderBy('priority', 'desc')
            ->first();

        return $priceRule ? (float) $priceRule->price : (float) $roomType->base_price;
    }

    public function checkAvailability(int $roomId, Carbon $checkIn, Carbon $checkOut): bool
    {
        return $this->roomRepository->checkAvailability($roomId, $checkIn, $checkOut);
    }

    public function lockDates(int $roomId, Carbon $checkIn, Carbon $checkOut): bool
    {
        return $this->availabilityRepository->lockRoomDates($roomId, $checkIn, $checkOut);
    }

    public function releaseDates(int $roomId, Carbon $checkIn, Carbon $checkOut): bool
    {
        return $this->availabilityRepository->releaseRoomDates($roomId, $checkIn, $checkOut);
    }

    public function getUnavailableDates(int $roomId, int $months = 3): array
    {
        $startDate = Carbon::now();
        $endDate = Carbon::now()->addMonths($months);

        $unavailableDates = $this->availabilityRepository
            ->getUnavailableDates($roomId, $startDate, $endDate);

        return $unavailableDates->pluck('date')->map(fn($date) => $date->format('Y-m-d'))->toArray();
    }

    public function initializeRoomAvailability(int $roomId, int $months = 12): void
    {
        $startDate = Carbon::now();
        $endDate = Carbon::now()->addMonths($months);

        $this->availabilityRepository->createAvailabilityRecords($roomId, $startDate, $endDate);
    }
}
