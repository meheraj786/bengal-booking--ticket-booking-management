# Evently

Evently is a separate Next.js and NestJS event-booking platform. The initial slice includes the complete Prisma domain model and the concurrency-critical booking flow: immediate per-ticket locks, ten-minute pending bookings, payment confirmation, and expiry cleanup.

## Structure

- `frontend/` Next.js 15 App Router application
- `backend/` NestJS API, organized by feature:
  - `src/auth/` registration, email verification, login, JWT, Google OAuth2
  - `src/category/` super-admin category CRUD
  - `src/area/` super-admin location CRUD
  - `src/event/` public discovery plus seller event CRUD
  - `src/ticket/` seller ticket creation and management
  - `src/booking/` direct ticket locking and booking lifecycle
  - `src/payment/` payment administration endpoints
  - `src/user/` super-admin user management
  - `src/dashboard/` role-specific summaries
  - `src/common/` guards, decorators, and middleware
  - `src/infrastructure/` shared Prisma and Redis clients
- `docker-compose.yml` PostgreSQL, Redis, backend, and frontend services

## Local setup

1. Copy `backend/.env.example` to `backend/.env`.
2. Start infrastructure with `docker compose up -d postgres redis`.
3. In `backend/`, run `pnpm install`, `pnpm prisma:generate`, then `pnpm prisma:migrate`.
4. Run `pnpm seed` in `backend/` to add the verified demo seller/user, categories, event, and tickets.
5. Run `pnpm start:dev` in `backend/` and `pnpm dev` in `frontend/`.

## API surface

- `GET /health` API health check
- `POST /auth/register`, `GET /auth/verify-email`, `POST /auth/login`, and `GET /auth/google` authentication
- `GET /events?category=music&area=dhaka&search=festival` published event discovery
- `GET /events/:id` event details
- `GET /categories` and `GET /areas` filter data
- `POST /bookings` immediately lock available ticket IDs and create a pending booking
- `POST /bookings/:bookingId/confirm` confirm a successful payment
- `POST /bookings/:bookingId/expire` release an expired booking
- `GET /dashboard/user`, `GET /dashboard/seller`, and `GET /dashboard/admin` role dashboard summaries

## Authorization rules

- `SUPER_ADMIN`: manage users, categories, areas, payments, and all events/tickets.
- `SELLER`: create and manage their own events and tickets.
- `USER`: read public resources and create/confirm their own bookings.

Normal registration creates an unverified account. Configure SMTP variables to send the verification link; without SMTP, the backend logs the link for local development. Google users are verified automatically by the OAuth callback.

Authentication uses an `HttpOnly` `evently_access_token` cookie. Axios is configured with `withCredentials: true`, so browser requests send the cookie automatically; frontend JavaScript cannot read the JWT. Password login and Google OAuth both set the cookie, and `POST /auth/logout` clears it.

The booking service has no waiting queue. It atomically selects available ticket records, acquires Redis locks keyed as `ticket_lock:{ticketId}`, and creates a ten-minute pending booking. Locks include the booking id as their value, so only the owner can release them.
