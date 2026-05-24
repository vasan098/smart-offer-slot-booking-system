import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'

export function CountdownTimer({ endDate }: { endDate: string }) {
  const [remaining, setRemaining] = useState('')

  useEffect(() => {
    const tick = () => {
      const end = new Date(endDate + 'T23:59:59').getTime()
      const diff = end - Date.now()
      if (diff <= 0) {
        setRemaining('Expired')
        return
      }
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setRemaining(`${d}d ${h}h ${m}m ${s}s`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [endDate])

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
      <Clock size={12} />
      {remaining}
    </span>
  )
}
