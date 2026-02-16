# Hotel Booking System - Complete Project Documentation

## 🎯 Project Overview

A production-grade, full-stack hotel booking system with:
- **Backend**: Laravel 12 API with clean architecture
- **Admin Panel**: Filament v4
- **Frontend**: Next.js (React) + Tailwind CSS
- **Database**: PostgreSQL
- **Payment**: Chapa integration
- **Authentication**: Laravel Sanctum

## 📁 Project Structure

```
hotel-booking-system/
├── backend/              # Laravel 12 API
│   ├── app/
│   │   ├── Contracts/   # Repository interfaces
│   │   ├── DTO/         # Data Transfer Objects
│   │   ├── Events/      # Domain events
│   │   ├── Filament/    # Admin resources
│   │   ├── Http/        # Controllers, Requests, Resources
│   │   ├── Listeners/   # Event listeners
│   │   ├── Models/      # Eloquent models
│   │   ├── Policies/    # Authorization
│   │   ├── Repositories/# Repository implementations
│   │   └── Services/    # Business logic
│   ├── config/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   └── tests/
│
└── my-app/              # Next.js Frontend
    ├── app/             # Next.js 14 app directory
    ├── components/      # React components
    └── public/

```

## 🗄️ Database Schema

### Tables

1. **users** - User accounts (customers, staff, admin)
2. **roles** - User roles (super_admin, admin, receptionist, customer)
3. **role_user** - Pivot table for user roles
4. **hotels** - Hotel information
5. **amenities** - Room amenities (WiFi, AC, etc.)
6. **room_types** - Room categories (Standard, Deluxe, Suite)
7. **room_type_amenity** - Pivot table for room type amenities
8. **rooms** - Physical rooms
9. **price_rules** - Seasonal pricing
10. **availability** - Date-based room availability
11. **bookings** - Booking records
12. **booking_guests** - Guest information
13. **payments** - Payment transactions
14. **reviews** - Hotel/room reviews

### Key Relationships

```
Hotel
  ├── has many → RoomTypes
  ├── has many → Rooms
  └── has many → Bookings

RoomType
  ├── belongs to → Hotel
  ├── has many → Rooms
  ├── belongs to many → Amenities
  └── has many → PriceRules

Room
  ├── belongs to → Hotel
  ├── belongs to → RoomType
  ├── has many → Availability
  └── has many → Bookings

Booking
  ├── belongs to → User
  ├── belongs to → Hotel
  ├── belongs to → Room
  ├── belongs to → RoomType
  ├── has many → BookingGuests
  ├── has many → Payments
  └── has one → Review

Payment
  └── belongs to → Booking

User
  ├── belongs to many → Roles
  ├── has many → Bookings
  └── has many → Reviews
```

## 🏗️ Backend Architecture

### Clean Architecture Layers

#### 1. **Models Layer** (Eloquent)
- Data structure and relationships
- No business logic

#### 2. **Repository Layer**
- Data access abstraction
- Database queries
- Interfaces in `Contracts/Repositories`
- Implementations in `Repositories/`

#### 3. **Service Layer**
- Business logic
- Transaction management
- Coordinates multiple repositories
- Key services:
  - `BookingService`
  - `PaymentService`
  - `AvailabilityService`

#### 4. **Controller Layer**
- HTTP request handling
- Validation via Form Requests
- Response formatting via API Resources

#### 5. **Presentation Layer**
- API Resources
- JSON response formatting

### Design Patterns

1. **Repository Pattern**: Abstracts data access
2. **Service Layer Pattern**: Encapsulates business logic
3. **DTO Pattern**: Type-safe data transfer
4. **Observer Pattern**: Events & Listeners
5. **Policy Pattern**: Authorization
6. **Factory Pattern**: Test data generation

## 🔐 Authentication & Authorization

### Authentication
- **Technology**: Laravel Sanctum
- **Token Type**: Bearer tokens
- **Endpoints**:
  - `/api/v1/auth/register`
  - `/api/v1/auth/login`
  - `/api/v1/auth/logout`

### Authorization

#### Roles
1. **Super Admin**: Full system access
2. **Admin**: Hotel and booking management
3. **Receptionist**: Booking operations, check-in/out
4. **Customer**: Book and manage own reservations

#### Policies
- `BookingPolicy`: Controls booking operations
- `PaymentPolicy`: Controls payment operations
- `HotelPolicy`: Controls hotel management

## 🏨 Core Features

### 1. Room Search & Availability

**Endpoint**: `POST /api/v1/rooms/search`

**Flow**:
1. User submits search criteria (dates, guests, hotel)
2. `AvailabilityService` queries available rooms
3. Filters by capacity, amenities, price
4. Calculates pricing (including seasonal rules)
5. Returns available room types with counts

**Double Booking Prevention**:
- Real-time availability check
- Database transactions
- Row-level locking
- Availability table locking

### 2. Booking Process

**Endpoint**: `POST /api/v1/bookings`

**Flow**:
```
1. Validate input (FormRequest)
2. Start database transaction
3. Find available room
4. Re-check availability (prevent race condition)
5. Calculate pricing
6. Create booking record
7. Add guest information
8. Lock room dates (availability table)
9. Update room status
10. Fire BookingCreated event
11. Commit transaction
12. Return booking details
```

**Booking Statuses**:
- `pending`: Awaiting payment
- `confirmed`: Payment received or pay_at_hotel
- `checked_in`: Guest has checked in
- `checked_out`: Guest has checked out
- `cancelled`: Booking cancelled
- `no_show`: Guest didn't arrive

### 3. Payment System

#### Payment Methods

**1. Pay Now (Chapa)**

**Flow**:
```
1. User creates booking
2. Booking status = 'pending'
3. Frontend calls /api/v1/payments/chapa/initialize
4. Backend creates Payment record
5. Backend calls Chapa API
6. Returns checkout URL to frontend
7. User redirects to Chapa
8. User completes payment
9. Chapa calls webhook /api/v1/payments/chapa/webhook
10. Backend verifies signature
11. Updates payment status
12. Updates booking status to 'confirmed'
13. Fires PaymentSuccessful event
```

**2. Pay at Hotel**
- Booking immediately confirmed
- Payment marked as pending
- Receptionist marks as paid at check-in

### 4. Booking Expiry

**Scheduled Task** (every 5 minutes):
```php
Schedule::call(function () {
    app(\App\Services\BookingService::class)->expirePendingBookings();
})->everyFiveMinutes();
```

**Logic**:
- Find bookings with status = 'pending'
- Check if expires_at < now()
- Cancel booking
- Release room dates
- Update room status

## 📊 Filament Admin Panel

### Resources

1. **Hotel Resource**
   - CRUD operations
   - Upload images
   - Manage facilities
   - Location mapping

2. **Room Type Resource**
   - Manage room categories
   - Set pricing
   - Assign amenities
   - Upload room images

3. **Booking Resource**
   - View all bookings
   - Filter by status, hotel, date
   - Check-in/Check-out actions
   - Manual booking creation

### Dashboard Widgets (To Be Implemented)
- Revenue chart
- Occupancy rate
- Recent bookings
- Payment statistics

## 🧪 Testing Strategy

### Test Types

1. **Feature Tests**
   - API endpoint testing
   - Full request/response cycle
   - Database interactions

2. **Unit Tests** (To Be Added)
   - Service layer logic
   - Repository methods
   - DTO validation

### Test Coverage

**BookingTest**:
- ✅ Create booking
- ✅ Prevent double booking
- ✅ View bookings
- ✅ Cancel booking
- ✅ Authorization checks

**AuthTest**:
- ✅ User registration
- ✅ Login
- ✅ Logout
- ✅ Invalid credentials

**RoomSearchTest**:
- ✅ Search available rooms
- ✅ Date validation
- ✅ View room details

## 🚀 API Endpoints

### Public Endpoints

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
GET    /api/v1/hotels
GET    /api/v1/hotels/{id}
GET    /api/v1/rooms
GET    /api/v1/rooms/{id}
POST   /api/v1/rooms/search
POST   /api/v1/payments/chapa/webhook
```

### Protected Endpoints (Require Auth)

```
POST   /api/v1/auth/logout
GET    /api/v1/auth/user
POST   /api/v1/bookings
GET    /api/v1/bookings
GET    /api/v1/bookings/{bookingNumber}
PUT    /api/v1/bookings/{bookingNumber}/cancel
POST   /api/v1/payments/chapa/initialize
POST   /api/v1/payments/verify
```

### Staff Only Endpoints

```
PUT    /api/v1/bookings/{bookingNumber}/check-in
PUT    /api/v1/bookings/{bookingNumber}/check-out
PUT    /api/v1/payments/{paymentId}/mark-cash-paid
```

## 💳 Chapa Integration

### Configuration

```env
CHAPA_SECRET_KEY=your_secret_key
CHAPA_WEBHOOK_SECRET=your_webhook_secret
CHAPA_BASE_URL=https://api.chapa.co/v1
```

### Initialize Payment

```php
POST https://api.chapa.co/v1/transaction/initialize
Headers:
  Authorization: Bearer {CHAPA_SECRET_KEY}
  Content-Type: application/json

Body:
{
  "amount": 2300,
  "currency": "ETB",
  "email": "customer@example.com",
  "first_name": "Jane",
  "last_name": "Customer",
  "tx_ref": "TX-ABC123",
  "callback_url": "https://api.hotel.com/api/v1/payments/chapa/webhook",
  "return_url": "http://localhost:3000/booking/BK-ABC/payment/callback"
}
```

### Webhook Verification

```php
$signature = $request->header('Chapa-Signature');
$expected = hash_hmac('sha256', $request->getContent(), config('chapa.webhook_secret'));

if (!hash_equals($signature, $expected)) {
    abort(403, 'Invalid signature');
}
```

## 🔄 Event System

### Events

**BookingCreated**
- Triggered when booking is created
- Payload: Booking model

**PaymentSuccessful**
- Triggered when payment completes
- Payload: Payment model

### Listeners

**SendBookingConfirmationEmail**
- Sends email to customer
- Logs booking creation

**SendPaymentReceiptEmail**
- Sends payment receipt
- Logs payment completion

## 📈 Performance Optimization

1. **Eager Loading**: Load relationships to avoid N+1 queries
2. **Database Indexing**: Indexes on foreign keys, dates, status
3. **Query Optimization**: Use repository pattern for efficient queries
4. **Caching** (To Be Implemented): Cache room availability
5. **Queue Jobs** (To Be Implemented): Async email sending

## 🛡️ Security Measures

1. **SQL Injection**: Eloquent ORM prevents SQL injection
2. **CSRF Protection**: Laravel built-in CSRF
3. **XSS Protection**: Output escaping
4. **Mass Assignment**: $fillable properties
5. **Authentication**: Sanctum tokens
6. **Authorization**: Policies
7. **Rate Limiting**: API throttling
8. **Webhook Verification**: HMAC signature
9. **Input Validation**: Form Requests

## 🌐 CORS Configuration

```php
// In bootstrap/app.php or cors config
'paths' => ['api/*'],
'allowed_origins' => [env('FRONTEND_URL')],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => true,
```

## 📦 Deployment Checklist

### Backend

- [ ] Set `APP_ENV=production`
- [ ] Set strong `APP_KEY`
- [ ] Configure production database
- [ ] Set `APP_DEBUG=false`
- [ ] Configure Chapa credentials
- [ ] Run `composer install --optimize-autoloader --no-dev`
- [ ] Run `php artisan config:cache`
- [ ] Run `php artisan route:cache`
- [ ] Run `php artisan view:cache`
- [ ] Set up queue worker
- [ ] Set up scheduler cron job
- [ ] Configure error logging
- [ ] Set up SSL certificate
- [ ] Configure CORS for production frontend
- [ ] Run migrations
- [ ] Seed initial data

### Database

- [ ] Create production database
- [ ] Configure backups
- [ ] Set up connection pooling
- [ ] Optimize PostgreSQL settings

## 🔧 Environment Variables

### Required Variables

```env
APP_NAME=Hotel Booking API
APP_ENV=production
APP_KEY=base64:...
APP_DEBUG=false
APP_URL=https://api.yourhotel.com

DB_CONNECTION=pgsql
DB_HOST=your_db_host
DB_PORT=5432
DB_DATABASE=hotel_booking_prod
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password

CHAPA_SECRET_KEY=your_chapa_secret
CHAPA_WEBHOOK_SECRET=your_webhook_secret

FRONTEND_URL=https://yourhotel.com

MAIL_MAILER=smtp
MAIL_HOST=your_mail_host
MAIL_PORT=587
MAIL_USERNAME=your_mail_user
MAIL_PASSWORD=your_mail_password
```

## 🐛 Common Issues & Solutions

### Issue: Double booking occurs
**Solution**: Ensure database transactions are working, check PostgreSQL isolation level

### Issue: Payment webhook not working
**Solution**: Verify webhook URL is publicly accessible, check signature verification

### Issue: Booking expires immediately
**Solution**: Check `BOOKING_EXPIRY_MINUTES` in config, ensure scheduler is running

### Issue: 419 CSRF error
**Solution**: Configure CORS properly, ensure Sanctum stateful domains are set

## 📚 Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Filament Documentation](https://filamentphp.com/docs)
- [Chapa API Documentation](https://developer.chapa.co)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🤝 Contributing

1. Follow PSR-12 coding standards
2. Write tests for new features
3. Update documentation
4. Use meaningful commit messages

## 📄 License

Proprietary - All rights reserved
