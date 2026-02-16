<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name' => 'super_admin',
                'display_name' => 'Super Administrator',
                'description' => 'Full system access',
            ],
            [
                'name' => 'admin',
                'display_name' => 'Administrator',
                'description' => 'Hotel management access',
            ],
            [
                'name' => 'receptionist',
                'display_name' => 'Receptionist',
                'description' => 'Booking and check-in/out access',
            ],
            [
                'name' => 'customer',
                'display_name' => 'Customer',
                'description' => 'Standard customer access',
            ],
        ];

        foreach ($roles as $roleData) {
            Role::create($roleData);
        }

        // Create super admin user
        $superAdmin = User::create([
            'first_name' => 'Super',
            'last_name' => 'Admin',
            'email' => 'admin@hotel.com',
            'phone' => '+251911234567',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);

        $superAdmin->roles()->attach(Role::where('name', 'super_admin')->first()->id);

        // Create receptionist user
        $receptionist = User::create([
            'first_name' => 'John',
            'last_name' => 'Receptionist',
            'email' => 'receptionist@hotel.com',
            'phone' => '+251911234568',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);

        $receptionist->roles()->attach(Role::where('name', 'receptionist')->first()->id);

        // Create customer user
        $customer = User::create([
            'first_name' => 'Jane',
            'last_name' => 'Customer',
            'email' => 'customer@example.com',
            'phone' => '+251911234569',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);

        $customer->roles()->attach(Role::where('name', 'customer')->first()->id);
    }
}
