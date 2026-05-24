import { useQuery } from '@tanstack/react-query'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Tag, CalendarCheck, Users, TrendingUp } from 'lucide-react'
import { dashboardService } from '@/services/dashboardService'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

type StatKey =
  | 'totalOffers'
  | 'activeOffers'
  | 'totalBookings'
  | 'todaysBookings'
  | 'totalCapacity'
  | 'bookedSeats'
  | 'availableSeats'
  | 'conversionRate'

const statCards: {
  key: StatKey
  label: string
  icon: typeof Tag
  suffix?: string
}[] = [
  { key: 'totalOffers', label: 'Total Offers', icon: Tag },
  { key: 'activeOffers', label: 'Active Offers', icon: Tag },
  { key: 'totalBookings', label: 'Total Bookings', icon: CalendarCheck },
  { key: 'todaysBookings', label: "Today's Bookings", icon: CalendarCheck },
  { key: 'totalCapacity', label: 'Total Capacity', icon: Users },
  { key: 'bookedSeats', label: 'Booked Seats', icon: Users },
  { key: 'availableSeats', label: 'Available Seats', icon: Users },
  { key: 'conversionRate', label: 'Conversion %', icon: TrendingUp, suffix: '%' },
]

export function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardService.getSummary,
  })

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
    )
  }

  if (error || !data) {
    return (
      <Card>
        <p className="text-red-500">{(error as Error)?.message || 'Failed to load dashboard'}</p>
        <p className="mt-2 text-sm text-slate-500">Create your business profile first.</p>
      </Card>
    )
  }

  const pieData = Object.entries(data.bookingStatusStats).map(([name, value]) => ({
    name,
    value,
  }))

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ key, label, icon: Icon, suffix }) => (
          <Card key={key} className="!p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">{label}</p>
                <p className="mt-1 text-2xl font-bold">
                  {data[key]}
                  {suffix ?? ''}
                </p>
              </div>
              <Icon className="text-indigo-500 opacity-60" size={24} />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-semibold">Offer Performance</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.offerPerformance}>
              <XAxis dataKey="offerTitle" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h2 className="mb-4 font-semibold">Booking Status</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <h2 className="mb-4 font-semibold">Recent Bookings</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="py-2">Ref</th>
                <th>Customer</th>
                <th>Offer</th>
                <th>Date</th>
                <th>Status</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {data.recentBookings.map((b) => (
                <tr key={b.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-3 font-mono text-xs">{b.reference}</td>
                  <td>{b.customerName}</td>
                  <td>{b.offerTitle}</td>
                  <td>{b.slotDate}</td>
                  <td>{b.status}</td>
                  <td>{b.paymentStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
