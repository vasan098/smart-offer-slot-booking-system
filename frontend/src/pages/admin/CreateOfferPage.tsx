import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { offerService } from '@/services/offerService'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { OFFER_STATUSES, CATEGORIES } from '@/constants'
import { useToast } from '@/store/ToastContext'

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string(),
  originalPrice: z.number().positive(),
  offerPrice: z.number().positive(),
  startDate: z.string(),
  endDate: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  totalCapacity: z.number().positive(),
  maxBookingPerCustomer: z.number().positive(),
  termsAndConditions: z.string().optional(),
  status: z.string(),
})

type FormData = z.infer<typeof schema>

export function CreateOfferPage() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const { toast } = useToast()

  const { data: existing } = useQuery({
    queryKey: ['offer', id],
    queryFn: () => offerService.getById(id!),
    enabled: isEdit,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: 'Draft',
      category: 'Fitness',
      maxBookingPerCustomer: 2,
      startTime: '09:00',
      endTime: '18:00',
    },
  })

  useEffect(() => {
    if (existing) {
      reset({
        title: existing.title,
        description: existing.description,
        category: existing.category,
        originalPrice: existing.originalPrice,
        offerPrice: existing.offerPrice,
        startDate: existing.startDate,
        endDate: existing.endDate,
        startTime: existing.startTime,
        endTime: existing.endTime,
        totalCapacity: existing.totalCapacity,
        maxBookingPerCustomer: existing.maxBookingPerCustomer,
        termsAndConditions: existing.termsAndConditions,
        status: existing.status,
      })
    }
  }, [existing, reset])

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      isEdit ? offerService.update(id!, data as Record<string, unknown>) : offerService.create(data as Record<string, unknown>),
    onSuccess: () => {
      toast(isEdit ? 'Offer updated' : 'Offer created')
      navigate('/admin/offers')
    },
    onError: (e: Error) => toast(e.message, 'error'),
  })

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">{isEdit ? 'Edit Offer' : 'Create Offer'}</h1>
      <Card>
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
          <Input label="Title" error={errors.title?.message} {...register('title')} />
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              className="mt-1 w-full rounded-xl border border-slate-200 p-3 dark:border-slate-700 dark:bg-slate-900"
              rows={4}
              {...register('description')}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Category</label>
              <select className="mt-1 w-full rounded-xl border px-3 py-2 dark:border-slate-700 dark:bg-slate-900" {...register('category')}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <select className="mt-1 w-full rounded-xl border px-3 py-2 dark:border-slate-700 dark:bg-slate-900" {...register('status')}>
                {OFFER_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Original Price ₹" type="number" error={errors.originalPrice?.message} {...register('originalPrice')} />
            <Input label="Offer Price ₹" type="number" error={errors.offerPrice?.message} {...register('offerPrice')} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Start Date" type="date" {...register('startDate')} />
            <Input label="End Date" type="date" {...register('endDate')} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Start Time" type="time" {...register('startTime')} />
            <Input label="End Time" type="time" {...register('endTime')} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Total Capacity" type="number" {...register('totalCapacity')} />
            <Input label="Max per Customer" type="number" {...register('maxBookingPerCustomer')} />
          </div>
          <Input label="Terms & Conditions" {...register('termsAndConditions')} />
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving...' : isEdit ? 'Update Offer' : 'Create Offer'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
