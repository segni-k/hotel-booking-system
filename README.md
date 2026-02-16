# Hotel Booking System

A production-grade hotel booking system with Laravel 12 API, Filament v4 admin panel, and Next.js frontend.

## 🌟 Features

- ✅ Search and book hotel rooms
- ✅ Real-time availability checking
- ✅ Double booking prevention
- ✅ Multiple payment options (Chapa & Pay at Hotel)
- ✅ Role-based access control (Super Admin, Admin, Receptionist, Customer)
- ✅ Filament v4 admin panel
- ✅ Seasonal pricing rules
- ✅ Booking management (Check-in/Check-out)
- ✅ Payment tracking
- ✅ Guest reviews
- ✅ Email notifications
- ✅ Comprehensive test coverage

## 🏗️ Tech Stack

### Backend
- **Framework**: Laravel 12
- **Admin Panel**: Filament v4
- **Database**: PostgreSQL
- **Authentication**: Laravel Sanctum
- **Payment**: Chapa (Ethiopian Payment Gateway)
- **Testing**: PHPUnit

### Frontend (Next.js)
- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **State Management**: React Context/Hooks
- **HTTP Client**: Axios
- **UI Components**: Custom components

## 📁 Project Structure

```
hotel-booking-system/
├── backend/                 # Laravel 12 API
│   ├── app/
│   │   ├── Contracts/      # Repository interfaces
│   │   ├── DTO/            # Data Transfer Objects
│   │   ├── Events/         # Domain events
│   │   ├── Filament/       # Admin panel resources
│   │   ├── Http/           # Controllers, Requests, Resources
│   │   ├── Listeners/      # Event listeners
│   │   ├── Models/         # Eloquent models
│   │   ├── Policies/       # Authorization policies
│   │   ├── Repositories/   # Repository implementations
│   │   └── Services/       # Business logic
│   ├── database/
│   │   ├── migrations/     # Database migrations
│   │   └── seeders/        # Database seeders
│   ├── routes/             # API routes
│   └── tests/              # Feature & Unit tests
│
├── my-app/                 # Next.js Frontend
│   ├── app/                # Next.js 14 app directory
│   │   ├── about-us/
│   │   ├── auth/
│   │   ├── reserve/
│   │   └── rooms/
│   ├── components/         # React components
│   ├── context/            # React context
│   └── public/             # Static assets
│
└── DOCUMENTATION.md        # Comprehensive documentation
```

## 🚀 Quick Start

### Prerequisites

- PHP >= 8.2
- Composer
- PostgreSQL >= 14
- Node.js >= 18
- npm or yarn

### Backend Setup

```bash
cd backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env
# DB_CONNECTION=pgsql
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_DATABASE=hotel_booking
# DB_USERNAME=postgres
# DB_PASSWORD=your_password

# Run migrations
php artisan migrate

# Seed database with demo data
php artisan db:seed

# Start development server
php artisan serve
```

Backend will be available at: http://localhost:8000

**Default Users:**
- Super Admin: admin@hotel.com / password
- Receptionist: receptionist@hotel.com / password
- Customer: customer@example.com / password

### Filament Admin Panel

Access at: http://localhost:8000/admin

Login with super admin credentials.

### Frontend Setup

```bash
cd my-app

# Install dependencies
npm install

# Configure environment
# Create .env.local and add:
# NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Start development server
npm run dev
```

Frontend will be available at: http://localhost:3000

## 📖 Documentation

See [DOCUMENTATION.md](./DOCUMENTATION.md) for comprehensive documentation including:
- Architecture overview
- Database schema
- API endpoints
- Authentication & authorization
- Payment integration
- Testing strategy
- Deployment guide

### Backend Documentation

See [backend/README.md](./backend/README.md) for:
- API documentation
- Installation instructions
- Configuration options
- Testing commands

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
php artisan test

# Run specific test file
php artisan test --filter BookingTest

# Run with coverage
php artisan test --coverage
```

**Test Coverage:**
- Authentication (Register, Login, Logout)
- Booking Creation & Validation
- Double Booking Prevention
- Room Search & Availability
- Booking Cancellation

## 📊 Database Schema

Key tables:
- `users` - User accounts
- `roles` - User roles
- `hotels` - Hotel information
- `room_types` - Room categories
- `rooms` - Physical rooms
- `amenities` - Room amenities
- `bookings` - Booking records
- `payments` - Payment transactions
- `availability` - Date-based availability
- `price_rules` - Seasonal pricing
- `reviews` - Customer reviews

## 🔐 Authentication

**Technology**: Laravel Sanctum (Bearer tokens)

**Endpoints**:
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login and get token
- `POST /api/v1/auth/logout` - Logout and revoke token
- `GET /api/v1/auth/user` - Get authenticated user

## 💳 Payment Integration

**Provider**: Chapa (Ethiopian Payment Gateway)

**Payment Methods**:
1. **Pay Now**: Chapa online payment
2. **Pay at Hotel**: Cash payment at check-in

**Flow**:
1. Create booking
2. Initialize payment with Chapa
3. Redirect user to Chapa checkout
4. Handle webhook callback
5. Update booking status

## 🛡️ Security Features

- SQL Injection protection (Eloquent ORM)
- CSRF protection
- XSS protection
- Mass assignment protection
- Authentication (Sanctum)
- Authorization (Policies)
- Input validation (Form Requests)
- Rate limiting
- Webhook signature verification

## 📈 Performance

- Repository pattern for data access
- Service layer for business logic
- Eager loading to prevent N+1 queries
- Database indexing on critical columns
- API response caching (to be implemented)
- Queue jobs for async tasks (to be implemented)

## 🎯 Key Features Implemented

### ✅ No Double Booking
- Database transactions
- Real-time availability checks
- Row-level locking
- Availability table management

### ✅ Role-Based Access Control
- Super Admin: Full access
- Admin: Hotel & booking management
- Receptionist: Check-in/out, cash payments
- Customer: Book & manage own reservations

### ✅ Booking Expiration
- Automatic cancellation of unpaid bookings
- Scheduled task runs every 5 minutes
- Configurable expiry time

### ✅ Clean Architecture
- Service Layer pattern
- Repository pattern
- DTO pattern
- Event-driven architecture
- Policy-based authorization

## 🔄 Booking Statuses

- `pending` - Awaiting payment
- `confirmed` - Payment received or pay_at_hotel selected
- `checked_in` - Guest has checked in
- `checked_out` - Guest has checked out
- `cancelled` - Booking cancelled
- `no_show` - Guest didn't arrive

## 📱 API Response Format

```json
{
  "message": "Success message",
  "data": {
    // Resource data
  },
  "meta": {
    // Pagination or additional info
  }
}
```

Error response:
```json
{
  "message": "Error message",
  "errors": {
    "field": ["Validation error"]
  }
}
```

## 🌐 CORS Configuration

Backend is configured to accept requests from:
- `localhost:3000` (development)
- Production frontend URL (configure in `.env`)

## 🔧 Configuration

### Backend Environment Variables

```env
APP_NAME="Hotel Booking API"
APP_URL=http://localhost:8000
DB_CONNECTION=pgsql
DB_DATABASE=hotel_booking
CHAPA_SECRET_KEY=your_secret
CHAPA_WEBHOOK_SECRET=your_webhook_secret
FRONTEND_URL=http://localhost:3000
BOOKING_EXPIRY_MINUTES=15
```

### Frontend Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## 📦 Deployment

### Backend Deployment

1. Set environment to production
2. Configure production database
3. Install dependencies: `composer install --optimize-autoloader --no-dev`
4. Run migrations: `php artisan migrate --force`
5. Seed data: `php artisan db:seed`
6. Cache config: `php artisan config:cache`
7. Cache routes: `php artisan route:cache`
8. Set up queue worker
9. Set up scheduler cron job
10. Configure SSL

### Frontend Deployment

1. Build: `npm run build`
2. Start: `npm start`
3. Or deploy to Vercel/Netlify

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Write tests for new features
4. Follow PSR-12 coding standards
5. Submit pull request

## 📄 License

Proprietary - All rights reserved

## 👥 Support

For issues or questions, please open an issue in the repository.

---

**Built with ❤️ using Laravel 12, Filament v4, and Next.js**
