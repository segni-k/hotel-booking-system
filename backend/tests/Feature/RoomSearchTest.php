<?php

namespace Tests\Feature;

use App\Models\Hotel;
use App\Models\Room;
use App\Models\RoomType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class RoomSearchTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

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

        Room::create([
            'hotel_id' => $this->hotel->id,
            'room_type_id' => $this->roomType->id,
            'room_number' => '101',
            'status' => 'available',
            'is_active' => true,
        ]);
    }

    public function test_can_search_available_rooms(): void
    {
        $response = $this->postJson('/api/v1/rooms/search', [
            'hotel_id' => $this->hotel->id,
            'check_in_date' => Carbon::tomorrow()->format('Y-m-d'),
            'check_out_date' => Carbon::tomorrow()->addDays(2)->format('Y-m-d'),
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'base_price',
                        'price_per_night',
                        'total_price',
                        'available_rooms',
                    ],
                ],
                'meta',
            ]);
    }

    public function test_search_requires_valid_dates(): void
    {
        $response = $this->postJson('/api/v1/rooms/search', [
            'hotel_id' => $this->hotel->id,
            'check_in_date' => Carbon::yesterday()->format('Y-m-d'),
            'check_out_date' => Carbon::tomorrow()->format('Y-m-d'),
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['check_in_date']);
    }

    public function test_can_view_room_details(): void
    {
        $response = $this->getJson("/api/v1/rooms/{$this->roomType->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'name',
                    'description',
                    'base_price',
                    'amenities',
                ],
            ]);
    }
}
