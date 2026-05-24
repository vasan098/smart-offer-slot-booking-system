import { useParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { bookingService } from '@/services/bookingService'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/store/ToastContext'

export function CancelBookingPage() {
  const { token } = useParams<{ token: string }>()
  const { toast } = useToast()

  const mutation = useMutation({
    mutationFn: () => bookingService.cancel(token!),
    onSuccess: () => toast('Booking cancelled successfully'),
    onError: (e: Error) => toast(e.message, 'error'),
  })

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Card className="text-center">
        <h1 className="text-xl font-bold">Cancel Booking</h1>
        <p className="mt-2 text-sm text-slate-500">
          This action cannot be undone. Your slot will be released.
        </p>
        <Button
          variant="danger"
          className="mt-6 w-full"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Cancelling...' : 'Confirm Cancellation'}
        </Button>
        {mutation.isSuccess && (
          <p className="mt-4 text-sm text-emerald-600">
            Cancelled. Reference: {mutation.data.reference}
          </p>
        )}
      </Card>
    </div>
  )
}
