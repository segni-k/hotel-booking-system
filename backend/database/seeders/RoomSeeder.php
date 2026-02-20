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
        $standardRoom = RoomType::firstOrCreate(
            ['hotel_id' => $hotel->id, 'slug' => 'standard-room'],
            [
                'name' => 'Standard Room',
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
            ]
        );

        $deluxeRoom = RoomType::firstOrCreate(
            ['hotel_id' => $hotel->id, 'slug' => 'deluxe-room'],
            [
                'name' => 'Deluxe Room',
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
            ]
        );

        $suite = RoomType::firstOrCreate(
            ['hotel_id' => $hotel->id, 'slug' => 'executive-suite'],
            [
                'name' => 'Executive Suite',
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
            ]
        );

        // Attach Amenities (sync to avoid duplicates)
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

        $standardRoom->amenities()->syncWithoutDetaching($basicAmenities);
        $deluxeRoom->amenities()->syncWithoutDetaching($deluxeAmenities);
        $suite->amenities()->syncWithoutDetaching($suiteAmenities);

        // Create Physical Rooms (skip if already exist)
        // Standard Rooms (10 rooms)
        for ($i = 1; $i <= 10; $i++) {
            Room::firstOrCreate(
                ['hotel_id' => $hotel->id, 'room_number' => '1' . str_pad($i, 2, '0', STR_PAD_LEFT)],
                [
                    'room_type_id' => $standardRoom->id,
                    'floor' => '1',
                    'status' => 'available',
                    'is_active' => true,
                ]
            );
        }

        // Deluxe Rooms (8 rooms)
        for ($i = 1; $i <= 8; $i++) {
            Room::firstOrCreate(
                ['hotel_id' => $hotel->id, 'room_number' => '2' . str_pad($i, 2, '0', STR_PAD_LEFT)],
                [
                    'room_type_id' => $deluxeRoom->id,
                    'floor' => '2',
                    'status' => 'available',
                    'is_active' => true,
                ]
            );
        }

        // Suites (5 rooms)
        for ($i = 1; $i <= 5; $i++) {
            Room::firstOrCreate(
                ['hotel_id' => $hotel->id, 'room_number' => '3' . str_pad($i, 2, '0', STR_PAD_LEFT)],
                [
                    'room_type_id' => $suite->id,
                    'floor' => '3',
                    'status' => 'available',
                    'is_active' => true,
                ]
            );
        }
    }
}
