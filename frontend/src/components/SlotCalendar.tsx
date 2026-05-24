import { cn } from '@/utils/cn'
import type { Slot } from '@/types'

export function SlotCalendar({
  slots,
  selectedId,
  onSelect,
}: {
  slots: Slot[]
  selectedId?: string
  onSelect: (slot: Slot) => void
}) {
  const byDate = slots.reduce<Record<string, Slot[]>>((acc, s) => {
    ;(acc[s.slotDate] ??= []).push(s)
    return acc
  }, {})

  const dates = Object.keys(byDate).sort()

  if (!dates.length) {
    return (
      <p className="rounded-xl border border-dashed border-slate-300 bg-stone-50 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/60">
        No slots available. Check back soon or join the waitlist when full.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {dates.map((date) => (
        <div key={date}>
          <h4 className="mb-2 text-sm font-bold text-slate-800 dark:text-slate-100">
            {new Date(date + 'T00:00:00').toLocaleDateString(undefined, {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </h4>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {byDate[date].map((slot) => {
              const isFull = slot.status === 'Full' || slot.availableCount === 0
              const disabled = slot.status === 'Closed' || slot.status === 'Expired'
              return (
                <button
                  key={slot.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => onSelect(slot)}
                  className={cn(
                    'min-h-20 rounded-xl border p-3 text-left text-sm transition',
                    selectedId === slot.id
                      ? 'border-teal-600 bg-teal-50 ring-2 ring-teal-600/15 dark:bg-teal-950/40'
                      : 'border-slate-200 bg-white hover:border-teal-300 hover:bg-teal-50/50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800',
                    isFull && !disabled && 'border-amber-200 bg-amber-50/70 hover:border-amber-300 dark:border-amber-900/60 dark:bg-amber-950/20',
                    disabled && 'cursor-not-allowed opacity-45'
                  )}
                >
                  <div className="font-bold text-slate-900 dark:text-white">
                    {slot.startTime} – {slot.endTime}
                  </div>
                  <div className="mt-2 text-xs font-medium text-slate-500">
                    {isFull ? 'Join waitlist' : `${slot.availableCount} of ${slot.capacity} left`} · {slot.status}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
