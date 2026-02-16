<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Hotel;
use App\Models\Role;
use App\Models\Room;
use App\Models\RoomType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class BookingTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Create roles
        Role::create(['name' => 'customer', 'display_name' => 'Customer']);
        
        // Create test data
        $this->hotel = Hotel::create([
            'name' => 'Test Hotel',
            'phone' => '+251911111111',
            'address' => 'Test Address',
            'city' => 'Addis Ababa',
            'country' => 'Ethiopia',
            'is_active' => true,
        ]);

        $this->roomType = RoomType::create([
            'hotel_id' => $this->hotel->id,
            'name' => 'Test Room',
            'slug' => 'test-room',
            'base_price' => 1000,
            'max_adults' => 2,
            'max_children' => 1,
            'is_active' => true,
        ]);

        $this->room = Room::create([
            'hotel_id' => $this->hotel->id,
            'room_type_id' => $this->roomType->id,
            'room_number' => '101',
            'status' => 'available',
            'is_active' => true,
        ]);

        $this->user = User::create([
            'first_name' => 'Test',
            'last_name' => 'User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
            'is_active' => true,
        ]);

        $this->user->roles()->attach(Role::where('name', 'customer')->first()->id);
    }

    public function test_user_can_create_booking(): void
    {
        $response = $this->actingAs($this->user, 'sanctum')->postJson('/api/v1/bookings', [
            'hotel_id' => $this->hotel->id,
            'room_type_id' => $this->roomType->id,
            'check_in_date' => Carbon::tomorrow()->format('Y-m-d'),
            'check_out_date' => Carbon::tomorrow()->addDays(2)->format('Y-m-d'),
            'number_of_adults' => 2,
            'number_of_children' => 0,
            'payment_method' => 'pay_at_hotel',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'data' => [
                    'id',
                    'booking_number',
                    'status',
                    'total_amount',
                ],
            ]);

        $this->assertDatabaseHas('bookings', [
            'user_id' => $this->user->id,
            'hotel_id' => $this->hotel->id,
            'status' => 'confirmed',
        ]);
    }

    public function test_prevents_double_booking(): void
    {
        $checkIn = Carbon::tomorrow();
        $checkOut = $checkIn->copy()->addDays(2);

        // Create first booking
        $this->actingAs($this->user, 'sanctum')->postJson('/api/v1/bookings', [
            'hotel_id' => $this->hotel->id,
            'room_type_id' => $this->roomType->id,
            'check_in_date' => $checkIn->format('Y-m-d'),
            'check_out_date' => $checkOut->format('Y-m-d'),
            'number_of_adults' => 2,
            'number_of_children' => 0,
            'payment_method' => 'pay_at_hotel',
        ]);

        // Try to create overlapping booking
        $response = $this->actingAs($this->user, 'sanctum')->postJson('/api/v1/bookings', [
            'hotel_id' => $this->hotel->id,
            'room_type_id' => $this->roomType->id,
            'check_in_date' => $checkIn->format('Y-m-d'),
            'check_out_date' => $checkOut->format('Y-m-d'),
            'number_of_adults' => 2,
            'number_of_children' => 0,
            'payment_method' => 'pay_at_hotel',
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'message' => 'Failed to create booking',
            ]);
    }

    public function test_user_can_view_their_bookings(): void
    {
        Booking::create([
            'booking_number' => 'BK-TEST001',
            'user_id' => $this->user->id,
            'hotel_id' => $this->hotel->id,
            'room_id' => $this->room->id,
            'room_type_id' => $this->roomType->id,
            'check_in_date' => Carbon::tomorrow(),
            'check_out_date' => Carbon::tomorrow()->addDays(2),
            'number_of_adults' => 2,
            'number_of_children' => 0,
            'number_of_nights' => 2,
            'price_per_night' => 1000,
            'subtotal' => 2000,
            'tax_amount' => 300,
            'total_amount' => 2300,
            'status' => 'confirmed',
            'payment_method' => 'pay_at_hotel',
        ]);

        $response = $this->actingAs($this->user, 'sanctum')->getJson('/api/v1/bookings');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'booking_number',
                        'status',
                        'total_amount',
                    ],
                ],
            ]);
    }

    public function test_user_can_cancel_their_booking(): void
    {
        $booking = Booking::create([
            'booking_number' => 'BK-TEST002',
            'user_id' => $this->user->id,
            'hotel_id' => $this->hotel->id,
            'room_id' => $this->room->id,
            'room_type_id' => $this->roomType->id,
            'check_in_date' => Carbon::tomorrow(),
            'check_out_date' => Carbon::tomorrow()->addDays(2),
            'number_of_adults' => 2,
            'number_of_children' => 0,
            'number_of_nights' => 2,
            'price_per_night' => 1000,
            'subtotal' => 2000,
            'tax_amount' => 300,
            'total_amount' => 2300,
            'status' => 'confirmed',
            'payment_method' => 'pay_at_hotel',
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->putJson("/api/v1/bookings/{$booking->booking_number}/cancel", [
                'reason' => 'Change of plans',
            ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('bookings', [
            'id' => $booking->id,
            'status' => 'cancelled',
        ]);
    }

    public function test_guest_cannot_access_bookings(): void
    {
        $response = $this->getJson('/api/v1/bookings');

        $response->assertStatus(401);
    }
}
