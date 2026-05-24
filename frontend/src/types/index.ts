export interface User {
  id: string
  email: string
  role: string
  fullName?: string
  phoneNumber?: string
}

export interface LoginResponse {
  token: string
  expiresAt: string
  user: User
}

export interface RegisterPayload {
  email: string
  password: string
  fullName: string
  phoneNumber: string
}

export interface Business {
  id: string
  businessName: string
  businessType: string
  ownerName: string
  phoneNumber: string
  email: string
  address: string
  city: string
  logoUrl?: string
  openingTime: string
  closingTime: string
}

export interface Offer {
  id: string
  businessId: string
  businessName: string
  businessType: string
  title: string
  description: string
  category: string
  originalPrice: number
  offerPrice: number
  discountPercentage: number
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  totalCapacity: number
  maxBookingPerCustomer: number
  termsAndConditions?: string
  status: string
  availableSlots: number
  city?: string
  address?: string
}

export interface Slot {
  id: string
  offerId: string
  slotDate: string
  startTime: string
  endTime: string
  capacity: number
  bookedCount: number
  availableCount: number
  status: string
}

export interface Booking {
  id: string
  reference: string
  offerId: string
  offerTitle: string
  businessName: string
  slotId: string
  slotDate: string
  slotStartTime: string
  slotEndTime: string
  customerName: string
  phoneNumber: string
  email?: string
  numberOfPeople: number
  specialNote?: string
  status: string
  paymentStatus: string
  couponCode?: string
  qrCodeData?: string
  cancellationToken: string
  createdAt: string
}

export interface DashboardSummary {
  totalOffers: number
  activeOffers: number
  totalBookings: number
  todaysBookings: number
  totalCapacity: number
  bookedSeats: number
  availableSeats: number
  conversionRate: number
  recentBookings: Booking[]
  bookingStatusStats: Record<string, number>
  offerPerformance: { offerTitle: string; bookings: number; revenue: number }[]
}

export interface OfferFilters {
  search?: string
  businessType?: string
  category?: string
  date?: string
  minPrice?: number
  maxPrice?: number
  availableOnly?: boolean
}
