<?php

namespace App\Repositories;

use App\Contracts\Repositories\AvailabilityRepositoryInterface;
use App\Models\Availability;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class AvailabilityRepository implements AvailabilityRepositoryInterface
{
    public function checkRoomAvailability(int $roomId, Carbon $checkIn, Carbon $checkOut): bool
    {
        $unavailableCount = Availability::where('room_id', $roomId)
            ->whereBetween('date', [$checkIn, $checkOut])
            ->whereIn('status', ['booked', 'blocked'])
            ->count();

        return $unavailableCount === 0;
    }

    public function lockRoomDates(int $roomId, Carbon $checkIn, Carbon $checkOut): bool
    {
        $dates = [];
        $currentDate = $checkIn->copy();

        while ($currentDate->lte($checkOut)) {
            $dates[] = [
                'room_id' => $roomId,
                'date' => $currentDate->format('Y-m-d'),
                'status' => 'booked',
                'created_at' => now(),
                'updated_at' => now(),
            ];
            $currentDate->addDay();
        }

        if (empty($dates)) {
            return true;
        }

        // Use upsert to handle existing records
        return DB::table('availability')->upsert(
            $dates,
            ['room_id', 'date'],
            ['status', 'updated_at']
        );
    }

    public function releaseRoomDates(int $roomId, Carbon $checkIn, Carbon $checkOut): bool
    {
        return Availability::where('room_id', $roomId)
            ->whereBetween('date', [$checkIn, $checkOut])
            ->update(['status' => 'available']);
    }

    public function createAvailabilityRecords(int $roomId, Carbon $startDate, Carbon $endDate): void
    {
        $dates = [];
        $currentDate = $startDate->copy();

        while ($currentDate->lte($endDate)) {
            $dates[] = [
                'room_id' => $roomId,
                'date' => $currentDate->format('Y-m-d'),
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ];
            $currentDate->addDay();
        }

        if (!empty($dates)) {
            DB::table('availability')->insertOrIgnore($dates);
        }
    }

    public function getUnavailableDates(int $roomId, Carbon $startDate, Carbon $endDate): Collection
    {
        return Availability::where('room_id', $roomId)
            ->whereBetween('date', [$startDate, $endDate])
            ->whereIn('status', ['booked', 'blocked'])
            ->get();
    }

    public function bulkUpdateStatus(array $roomIds, Carbon $date, string $status): bool
    {
        return Availability::whereIn('room_id', $roomIds)
            ->where('date', $date)
            ->update(['status' => $status]);
    }
}
