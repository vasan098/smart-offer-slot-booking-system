import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation } from '@tanstack/react-query'
import { businessService } from '@/services/businessService'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { BUSINESS_TYPES } from '@/constants'
import { useToast } from '@/store/ToastContext'

const schema = z.object({
  businessName: z.string().min(2),
  businessType: z.string(),
  ownerName: z.string().min(2),
  phoneNumber: z.string().min(8),
  email: z.string().email(),
  address: z.string().min(5),
  city: z.string().min(2),
  logoUrl: z.string().optional(),
  openingTime: z.string(),
  closingTime: z.string(),
})

type FormData = z.infer<typeof schema>

export function BusinessProfilePage() {
  const { toast } = useToast()

  const { data: business, isError } = useQuery({
    queryKey: ['business'],
    queryFn: businessService.get,
    retry: false,
  })

  const { register, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      businessType: 'Gym',
      openingTime: '09:00',
      closingTime: '21:00',
    },
  })

  useEffect(() => {
    if (business) reset(business as FormData)
  }, [business, reset])

  const saveMutation = useMutation({
    mutationFn: (data: FormData) =>
      business
        ? businessService.update(business.id, data as Record<string, unknown>)
        : businessService.create(data as Record<string, unknown>),
    onSuccess: () => toast('Business profile saved'),
    onError: (e: Error) => toast(e.message, 'error'),
  })

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Business Profile</h1>
      {isError && !business && (
        <p className="text-sm text-amber-600">No profile yet — fill the form to create one.</p>
      )}
      <Card>
        <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))} className="space-y-4">
          <Input label="Business Name" {...register('businessName')} />
          <div>
            <label className="text-sm font-medium">Business Type</label>
            <select className="mt-1 w-full rounded-xl border px-3 py-2 dark:border-slate-700 dark:bg-slate-900" {...register('businessType')}>
              {BUSINESS_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <Input label="Owner Name" {...register('ownerName')} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Phone" {...register('phoneNumber')} />
            <Input label="Email" {...register('email')} />
          </div>
          <Input label="Address" {...register('address')} />
          <Input label="City" {...register('city')} />
          <Input label="Logo URL" {...register('logoUrl')} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Opening Time" type="time" {...register('openingTime')} />
            <Input label="Closing Time" type="time" {...register('closingTime')} />
          </div>
          <Button type="submit" disabled={saveMutation.isPending}>
            {business ? 'Update Profile' : 'Create Profile'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
