<?php

namespace App\Http\Controllers\Api\V1;

use App\DTO\BookingDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\CreateBookingRequest;
use App\Http\Resources\BookingResource;
use App\Services\BookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function __construct(
        private readonly BookingService $bookingService
    ) {}

    public function store(CreateBookingRequest $request): JsonResponse
    {
        try {
            $bookingDTO = BookingDTO::fromArray(array_merge(
                $request->validated(),
                ['user_id' => $request->user()->id]
            ));

            $booking = $this->bookingService->createBooking($bookingDTO);

            return response()->json([
                'message' => 'Booking created successfully',
                'data' => new BookingResource($booking),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create booking',
                'error' => $e->getMessage(),
            ], 422);
        }
    }

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // If admin/staff, show all bookings, else show user's bookings
        if ($user->hasAnyRole(['super_admin', 'admin', 'receptionist'])) {
            $bookings = \App\Models\Booking::with(['user', 'hotel', 'roomType', 'payments'])
                ->latest()
                ->paginate(15);
        } else {
            $bookings = \App\Models\Booking::with(['hotel', 'roomType', 'payments'])
                ->where('user_id', $user->id)
                ->latest()
                ->paginate(15);
        }

        return response()->json([
            'data' => BookingResource::collection($bookings),
            'meta' => [
                'current_page' => $bookings->currentPage(),
                'last_page' => $bookings->lastPage(),
                'per_page' => $bookings->perPage(),
                'total' => $bookings->total(),
            ],
        ]);
    }

    public function show(Request $request, string $bookingNumber): JsonResponse
    {
        $booking = \App\Models\Booking::with(['user', 'hotel', 'roomType', 'room', 'guests', 'payments'])
            ->where('booking_number', $bookingNumber)
            ->firstOrFail();

        // Check authorization
        $user = $request->user();
        if ($booking->user_id !== $user->id && !$user->hasAnyRole(['super_admin', 'admin', 'receptionist'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'data' => new BookingResource($booking),
        ]);
    }

    public function cancel(Request $request, string $bookingNumber): JsonResponse
    {
        try {
            $booking = \App\Models\Booking::where('booking_number', $bookingNumber)->firstOrFail();

            // Check authorization
            $user = $request->user();
            if ($booking->user_id !== $user->id && !$user->hasAnyRole(['super_admin', 'admin'])) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $request->validate([
                'reason' => 'nullable|string|max:500',
            ]);

            $this->bookingService->cancelBooking(
                $booking->id,
                $user->id,
                $request->input('reason', 'Cancelled by user')
            );

            return response()->json([
                'message' => 'Booking cancelled successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to cancel booking',
                'error' => $e->getMessage(),
            ], 422);
        }
    }

    public function checkIn(Request $request, string $bookingNumber): JsonResponse
    {
        try {
            $booking = \App\Models\Booking::where('booking_number', $bookingNumber)->firstOrFail();

            $this->bookingService->checkIn($booking->id);

            return response()->json([
                'message' => 'Guest checked in successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to check in',
                'error' => $e->getMessage(),
            ], 422);
        }
    }

    public function checkOut(Request $request, string $bookingNumber): JsonResponse
    {
        try {
            $booking = \App\Models\Booking::where('booking_number', $bookingNumber)->firstOrFail();

            $this->bookingService->checkOut($booking->id);

            return response()->json([
                'message' => 'Guest checked out successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to check out',
                'error' => $e->getMessage(),
            ], 422);
        }
    }
}
