export const BUSINESS_TYPES = [
  'Restaurant',
  'Gym',
  'Salon',
  'Clinic',
  'Coaching',
  'Turf',
  'Other',
] as const

export const OFFER_STATUSES = ['Draft', 'Active', 'Paused', 'Expired', 'Cancelled'] as const

export const BOOKING_STATUSES = ['Pending', 'Confirmed', 'Cancelled', 'Completed', 'NoShow'] as const

export const PAYMENT_STATUSES = ['Unpaid', 'Paid', 'Refunded', 'Failed'] as const

export const CATEGORIES = [
  'Fitness',
  'Wellness',
  'Food',
  'Beauty',
  'Sports',
  'Education',
  'Healthcare',
  'Entertainment',
] as const

export const ROLES = {
  Admin: 'Admin',
  Customer: 'Customer',
} as const

export const API_BASE = import.meta.env.VITE_API_URL || '/api'

export const TOKEN_KEY = 'smartoffer_token'
export const THEME_KEY = 'smartoffer_theme'
