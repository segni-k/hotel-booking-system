<?php

namespace App\Contracts\Repositories;

use App\Models\Booking;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface BookingRepositoryInterface
{
    public function create(array $data): Booking;
    
    public function findById(int $id): ?Booking;
    
    public function findByBookingNumber(string $bookingNumber): ?Booking;
    
    public function getUserBookings(int $userId, int $perPage = 15): LengthAwarePaginator;
    
    public function getAllBookings(array $filters = [], int $perPage = 15): LengthAwarePaginator;
    
    public function updateStatus(int $bookingId, string $status): bool;
    
    public function cancel(int $bookingId, int $userId, string $reason): bool;
    
    public function getExpiredPendingBookings(): Collection;
    
    public function checkIn(int $bookingId): bool;
    
    public function checkOut(int $bookingId): bool;
}
