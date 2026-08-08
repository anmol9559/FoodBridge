import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { UserPlus, Mail, Lock, Building, User, ArrowRight } from 'lucide-react'

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  email: z.string().email('Please enter a valid email.'),
  password: z.string().min(12, 'Password must be at least 12 characters.'),
  role: z.enum(['RESTAURANT', 'NGO']),
  organizationName: z.string().min(1, 'Organization name is required.'),
})

type RegisterFormData = z.infer<typeof registerSchema>

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'RESTAURANT',
    },
  })

  const onSubmit = (data: RegisterFormData) => {
    console.log('Register Submitted:', data)
    navigate('/login')
  }

  return (
    <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-2xl shadow-2xl backdrop-blur-xl space-y-6">
      <div className="space-y-2 text-center sm:text-left">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center justify-center sm:justify-start space-x-2">
          <UserPlus className="h-6 w-6 text-emerald-400" />
          <span>Register Organization</span>
        </h2>
        <p className="text-sm text-slate-400">Join FoodBridge as a Restaurant Donor or Distribution NGO.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              First Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                {...register('firstName')}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                placeholder="John"
              />
            </div>
            {errors.firstName && <p className="text-[10px] text-rose-400 mt-1">{errors.firstName.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Last Name
            </label>
            <input
              type="text"
              {...register('lastName')}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              placeholder="Doe"
            />
            {errors.lastName && <p className="text-[10px] text-rose-400 mt-1">{errors.lastName.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="email"
              {...register('email')}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              placeholder="contact@org.com"
            />
          </div>
          {errors.email && <p className="text-[10px] text-rose-400 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Organization Type
          </label>
          <select
            {...register('role')}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
          >
            <option value="RESTAURANT">Restaurant / Food Business</option>
            <option value="NGO">NGO / Charitable Organization</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Organization Name
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              {...register('organizationName')}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              placeholder="Green Bites Restaurant"
            />
          </div>
          {errors.organizationName && <p className="text-[10px] text-rose-400 mt-1">{errors.organizationName.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Password (min 12 chars)
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="password"
              {...register('password')}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              placeholder="••••••••••••"
            />
          </div>
          {errors.password && <p className="text-[10px] text-rose-400 mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-2.5 px-4 rounded-xl transition duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 text-xs"
        >
          <span>Create Account</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <div className="pt-4 border-t border-slate-800 text-center">
        <p className="text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-emerald-400 font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
