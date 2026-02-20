<?php

namespace Database\Seeders;

use App\Models\Hotel;
use Illuminate\Database\Seeder;

class HotelSeeder extends Seeder
{
    public function run(): void
    {
        Hotel::firstOrCreate(
            ['email' => 'info@grandpalace.com'],
            [
                'name' => 'Grand Palace Hotel',
                'description' => 'A luxurious 5-star hotel in the heart of Addis Ababa with world-class amenities and services.',
                'phone' => '+251115551234',
                'address' => 'Bole Road, Near Millennium Hall',
                'city' => 'Addis Ababa',
                'state' => 'Addis Ababa',
                'country' => 'Ethiopia',
                'postal_code' => '1000',
                'latitude' => 9.0054,
                'longitude' => 38.7636,
                'star_rating' => 5,
                'images' => [
                    '(imageUrl:https://images.unsplash.com/photo-1566073771259-6a8506099945',
                    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
                ],
                'facilities' => [
                    'Free WiFi',
                    'Swimming Pool',
                    'Spa & Wellness',
                    'Restaurant',
                    'Bar',
                    'Gym',
                    '24/7 Room Service',
                    'Airport Shuttle',
                    'Parking',
                ],
                'is_active' => true,
            ]
        );

        Hotel::firstOrCreate(
            ['email' => 'contact@skyline.com'],
            [
                'name' => 'Skyline Business Hotel',
                'description' => 'Modern business hotel with conference facilities and excellent location.',
                'phone' => '+251115551235',
                'address' => 'Megenagna',
                'city' => 'Addis Ababa',
                'state' => 'Addis Ababa',
                'country' => 'Ethiopia',
                'postal_code' => '1000',
                'latitude' => 9.0143,
                'longitude' => 38.7847,
                'star_rating' => 4,
                'images' => [
                    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa',
                ],
                'facilities' => [
                    'Free WiFi',
                    'Business Center',
                    'Restaurant',
                    'Meeting Rooms',
                    'Parking',
                ],
                'is_active' => true,
            ]
        );
    }
}
