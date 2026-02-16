<?php

namespace App\Contracts\Repositories;

use App\Models\Payment;
use Illuminate\Database\Eloquent\Collection;

interface PaymentRepositoryInterface
{
    public function create(array $data): Payment;
    
    public function findById(int $id): ?Payment;
    
    public function findByTransactionId(string $transactionId): ?Payment;
    
    public function findByChapaReference(string $reference): ?Payment;
    
    public function updateStatus(int $paymentId, string $status, ?array $additionalData = null): bool;
    
    public function markAsPaid(int $paymentId, int $processedBy): bool;
    
    public function getBookingPayments(int $bookingId): Collection;
}
