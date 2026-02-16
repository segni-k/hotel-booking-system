<?php

namespace App\DTO;

class PaymentDTO
{
    public function __construct(
        public readonly int $bookingId,
        public readonly float $amount,
        public readonly string $paymentMethod,
        public readonly string $currency = 'ETB',
        public readonly ?string $chapaReference = null,
        public readonly ?array $paymentDetails = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            bookingId: $data['booking_id'],
            amount: $data['amount'],
            paymentMethod: $data['payment_method'],
            currency: $data['currency'] ?? 'ETB',
            chapaReference: $data['chapa_reference'] ?? null,
            paymentDetails: $data['payment_details'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'booking_id' => $this->bookingId,
            'amount' => $this->amount,
            'payment_method' => $this->paymentMethod,
            'currency' => $this->currency,
            'chapa_reference' => $this->chapaReference,
            'payment_details' => $this->paymentDetails,
        ];
    }
}
