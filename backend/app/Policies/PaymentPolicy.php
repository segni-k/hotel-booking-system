<?php

namespace App\Policies;

use App\Models\Payment;
use App\Models\User;

class PaymentPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin', 'receptionist']);
    }

    public function view(User $user, Payment $payment): bool
    {
        return $user->id === $payment->booking->user_id || $user->hasAnyRole(['super_admin', 'admin', 'receptionist']);
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Payment $payment): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin', 'receptionist']);
    }

    public function delete(User $user, Payment $payment): bool
    {
        return $user->hasRole('super_admin');
    }

    public function markPaid(User $user, Payment $payment): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin', 'receptionist']);
    }
}
