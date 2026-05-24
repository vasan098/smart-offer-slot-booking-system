import { api } from './api'
import type { Offer, OfferFilters } from '@/types'

export const offerService = {
  getAll: (filters?: OfferFilters) =>
    api.get<Offer[]>('/offers', { params: filters }).then((r) => r.data),
  getById: (id: string) => api.get<Offer>(`/offers/${id}`).then((r) => r.data),
  create: (data: Record<string, unknown>) => api.post<Offer>('/offers', data).then((r) => r.data),
  update: (id: string, data: Record<string, unknown>) =>
    api.put<Offer>(`/offers/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/offers/${id}`),
}
