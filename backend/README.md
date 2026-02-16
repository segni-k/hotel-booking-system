# Hotel Booking System - Backend API

## Overview

A production-grade Laravel 12 REST API for a hotel booking system with:

- **Clean Architecture**: Service Layer, Repository Pattern, DTOs
- **Filament v4 Admin Panel**: Complete hotel & booking management
- **Chapa Payment Integration**: Ethiopian payment gateway
- **PostgreSQL Database**: Robust relational data storage
- **Role-Based Access Control**: Super Admin, Admin, Receptionist, Customer
- **Real-time Availability**: Prevents double booking
- **API Versioning**: `/api/v1` endpoints

## Tech Stack

- **Framework**: Laravel 12
- **Admin Panel**: Filament v4
- **Database**: PostgreSQL
- **Authentication**: Laravel Sanctum
- **Payment**: Chapa
- **Testing**: PHPUnit

## Requirements

- PHP >= 8.2
- PostgreSQL >= 14
- Composer
- Node.js & NPM (for Filament assets)

## Installation

### 1. Clone & Install Dependencies

```bash
cd backend
composer install
```

### 2. Environment Setup

```bash
cp .env.example .env
php artisan key:generate
```

Update `.env` with your settings:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=hotel_booking
DB_USERNAME=postgres
DB_PASSWORD=your_password

CHAPA_SECRET_KEY=your_chapa_secret
CHAPA_WEBHOOK_SECRET=your_webhook_secret

FRONTEND_URL=http://localhost:3000
```

### 3. Run Migrations & Seed Data

```bash
php artisan migrate
php artisan db:seed
```

### 4. Install Filament

```bash
composer require filament/filament:"^4.0"
php artisan filament:install --panels
```

### 5. Serve the Application

```bash
php artisan serve
```

API: http://localhost:8000
Filament Admin: http://localhost:8000/admin

## Default Users

**Super Admin**
- Email: admin@hotel.com
- Password: password

**Receptionist**
- Email: receptionist@hotel.com
- Password: password

**Customer**
- Email: customer@example.com
- Password: password

## API Documentation

### Authentication

**Register**
```
POST /api/v1/auth/register
```

**Login**
```
POST /api/v1/auth/login
```

**Logout**
```
POST /api/v1/auth/logout
Authorization: Bearer {token}
```

### Hotels

**List Hotels**
```
GET /api/v1/hotels
```

**Get Hotel**
```
GET /api/v1/hotels/{id}
```

### Rooms

**Search Available Rooms**
```
POST /api/v1/rooms/search
Content-Type: application/json

{
  "hotel_id": 1,
  "check_in_date": "2026-03-01",
  "check_out_date": "2026-03-03",
  "adults": 2,
  "children": 0
}
```

**List Room Types**
```
GET /api/v1/rooms
```

**Get Room Details**
```
GET /api/v1/rooms/{id}
```

### Bookings

**Create Booking**
```
POST /api/v1/bookings
Authorization: Bearer {token}
Content-Type: application/json

{
  "hotel_id": 1,
  "room_type_id": 1,
  "check_in_date": "2026-03-01",
  "check_out_date": "2026-03-03",
  "number_of_adults": 2,
  "number_of_children": 0,
  "payment_method": "pay_now",
  "guests": [
    {
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "guest_type": "adult",
      "is_primary": true
    }
  ]
}
```

**List User Bookings**
```
GET /api/v1/bookings
Authorization: Bearer {token}
```

**Get Booking Details**
```
GET /api/v1/bookings/{bookingNumber}
Authorization: Bearer {token}
```

**Cancel Booking**
```
PUT /api/v1/bookings/{bookingNumber}/cancel
Authorization: Bearer {token}
Content-Type: application/json

{
  "reason": "Change of plans"
}
```

**Check-In** (Staff Only)
```
PUT /api/v1/bookings/{bookingNumber}/check-in
Authorization: Bearer {token}
```

**Check-Out** (Staff Only)
```
PUT /api/v1/bookings/{bookingNumber}/check-out
Authorization: Bearer {token}
```

### Payments

**Initialize Chapa Payment**
```
POST /api/v1/payments/chapa/initialize
Authorization: Bearer {token}
Content-Type: application/json

{
  "booking_number": "BK-ABC12345"
}
```

**Verify Payment**
```
POST /api/v1/payments/verify
Authorization: Bearer {token}
Content-Type: application/json

{
  "transaction_id": "TX-ABC12345"
}
```

**Mark Cash Payment** (Staff Only)
```
PUT /api/v1/payments/{paymentId}/mark-cash-paid
Authorization: Bearer {token}
```

## Architecture

### Folder Structure

```
app/
├── Contracts/
│   └── Repositories/     # Repository interfaces
├── DTO/                  # Data Transfer Objects
├── Events/               # Domain events
├── Filament/
│   └── Resources/        # Admin panel resources
├── Http/
│   ├── Controllers/
│   │   └── Api/V1/       # API controllers
│   ├── Requests/         # Form request validation
│   └── Resources/        # API response resources
├── Listeners/            # Event listeners
├── Models/               # Eloquent models
├── Policies/             # Authorization policies
├── Repositories/         # Repository implementations
└── Services/             # Business logic services
```

### Key Components

**Services**
- `BookingService`: Handles booking creation, cancellation, check-in/out
- `PaymentService`: Manages Chapa payments and cash payments
- `AvailabilityService`: Room search and availability checks

**Repositories**
- `BookingRepository`
- `RoomRepository`
- `PaymentRepository`
- `AvailabilityRepository`

**Events**
- `BookingCreated`: Fired when a booking is created
- `PaymentSuccessful`: Fired when payment completes

## Double Booking Prevention

The system prevents double booking through:

1. **Database Transactions**: All booking operations wrapped in transactions
2. **Availability Locking**: Room dates locked during booking process
3. **Real-time Checks**: Availability re-verified before saving
4. **Concurrent Request Handling**: Row-level locking in PostgreSQL

## Testing

Run tests:
```bash
php artisan test
```

Run specific test:
```bash
php artisan test --filter BookingTest
```

## Scheduled Tasks

**Expire Pending Bookings**
Runs every 5 minutes to cancel unpaid bookings:
```bash
php artisan schedule:work
```

## Production Deployment

1. Set `APP_ENV=production` in `.env`
2. Run `php artisan optimize`
3. Run `php artisan config:cache`
4. Run `php artisan route:cache`
5. Set up queue worker: `php artisan queue:work`
6. Set up scheduler cron job

## License

Proprietary - Hotel Booking System
