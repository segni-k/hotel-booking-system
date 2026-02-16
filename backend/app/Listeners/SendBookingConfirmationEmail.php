<?php

namespace App\Listeners;

use App\Events\BookingCreated;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendBookingConfirmationEmail
{
    public function handle(BookingCreated $event): void
    {
        $booking = $event->booking;

        // Log the booking creation
        Log::info("Booking created: {$booking->booking_number}", [
            'booking_id' => $booking->id,
            'user_id' => $booking->user_id,
            'total_amount' => $booking->total_amount,
        ]);

        // TODO: Send email notification
        // Mail::to($booking->user->email)->send(new BookingConfirmation($booking));
    }
}
