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
            Role::firstOrCreate(
                ['name' => $roleData['name']],
                $roleData
            );
        }

        // Create super admin user
        $superAdmin = User::firstOrCreate(
            ['email' => 'admin@hotel.com'],
            [
                'first_name' => 'Super',
                'last_name' => 'Admin',
                'phone' => '+251911234567',
                'password' => Hash::make('password'),
                'is_active' => true,
            ]
        );

        $superAdminRole = Role::where('name', 'super_admin')->first();
        if ($superAdminRole && !$superAdmin->roles()->where('role_id', $superAdminRole->id)->exists()) {
            $superAdmin->roles()->attach($superAdminRole->id);
        }

        // Create receptionist user
        $receptionist = User::firstOrCreate(
            ['email' => 'receptionist@hotel.com'],
            [
                'first_name' => 'John',
                'last_name' => 'Receptionist',
                'phone' => '+251911234568',
                'password' => Hash::make('password'),
                'is_active' => true,
            ]
        );

        $receptionistRole = Role::where('name', 'receptionist')->first();
        if ($receptionistRole && !$receptionist->roles()->where('role_id', $receptionistRole->id)->exists()) {
            $receptionist->roles()->attach($receptionistRole->id);
        }

        // Create customer user
        $customer = User::firstOrCreate(
            ['email' => 'customer@example.com'],
            [
                'first_name' => 'Jane',
                'last_name' => 'Customer',
                'phone' => '+251911234569',
                'password' => Hash::make('password'),
                'is_active' => true,
            ]
        );

        $customerRole = Role::where('name', 'customer')->first();
        if ($customerRole && !$customer->roles()->where('role_id', $customerRole->id)->exists()) {
            $customer->roles()->attach($customerRole->id);
        }
    }
}
