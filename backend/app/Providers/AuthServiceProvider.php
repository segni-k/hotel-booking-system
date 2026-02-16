<?php

namespace App\Providers;

use App\Models\Booking;
use App\Models\Hotel;
use App\Models\Payment;
use App\Policies\BookingPolicy;
use App\Policies\HotelPolicy;
use App\Policies\PaymentPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Booking::class => BookingPolicy::class,
        Payment::class => PaymentPolicy::class,
        Hotel::class => HotelPolicy::class,
    ];

    public function boot(): void
    {
        //
    }
}
