# Implementation Plan

## Phase 1 — Foundation ✅
1. Folder structure, schema SQL, ER diagram, API contract
2. Docker Compose (PostgreSQL + API + frontend)
3. .env.example

## Phase 2 — Backend
1. Entities + DbContext + migrations seed
2. Repositories (generic + specialized)
3. Services (auth, business, offers, slots, bookings, dashboard, waitlist, coupons)
4. FluentValidation + AutoMapper
5. JWT middleware + global exception handler
6. Controllers + Swagger

## Phase 3 — Frontend
1. Vite scaffold, Tailwind, shadcn-style components
2. Auth store, API client, TanStack Query
3. Public: listing, detail, booking, confirmation, cancel link
4. Admin: login, dashboard, offers, slots, bookings, business profile
5. Bonus: QR, countdown, waitlist, calendar, dark mode, CSV export

## Phase 4 — Integration
1. CORS, seed data, E2E smoke paths
2. README + deployment guide

## Module Order
| # | Module | Depends on |
|---|--------|------------|
| 1 | Database schema | — |
| 2 | Auth + Users | schema |
| 3 | Business profile | auth |
| 4 | Offers CRUD | business |
| 5 | Slots CRUD | offers |
| 6 | Public listing API | offers + slots |
| 7 | Bookings + rules | slots |
| 8 | Dashboard analytics | bookings |
| 9 | Waitlist + coupons | bookings |
| 10 | Frontend shell | API |
| 11 | Admin UI | shell + auth |
| 12 | Customer UI | public API |
| 13 | Docker + docs | all |
