import { Link, Outlet } from 'react-router-dom'
import { Moon, Sun, Sparkles, User } from 'lucide-react'
import { useTheme } from '@/store/ThemeContext'
import { useAuth } from '@/store/AuthContext'
import { ROLES } from '@/constants'
import { Button } from '@/components/ui/Button'

export function PublicLayout() {
  const { theme, toggle } = useTheme()
  const { isAuthenticated, isCustomer, isAdmin, user, logout } = useAuth()

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-white/70 backdrop-blur-xl dark:bg-slate-950/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2 font-bold text-indigo-600">
            <Sparkles className="text-purple-500" />
            SmartOffer
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link to="/" className="hidden text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-300 sm:block">
              Offers
            </Link>

            {isCustomer ? (
              <>
                <Link to="/account">
                  <Button variant="secondary" size="sm">
                    <User size={16} /> My Bookings
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Sign Out
                </Button>
              </>
            ) : isAdmin ? (
              <Link to="/admin">
                <Button variant="secondary" size="sm">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="secondary" size="sm">
                  Sign In
                </Button>
              </Link>
            )}

            {!isAdmin && (
              <Link to="/admin/login" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  Admin
                </Button>
              </Link>
            )}

            {isAuthenticated && user?.role === ROLES.Admin && (
              <span className="hidden text-xs text-slate-400 md:inline">{user.email}</span>
            )}

            <button
              onClick={toggle}
              className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="mt-16 border-t border-slate-200 py-8 text-center text-sm text-slate-500 dark:border-slate-800">
        © {new Date().getFullYear()} Smart Offer Slot Booking System
      </footer>
    </div>
  )
}
