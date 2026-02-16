<?php

namespace App\Listeners;

use App\Events\PaymentSuccessful;
use Illuminate\Support\Facades\Log;

class SendPaymentReceiptEmail
{
    public function handle(PaymentSuccessful $event): void
    {
        $payment = $event->payment;
        $booking = $payment->booking;

        // Log the payment success
        Log::info("Payment successful: {$payment->transaction_id}", [
            'payment_id' => $payment->id,
            'booking_number' => $booking->booking_number,
            'amount' => $payment->amount,
        ]);

        // TODO: Send payment receipt email
        // Mail::to($booking->user->email)->send(new PaymentReceipt($payment));
    }
}
