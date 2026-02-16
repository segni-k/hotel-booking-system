<?php

namespace App\Policies;

use App\Models\Booking;
use App\Models\User;

class BookingPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Booking $booking): bool
    {
        return $user->id === $booking->user_id || $user->hasAnyRole(['super_admin', 'admin', 'receptionist']);
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Booking $booking): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin', 'receptionist']);
    }

    public function delete(User $user, Booking $booking): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin']);
    }

    public function cancel(User $user, Booking $booking): bool
    {
        return $user->id === $booking->user_id || $user->hasAnyRole(['super_admin', 'admin']);
    }

    public function checkIn(User $user, Booking $booking): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin', 'receptionist']);
    }

    public function checkOut(User $user, Booking $booking): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin', 'receptionist']);
    }
}
