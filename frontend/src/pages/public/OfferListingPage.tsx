import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CalendarDays, MapPin, Search, SlidersHorizontal, Sparkles, TicketPercent } from 'lucide-react'
import { motion } from 'framer-motion'
import { offerService } from '@/services/offerService'
import { OfferCard } from '@/components/OfferCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { Input } from '@/components/ui/Input'
import { BUSINESS_TYPES, CATEGORIES } from '@/constants'
import type { OfferFilters } from '@/types'

export function OfferListingPage() {
  const [search, setSearch] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [availableOnly, setAvailableOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const filters: OfferFilters = useMemo(
    () => ({
      search: search || undefined,
      businessType: businessType || undefined,
      category: category || undefined,
      date: date || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      availableOnly: availableOnly || undefined,
    }),
    [search, businessType, category, date, minPrice, maxPrice, availableOnly]
  )

  const { data: offers = [], isLoading, error } = useQuery({
    queryKey: ['offers', filters],
    queryFn: () => offerService.getAll(filters),
  })

  return (
    <div className="surface-grid min-h-screen">
      <section className="gradient-bg px-4 py-14 text-white md:py-18">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-end"
        >
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-sm font-medium text-teal-50 ring-1 ring-white/20">
              <Sparkles size={15} /> Live local deals
            </span>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight md:text-6xl">
              Book better slots at better prices.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-100 md:text-lg">
              Find limited-time offers from gyms, salons, restaurants, clinics, and local services.
            </p>
          </div>
          <div className="grid gap-3 rounded-2xl bg-white/10 p-4 ring-1 ring-white/20 backdrop-blur">
            <div className="flex items-center gap-3 rounded-xl bg-white/12 p-3">
              <TicketPercent className="text-amber-300" size={22} />
              <div>
                <p className="font-semibold">Instant offer pricing</p>
                <p className="text-sm text-slate-200">Compare original and discounted prices.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white/12 p-3">
              <CalendarDays className="text-teal-200" size={22} />
              <div>
                <p className="font-semibold">Pick a convenient slot</p>
                <p className="text-sm text-slate-200">See availability before you book.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white/12 p-3">
              <MapPin className="text-indigo-200" size={22} />
              <div>
                <p className="font-semibold">Nearby businesses</p>
                <p className="text-sm text-slate-200">Filter by type, category, date, and price.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 md:-mt-8">
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
          <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search salons, dinners, clinics, classes..."
              className="h-12 w-full rounded-xl border border-slate-200 bg-stone-50 pl-12 pr-4 text-sm outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/15 dark:border-slate-700 dark:bg-slate-950"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 text-sm font-semibold transition hover:border-teal-300 hover:bg-teal-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <SlidersHorizontal size={18} /> Filters
          </button>
          </div>
        </div>

        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mb-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <div>
              <label className="text-xs font-medium">Business Type</label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-stone-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
              >
                <option value="">All</option>
                {BUSINESS_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-stone-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
              >
                <option value="">All</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <div className="flex gap-2">
              <Input label="Min ₹" type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
              <Input label="Max ₹" type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            </div>
            <label className="flex items-center gap-2 text-sm sm:col-span-2">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
              />
              Available slots only
            </label>
          </motion.div>
        )}

        {error && (
          <p className="rounded-xl bg-red-50 p-4 text-red-600 dark:bg-red-950">
            {(error as Error).message}
          </p>
        )}

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-72" />
            ))}
          </div>
        ) : offers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900">
            No offers match your filters.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
