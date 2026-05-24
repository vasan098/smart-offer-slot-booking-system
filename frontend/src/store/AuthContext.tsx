import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { TOKEN_KEY, ROLES } from '@/constants'
import { authService } from '@/services/authService'
import type { RegisterPayload, User } from '@/types'

interface AuthContextValue {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isAdmin: boolean
  isCustomer: boolean
  loginAdmin: (email: string, password: string) => Promise<User>
  loginUser: (email: string, password: string) => Promise<User>
  register: (data: RegisterPayload) => Promise<User>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function persistSession(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem('smartoffer_user', JSON.stringify(user))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem('smartoffer_user')
    return raw ? JSON.parse(raw) : null
  })

  const applySession = useCallback((res: { token: string; user: User }) => {
    persistSession(res.token, res.user)
    setToken(res.token)
    setUser(res.user)
    return res.user
  }, [])

  const loginAdmin = useCallback(
    async (email: string, password: string) => {
      const res = await authService.loginAdmin(email, password)
      return applySession(res)
    },
    [applySession]
  )

  const loginUser = useCallback(
    async (email: string, password: string) => {
      const res = await authService.loginUser(email, password)
      return applySession(res)
    },
    [applySession]
  )

  const register = useCallback(
    async (data: RegisterPayload) => {
      const res = await authService.register(data)
      return applySession(res)
    },
    [applySession]
  )

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem('smartoffer_user')
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token,
      isAdmin: user?.role === ROLES.Admin,
      isCustomer: user?.role === ROLES.Customer,
      loginAdmin,
      loginUser,
      register,
      logout,
    }),
    [user, token, loginAdmin, loginUser, register, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
