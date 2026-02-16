<?php

namespace Database\Seeders;

use App\Models\Amenity;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AmenitySeeder extends Seeder
{
    public function run(): void
    {
        $amenities = [
            ['name' => 'Free WiFi', 'icon' => 'wifi'],
            ['name' => 'Air Conditioning', 'icon' => 'ac'],
            ['name' => 'TV', 'icon' => 'tv'],
            ['name' => 'Mini Bar', 'icon' => 'minibar'],
            ['name' => 'Safe Box', 'icon' => 'safe'],
            ['name' => 'Hair Dryer', 'icon' => 'hairdryer'],
            ['name' => 'Balcony', 'icon' => 'balcony'],
            ['name' => 'City View', 'icon' => 'view'],
            ['name' => 'Room Service', 'icon' => 'service'],
            ['name' => 'Breakfast Included', 'icon' => 'breakfast'],
            ['name' => 'Work Desk', 'icon' => 'desk'],
            ['name' => 'Coffee Maker', 'icon' => 'coffee'],
            ['name' => 'Private Bathroom', 'icon' => 'bathroom'],
            ['name' => 'Bathtub', 'icon' => 'bathtub'],
            ['name' => 'Telephone', 'icon' => 'phone'],
        ];

        foreach ($amenities as $amenity) {
            Amenity::create([
                'name' => $amenity['name'],
                'slug' => Str::slug($amenity['name']),
                'icon' => $amenity['icon'],
                'is_active' => true,
            ]);
        }
    }
}
