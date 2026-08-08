import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Utensils, HeartHandshake, ShieldCheck } from 'lucide-react'

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-900 text-slate-100">
      {/* Brand Hero Panel */}
      <div className="md:w-1/2 bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-950 p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <Link to="/" className="flex items-center space-x-3 group w-fit">
            <div className="bg-emerald-500 p-2.5 rounded-xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Utensils className="h-6 w-6 text-slate-950 stroke-[2.5]" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
              FoodBridge
            </span>
          </Link>
        </div>

        <div className="relative z-10 my-12 md:my-0 space-y-6 max-w-lg">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Bridging Surplus Food to Communities in Need.
          </h1>
          <p className="text-emerald-100/70 text-base leading-relaxed">
            Connecting restaurants and food suppliers with verified NGOs for seamless, real-time food donation and redistribution.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="flex items-start space-x-3 bg-white/5 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
              <HeartHandshake className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-white">Direct Impact</h4>
                <p className="text-xs text-slate-300">Deliver fresh meals to local communities.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 bg-white/5 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
              <ShieldCheck className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-white">Verified Security</h4>
                <p className="text-xs text-slate-300">Strict organizational roles & status checks.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-400">
          © {new Date().getFullYear()} FoodBridge Platform. All rights reserved.
        </div>
      </div>

      {/* Auth Content Panel */}
      <div className="md:w-1/2 bg-slate-950 p-6 sm:p-12 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
