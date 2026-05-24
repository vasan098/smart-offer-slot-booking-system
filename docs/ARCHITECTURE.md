# Smart Offer Slot Booking System — Architecture

## Folder Structure

```
smart-offer-slot-booking-system/
├── docker-compose.yml
├── .env.example
├── README.md
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API_CONTRACT.md
│   ├── IMPLEMENTATION_PLAN.md
│   ├── ER_DIAGRAM.md
│   └── DEPLOYMENT.md
├── database/
│   └── schema.sql
├── backend/
│   ├── SmartOfferSlotBooking.sln
│   └── src/SmartOfferSlotBooking.Api/
│       ├── Controllers/
│       ├── Services/Interfaces/
│       ├── Repositories/Interfaces/
│       ├── Data/
│       ├── Entities/
│       ├── DTOs/
│       ├── Validators/
│       ├── Mappings/
│       ├── Middleware/
│       └── Program.cs
└── frontend/
    └── src/
        ├── components/
        ├── pages/
        ├── layouts/
        ├── routes/
        ├── hooks/
        ├── services/
        ├── store/
        ├── types/
        ├── utils/
        └── constants/
```

## Backend Layers

| Layer | Responsibility |
|-------|----------------|
| Controllers | HTTP, auth attributes, status codes |
| Services | Business rules, orchestration |
| Repositories | EF Core data access |
| DTOs | API contracts |
| Validators | FluentValidation |
| Middleware | JWT, exceptions |
| Entities | Domain + EF mappings |

## Frontend Layers

| Layer | Responsibility |
|-------|----------------|
| pages | Route-level screens |
| components | Reusable UI (shadcn-style) |
| services | Axios API clients |
| hooks | TanStack Query wrappers |
| store | Auth + theme context |
| routes | Public vs protected routing |
