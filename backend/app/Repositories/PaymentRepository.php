<?php

namespace App\Repositories;

use App\Contracts\Repositories\PaymentRepositoryInterface;
use App\Models\Payment;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;

class PaymentRepository implements PaymentRepositoryInterface
{
    public function create(array $data): Payment
    {
        return Payment::create($data);
    }

    public function findById(int $id): ?Payment
    {
        return Payment::with(['booking', 'processedBy'])->find($id);
    }

    public function findByTransactionId(string $transactionId): ?Payment
    {
        return Payment::with(['booking'])->where('transaction_id', $transactionId)->first();
    }

    public function findByChapaReference(string $reference): ?Payment
    {
        return Payment::with(['booking'])->where('chapa_reference', $reference)->first();
    }

    public function updateStatus(int $paymentId, string $status, ?array $additionalData = null): bool
    {
        $data = ['status' => $status];

        if ($status === 'completed') {
            $data['paid_at'] = Carbon::now();
        }

        if ($additionalData) {
            $data = array_merge($data, $additionalData);
        }

        return Payment::where('id', $paymentId)->update($data);
    }

    public function markAsPaid(int $paymentId, int $processedBy): bool
    {
        return Payment::where('id', $paymentId)->update([
            'status' => 'completed',
            'paid_at' => Carbon::now(),
            'processed_by' => $processedBy,
        ]);
    }

    public function getBookingPayments(int $bookingId): Collection
    {
        return Payment::where('booking_id', $bookingId)
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
