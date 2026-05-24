# Required Screens — Route Map

Base URL (local dev): **http://localhost:5173**

## Customer (Public)

| # | Screen | Route | Component |
|---|--------|-------|-----------|
| 6 | Public Offer Listing | `/` | `pages/public/OfferListingPage.tsx` |
| 7 | Public Offer Detail | `/offers/:id` | `pages/public/OfferDetailPage.tsx` |
| 8 | Booking Confirmation | `/booking/confirmation/:reference` | `pages/public/BookingConfirmationPage.tsx` |

## Admin

| # | Screen | Route | Component |
|---|--------|-------|-----------|
| 1 | Admin Login | `/admin/login` | `pages/admin/AdminLoginPage.tsx` |
| 2 | Admin Dashboard | `/admin` | `pages/admin/DashboardPage.tsx` |
| 3 | Create Offer | `/admin/offers/new` | `pages/admin/CreateOfferPage.tsx` |
| 4 | Manage Offers | `/admin/offers` | `pages/admin/ManageOffersPage.tsx` |
| 5 | Manage Bookings | `/admin/bookings` | `pages/admin/ManageBookingsPage.tsx` |

**Demo admin:** `admin@smartoffer.demo` / `Admin@123`

## Sample URLs (seed data)

- Listing: http://localhost:5173/
- Offer detail: http://localhost:5173/offers/{offerId}
- After booking: http://localhost:5173/booking/confirmation/{reference}

## Happy-path demo flow

1. Open `/` → browse & filter offers  
2. Click **Book Now** → `/offers/:id`  
3. Pick slot, fill form → submit  
4. Redirect to confirmation with QR + reference  
5. `/admin/login` → sign in  
6. `/admin` → dashboard stats & charts  
7. `/admin/offers/new` → create offer  
8. `/admin/offers` → edit/delete offers  
9. `/admin/bookings` → update status, export CSV  
