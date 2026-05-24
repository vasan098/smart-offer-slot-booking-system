import { api } from './api'
import type { Business } from '@/types'

export const businessService = {
  get: () => api.get<Business>('/business').then((r) => r.data),
  create: (data: Record<string, unknown>) =>
    api.post<Business>('/business', data).then((r) => r.data),
  update: (id: string, data: Record<string, unknown>) =>
    api.put<Business>(`/business/${id}`, data).then((r) => r.data),
}
