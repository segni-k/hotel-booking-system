<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\BookingController;
use App\Http\Controllers\Api\V1\HotelController;
use App\Http\Controllers\Api\V1\PaymentController;
use App\Http\Controllers\Api\V1\RoomController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::prefix('v1')->group(function () {
    // Authentication
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Hotels
    Route::get('/hotels', [HotelController::class, 'index']);
    Route::get('/hotels/{id}', [HotelController::class, 'show']);

    // Rooms
    Route::get('/rooms', [RoomController::class, 'index']);
    Route::get('/rooms/{id}', [RoomController::class, 'show']);
    Route::post('/rooms/search', [RoomController::class, 'search']);

    // Payment webhook (no auth required)
    Route::post('/payments/chapa/webhook', [PaymentController::class, 'chapaWebhook']);
});

// Protected routes
Route::prefix('v1')->middleware(['auth:sanctum'])->group(function () {
    // Authentication
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);

    // Bookings
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::get('/bookings/{bookingNumber}', [BookingController::class, 'show']);
    Route::put('/bookings/{bookingNumber}/cancel', [BookingController::class, 'cancel']);
    
    // Staff only routes
    Route::middleware(['role:super_admin,admin,receptionist'])->group(function () {
        Route::put('/bookings/{bookingNumber}/check-in', [BookingController::class, 'checkIn']);
        Route::put('/bookings/{bookingNumber}/check-out', [BookingController::class, 'checkOut']);
        Route::put('/payments/{paymentId}/mark-cash-paid', [PaymentController::class, 'markCashPaid']);
    });

    // Payments
    Route::post('/payments/chapa/initialize', [PaymentController::class, 'initializeChapa']);
    Route::post('/payments/verify', [PaymentController::class, 'verify']);
});
