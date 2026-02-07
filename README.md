# Multi-Tenant AI Receptionist

A robust, white-label ready AI receptionist platform for SaaS.

## Features

- **Multi-Tenant Architecture**: Strict data isolation per tenant.
- **AI Receptionist**: Powered by OpenAI (GPT-5), handles conversations and booking.
- **Admin Dashboard**: For tenants to manage inbox, calendar, and settings.
- **Appointment Booking**: Integrated scheduling system.
- **Billing**: Stripe subscription schema ready.

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Database Setup**:
   ```bash
   npm run db:push
   ```

3. **Environment Variables**:
   Copy `.env.example` to `.env` (handled by Replit automatically for secrets, but useful for local dev).

4. **Run**:
   ```bash
   npm run dev
   ```

## Demo Login

- **Email**: `admin@demo.com`
- **Password**: `password123`

## Architecture

- `shared/schema.ts`: Single source of truth for database and API types.
- `server/routes.ts`: Backend API implementation.
- `client/`: React frontend (Admin Dashboard).
- `server/replit_integrations/`: AI modules.

## Deployment

Use the "Deploy" button in Replit to publish.
