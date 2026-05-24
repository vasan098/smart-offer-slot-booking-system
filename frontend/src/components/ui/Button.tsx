import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'
import type { ButtonHTMLAttributes } from 'react'

const variants = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-700',
        secondary:
          'bg-white/80 text-slate-900 border border-slate-200 hover:bg-white dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700',
        ghost: 'hover:bg-slate-100 dark:hover:bg-slate-800',
        danger: 'bg-red-600 text-white hover:bg-red-700',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-5 text-sm',
        lg: 'h-12 px-6',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
)

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof variants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(variants({ variant, size }), className)} {...props} />
}
