<?php

namespace Database\Seeders;

use App\Models\Amenity;
use App\Models\Hotel;
use App\Models\Room;
use App\Models\RoomType;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    public function run(): void
    {
        $hotel = Hotel::where('name', 'Grand Palace Hotel')->first();

        if (!$hotel) {
            return;
        }

        // Room Types
        $standardRoom = RoomType::create([
            'hotel_id' => $hotel->id,
            'name' => 'Standard Room',
            'slug' => 'standard-room',
            'description' => 'Comfortable standard room with all basic amenities',
            'base_price' => 1500.00,
            'max_adults' => 2,
            'max_children' => 1,
            'size_sqm' => 25.00,
            'bed_type' => 'double',
            'number_of_beds' => 1,
            'images' => [
                'https://images.unsplash.com/photo-1590490360182-c33d57733427',
            ],
            'is_active' => true,
        ]);

        $deluxeRoom = RoomType::create([
            'hotel_id' => $hotel->id,
            'name' => 'Deluxe Room',
            'slug' => 'deluxe-room',
            'description' => 'Spacious deluxe room with premium amenities and city view',
            'base_price' => 2500.00,
            'max_adults' => 2,
            'max_children' => 2,
            'size_sqm' => 35.00,
            'bed_type' => 'king',
            'number_of_beds' => 1,
            'images' => [
                'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
            ],
            'is_active' => true,
        ]);

        $suite = RoomType::create([
            'hotel_id' => $hotel->id,
            'name' => 'Executive Suite',
            'slug' => 'executive-suite',
            'description' => 'Luxury suite with separate living area, perfect for business travelers',
            'base_price' => 4500.00,
            'max_adults' => 4,
            'max_children' => 2,
            'size_sqm' => 55.00,
            'bed_type' => 'king',
            'number_of_beds' => 2,
            'images' => [
                'https://images.unsplash.com/photo-1578683010236-d716f9a3f461',
            ],
            'is_active' => true,
        ]);

        // Attach Amenities
        $basicAmenities = Amenity::whereIn('slug', [
            'free-wifi', 'air-conditioning', 'tv', 'private-bathroom', 'room-service'
        ])->pluck('id');

        $deluxeAmenities = Amenity::whereIn('slug', [
            'free-wifi', 'air-conditioning', 'tv', 'mini-bar', 'safe-box', 
            'balcony', 'city-view', 'room-service', 'private-bathroom', 'work-desk'
        ])->pluck('id');

        $suiteAmenities = Amenity::whereIn('slug', [
            'free-wifi', 'air-conditioning', 'tv', 'mini-bar', 'safe-box', 
            'balcony', 'city-view', 'room-service', 'breakfast-included',
            'work-desk', 'coffee-maker', 'private-bathroom', 'bathtub'
        ])->pluck('id');

        $standardRoom->amenities()->attach($basicAmenities);
        $deluxeRoom->amenities()->attach($deluxeAmenities);
        $suite->amenities()->attach($suiteAmenities);

        // Create Physical Rooms
        // Standard Rooms (10 rooms)
        for ($i = 1; $i <= 10; $i++) {
            Room::create([
                'hotel_id' => $hotel->id,
                'room_type_id' => $standardRoom->id,
                'room_number' => '1' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'floor' => '1',
                'status' => 'available',
                'is_active' => true,
            ]);
        }

        // Deluxe Rooms (8 rooms)
        for ($i = 1; $i <= 8; $i++) {
            Room::create([
                'hotel_id' => $hotel->id,
                'room_type_id' => $deluxeRoom->id,
                'room_number' => '2' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'floor' => '2',
                'status' => 'available',
                'is_active' => true,
            ]);
        }

        // Suites (5 rooms)
        for ($i = 1; $i <= 5; $i++) {
            Room::create([
                'hotel_id' => $hotel->id,
                'room_type_id' => $suite->id,
                'room_number' => '3' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'floor' => '3',
                'status' => 'available',
                'is_active' => true,
            ]);
        }
    }
}
