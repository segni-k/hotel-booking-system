<?php

namespace App\Providers;

use App\Events\BookingCreated;
use App\Events\PaymentSuccessful;
use App\Listeners\SendBookingConfirmationEmail;
use App\Listeners\SendPaymentReceiptEmail;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        BookingCreated::class => [
            SendBookingConfirmationEmail::class,
        ],
        PaymentSuccessful::class => [
            SendPaymentReceiptEmail::class,
        ],
    ];

    public function boot(): void
    {
        //
    }

    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
