# Smart Offer Slot Booking System

Production-grade full stack application for businesses to publish limited-time offers with slot-based booking — gyms, salons, restaurants, clinics, coaching centers, and more.

## Tech Stack

| Layer    | Technologies |
|----------|--------------|
| Frontend | React, TypeScript, Vite, Tailwind CSS, React Router, Axios, React Hook Form, Zod, TanStack Query, Lucide, Framer Motion, Recharts |
| Backend  | .NET 8 Web API, EF Core, PostgreSQL, JWT, FluentValidation, Swagger |
| Infra    | Docker, PostgreSQL |

## Features

### Admin
- JWT login & role-based routes
- Dashboard analytics (Recharts)
- Business profile CRUD
- Offer & slot management
- Booking status & payment updates
- CSV export

### Customer
- Browse & filter offers
- Offer detail + calendar slots
- Book with validation & coupons
- QR confirmation + cancel link
- Waitlist for full slots

### Bonus
- QR codes, countdown timers, waitlist
- Mock SMS/email notification logs
- Dark/light mode, responsive UI
- Coupon codes, payment status

## Quick Start

### Prerequisites

- Node.js 20+
- .NET 8 SDK
- Docker Desktop, or PostgreSQL 16 installed locally

### Environment

Copy the sample environment files before running locally:

```bash
cp .env.example .env
cp frontend/.env.example frontend/.env
```

Default local values are already provided for development.

### Run With Docker

```bash
docker compose up --build
```

Frontend: http://localhost:3000  
Backend Swagger: http://localhost:5000/swagger

### Run Locally

Start PostgreSQL first, then run:

```bash
cd backend/src/SmartOfferSlotBooking.Api
dotnet restore
dotnet run --urls http://localhost:5000
```

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173  
Backend Swagger: http://localhost:5000/swagger

**Demo login:** `admin@smartoffer.demo` / `Admin@123`

## Project Structure

```
├── backend/          # .NET 8 Web API (clean architecture)
├── frontend/         # React + Vite SPA
├── database/         # PostgreSQL schema SQL
├── docs/             # Architecture, API contract, ER diagram
├── docker-compose.yml
└── README.md
```

## API Documentation

- Swagger UI: http://localhost:5000/swagger
- Contract: [docs/API_CONTRACT.md](docs/API_CONTRACT.md)
- ER Diagram: [docs/ER_DIAGRAM.md](docs/ER_DIAGRAM.md)
- Database Schema: [database/schema.sql](database/schema.sql)

## Submission Checklist

- GitHub repository link: add your final repository URL here after pushing.
- README with setup steps: this file.
- Frontend screenshots: save under [docs/screenshots](docs/screenshots).
- Swagger screenshot: save as `docs/screenshots/swagger.png`.
- Database schema or ER diagram: [database/schema.sql](database/schema.sql) and [docs/ER_DIAGRAM.md](docs/ER_DIAGRAM.md).
- Demo video of 2-3 minutes: add the video link in [docs/SUBMISSION.md](docs/SUBMISSION.md).
- `.env.example` file: [.env.example](.env.example) and [frontend/.env.example](frontend/.env.example).

## Required Endpoints

| Method | Endpoint |
|--------|----------|
| POST | `/api/auth/login` |
| GET/POST/PUT | `/api/business` |
| CRUD | `/api/offers` |
| CRUD | `/api/slots`, `/api/offers/{id}/slots` |
| CRUD | `/api/bookings`, status, export, waitlist |
| GET | `/api/dashboard/summary` |
| GET | `/api/coupons/validate` |

## License

MIT — built for hackathons and production learning.
