import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, BadgePercent, CalendarCheck2, MapPin, ShieldCheck, Users } from 'lucide-react'
import { offerService } from '@/services/offerService'
import { slotService } from '@/services/slotService'
import { bookingService } from '@/services/bookingService'
import { SlotCalendar } from '@/components/SlotCalendar'
import { CountdownTimer } from '@/components/CountdownTimer'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'
import { useToast } from '@/store/ToastContext'
import { useAuth } from '@/store/AuthContext'
import type { Slot } from '@/types'

const schema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  phoneNumber: z.string().min(8, 'Valid phone required'),
  email: z.string().email().optional().or(z.literal('')),
  numberOfPeople: z.number().min(1),
  specialNote: z.string().optional(),
  couponCode: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export function OfferDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user, isCustomer } = useAuth()
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [waitlistMode, setWaitlistMode] = useState(false)

  const { data: offer, isLoading } = useQuery({
    queryKey: ['offer', id],
    queryFn: () => offerService.getById(id!),
    enabled: !!id,
  })

  const { data: slots = [] } = useQuery({
    queryKey: ['slots', id],
    queryFn: () => slotService.getByOffer(id!),
    enabled: !!id,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { numberOfPeople: 1 } })

  useEffect(() => {
    if (isCustomer && user) {
      reset({
        customerName: user.fullName || '',
        phoneNumber: user.phoneNumber || '',
        email: user.email || '',
        numberOfPeople: 1,
      })
    }
  }, [isCustomer, user, reset])

  const bookingMutation = useMutation({
    mutationFn: (data: FormData) =>
      bookingService.create({
        offerId: id,
        slotId: selectedSlot!.id,
        customerName: data.customerName,
        phoneNumber: data.phoneNumber,
        email: data.email || undefined,
        numberOfPeople: data.numberOfPeople,
        specialNote: data.specialNote,
        couponCode: data.couponCode,
      }),
    onSuccess: (booking) => navigate(`/booking/confirmation/${booking.reference}`),
    onError: (e: Error) => toast(e.message, 'error'),
  })

  const waitlistMutation = useMutation({
    mutationFn: (data: FormData) =>
      bookingService.joinWaitlist({
        slotId: selectedSlot!.id,
        customerName: data.customerName,
        phoneNumber: data.phoneNumber,
        email: data.email,
        numberOfPeople: data.numberOfPeople,
      }),
    onSuccess: () => {
      toast('Added to waitlist! We will notify you when a slot opens.')
      setWaitlistMode(false)
    },
    onError: (e: Error) => toast(e.message, 'error'),
  })

  const onSubmit = (data: FormData) => {
    if (!selectedSlot) {
      toast('Please select a slot', 'error')
      return
    }
    if (waitlistMode || selectedSlot.status === 'Full') {
      waitlistMutation.mutate(data)
    } else {
      bookingMutation.mutate(data)
    }
  }

  if (isLoading) return <div className="p-8"><Skeleton className="h-96 max-w-4xl mx-auto" /></div>
  if (!offer) return <p className="p-8 text-center">Offer not found</p>

  return (
    <div className="surface-grid min-h-screen px-4 py-8">
      <div className="mx-auto max-w-6xl">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-teal-700">
        <ArrowLeft size={16} /> Back
      </button>
      <div className="grid gap-8 lg:grid-cols-[1fr_440px]">
        <div className="space-y-6">
        <Card className="overflow-hidden p-0">
          <div className="bg-gradient-to-br from-slate-950 via-teal-900 to-indigo-800 p-6 text-white md:p-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-sm font-semibold ring-1 ring-white/20">
              <BadgePercent size={15} /> {offer.discountPercentage.toFixed(0)}% off today
            </span>
            <p className="mt-5 text-sm font-medium text-teal-100">{offer.businessName}</p>
            <h1 className="mt-2 max-w-3xl text-3xl font-black leading-tight md:text-5xl">{offer.title}</h1>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-100">
              <span className="rounded-full bg-white/12 px-3 py-1">{offer.category}</span>
              <span className="rounded-full bg-white/12 px-3 py-1">{offer.businessType}</span>
              {offer.city && <span className="rounded-full bg-white/12 px-3 py-1">{offer.city}</span>}
            </div>
          </div>
          <div className="p-6 md:p-8">
          <p className="text-base leading-7 text-slate-600 dark:text-slate-400">{offer.description}</p>
          <div className="mt-6 flex flex-wrap items-end gap-3">
            <span className="text-4xl font-black text-teal-700 dark:text-teal-300">₹{offer.offerPrice}</span>
            <span className="text-lg text-slate-400 line-through">₹{offer.originalPrice}</span>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">Save ₹{offer.originalPrice - offer.offerPrice}</span>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-stone-50 p-4 dark:bg-slate-800/60">
              <CalendarCheck2 className="text-teal-600" size={20} />
              <p className="mt-2 text-xs text-slate-500">Offer ends</p>
              <CountdownTimer endDate={offer.endDate} />
            </div>
            <div className="rounded-xl bg-stone-50 p-4 dark:bg-slate-800/60">
              <Users className="text-indigo-600" size={20} />
              <p className="mt-2 text-xs text-slate-500">Availability</p>
              <p className="font-semibold">{offer.availableSlots} slots left</p>
            </div>
            <div className="rounded-xl bg-stone-50 p-4 dark:bg-slate-800/60">
              <ShieldCheck className="text-emerald-600" size={20} />
              <p className="mt-2 text-xs text-slate-500">Booking</p>
              <p className="font-semibold">Instant confirm</p>
            </div>
          </div>
          <div className="mt-4 hidden flex-wrap gap-3">
            <CountdownTimer endDate={offer.endDate} />
            <span className="text-sm text-slate-500">{offer.availableSlots} slots available</span>
          </div>
          {offer.address && (
            <p className="mt-4 flex items-start gap-2 text-sm text-slate-600">
              <MapPin size={18} className="mt-0.5 shrink-0 text-teal-700" />
              {offer.address}, {offer.city}
            </p>
          )}
          {offer.termsAndConditions && (
            <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm dark:bg-slate-800/50">
              <h3 className="font-semibold">Terms & Conditions</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">{offer.termsAndConditions}</p>
            </div>
          )}
          </div>
        </Card>
        </div>

        <Card className="h-fit lg:sticky lg:top-6">
          <h2 className="text-2xl font-black">Book your slot</h2>
          <p className="mt-1 text-sm text-slate-500">Choose a time, add your details, and confirm in one step.</p>
          <div className="mt-4">
            <SlotCalendar
              slots={slots}
              selectedId={selectedSlot?.id}
              onSelect={(s) => {
                setSelectedSlot(s)
                setWaitlistMode(s.status === 'Full')
              }}
            />
          </div>
          {selectedSlot?.status === 'Full' && (
            <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-200">Slot full — submit form to join waitlist.</p>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <Input label="Full Name" error={errors.customerName?.message} {...register('customerName')} />
            <Input label="Phone" error={errors.phoneNumber?.message} {...register('phoneNumber')} />
            <Input label="Email (optional)" error={errors.email?.message} {...register('email')} />
            <Input
              label="Number of People"
              type="number"
              error={errors.numberOfPeople?.message}
              {...register('numberOfPeople')}
            />
            <Input label="Coupon Code" {...register('couponCode')} />
            <Input label="Special Note" {...register('specialNote')} />
            <Button
              type="submit"
              className="h-12 w-full bg-teal-700 text-base shadow-teal-700/25 hover:bg-teal-800"
              disabled={bookingMutation.isPending || waitlistMutation.isPending}
            >
              {waitlistMode ? 'Join Waitlist' : 'Confirm Booking'}
            </Button>
          </form>
        </Card>
      </div>
      </div>
    </div>
  )
}
