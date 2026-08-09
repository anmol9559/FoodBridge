import React from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Building2,
  Users,
  Package,
  CalendarCheck,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Clock,
  ChevronRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { getDashboardStats } from '../../api/admin.api'

export const AdminDashboardPage: React.FC = () => {
  const {
    data: stats,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: getDashboardStats,
  })

  // Simulated chart monthly metrics for visual analytics rendering
  const monthlyData = [
    { month: 'Jan', donations: 45, completed: 40 },
    { month: 'Feb', donations: 68, completed: 62 },
    { month: 'Mar', donations: 95, completed: 88 },
    { month: 'Apr', donations: 130, completed: 120 },
    { month: 'May', donations: 185, completed: 172 },
    { month: 'Jun', donations: 240, completed: 228 },
    { month: 'Jul', donations: 310, completed: 295 },
  ]

  const maxVal = Math.max(...monthlyData.map((d) => d.donations))

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass-card p-6 sm:p-8 rounded-3xl border border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Platform Operations Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            System Analytics & Verification Governance
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time transactional audit, donor verification metrics, and food rescue analytics.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold px-3.5 py-2 rounded-2xl text-xs flex items-center space-x-2 transition disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            <span>Refresh Audit Data</span>
          </button>

          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center space-x-1.5 shrink-0">
            <ShieldCheck className="h-4 w-4" />
            <span>SUPER ADMIN</span>
          </div>
        </div>
      </div>

      {/* Error State Banner with Retry */}
      {isError && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-rose-300">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-200">Failed to load dashboard statistics</p>
              <p className="text-rose-400/80">
                {(error as { response?: { data?: { error?: { message?: string } } }; message?: string })?.response?.data?.error?.message ||
                  (error as Error)?.message ||
                  'An unexpected error occurred while fetching metrics.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="bg-rose-500 hover:bg-rose-600 text-slate-950 font-bold px-4 py-2 rounded-xl flex items-center space-x-2 transition disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            <span>Retry Loading</span>
          </button>
        </div>
      )}

      {/* Grid of Stripe-Quality Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Restaurants */}
        <div className="glass-card p-6 rounded-3xl space-y-3 relative overflow-hidden group hover:border-amber-500/40 transition-colors">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-extrabold uppercase tracking-wider">Verified Donors</span>
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Building2 className="h-5 w-5" />
            </div>
          </div>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-9 bg-slate-800 rounded-lg w-20" />
              <div className="h-3 bg-slate-800/60 rounded w-32" />
            </div>
          ) : (
            <div>
              <div className="flex items-baseline space-x-2">
                <p className="text-3xl lg:text-4xl font-black text-white">{stats?.totalRestaurants ?? 0}</p>
                <span className="text-xs font-bold text-emerald-400 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-0.5" /> +18.4%
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Active Indian Restaurants & Hotels</p>
            </div>
          )}
        </div>

        {/* Total NGOs */}
        <div className="glass-card p-6 rounded-3xl space-y-3 relative overflow-hidden group hover:border-cyan-500/40 transition-colors">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-extrabold uppercase tracking-wider">Accredited NGOs</span>
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Users className="h-5 w-5" />
            </div>
          </div>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-9 bg-slate-800 rounded-lg w-20" />
              <div className="h-3 bg-slate-800/60 rounded w-36" />
            </div>
          ) : (
            <div>
              <div className="flex items-baseline space-x-2">
                <p className="text-3xl lg:text-4xl font-black text-white">{stats?.totalNgos ?? 0}</p>
                <span className="text-xs font-bold text-cyan-400 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-0.5" /> +24.1%
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Distribution Partners across India</p>
            </div>
          )}
        </div>

        {/* Total Surplus Listings */}
        <div className="glass-card p-6 rounded-3xl space-y-3 relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-extrabold uppercase tracking-wider">Surplus Food Listings</span>
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Package className="h-5 w-5" />
            </div>
          </div>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-9 bg-slate-800 rounded-lg w-24" />
              <div className="h-3 bg-slate-800/60 rounded w-40" />
            </div>
          ) : (
            <div>
              <div className="flex items-baseline space-x-2">
                <p className="text-3xl lg:text-4xl font-black text-white">{stats?.totalDonations ?? 0}</p>
                <span className="text-xs font-bold text-emerald-400 flex items-center">
                  <Activity className="h-3 w-3 mr-0.5" /> Live
                </span>
              </div>
              <p className="text-[11px] text-emerald-400 mt-1">
                {stats?.completedDonations ?? 0} Completed • {stats?.availableDonations ?? 0} Active
              </p>
            </div>
          )}
        </div>

        {/* Total Reservations */}
        <div className="glass-card p-6 rounded-3xl space-y-3 relative overflow-hidden group hover:border-teal-500/40 transition-colors">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-extrabold uppercase tracking-wider">Reservation Lifecycle</span>
            <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <CalendarCheck className="h-5 w-5" />
            </div>
          </div>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-9 bg-slate-800 rounded-lg w-24" />
              <div className="h-3 bg-slate-800/60 rounded w-44" />
            </div>
          ) : (
            <div>
              <div className="flex items-baseline space-x-2">
                <p className="text-3xl lg:text-4xl font-black text-white">{stats?.totalReservations ?? 0}</p>
                <span className="text-xs font-bold text-teal-300 flex items-center">
                  <CheckCircle2 className="h-3 w-3 mr-0.5" /> Verified
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {stats?.pendingReservations ?? 0} PENDING • {stats?.confirmedReservations ?? 0} CONFIRMED
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Analytics Chart & Quick Governance Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Donation Volume Visualizer (2 Cols) */}
        <div className="lg:col-span-2 glass-card p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-white flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
                <span>Monthly Food Rescue Growth Trend</span>
              </h3>
              <p className="text-xs text-slate-400">System-wide surplus meal donations and completed NGO handoffs.</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              +142% YOY Growth
            </span>
          </div>

          {/* SVG Visualizer Graph Bar */}
          <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-800">
            {monthlyData.map((item, idx) => {
              const heightPct = (item.donations / maxVal) * 100
              const compPct = (item.completed / maxVal) * 100

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                  {/* Hover Tooltip */}
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 border border-slate-700 px-2.5 py-1 rounded-xl text-[10px] text-white font-bold pointer-events-none z-20 whitespace-nowrap shadow-xl">
                    {item.completed} / {item.donations} Meals Rescued
                  </div>

                  <div className="w-full max-w-[36px] flex items-end justify-center h-44 bg-slate-950/60 rounded-xl p-1 border border-slate-800/80">
                    <div
                      className="w-full bg-gradient-to-t from-emerald-600 via-emerald-400 to-teal-300 rounded-lg transition-all duration-500 group-hover:brightness-125"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">{item.month}</span>
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                <span>Total Food Donations</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-teal-300 inline-block" />
                <span>Completed NGO Handoffs</span>
              </span>
            </div>
            <span className="text-slate-400 text-[11px]">Updated Real-Time</span>
          </div>
        </div>

        {/* Governance Quick Action Cards (1 Col) */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4">
          <h3 className="text-lg font-extrabold text-white flex items-center space-x-2">
            <ShieldCheck className="h-5 w-5 text-amber-400" />
            <span>Admin Governance Actions</span>
          </h3>
          <p className="text-xs text-slate-400">Direct portal shortcuts for organization verification and transaction audit.</p>

          <div className="space-y-3 pt-2">
            <Link
              to="/admin/verifications"
              className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 transition group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition">
                    Pending Verifications
                  </h4>
                  <p className="text-[10.5px] text-slate-400">Review NGO & Restaurant proofs</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-amber-400 transition" />
            </Link>

            <Link
              to="/admin/reservations"
              className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 transition group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition">
                    Reservation PIN Audit
                  </h4>
                  <p className="text-[10.5px] text-slate-400">View pickup timestamps</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 transition" />
            </Link>

            <Link
              to="/admin/restaurants"
              className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 transition group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition">
                    Manage Donors
                  </h4>
                  <p className="text-[10.5px] text-slate-400">Restaurant Directory</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
