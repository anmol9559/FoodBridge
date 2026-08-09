import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LogIn, Mail, Lock, ArrowRight, Loader2, AlertCircle, Eye, EyeOff, ShieldCheck, Building2, Heart } from 'lucide-react'
import { loginSchema, LoginFormData } from '../auth.schemas'
import { loginApi } from '../../../api/auth.api'
import { useAuth } from '../../../hooks/useAuth'

export const LoginForm: React.FC = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const fillDemoCredentials = (role: 'RESTAURANT' | 'NGO' | 'ADMIN') => {
    setErrorMessage(null)
    if (role === 'RESTAURANT') {
      setValue('email', 'restaurant@foodbridge.org')
      setValue('password', 'Password123!')
    } else if (role === 'NGO') {
      setValue('email', 'ngo@foodbridge.org')
      setValue('password', 'Password123!')
    } else {
      setValue('email', 'admin@foodbridge.org')
      setValue('password', 'Password123!')
    }
  }

  const onSubmit = async (data: LoginFormData) => {
    setErrorMessage(null)

    try {
      const response = await loginApi(data)

      if (response.success && response.data) {
        login(response.data)

        // Role-based redirection
        const userRole = response.data.role
        if (userRole === 'ADMIN') {
          navigate('/admin', { replace: true })
        } else if (userRole === 'NGO') {
          navigate('/ngo', { replace: true })
        } else {
          navigate('/restaurant', { replace: true })
        }
      }
    } catch (err: unknown) {
      const errorObj = err as {
        response?: {
          status?: number
          data?: { error?: { code?: string; message?: string }; message?: string }
        }
        message?: string
      }

      const status = errorObj.response?.status
      const errCode = errorObj.response?.data?.error?.code
      const serverMessage = errorObj.response?.data?.error?.message || errorObj.response?.data?.message

      let backendMessage = serverMessage

      if (errCode === 'INVALID_CREDENTIALS') {
        backendMessage = 'Invalid email or password.'
      } else if (errCode === 'ORGANIZATION_PENDING') {
        backendMessage = 'Your organization is waiting for admin approval.'
      } else if (errCode === 'ORGANIZATION_REJECTED') {
        backendMessage = 'Your organization has been rejected by the administrator.'
      } else if (errCode === 'ACCOUNT_DISABLED') {
        backendMessage = 'Your account has been disabled. Please contact support.'
      } else if (!backendMessage) {
        if (status === 401) {
          backendMessage = 'Invalid email or password.'
        } else if (status === 403) {
          backendMessage = 'Access forbidden. Your account or organization status is not active.'
        } else if (status === 500) {
          backendMessage = 'Internal server error. Please try again later.'
        } else if (errorObj.message === 'Network Error' || !status) {
          backendMessage = 'Unable to connect to FoodBridge server (Network Error). Please check if backend API (port 5001) is running.'
        } else {
          backendMessage = errorObj.message || 'Unable to sign in. Please verify your credentials and try again.'
        }
      }

      setErrorMessage(backendMessage)
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6 w-full max-w-md mx-auto text-slate-900 dark:text-slate-100 transition-colors">
      {/* Header */}
      <div className="space-y-1.5 text-center sm:text-left">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold mb-1">
          <LogIn className="h-3.5 w-3.5" />
          <span>FoodBridge SaaS Portal</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Welcome Back
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Sign in with your verified organizational account.</p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="bg-rose-500/10 border border-rose-500/30 p-3.5 rounded-2xl flex items-start space-x-3 text-xs text-rose-700 dark:text-rose-300 animate-in fade-in">
          <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
          <span className="font-semibold leading-relaxed">{errorMessage}</span>
        </div>
      )}

      {/* Quick Role Fill Buttons */}
      <div className="space-y-1.5">
        <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider block">Quick Demo Sign-In</span>
        <div className="grid grid-cols-3 gap-2 text-[10.5px]">
          <button
            type="button"
            onClick={() => fillDemoCredentials('RESTAURANT')}
            className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-950/80 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 p-2 rounded-xl text-slate-800 dark:text-slate-300 font-semibold transition flex flex-col items-center space-y-1"
          >
            <Building2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Restaurant</span>
          </button>
          <button
            type="button"
            onClick={() => fillDemoCredentials('NGO')}
            className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-950/80 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 p-2 rounded-xl text-slate-800 dark:text-slate-300 font-semibold transition flex flex-col items-center space-y-1"
          >
            <Heart className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>NGO Partner</span>
          </button>
          <button
            type="button"
            onClick={() => fillDemoCredentials('ADMIN')}
            className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-950/80 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 p-2 rounded-xl text-slate-800 dark:text-slate-300 font-semibold transition flex flex-col items-center space-y-1"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
            <span>Admin</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-semibold uppercase tracking-wider mb-1.5 text-[10px]">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <input
              type="email"
              {...register('email')}
              disabled={isSubmitting}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition disabled:opacity-50"
              placeholder="name@organization.com"
            />
          </div>
          {errors.email && <p className="text-rose-600 dark:text-rose-400 mt-1 text-[10px] font-semibold">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-slate-700 dark:text-slate-300 font-semibold uppercase tracking-wider text-[10px]">
              Password
            </label>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              disabled={isSubmitting}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition disabled:opacity-50 font-mono"
              placeholder="••••••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-rose-600 dark:text-rose-400 mt-1 text-[10px] font-semibold">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/25 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Authenticating Credentials...</span>
            </>
          ) : (
            <>
              <span>Sign In to Dashboard</span>
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </>
          )}
        </button>
      </form>

      {/* Footer link */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 text-center">
        <p className="text-xs text-slate-600 dark:text-slate-400">
          New Organization?{' '}
          <Link to="/register" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
            Register Partner Account
          </Link>
        </p>
      </div>
    </div>
  )
}
