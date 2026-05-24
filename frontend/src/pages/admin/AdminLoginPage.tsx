import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/store/AuthContext'
import { useToast } from '@/store/ToastContext'
import { ROLES } from '@/constants'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type FormData = z.infer<typeof schema>

export function AdminLoginPage() {
  const { loginAdmin, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin'

  useEffect(() => {
    if (isAuthenticated && user?.role === ROLES.Admin) {
      navigate(from, { replace: true })
    }
    if (isAuthenticated && user?.role === ROLES.Customer) {
      navigate('/account', { replace: true })
    }
  }, [from, isAuthenticated, navigate, user?.role])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: 'admin@smartoffer.demo', password: 'Admin@123' },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      await loginAdmin(data.email, data.password)
      toast('Welcome back, Admin!')
      navigate(from, { replace: true })
    } catch (e) {
      toast((e as Error).message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center gradient-bg p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Card>
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-indigo-100 p-3 dark:bg-indigo-900">
              <Shield className="text-indigo-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Admin Login</h1>
              <p className="text-sm text-slate-500">Business dashboard & offer management</p>
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Email" error={errors.email?.message} {...register('email')} />
            <Input label="Password" type="password" error={errors.password?.message} {...register('password')} />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In as Admin'}
            </Button>
          </form>
          <p className="mt-4 text-center text-xs text-slate-500">
            Demo: admin@smartoffer.demo / Admin@123
          </p>
          <div className="mt-6 border-t border-slate-200 pt-4 text-center text-sm dark:border-slate-700">
            <span className="text-slate-500">Looking to book offers? </span>
            <Link to="/login" className="font-medium text-purple-600 hover:underline">
              Customer Login
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
