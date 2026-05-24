import { api } from './api'
import type { Booking } from '@/types'

export const bookingService = {
  create: (data: Record<string, unknown>) =>
    api.post<Booking>('/bookings', data).then((r) => r.data),
  getMyBookings: () => api.get<Booking[]>('/bookings/my').then((r) => r.data),
  getAll: () => api.get<Booking[]>('/bookings').then((r) => r.data),
  getById: (id: string) => api.get<Booking>(`/bookings/${id}`).then((r) => r.data),
  getByReference: (reference: string) =>
    api.get<Booking>(`/bookings/reference/${reference}`).then((r) => r.data),
  updateStatus: (id: string, status: string, paymentStatus?: string) =>
    api.put<Booking>(`/bookings/${id}/status`, { status, paymentStatus }).then((r) => r.data),
  cancel: (token: string) =>
    api.post<Booking>(`/bookings/cancel/${token}`).then((r) => r.data),
  exportCsv: () =>
    api.get('/bookings/export', { responseType: 'blob' }).then((r) => r.data),
  joinWaitlist: (data: Record<string, unknown>) =>
    api.post('/bookings/waitlist', data).then((r) => r.data),
  validateCoupon: (code: string, offerId?: string) =>
    api
      .get<{ valid: boolean; message: string }>('/coupons/validate', {
        params: { code, offerId },
      })
      .then((r) => r.data),
}
