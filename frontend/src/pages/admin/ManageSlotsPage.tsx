import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { offerService } from '@/services/offerService'
import { slotService } from '@/services/slotService'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/store/ToastContext'

export function ManageSlotsPage() {
  const { offerId } = useParams<{ offerId: string }>()
  const { toast } = useToast()
  const qc = useQueryClient()
  const [form, setForm] = useState({
    slotDate: '',
    startTime: '09:00',
    endTime: '10:00',
    capacity: 8,
    status: 'Available',
  })

  const { data: offer } = useQuery({
    queryKey: ['offer', offerId],
    queryFn: () => offerService.getById(offerId!),
  })

  const { data: slots = [] } = useQuery({
    queryKey: ['slots', offerId],
    queryFn: () => slotService.getByOffer(offerId!),
  })

  const createMutation = useMutation({
    mutationFn: () =>
      slotService.create({
        offerId,
        ...form,
      }),
    onSuccess: () => {
      toast('Slot created')
      qc.invalidateQueries({ queryKey: ['slots', offerId] })
    },
    onError: (e: Error) => toast(e.message, 'error'),
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Slots — {offer?.title}</h1>
      <Card>
        <h2 className="mb-4 font-semibold">Add Slot</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Input label="Date" type="date" value={form.slotDate} onChange={(e) => setForm({ ...form, slotDate: e.target.value })} />
          <Input label="Start" type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
          <Input label="End" type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
          <Input label="Capacity" type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} />
          <div className="flex items-end">
            <Button onClick={() => createMutation.mutate()} disabled={!form.slotDate}>
              Add
            </Button>
          </div>
        </div>
      </Card>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="py-2 text-left">Date</th>
                <th>Time</th>
                <th>Capacity</th>
                <th>Booked</th>
                <th>Available</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((s) => (
                <tr key={s.id} className="border-b dark:border-slate-800">
                  <td className="py-2">{s.slotDate}</td>
                  <td>{s.startTime}–{s.endTime}</td>
                  <td>{s.capacity}</td>
                  <td>{s.bookedCount}</td>
                  <td>{s.availableCount}</td>
                  <td>{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
