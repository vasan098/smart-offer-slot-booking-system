import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/store/AuthContext'
import { ROLES } from '@/constants'

type Role = (typeof ROLES)[keyof typeof ROLES]

export function ProtectedRoute({
  children,
  allowedRoles,
  loginPath = '/admin/login',
}: {
  children: React.ReactNode
  allowedRoles: Role[]
  loginPath?: string
}) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={loginPath} state={{ from: location }} replace />
  }

  if (user && !allowedRoles.includes(user.role as Role)) {
    const redirect =
      user.role === ROLES.Admin ? '/admin' : user.role === ROLES.Customer ? '/account' : '/'
    return <Navigate to={redirect} replace />
  }

  return <>{children}</>
}
