import { api } from './api'
import type { Slot } from '@/types'

export const slotService = {
  getByOffer: (offerId: string) =>
    api.get<Slot[]>(`/offers/${offerId}/slots`).then((r) => r.data),
  getAll: (offerId?: string) =>
    api.get<Slot[]>('/slots', { params: { offerId } }).then((r) => r.data),
  create: (data: Record<string, unknown>) => api.post<Slot>('/slots', data).then((r) => r.data),
  update: (id: string, data: Record<string, unknown>) =>
    api.put<Slot>(`/slots/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/slots/${id}`),
}
