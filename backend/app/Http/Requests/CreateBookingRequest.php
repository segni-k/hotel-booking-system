<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'hotel_id' => ['required', 'integer', 'exists:hotels,id'],
            'room_type_id' => ['required', 'integer', 'exists:room_types,id'],
            'check_in_date' => ['required', 'date', 'after_or_equal:today'],
            'check_out_date' => ['required', 'date', 'after:check_in_date'],
            'number_of_adults' => ['required', 'integer', 'min:1', 'max:10'],
            'number_of_children' => ['nullable', 'integer', 'min:0', 'max:10'],
            'payment_method' => ['required', 'in:pay_now,pay_at_hotel'],
            'special_requests' => ['nullable', 'string', 'max:1000'],
            'guests' => ['nullable', 'array'],
            'guests.*.first_name' => ['required', 'string', 'max:255'],
            'guests.*.last_name' => ['required', 'string', 'max:255'],
            'guests.*.email' => ['nullable', 'email', 'max:255'],
            'guests.*.phone' => ['nullable', 'string', 'max:20'],
            'guests.*.guest_type' => ['required', 'in:adult,child'],
            'guests.*.is_primary' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'check_in_date.after_or_equal' => 'Check-in date must be today or a future date.',
            'check_out_date.after' => 'Check-out date must be after check-in date.',
            'payment_method.in' => 'Payment method must be either pay_now or pay_at_hotel.',
        ];
    }
}
