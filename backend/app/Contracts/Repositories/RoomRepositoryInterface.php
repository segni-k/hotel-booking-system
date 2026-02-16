<?php

namespace App\Contracts\Repositories;

use App\Models\Room;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;

interface RoomRepositoryInterface
{
    public function findById(int $id): ?Room;
    
    public function findByRoomNumber(string $roomNumber): ?Room;
    
    public function getAvailableRooms(
        int $hotelId,
        Carbon $checkIn,
        Carbon $checkOut,
        ?int $roomTypeId = null
    ): Collection;
    
    public function checkAvailability(int $roomId, Carbon $checkIn, Carbon $checkOut): bool;
    
    public function getRoomsByType(int $roomTypeId): Collection;
    
    public function updateStatus(int $roomId, string $status): bool;
}
