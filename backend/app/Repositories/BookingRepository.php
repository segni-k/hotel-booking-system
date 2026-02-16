<?php

namespace App\Repositories;

use App\Contracts\Repositories\BookingRepositoryInterface;
use App\Models\Booking;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;

class BookingRepository implements BookingRepositoryInterface
{
    public function create(array $data): Booking
    {
        return Booking::create($data);
    }

    public function findById(int $id): ?Booking
    {
        return Booking::with([
            'user',
            'hotel',
            'room.roomType',
            'roomType.amenities',
            'guests',
            'payments'
        ])->find($id);
    }

    public function findByBookingNumber(string $bookingNumber): ?Booking
    {
        return Booking::with([
            'user',
            'hotel',
            'room.roomType',
            'roomType.amenities',
            'guests',
            'payments'
        ])->where('booking_number', $bookingNumber)->first();
    }

    public function getUserBookings(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return Booking::with(['hotel', 'room.roomType', 'payments'])
            ->where('user_id', $userId)
            ->orderBy('check_in_date', 'desc')
            ->paginate($perPage);
    }

    public function getAllBookings(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Booking::with(['user', 'hotel', 'room.roomType', 'payments']);

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['check_in_date'])) {
            $query->whereDate('check_in_date', $filters['check_in_date']);
        }

        if (isset($filters['hotel_id'])) {
            $query->where('hotel_id', $filters['hotel_id']);
        }

        if (isset($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('booking_number', 'like', "%{$filters['search']}%")
                  ->orWhereHas('user', function ($q) use ($filters) {
                      $q->where('first_name', 'like', "%{$filters['search']}%")
                        ->orWhere('last_name', 'like', "%{$filters['search']}%")
                        ->orWhere('email', 'like', "%{$filters['search']}%");
                  });
            });
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function updateStatus(int $bookingId, string $status): bool
    {
        return Booking::where('id', $bookingId)->update(['status' => $status]);
    }

    public function cancel(int $bookingId, int $userId, string $reason): bool
    {
        return Booking::where('id', $bookingId)->update([
            'status' => 'cancelled',
            'cancelled_by' => $userId,
            'cancellation_reason' => $reason,
            'cancelled_at' => Carbon::now(),
        ]);
    }

    public function getExpiredPendingBookings(): Collection
    {
        return Booking::where('status', 'pending')
            ->where('expires_at', '<', Carbon::now())
            ->get();
    }

    public function checkIn(int $bookingId): bool
    {
        return Booking::where('id', $bookingId)->update([
            'status' => 'checked_in',
            'checked_in_at' => Carbon::now(),
        ]);
    }

    public function checkOut(int $bookingId): bool
    {
        return Booking::where('id', $bookingId)->update([
            'status' => 'checked_out',
            'checked_out_at' => Carbon::now(),
        ]);
    }
}
