<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentResource;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function __construct(
        private readonly PaymentService $paymentService
    ) {}

    public function initializeChapa(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'booking_number' => 'required|string|exists:bookings,booking_number',
            ]);

            $booking = \App\Models\Booking::with('user')
                ->where('booking_number', $request->booking_number)
                ->firstOrFail();

            // Check authorization
            if ($booking->user_id !== $request->user()->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            if ($booking->payment_method !== 'pay_now') {
                return response()->json([
                    'message' => 'This booking is set to pay at hotel',
                ], 422);
            }

            if ($booking->status !== 'pending') {
                return response()->json([
                    'message' => 'Payment already processed or booking is not pending',
                ], 422);
            }

            $paymentData = $this->paymentService->initializeChapaPayment($booking);

            return response()->json([
                'message' => 'Payment initialized successfully',
                'data' => $paymentData,
            ]);
        } catch (\Exception $e) {
            Log::error('Chapa payment initialization failed: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to initialize payment',
                'error' => $e->getMessage(),
            ], 422);
        }
    }

    public function chapaWebhook(Request $request): JsonResponse
    {
        try {
            // Verify webhook signature
            $signature = $request->header('Chapa-Signature');
            // TODO: Implement signature verification with config('chapa.webhook_secret')

            $this->paymentService->handleChapaWebhook($request->all());

            return response()->json(['message' => 'Webhook processed successfully']);
        } catch (\Exception $e) {
            Log::error('Chapa webhook processing failed: ' . $e->getMessage(), [
                'payload' => $request->all(),
            ]);

            return response()->json([
                'message' => 'Webhook processing failed',
                'error' => $e->getMessage(),
            ], 422);
        }
    }

    public function verify(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'transaction_id' => 'required|string',
            ]);

            $payment = $this->paymentService->verifyPayment($request->transaction_id);

            return response()->json([
                'message' => 'Payment verified',
                'data' => new PaymentResource($payment),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to verify payment',
                'error' => $e->getMessage(),
            ], 422);
        }
    }

    public function markCashPaid(Request $request, int $paymentId): JsonResponse
    {
        try {
            // Only staff can mark cash payments
            if (!$request->user()->hasAnyRole(['super_admin', 'admin', 'receptionist'])) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $this->paymentService->markCashPayment($paymentId, $request->user()->id);

            return response()->json([
                'message' => 'Payment marked as paid successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to mark payment as paid',
                'error' => $e->getMessage(),
            ], 422);
        }
    }
}
