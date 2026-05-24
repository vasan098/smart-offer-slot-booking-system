import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Tag,
  ClipboardList,
  Building2,
  LogOut,
  Moon,
  Sun,
} from 'lucide-react'
import { useAuth } from '@/store/AuthContext'
import { useTheme } from '@/store/ThemeContext'
import { Button } from '@/components/ui/Button'

const nav = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/offers', icon: Tag, label: 'Offers' },
  { to: '/admin/offers/new', icon: Tag, label: 'Create Offer' },
  { to: '/admin/bookings', icon: ClipboardList, label: 'Bookings' },
  { to: '/admin/business', icon: Building2, label: 'Business' },
]

export function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { theme, toggle } = useTheme()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/80 md:flex">
        <div className="mb-8 text-lg font-bold text-indigo-600">SmartOffer Admin</div>
        <nav className="flex flex-1 flex-col gap-1">
          {nav.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="flex gap-2">
          <button onClick={toggle} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </Button>
        </div>
      </aside>
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3 md:hidden dark:border-slate-800">
          <span className="font-bold text-indigo-600">Admin</span>
          <div className="flex gap-2">
            <Link to="/admin/offers" className="text-sm">
              Offers
            </Link>
            <button onClick={handleLogout}>
              <LogOut size={18} />
            </button>
          </div>
        </header>
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
