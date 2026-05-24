import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Download } from 'lucide-react'
import { bookingService } from '@/services/bookingService'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { BOOKING_STATUSES, PAYMENT_STATUSES } from '@/constants'
import { useToast } from '@/store/ToastContext'

export function ManageBookingsPage() {
  const { toast } = useToast()
  const qc = useQueryClient()

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: bookingService.getAll,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, status, paymentStatus }: { id: string; status: string; paymentStatus?: string }) =>
      bookingService.updateStatus(id, status, paymentStatus),
    onSuccess: () => {
      toast('Booking updated')
      qc.invalidateQueries({ queryKey: ['bookings'] })
    },
  })

  const handleExport = async () => {
    try {
      const blob = await bookingService.exportCsv()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `bookings-${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      toast('CSV exported')
    } catch (e) {
      toast((e as Error).message, 'error')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Bookings</h1>
        <Button variant="secondary" size="sm" onClick={handleExport}>
          <Download size={16} /> Export CSV
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-64" />
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="py-2 text-left">Reference</th>
                <th>Customer</th>
                <th>Offer</th>
                <th>Slot</th>
                <th>People</th>
                <th>Status</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b dark:border-slate-800">
                  <td className="py-3 font-mono text-xs">{b.reference}</td>
                  <td>{b.customerName}<br /><span className="text-xs text-slate-500">{b.phoneNumber}</span></td>
                  <td>{b.offerTitle}</td>
                  <td>{b.slotDate} {b.slotStartTime}</td>
                  <td>{b.numberOfPeople}</td>
                  <td>
                    <select
                      value={b.status}
                      onChange={(e) => updateMutation.mutate({ id: b.id, status: e.target.value })}
                      className="rounded-lg border px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900"
                    >
                      {BOOKING_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      value={b.paymentStatus}
                      onChange={(e) => updateMutation.mutate({ id: b.id, status: b.status, paymentStatus: e.target.value })}
                      className="rounded-lg border px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900"
                    >
                      {PAYMENT_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && (
            <p className="py-8 text-center text-slate-500">No bookings yet.</p>
          )}
        </Card>
      )}
    </div>
  )
}
