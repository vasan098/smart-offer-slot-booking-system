import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Clock3, MapPin, Tag, TicketPercent } from 'lucide-react'
import type { Offer } from '@/types'
import { CountdownTimer } from './CountdownTimer'
import { Button } from './ui/Button'

export function OfferCard({ offer }: { offer: Offer }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="group flex min-h-[320px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-2xl hover:shadow-teal-900/10 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex h-28 items-end justify-between bg-gradient-to-br from-slate-900 via-teal-800 to-indigo-700 p-5 text-white">
        <div>
          <p className="text-xs font-semibold uppercase text-teal-100">{offer.businessType}</p>
          <p className="mt-1 text-sm text-white/80">{offer.businessName}</p>
        </div>
        <span className="rounded-full bg-amber-300 px-3 py-1 text-sm font-black text-slate-950">
          {offer.discountPercentage.toFixed(0)}% off
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3">
          <div>
            <h3 className="line-clamp-2 text-lg font-bold text-slate-950 dark:text-white">
              {offer.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
              {offer.description}
            </p>
          </div>
        </div>
        <div className="mb-4 flex flex-wrap gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800">
            <Tag size={12} /> {offer.category}
          </span>
          {offer.city && (
            <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800">
              <MapPin size={12} /> {offer.city}
            </span>
          )}
        </div>
        <div className="mb-4 rounded-xl bg-stone-50 p-3 dark:bg-slate-800/70">
          <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-teal-700 dark:text-teal-300">
            ₹{offer.offerPrice}
          </span>
          <span className="text-sm text-slate-400 line-through">₹{offer.originalPrice}</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <Clock3 size={13} />
            <CountdownTimer endDate={offer.endDate} />
          </div>
        </div>
        <div className="mb-4 flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
            <TicketPercent size={16} className="text-amber-500" />
            {offer.availableSlots} slots left
          </span>
          <span className="text-xs text-slate-500">Limited seats</span>
        </div>
        <Link to={`/offers/${offer.id}`} className="mt-auto">
          <Button className="w-full bg-teal-700 shadow-teal-700/25 hover:bg-teal-800">
            Book Now <ArrowRight size={16} />
          </Button>
        </Link>
      </div>
    </motion.article>
  )
}
