<?php

namespace App\Repositories;

use App\Contracts\Repositories\RoomRepositoryInterface;
use App\Models\Availability;
use App\Models\Room;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class RoomRepository implements RoomRepositoryInterface
{
    public function findById(int $id): ?Room
    {
        return Room::with(['roomType', 'hotel'])->find($id);
    }

    public function findByRoomNumber(string $roomNumber): ?Room
    {
        return Room::with(['roomType', 'hotel'])
            ->where('room_number', $roomNumber)
            ->first();
    }

    public function getAvailableRooms(
        int $hotelId,
        Carbon $checkIn,
        Carbon $checkOut,
        ?int $roomTypeId = null
    ): Collection {
        $query = Room::query()
            ->with(['roomType.amenities'])
            ->where('hotel_id', $hotelId)
            ->where('is_active', true)
            ->whereNotIn('status', ['maintenance', 'out_of_service']);

        if ($roomTypeId) {
            $query->where('room_type_id', $roomTypeId);
        }

        // Get rooms that don't have bookings overlapping the requested dates
        $query->whereDoesntHave('bookings', function ($q) use ($checkIn, $checkOut) {
            $q->whereNotIn('status', ['cancelled', 'no_show'])
              ->where(function ($q) use ($checkIn, $checkOut) {
                  $q->whereBetween('check_in_date', [$checkIn, $checkOut])
                    ->orWhereBetween('check_out_date', [$checkIn, $checkOut])
                    ->orWhere(function ($q) use ($checkIn, $checkOut) {
                        $q->where('check_in_date', '<=', $checkIn)
                          ->where('check_out_date', '>=', $checkOut);
                    });
              });
        });

        // Also check availability table
        $query->whereDoesntHave('availability', function ($q) use ($checkIn, $checkOut) {
            $q->whereBetween('date', [$checkIn, $checkOut])
              ->where('status', 'blocked');
        });

        return $query->get();
    }

    public function checkAvailability(int $roomId, Carbon $checkIn, Carbon $checkOut): bool
    {
        // Check for overlapping bookings
        $hasOverlappingBooking = DB::table('bookings')
            ->where('room_id', $roomId)
            ->whereNotIn('status', ['cancelled', 'no_show'])
            ->where(function ($q) use ($checkIn, $checkOut) {
                $q->whereBetween('check_in_date', [$checkIn, $checkOut])
                  ->orWhereBetween('check_out_date', [$checkIn, $checkOut])
                  ->orWhere(function ($q) use ($checkIn, $checkOut) {
                      $q->where('check_in_date', '<=', $checkIn)
                        ->where('check_out_date', '>=', $checkOut);
                  });
            })
            ->exists();

        if ($hasOverlappingBooking) {
            return false;
        }

        // Check availability table for blocked dates
        $hasBlockedDates = DB::table('availability')
            ->where('room_id', $roomId)
            ->whereBetween('date', [$checkIn, $checkOut])
            ->where('status', 'blocked')
            ->exists();

        return !$hasBlockedDates;
    }

    public function getRoomsByType(int $roomTypeId): Collection
    {
        return Room::where('room_type_id', $roomTypeId)
            ->where('is_active', true)
            ->get();
    }

    public function updateStatus(int $roomId, string $status): bool
    {
        return Room::where('id', $roomId)->update(['status' => $status]);
    }
}
