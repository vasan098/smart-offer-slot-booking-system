import { api } from './api'
import type { LoginResponse, RegisterPayload } from '@/types'

export const authService = {
  loginAdmin: (email: string, password: string) =>
    api.post<LoginResponse>('/auth/admin/login', { email, password }).then((r) => r.data),

  loginUser: (email: string, password: string) =>
    api.post<LoginResponse>('/auth/user/login', { email, password }).then((r) => r.data),

  register: (data: RegisterPayload) =>
    api.post<LoginResponse>('/auth/register', data).then((r) => r.data),
}
