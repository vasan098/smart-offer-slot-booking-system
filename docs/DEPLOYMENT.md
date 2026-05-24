# Deployment Guide

## Prerequisites

- .NET 8 SDK
- Node.js 20+
- PostgreSQL 16+ (or Docker)
- Optional: Docker Compose

## Local Development

### 1. Database

```bash
docker compose up postgres -d
# Or apply schema manually:
psql -U postgres -d smartoffer -f database/schema.sql
```

### 2. Backend

```bash
cd backend
dotnet restore
dotnet run --project src/SmartOfferSlotBooking.Api
```

API: http://localhost:5000  
Swagger: http://localhost:5000/swagger

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

App: http://localhost:5173

## Docker (Full Stack)

```bash
cp .env.example .env
docker compose up --build
```

| Service  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:3000      |
| API      | http://localhost:5000      |
| Swagger  | http://localhost:5000/swagger |
| Postgres | localhost:5432             |

## Production Checklist

1. Change `Jwt:Key` to a secure random 64+ char secret
2. Use `dotnet ef migrations` instead of `EnsureCreated` for schema
3. Enable HTTPS and HSTS on the API
4. Set `VITE_API_URL` to your production API URL at build time
5. Configure managed PostgreSQL (RDS, Azure Database, etc.)
6. Set `ASPNETCORE_ENVIRONMENT=Production`

## Demo Credentials

- **Email:** admin@smartoffer.demo
- **Password:** Admin@123

## Health Verification

1. `GET /api/offers` returns active offers
2. Login via `POST /api/auth/login`
3. `GET /api/dashboard/summary` with Bearer token
