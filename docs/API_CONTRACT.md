# API Contract

Base URL: `http://localhost:5000/api`  
Auth: `Authorization: Bearer <jwt>`

## Auth

### POST /auth/login
```json
// Request
{ "email": "admin@demo.com", "password": "Admin@123" }

// Response 200
{
  "token": "eyJ...",
  "expiresAt": "2026-05-24T10:00:00Z",
  "user": { "id": "uuid", "email": "admin@demo.com", "role": "Admin" }
}
```

## Business (Admin)

### POST /business
### GET /business
### PUT /business/{id}

## Offers

### GET /offers (public + admin)
Query: `search`, `businessType`, `category`, `date`, `minPrice`, `maxPrice`, `availableOnly`, `status`

### GET /offers/{id}
### POST /offers (Admin)
### PUT /offers/{id} (Admin)
### DELETE /offers/{id} (Admin)

## Slots

### GET /slots?offerId=
### GET /offers/{offerId}/slots
### POST /slots (Admin)
### PUT /slots/{id} (Admin)
### DELETE /slots/{id} (Admin)

## Bookings

### POST /bookings (public)
```json
{
  "offerId": "uuid",
  "slotId": "uuid",
  "customerName": "Jane Doe",
  "phoneNumber": "+919876543210",
  "email": "jane@example.com",
  "numberOfPeople": 2,
  "specialNote": "Window seat",
  "couponCode": "SAVE10"
}
```

### GET /bookings (Admin)
### GET /bookings/{id}
### PUT /bookings/{id}/status (Admin)
### GET /bookings/export (Admin) — CSV
### POST /bookings/cancel/{cancellationToken} (public)

## Dashboard

### GET /dashboard/summary (Admin)

## Waitlist

### POST /waitlist
### GET /waitlist?slotId=

## Coupons

### POST /coupons (Admin)
### GET /coupons/validate?code=&offerId=

## Error Format
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": ["Offer price must be less than original price"]
}
```
