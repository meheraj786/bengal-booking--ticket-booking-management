# Bengal Booking

Bengal Booking is an event discovery and ticket-booking platform for connecting event organizers with people looking for things to do. Users can discover published events by category, location, and search term, select ticket types, and reserve tickets through a short-lived pending booking. Sellers can publish events and manage inventory, while administrators manage the platform's catalog, users, and payments.

The project is built as a separate Next.js frontend and NestJS backend. Its first implementation focuses on a reliable booking foundation: ticket-level inventory, immediate Redis-backed locks, ten-minute payment windows, payment confirmation, and expiry handling. This prevents two users from successfully reserving the same ticket during concurrent checkout attempts.

## Purpose

The purpose of Bengal Booking is to provide a role-aware event marketplace with a dependable booking lifecycle:

- Give users one place to browse events and reserve tickets.
- Give sellers the tools to create events, define ticket types and prices, and track bookings.
- Give super administrators control over users, categories, locations, events, tickets, and payments.
- Keep ticket availability consistent while several users try to book at the same time.
- Provide a foundation for payment-provider integration, email verification, dashboards, and future event-management features.

## Core features

### For users

- Browse published events with category, division/area, and text search filters.
- View event details, venue information, dates, ticket types, prices, and booking limits.
- Register with email and password or sign in with Google OAuth.
- Verify an account by email before normal password-based use.
- Reserve available tickets and submit buyer details.
- Confirm payment, view booking status, and receive a generated booking record.

### For sellers

- Create and manage owned events.
- Set event dates, venue details, booking and cancellation deadlines, payment type, and maximum tickets per booking.
- Create ticket types with names, descriptions, prices, and inventory.
- Review seller-specific dashboard information.

### For super administrators

- Manage users and account status.
- Manage event categories, divisions, and areas.
- Manage all events and tickets.
- Review and administer payments.
- View platform-level dashboard summaries.

## Booking lifecycle

1. A user selects one or more available ticket records.
2. The booking service atomically selects eligible inventory and acquires a Redis lock for each ticket.
3. A pending booking is created with a ten-minute expiry window.
4. A successful payment changes the booking to `CONFIRMED`, marks its tickets as sold, and records the payment.
5. An expired booking releases its tickets so they can be booked again.

Locks use keys in the form `ticket_lock:{ticketId}` and store the owning booking ID as their value. This means a booking can release only its own locks. The flow intentionally has no waiting queue: unavailable tickets fail immediately instead of leaving users in an indefinite queue.

## Architecture

```text
Next.js frontend
        |
        | HTTP requests with HttpOnly auth cookie
        v
NestJS API
   |             |
   v             v
PostgreSQL     Redis
 (Prisma)      (ticket locks)
```

### Technology stack

- **Frontend:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, TanStack Query, Zustand, React Hook Form, Zod, and Recharts.
- **Backend:** NestJS 11, TypeScript, Passport, JWT, Google OAuth2, class-validator, and Vitest.
- **Data:** PostgreSQL with Prisma ORM.
- **Concurrency:** Redis with ioredis for per-ticket locks.
- **Operations:** Docker Compose for PostgreSQL, Redis, backend, and frontend services.

## Repository structure

```text
.
├── frontend/                 # Next.js web application
├── backend/                  # NestJS API and Prisma schema
│   ├── prisma/               # Schema, migrations, and seed data
│   └── src/
│       ├── auth/             # Registration, verification, login, OAuth
│       ├── booking/          # Ticket locking and booking lifecycle
│       ├── category/         # Category management and public filters
│       ├── dashboard/        # Role-specific summaries
│       ├── event/            # Event discovery and event management
│       ├── payment/          # Payment operations
│       ├── ticket/           # Ticket inventory management
│       ├── user/             # User administration
│       ├── common/           # Guards, roles, pagination, and middleware
│       └── infrastructure/   # Prisma and Redis clients
└── docker-compose.yml        # Local service orchestration
```

## Local development

### Prerequisites

- Node.js with pnpm 10.15.0 or a compatible pnpm version.
- Docker and Docker Compose.

### 1. Configure the backend

```bash
cp backend/.env.example backend/.env
```

Update `backend/.env` before production use. The local defaults expect PostgreSQL at `localhost:5432`, Redis at `localhost:6379`, the API at `http://localhost:4000`, and the frontend at `http://localhost:3000`.

SMTP variables are optional for local development. When SMTP is not configured, the backend logs the email verification link instead. Google OAuth variables are required only when Google sign-in is enabled.

### 2. Start PostgreSQL and Redis

```bash
docker compose up -d postgres redis
```

### 3. Install and initialize the backend

```bash
cd backend
pnpm install
pnpm prisma:generate
pnpm prisma:migrate
pnpm seed
```

The seed creates the verified demo user/seller, base divisions and areas, categories, an event, and tickets.

### 4. Start the applications

Run the backend and frontend from separate terminals:

```bash
# Terminal 1
cd backend
pnpm start:dev
```

```bash
# Terminal 2
cd frontend
pnpm install
pnpm dev
```

The frontend is available at `http://localhost:3000` and the API at `http://localhost:4000`.

## Useful commands

### Backend

```bash
pnpm build          # Compile TypeScript
pnpm test           # Run Vitest tests
pnpm start:dev      # Start the API in watch mode
pnpm prisma:migrate # Create/apply development migrations
pnpm seed           # Load demo data
```

### Frontend

```bash
pnpm dev            # Start Next.js in development mode
pnpm build          # Create a production build
pnpm start          # Serve the production build
pnpm lint           # Run ESLint
```

## API overview

| Method | Endpoint                       | Purpose                                   |
| ------ | ------------------------------ | ----------------------------------------- |
| `GET`  | `/health`                      | Check API health                          |
| `POST` | `/auth/register`               | Register a user                           |
| `GET`  | `/auth/verify-email`           | Verify an email address                   |
| `POST` | `/auth/login`                  | Log in with credentials                   |
| `GET`  | `/auth/google`                 | Start Google OAuth2 login                 |
| `POST` | `/auth/logout`                 | Clear the authentication cookie           |
| `GET`  | `/events`                      | Browse published events and filters       |
| `GET`  | `/events/:id`                  | View event details                        |
| `GET`  | `/categories`                  | List event categories                     |
| `GET`  | `/areas`                       | List event areas                          |
| `POST` | `/bookings`                    | Lock tickets and create a pending booking |
| `POST` | `/bookings/:bookingId/confirm` | Confirm a successful payment              |
| `POST` | `/bookings/:bookingId/expire`  | Expire a booking and release tickets      |
| `GET`  | `/dashboard/user`              | View user dashboard data                  |
| `GET`  | `/dashboard/seller`            | View seller dashboard data                |
| `GET`  | `/dashboard/admin`             | View administrator dashboard data         |

## Authentication and authorization

Authentication uses an `HttpOnly` `evently_access_token` cookie. The frontend sends it automatically through Axios with credentials enabled, while browser JavaScript cannot read the JWT directly. Password login and Google OAuth both set the cookie; logout clears it.

The available roles are:

- `USER`: browse public resources and create or confirm personal bookings.
- `SELLER`: create and manage owned events and tickets.
- `SUPER_ADMIN`: manage users, categories, locations, payments, and all events and tickets.

## Project status

Bengal Booking is an active development project. The core domain model and concurrency-sensitive booking flow are in place, while payment-provider behavior, operational hardening, and additional production workflows can continue to evolve.
