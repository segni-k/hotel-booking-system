<?php

namespace App\Services;

use App\Contracts\Repositories\BookingRepositoryInterface;
use App\Contracts\Repositories\PaymentRepositoryInterface;
use App\DTO\PaymentDTO;
use App\Events\PaymentSuccessful;
use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class PaymentService
{
    public function __construct(
        private readonly PaymentRepositoryInterface $paymentRepository,
        private readonly BookingRepositoryInterface $bookingRepository,
    ) {}

    public function initializeChapaPayment(Booking $booking): array
    {
        // Create payment record
        $payment = $this->createPayment(PaymentDTO::fromArray([
            'booking_id' => $booking->id,
            'amount' => $booking->total_amount,
            'payment_method' => 'chapa',
        ]));

        // Initialize Chapa payment
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . config('chapa.secret_key'),
            'Content-Type' => 'application/json',
        ])->post(config('chapa.base_url') . '/transaction/initialize', [
            'amount' => $booking->total_amount,
            'currency' => 'ETB',
            'email' => $booking->user->email,
            'first_name' => $booking->user->first_name,
            'last_name' => $booking->user->last_name,
            'phone_number' => $booking->user->phone,
            'tx_ref' => $payment->transaction_id,
            'callback_url' => config('chapa.callback_url'),
            'return_url' => config('frontend.url') . '/booking/' . $booking->booking_number . '/payment/callback',
            'customization' => [
                'title' => 'Hotel Booking Payment',
                'description' => "Payment for booking {$booking->booking_number}",
            ],
        ]);

        if ($response->failed()) {
            $this->paymentRepository->updateStatus($payment->id, 'failed', [
                'failure_reason' => 'Failed to initialize payment with Chapa',
            ]);

            throw new \Exception('Failed to initialize payment. Please try again.');
        }

        $data = $response->json();

        // Update payment with Chapa reference
        $this->paymentRepository->updateStatus($payment->id, 'processing', [
            'chapa_reference' => $data['data']['tx_ref'] ?? null,
            'payment_details' => json_encode($data),
        ]);

        return [
            'payment_id' => $payment->id,
            'checkout_url' => $data['data']['checkout_url'],
            'transaction_id' => $payment->transaction_id,
        ];
    }

    public function createPayment(PaymentDTO $paymentDTO): Payment
    {
        return $this->paymentRepository->create([
            'booking_id' => $paymentDTO->bookingId,
            'transaction_id' => $this->generateTransactionId(),
            'chapa_reference' => $paymentDTO->chapaReference,
            'amount' => $paymentDTO->amount,
            'currency' => $paymentDTO->currency,
            'payment_method' => $paymentDTO->paymentMethod,
            'status' => 'pending',
            'payment_details' => $paymentDTO->paymentDetails ? json_encode($paymentDTO->paymentDetails) : null,
        ]);
    }

    public function handleChapaWebhook(array $webhookData): bool
    {
        return DB::transaction(function () use ($webhookData) {
            $txRef = $webhookData['tx_ref'] ?? null;

            if (!$txRef) {
                throw new \Exception('Transaction reference not found in webhook.');
            }

            $payment = $this->paymentRepository->findByTransactionId($txRef);

            if (!$payment) {
                throw new \Exception('Payment not found for transaction reference: ' . $txRef);
            }

            if ($payment->isCompleted()) {
                return true; // Already processed
            }

            $status = $webhookData['status'] ?? 'failed';

            if ($status === 'success') {
                // Update payment status
                $this->paymentRepository->updateStatus($payment->id, 'completed', [
                    'payment_details' => json_encode($webhookData),
                ]);

                // Update booking status
                $this->bookingRepository->updateStatus($payment->booking_id, 'confirmed');

                // Dispatch event
                event(new PaymentSuccessful($payment->fresh(['booking'])));

                return true;
            } else {
                $this->paymentRepository->updateStatus($payment->id, 'failed', [
                    'failure_reason' => $webhookData['message'] ?? 'Payment failed',
                    'payment_details' => json_encode($webhookData),
                ]);

                return false;
            }
        });
    }

    public function verifyPayment(string $transactionId): Payment
    {
        $payment = $this->paymentRepository->findByTransactionId($transactionId);

        if (!$payment) {
            throw new \Exception('Payment not found.');
        }

        // Verify with Chapa
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . config('chapa.secret_key'),
        ])->get(config('chapa.base_url') . '/transaction/verify/' . $transactionId);

        if ($response->failed()) {
            throw new \Exception('Failed to verify payment with Chapa.');
        }

        $data = $response->json();
        $status = $data['status'] ?? 'failed';

        if ($status === 'success' && !$payment->isCompleted()) {
            $this->handleChapaWebhook($data['data']);
        }

        return $payment->fresh(['booking']);
    }

    public function markCashPayment(int $paymentId, int $processedBy): bool
    {
        return DB::transaction(function () use ($paymentId, $processedBy) {
            $payment = $this->paymentRepository->findById($paymentId);

            if (!$payment) {
                throw new \Exception('Payment not found.');
            }

            if ($payment->isCompleted()) {
                throw new \Exception('Payment is already completed.');
            }

            // Mark payment as paid
            $this->paymentRepository->markAsPaid($paymentId, $processedBy);

            // Update booking status
            $this->bookingRepository->updateStatus($payment->booking_id, 'confirmed');

            // Dispatch event
            event(new PaymentSuccessful($payment->fresh(['booking'])));

            return true;
        });
    }

    private function generateTransactionId(): string
    {
        return 'TX-' . strtoupper(Str::random(12));
    }
}
