import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LogIn, Mail, Lock, ArrowRight, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react'
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
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

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
        response?: { data?: { error?: { code?: string; message?: string } } }
        message?: string
      }
      const errCode = errorObj.response?.data?.error?.code
      let backendMessage = errorObj.response?.data?.error?.message

      if (errCode === 'INVALID_CREDENTIALS') {
        backendMessage = 'Invalid email or password.'
      } else if (errCode === 'ORGANIZATION_PENDING') {
        backendMessage = 'Your organization is waiting for admin approval.'
      } else if (errCode === 'ORGANIZATION_REJECTED') {
        backendMessage = 'Your organization has been rejected. Please contact the administrator.'
      } else if (errCode === 'ACCOUNT_DISABLED') {
        backendMessage = 'Your account has been disabled. Please contact support.'
      } else if (!backendMessage) {
        backendMessage = errorObj.message || 'Unable to sign in. Please verify your credentials and try again.'
      }

      setErrorMessage(backendMessage)
    }
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 p-6 sm:p-8 rounded-3xl shadow-2xl backdrop-blur-2xl space-y-6 w-full max-w-md mx-auto">
      {/* Header */}
      <div className="space-y-1.5 text-center sm:text-left">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center justify-center sm:justify-start space-x-2">
          <LogIn className="h-6 w-6 text-emerald-400" />
          <span>Sign In to FoodBridge</span>
        </h2>
        <p className="text-xs text-slate-400">Enter your organizational email and password below.</p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-2xl flex items-start space-x-3 text-xs text-rose-300 animate-in fade-in">
          <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
          <span className="font-medium leading-relaxed">{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5 text-[10px]">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            <input
              type="email"
              {...register('email')}
              disabled={isSubmitting}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition disabled:opacity-50"
              placeholder="name@organization.com"
            />
          </div>
          {errors.email && <p className="text-rose-400 mt-1 text-[10px]">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-slate-300 font-semibold uppercase tracking-wider text-[10px]">
              Password
            </label>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              disabled={isSubmitting}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition disabled:opacity-50"
              placeholder="••••••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-rose-400 mt-1 text-[10px]">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer link */}
      <div className="pt-4 border-t border-slate-800/80 text-center">
        <p className="text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-emerald-400 font-bold hover:underline">
            Register your Organization
          </Link>
        </p>
      </div>
    </div>
  )
}
