import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { CalendarCheck2, CheckCircle, Download, TicketCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { bookingService } from '@/services/bookingService'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'

export function BookingConfirmationPage() {
  const { reference } = useParams<{ reference: string }>()

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking-ref', reference],
    queryFn: () => bookingService.getByReference(reference!),
    enabled: !!reference,
  })

  if (isLoading) return <Skeleton className="mx-auto mt-16 h-96 max-w-lg" />
  if (!booking) return <p className="p-8 text-center">Booking not found</p>

  const cancelUrl = `${window.location.origin}/cancel/${booking.cancellationToken}`

  return (
    <div className="surface-grid min-h-screen px-4 py-16">
      <div className="mx-auto max-w-2xl">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <Card className="overflow-hidden p-0">
          <div className="bg-gradient-to-br from-slate-950 via-teal-900 to-indigo-800 p-8 text-center text-white">
          <CheckCircle className="mx-auto text-emerald-300" size={60} />
          <h1 className="mt-4 text-3xl font-black">Booking confirmed</h1>
          <p className="mt-2 text-slate-200">Reference: <strong className="text-white">{booking.reference}</strong></p>
          </div>

          <div className="p-6 text-center md:p-8">
          {booking.qrCodeData && (
            <div className="mt-6 flex justify-center">
              <img
                src={`data:image/png;base64,${booking.qrCodeData}`}
                alt="Booking QR Code"
                className="h-44 w-44 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
              />
            </div>
          )}

          <dl className="mt-8 space-y-3 rounded-2xl bg-stone-50 p-4 text-left text-sm dark:bg-slate-800/60">
            <div className="flex justify-between gap-4 border-b border-slate-200 py-2 dark:border-slate-700">
              <dt className="text-slate-500">Offer</dt>
              <dd className="text-right font-semibold">{booking.offerTitle}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-slate-200 py-2 dark:border-slate-700">
              <dt className="text-slate-500">Business</dt>
              <dd className="text-right font-semibold">{booking.businessName}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-slate-200 py-2 dark:border-slate-700">
              <dt className="text-slate-500">Slot</dt>
              <dd className="text-right font-medium">
                {booking.slotDate} · {booking.slotStartTime}–{booking.slotEndTime}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-slate-200 py-2 dark:border-slate-700">
              <dt className="text-slate-500">Customer</dt>
              <dd className="text-right font-medium">{booking.customerName}</dd>
            </div>
            <div className="flex justify-between gap-4 py-2">
              <dt className="text-slate-500">Status</dt>
              <dd>
                <span className="rounded-full bg-teal-100 px-2.5 py-1 font-semibold text-teal-700 dark:bg-teal-900 dark:text-teal-300">
                  {booking.status}
                </span>
                <span className="ml-2 rounded-full bg-white px-2.5 py-1 text-xs font-medium dark:bg-slate-900">
                  {booking.paymentStatus}
                </span>
              </dd>
            </div>
          </dl>

          <div className="mt-6 grid gap-3 text-left sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <CalendarCheck2 className="text-teal-700" size={20} />
              <p className="mt-2 text-sm font-semibold">Arrive on time</p>
              <p className="text-xs text-slate-500">Show the QR code at the venue.</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <TicketCheck className="text-indigo-700" size={20} />
              <p className="mt-2 text-sm font-semibold">Keep this reference</p>
              <p className="text-xs text-slate-500">Use it for booking support.</p>
            </div>
          </div>

          <p className="mt-6 break-all text-xs text-slate-500">
            Cancel anytime:{' '}
            <a href={cancelUrl} className="text-indigo-600 underline">
              {cancelUrl}
            </a>
          </p>

          <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link to="/">
              <Button variant="secondary">Browse More Offers</Button>
            </Link>
            <Button
              variant="ghost"
              onClick={() => window.print()}
            >
              <Download size={16} /> Print
            </Button>
          </div>
          </div>
        </Card>
      </motion.div>
      </div>
    </div>
  )
}
