import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { offerService } from '@/services/offerService'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { useToast } from '@/store/ToastContext'

export function ManageOffersPage() {
  const { toast } = useToast()
  const qc = useQueryClient()

  const { data: offers = [], isLoading } = useQuery({
    queryKey: ['admin-offers'],
    queryFn: () => offerService.getAll({}),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => offerService.remove(id),
    onSuccess: () => {
      toast('Offer deleted')
      qc.invalidateQueries({ queryKey: ['admin-offers'] })
    },
    onError: (e: Error) => toast(e.message, 'error'),
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Offers</h1>
        <Link to="/admin/offers/new">
          <Button size="sm">
            <Plus size={16} /> New Offer
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <Skeleton className="h-48" />
      ) : offers.length === 0 ? (
        <Card className="text-center text-slate-500">No offers yet. Create your first offer.</Card>
      ) : (
        <div className="space-y-4">
          {offers.map((o) => (
            <Card key={o.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold">{o.title}</h3>
                <p className="text-sm text-slate-500">
                  ₹{o.offerPrice} · {o.status} · {o.availableSlots} slots
                </p>
              </div>
              <div className="flex gap-2">
                <Link to={`/admin/offers/${o.id}/edit`}>
                  <Button variant="secondary" size="sm">
                    <Pencil size={14} /> Edit
                  </Button>
                </Link>
                <Link to={`/admin/offers/${o.id}/slots`}>
                  <Button variant="ghost" size="sm">
                    Slots
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    if (confirm('Delete this offer?')) deleteMutation.mutate(o.id)
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
