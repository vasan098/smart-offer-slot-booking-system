import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, UserPlus } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/store/AuthContext'
import { useToast } from '@/store/ToastContext'
import { ROLES } from '@/constants'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const registerSchema = loginSchema.extend({
  fullName: z.string().min(2),
  phoneNumber: z.string().min(8),
})

type LoginForm = z.infer<typeof loginSchema>
type RegisterForm = z.infer<typeof registerSchema>

export function UserLoginPage() {
  const { loginUser, register, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/account'

  useEffect(() => {
    if (isAuthenticated && user?.role === ROLES.Customer) {
      navigate(from, { replace: true })
    }
    if (isAuthenticated && user?.role === ROLES.Admin) {
      navigate('/admin', { replace: true })
    }
  }, [from, isAuthenticated, navigate, user?.role])

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'customer@smartoffer.demo', password: 'Customer@123' },
  })

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onLogin = async (data: LoginForm) => {
    setLoading(true)
    try {
      await loginUser(data.email, data.password)
      toast('Welcome back!')
      navigate(from, { replace: true })
    } catch (e) {
      toast((e as Error).message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const onRegister = async (data: RegisterForm) => {
    setLoading(true)
    try {
      await register(data)
      toast('Account created!')
      navigate('/account', { replace: true })
    } catch (e) {
      toast((e as Error).message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Card>
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-purple-100 p-3 dark:bg-purple-900/50">
              {mode === 'login' ? (
                <User className="text-purple-600" />
              ) : (
                <UserPlus className="text-purple-600" />
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold">
                {mode === 'login' ? 'Customer Login' : 'Create Account'}
              </h1>
              <p className="text-sm text-slate-500">Book offers & manage your reservations</p>
            </div>
          </div>

          <div className="mb-6 flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                mode === 'login' ? 'bg-white shadow dark:bg-slate-900' : ''
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                mode === 'register' ? 'bg-white shadow dark:bg-slate-900' : ''
              }`}
            >
              Register
            </button>
          </div>

          {mode === 'login' ? (
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
              <Input label="Email" error={loginForm.formState.errors.email?.message} {...loginForm.register('email')} />
              <Input label="Password" type="password" error={loginForm.formState.errors.password?.message} {...loginForm.register('password')} />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
              <p className="text-center text-xs text-slate-500">
                Demo: customer@smartoffer.demo / Customer@123
              </p>
            </form>
          ) : (
            <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
              <Input label="Full Name" error={registerForm.formState.errors.fullName?.message} {...registerForm.register('fullName')} />
              <Input label="Phone" error={registerForm.formState.errors.phoneNumber?.message} {...registerForm.register('phoneNumber')} />
              <Input label="Email" error={registerForm.formState.errors.email?.message} {...registerForm.register('email')} />
              <Input label="Password" type="password" error={registerForm.formState.errors.password?.message} {...registerForm.register('password')} />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating...' : 'Create Account'}
              </Button>
            </form>
          )}

          <div className="mt-6 border-t border-slate-200 pt-4 text-center text-sm dark:border-slate-700">
            <span className="text-slate-500">Business owner? </span>
            <Link to="/admin/login" className="font-medium text-indigo-600 hover:underline">
              Admin Login
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
