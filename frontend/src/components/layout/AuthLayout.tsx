import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Utensils, ShieldCheck, Activity, Users, Building2, PackageCheck, Loader2 } from 'lucide-react'
import { getPublicStatsApi } from '../../api/public.api'

export const AuthLayout: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['publicStats'],
    queryFn: getPublicStatsApi,
    refetchInterval: 30000,
  })

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden flex flex-col lg:flex-row bg-slate-950 text-slate-100 relative selection:bg-emerald-500 selection:text-slate-950">
      {/* Background Ambient Glow & Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Left Brand Hero Dashboard Panel (42% Width on Desktop) */}
      <div className="lg:w-[42%] bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-900/90 border-r border-slate-800/80 p-6 sm:p-10 lg:p-12 flex flex-col justify-between relative z-10 overflow-y-auto">
        <div className="space-y-8">
          {/* Logo & Header Status Badge */}
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-emerald-500 p-2.5 rounded-2xl shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-200">
                <Utensils className="h-6 w-6 text-slate-950 stroke-[2.5]" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
                FoodBridge
              </span>
            </Link>

            <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Live Platform Stats</span>
            </div>
          </div>

          {/* Hero Headlines */}
          <div className="space-y-3 pt-2">
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              Bridging Surplus Food to Communities in Need.
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Connecting verified restaurant food donors with accredited NGO distribution partners for transparent, real-time meal rescue.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center space-x-3 bg-slate-900/80 border border-slate-800 p-3 rounded-2xl backdrop-blur-xl">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Verified Organization Network</h4>
                <p className="text-[11px] text-slate-400">Admin audit for all food donors & recipient NGOs.</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-slate-900/80 border border-slate-800 p-3 rounded-2xl backdrop-blur-xl">
              <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 shrink-0">
                <Activity className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Live Surplus Tracking</h4>
                <p className="text-[11px] text-slate-400">Real-time availability & quantity updates.</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-slate-900/80 border border-slate-800 p-3 rounded-2xl backdrop-blur-xl">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
                <PackageCheck className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Direct Pickup Coordination</h4>
                <p className="text-[11px] text-slate-400">Automated reservation workflow & status confirmations.</p>
              </div>
            </div>
          </div>

          {/* Live Database Statistics Cards */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400 font-bold uppercase tracking-wider">Live Platform Metrics</span>
              <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                <span>Updated Real-Time</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl text-left space-y-1">
                <div className="flex items-center space-x-2 text-emerald-400">
                  <Building2 className="h-4 w-4 shrink-0" />
                  <span className="text-xs font-semibold text-slate-300">Verified Donors</span>
                </div>
                <p className="text-2xl font-black tracking-tight text-white">
                  {isLoading ? '...' : (stats?.verifiedRestaurants ?? 0).toLocaleString()}
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl text-left space-y-1">
                <div className="flex items-center space-x-2 text-cyan-400">
                  <Users className="h-4 w-4 shrink-0" />
                  <span className="text-xs font-semibold text-slate-300">Verified NGOs</span>
                </div>
                <p className="text-2xl font-black tracking-tight text-white">
                  {isLoading ? '...' : (stats?.verifiedNgos ?? 0).toLocaleString()}
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl text-left space-y-1">
                <div className="flex items-center space-x-2 text-teal-400">
                  <PackageCheck className="h-4 w-4 shrink-0" />
                  <span className="text-xs font-semibold text-slate-300">Completed Pickups</span>
                </div>
                <p className="text-2xl font-black tracking-tight text-white">
                  {isLoading ? '...' : (stats?.completedPickups ?? 0).toLocaleString()}
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl text-left space-y-1">
                <div className="flex items-center space-x-2 text-amber-400">
                  <Utensils className="h-4 w-4 shrink-0" />
                  <span className="text-xs font-semibold text-slate-300">Meals Rescued</span>
                </div>
                <p className="text-2xl font-black tracking-tight text-white">
                  {isLoading ? '...' : (stats?.mealsSaved ?? 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-6 border-t border-slate-800/80 text-[11px] text-slate-500 flex justify-between items-center">
          <span>© {new Date().getFullYear()} FoodBridge Platform</span>
          <span className="text-emerald-400 font-semibold">Zero Food Waste Goal</span>
        </div>
      </div>

      {/* Right Form Container (58% Width on Desktop) */}
      <div className="lg:w-[58%] flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10 overflow-y-auto">
        <div className="w-full max-w-[760px] mx-auto py-2">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
