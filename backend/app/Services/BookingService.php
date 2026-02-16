<?php

namespace App\Services;

use App\Contracts\Repositories\BookingRepositoryInterface;
use App\Contracts\Repositories\RoomRepositoryInterface;
use App\DTO\BookingDTO;
use App\Events\BookingCreated;
use App\Models\Booking;
use App\Models\BookingGuest;
use App\Models\Room;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BookingService
{
    public function __construct(
        private readonly BookingRepositoryInterface $bookingRepository,
        private readonly RoomRepositoryInterface $roomRepository,
        private readonly AvailabilityService $availabilityService,
    ) {}

    public function createBooking(BookingDTO $bookingDTO): Booking
    {
        return DB::transaction(function () use ($bookingDTO) {
            $checkIn = Carbon::parse($bookingDTO->checkInDate);
            $checkOut = Carbon::parse($bookingDTO->checkOutDate);

            // Find available room
            $room = $this->findAvailableRoom(
                $bookingDTO->hotelId,
                $bookingDTO->roomTypeId,
                $checkIn,
                $checkOut
            );

            if (!$room) {
                throw new \Exception('No rooms available for the selected dates.');
            }

            // Re-check availability inside transaction (prevent double booking)
            if (!$this->availabilityService->checkAvailability($room->id, $checkIn, $checkOut)) {
                throw new \Exception('Room is no longer available. Please try again.');
            }

            // Calculate pricing
            $numberOfNights = $checkIn->diffInDays($checkOut);
            $pricePerNight = $this->availabilityService->calculatePrice($room->roomType, $checkIn, $checkOut);
            $subtotal = $pricePerNight * $numberOfNights;
            $taxAmount = $subtotal * 0.15; // 15% tax
            $totalAmount = $subtotal + $taxAmount;

            // Determine expiry for pay_now bookings
            $expiresAt = null;
            if ($bookingDTO->paymentMethod === 'pay_now') {
                $expiresAt = Carbon::now()->addMinutes(config('booking.expiry_minutes', 15));
            }

            // Create booking
            $booking = $this->bookingRepository->create([
                'booking_number' => $this->generateBookingNumber(),
                'user_id' => $bookingDTO->userId,
                'hotel_id' => $bookingDTO->hotelId,
                'room_id' => $room->id,
                'room_type_id' => $bookingDTO->roomTypeId,
                'check_in_date' => $checkIn,
                'check_out_date' => $checkOut,
                'number_of_adults' => $bookingDTO->numberOfAdults,
                'number_of_children' => $bookingDTO->numberOfChildren,
                'number_of_nights' => $numberOfNights,
                'price_per_night' => $pricePerNight,
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'total_amount' => $totalAmount,
                'status' => $bookingDTO->paymentMethod === 'pay_at_hotel' ? 'confirmed' : 'pending',
                'payment_method' => $bookingDTO->paymentMethod,
                'expires_at' => $expiresAt,
                'special_requests' => $bookingDTO->specialRequests,
            ]);

            // Add guests
            if ($bookingDTO->guests) {
                foreach ($bookingDTO->guests as $guestData) {
                    BookingGuest::create([
                        'booking_id' => $booking->id,
                        'first_name' => $guestData['first_name'],
                        'last_name' => $guestData['last_name'],
                        'email' => $guestData['email'] ?? null,
                        'phone' => $guestData['phone'] ?? null,
                        'guest_type' => $guestData['guest_type'] ?? 'adult',
                        'is_primary' => $guestData['is_primary'] ?? false,
                    ]);
                }
            }

            // Lock room dates
            $this->availabilityService->lockDates($room->id, $checkIn, $checkOut);

            // Update room status
            $this->roomRepository->updateStatus($room->id, 'occupied');

            // Dispatch event
            event(new BookingCreated($booking));

            return $booking->fresh(['user', 'hotel', 'room.roomType', 'guests', 'payments']);
        });
    }

    private function findAvailableRoom(int $hotelId, int $roomTypeId, Carbon $checkIn, Carbon $checkOut): ?Room
    {
        $availableRooms = $this->roomRepository->getAvailableRooms($hotelId, $checkIn, $checkOut, $roomTypeId);
        return $availableRooms->first();
    }

    private function generateBookingNumber(): string
    {
        return 'BK-' . strtoupper(Str::random(8));
    }

    public function cancelBooking(int $bookingId, int $userId, string $reason = 'Cancelled by user'): bool
    {
        return DB::transaction(function () use ($bookingId, $userId, $reason) {
            $booking = $this->bookingRepository->findById($bookingId);

            if (!$booking) {
                throw new \Exception('Booking not found.');
            }

            if ($booking->isCancelled()) {
                throw new \Exception('Booking is already cancelled.');
            }

            // Release room dates
            $this->availabilityService->releaseDates(
                $booking->room_id,
                Carbon::parse($booking->check_in_date),
                Carbon::parse($booking->check_out_date)
            );

            // Update room status if not checked in
            if ($booking->status !== 'checked_in') {
                $this->roomRepository->updateStatus($booking->room_id, 'available');
            }

            return $this->bookingRepository->cancel($bookingId, $userId, $reason);
        });
    }

    public function checkIn(int $bookingId): bool
    {
        $booking = $this->bookingRepository->findById($bookingId);

        if (!$booking) {
            throw new \Exception('Booking not found.');
        }

        if ($booking->status !== 'confirmed') {
            throw new \Exception('Only confirmed bookings can be checked in.');
        }

        return $this->bookingRepository->checkIn($bookingId);
    }

    public function checkOut(int $bookingId): bool
    {
        $booking = $this->bookingRepository->findById($bookingId);

        if (!$booking) {
            throw new \Exception('Booking not found.');
        }

        if ($booking->status !== 'checked_in') {
            throw new \Exception('Only checked-in bookings can be checked out.');
        }

        // Update room status
        $this->roomRepository->updateStatus($booking->room_id, 'available');

        return $this->bookingRepository->checkOut($bookingId);
    }

    public function expirePendingBookings(): int
    {
        $expiredBookings = $this->bookingRepository->getExpiredPendingBookings();
        $count = 0;

        foreach ($expiredBookings as $booking) {
            try {
                $this->cancelBooking($booking->id, $booking->user_id, 'Expired - Payment not received');
                $count++;
            } catch (\Exception $e) {
                // Log error and continue
                \Log::error("Failed to expire booking {$booking->id}: " . $e->getMessage());
            }
        }

        return $count;
    }
}
