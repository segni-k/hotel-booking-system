<?php

namespace App\Contracts\Repositories;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;

interface AvailabilityRepositoryInterface
{
    public function checkRoomAvailability(int $roomId, Carbon $checkIn, Carbon $checkOut): bool;
    
    public function lockRoomDates(int $roomId, Carbon $checkIn, Carbon $checkOut): bool;
    
    public function releaseRoomDates(int $roomId, Carbon $checkIn, Carbon $checkOut): bool;
    
    public function createAvailabilityRecords(int $roomId, Carbon $startDate, Carbon $endDate): void;
    
    public function getUnavailableDates(int $roomId, Carbon $startDate, Carbon $endDate): Collection;
    
    public function bulkUpdateStatus(array $roomIds, Carbon $date, string $status): bool;
}
