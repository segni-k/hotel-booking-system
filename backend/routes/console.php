<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

// Expire pending bookings every 5 minutes
Schedule::call(function () {
    app(\App\Services\BookingService::class)->expirePendingBookings();
})->everyFiveMinutes();
