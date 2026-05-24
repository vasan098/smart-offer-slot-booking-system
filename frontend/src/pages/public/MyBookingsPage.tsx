import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Calendar, ExternalLink } from 'lucide-react'
import { bookingService } from '@/services/bookingService'
import { useAuth } from '@/store/AuthContext'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'

export function MyBookingsPage() {
  const { user, logout } = useAuth()

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => bookingService.getMyBookings(),
  })

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Bookings</h1>
          <p className="text-slate-500">
            {user?.fullName || user?.email} · {user?.phoneNumber}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/">
            <Button variant="secondary" size="sm">
              Browse Offers
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={logout}>
            Sign Out
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <Card className="text-center">
          <Calendar className="mx-auto text-slate-300" size={48} />
          <p className="mt-4 text-slate-500">No bookings yet.</p>
          <Link to="/" className="mt-4 inline-block">
            <Button>Find Offers</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <Card key={b.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-mono text-xs text-indigo-600">{b.reference}</p>
                <h3 className="mt-1 font-semibold">{b.offerTitle}</h3>
                <p className="text-sm text-slate-500">{b.businessName}</p>
                <p className="mt-2 text-sm">
                  {b.slotDate} · {b.slotStartTime}–{b.slotEndTime} · {b.numberOfPeople} guest(s)
                </p>
                <div className="mt-2 flex gap-2">
                  <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                    {b.status}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs dark:bg-slate-800">
                    {b.paymentStatus}
                  </span>
                </div>
              </div>
              <Link to={`/booking/confirmation/${b.reference}`}>
                <Button variant="secondary" size="sm">
                  <ExternalLink size={14} /> View
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
