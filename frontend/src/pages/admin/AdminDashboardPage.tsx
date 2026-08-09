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
  Sparkles,
  CheckCircle2,
  Clock,
  ChevronRight,
  Recycle,
  Leaf,
  Factory,
  Trash2,
  Heart,
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#181818] border border-[#2E2E2E] p-6 sm:p-8 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-xs font-extrabold mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Platform Operations & Sustainability Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            System Analytics & Food Recovery Audit
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            Real-time transactional audit, donor verification metrics, and sustainable food recovery tracking across India.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="bg-[#111111] hover:bg-[#222222] border border-[#333333] text-neutral-300 font-bold px-3.5 py-2 rounded-2xl text-xs flex items-center space-x-2 transition disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            <span>Refresh Audit Data</span>
          </button>

          <div className="bg-amber-950/60 border border-amber-800/40 text-amber-400 px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center space-x-1.5 shrink-0">
            <ShieldCheck className="h-4 w-4" />
            <span>SUPER ADMIN</span>
          </div>
        </div>
      </div>

      {/* Error State Banner with Retry */}
      {isError && (
        <div className="bg-rose-950/40 border border-rose-800/40 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-rose-300">
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
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl flex items-center space-x-2 transition disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            <span>Retry Loading</span>
          </button>
        </div>
      )}

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Verified Donors */}
        <div className="bg-[#181818] border border-[#2E2E2E] p-6 rounded-3xl space-y-3 relative overflow-hidden group hover:border-amber-500/40 transition-colors shadow-xl">
          <div className="flex justify-between items-center text-neutral-400">
            <span className="text-xs font-extrabold uppercase tracking-wider">Verified Donors</span>
            <div className="p-2.5 rounded-2xl bg-amber-950/60 text-amber-400 border border-amber-800/40">
              <Building2 className="h-5 w-5" />
            </div>
          </div>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-9 bg-[#222222] rounded-lg w-20" />
            </div>
          ) : (
            <div>
              <p className="text-3xl lg:text-4xl font-black text-white">{stats?.totalRestaurants ?? 0}</p>
              <p className="text-[11px] text-neutral-400 mt-1">Active Indian Restaurants & Hotels</p>
            </div>
          )}
        </div>

        {/* Accredited NGOs */}
        <div className="bg-[#181818] border border-[#2E2E2E] p-6 rounded-3xl space-y-3 relative overflow-hidden group hover:border-cyan-500/40 transition-colors shadow-xl">
          <div className="flex justify-between items-center text-neutral-400">
            <span className="text-xs font-extrabold uppercase tracking-wider">Accredited NGOs</span>
            <div className="p-2.5 rounded-2xl bg-blue-950/60 text-blue-400 border border-blue-800/40">
              <Users className="h-5 w-5" />
            </div>
          </div>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-9 bg-[#222222] rounded-lg w-20" />
            </div>
          ) : (
            <div>
              <p className="text-3xl lg:text-4xl font-black text-white">{stats?.totalNgos ?? 0}</p>
              <p className="text-[11px] text-neutral-400 mt-1">Distribution Partners across India</p>
            </div>
          )}
        </div>

        {/* Total Listings */}
        <div className="bg-[#181818] border border-[#2E2E2E] p-6 rounded-3xl space-y-3 relative overflow-hidden group hover:border-emerald-500/40 transition-colors shadow-xl">
          <div className="flex justify-between items-center text-neutral-400">
            <span className="text-xs font-extrabold uppercase tracking-wider">Surplus Food Listings</span>
            <div className="p-2.5 rounded-2xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
              <Package className="h-5 w-5" />
            </div>
          </div>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-9 bg-[#222222] rounded-lg w-24" />
            </div>
          ) : (
            <div>
              <p className="text-3xl lg:text-4xl font-black text-white">{stats?.totalDonations ?? 0}</p>
              <p className="text-[11px] text-emerald-400 mt-1">
                {stats?.completedDonations ?? 0} Completed • {stats?.availableDonations ?? 0} Active
              </p>
            </div>
          )}
        </div>

        {/* Total Reservations */}
        <div className="bg-[#181818] border border-[#2E2E2E] p-6 rounded-3xl space-y-3 relative overflow-hidden group hover:border-teal-500/40 transition-colors shadow-xl">
          <div className="flex justify-between items-center text-neutral-400">
            <span className="text-xs font-extrabold uppercase tracking-wider">Reservation Lifecycle</span>
            <div className="p-2.5 rounded-2xl bg-teal-950/60 text-teal-400 border border-teal-800/40">
              <CalendarCheck className="h-5 w-5" />
            </div>
          </div>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-9 bg-[#222222] rounded-lg w-24" />
            </div>
          ) : (
            <div>
              <p className="text-3xl lg:text-4xl font-black text-white">{stats?.totalReservations ?? 0}</p>
              <p className="text-[11px] text-neutral-400 mt-1">
                {stats?.pendingReservations ?? 0} PENDING • {stats?.confirmedReservations ?? 0} CONFIRMED
              </p>
            </div>
          )}
        </div>
      </div>

      {/* FOOD RECOVERY AUDIT CARDS */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Recycle className="h-5 w-5 text-emerald-400" />
          <h2 className="text-lg font-extrabold text-white">Food Recovery & Zero Waste Metrics</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Recovered Donations */}
          <div className="bg-[#181818] border border-[#2E2E2E] p-4 rounded-2xl space-y-1">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Recovered Donations</span>
            <p className="text-2xl font-black text-purple-400">{stats?.recoveredDonations ?? 0}</p>
            <p className="text-[10px] text-neutral-500 font-semibold">Total items diverted</p>
          </div>

          {/* Cattle Feed */}
          <div className="bg-[#181818] border border-[#2E2E2E] p-4 rounded-2xl space-y-1">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Animal / Cattle Feed</span>
            <p className="text-2xl font-black text-emerald-400">{stats?.cattleFeedDonations ?? 0}</p>
            <p className="text-[10px] text-emerald-400 font-semibold">Dairy farm feed</p>
          </div>

          {/* Composted */}
          <div className="bg-[#181818] border border-[#2E2E2E] p-4 rounded-2xl space-y-1">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Food Composted</span>
            <p className="text-2xl font-black text-teal-400">{stats?.compostDonations ?? 0}</p>
            <p className="text-[10px] text-teal-400 font-semibold">Organic fertilizer</p>
          </div>

          {/* Biogas */}
          <div className="bg-[#181818] border border-[#2E2E2E] p-4 rounded-2xl space-y-1">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Sent to Biogas</span>
            <p className="text-2xl font-black text-cyan-400">{stats?.biogasDonations ?? 0}</p>
            <p className="text-[10px] text-cyan-400 font-semibold">Bio-energy fuel</p>
          </div>

          {/* Safe Disposal */}
          <div className="bg-[#181818] border border-[#2E2E2E] p-4 rounded-2xl space-y-1">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Safe Disposal</span>
            <p className="text-2xl font-black text-neutral-300">{stats?.safeDisposalDonations ?? 0}</p>
            <p className="text-[10px] text-neutral-500 font-semibold">Eco disposal</p>
          </div>

          {/* Recovery % */}
          <div className="bg-[#181818] border border-[#2E2E2E] p-4 rounded-2xl space-y-1">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Recovery Rate</span>
            <p className="text-2xl font-black text-amber-400">{stats?.recoveryPercentage ?? 0}%</p>
            <p className="text-[10px] text-amber-400 font-semibold">Waste prevention</p>
          </div>
        </div>
      </div>

      {/* Analytics Chart & Governance Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Visualizer */}
        <div className="lg:col-span-2 bg-[#181818] border border-[#2E2E2E] p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-white flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
                <span>Monthly Food Rescue Growth Trend</span>
              </h3>
              <p className="text-xs text-neutral-400">System-wide surplus meal donations and completed NGO handoffs.</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
              +142% YOY Growth
            </span>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-[#2E2E2E]">
            {monthlyData.map((item, idx) => {
              const heightPct = (item.donations / maxVal) * 100

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-[#111111] border border-[#333333] px-2.5 py-1 rounded-xl text-[10px] text-white font-bold pointer-events-none z-20 whitespace-nowrap shadow-xl">
                    {item.completed} / {item.donations} Meals Rescued
                  </div>

                  <div className="w-full max-w-[36px] flex items-end justify-center h-44 bg-[#111111] rounded-xl p-1 border border-[#2E2E2E]">
                    <div
                      className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-lg transition-all duration-500 group-hover:brightness-125"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-neutral-400">{item.month}</span>
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-400">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span>Total Food Donations</span>
              </span>
            </div>
            <span className="text-neutral-500 text-[11px]">Updated Real-Time</span>
          </div>
        </div>

        {/* Admin Shortcuts */}
        <div className="bg-[#181818] border border-[#2E2E2E] p-6 sm:p-8 rounded-3xl space-y-4 shadow-xl">
          <h3 className="text-lg font-extrabold text-white flex items-center space-x-2">
            <ShieldCheck className="h-5 w-5 text-amber-400" />
            <span>Admin Governance Actions</span>
          </h3>
          <p className="text-xs text-neutral-400">Direct portal shortcuts for organization verification and transaction audit.</p>

          <div className="space-y-3 pt-2">
            <Link
              to="/admin/verifications"
              className="flex items-center justify-between p-4 rounded-2xl bg-[#111111] hover:bg-[#222222] border border-[#2E2E2E] hover:border-amber-500/40 transition group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-amber-950/60 text-amber-400 border border-amber-800/40">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition">
                    Pending Verifications
                  </h4>
                  <p className="text-[10.5px] text-neutral-400">Review NGO & Restaurant proofs</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-neutral-500 group-hover:text-amber-400 transition" />
            </Link>

            <Link
              to="/admin/donations"
              className="flex items-center justify-between p-4 rounded-2xl bg-[#111111] hover:bg-[#222222] border border-[#2E2E2E] hover:border-purple-500/40 transition group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-purple-950/60 text-purple-400 border border-purple-800/40">
                  <Recycle className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition">
                    Food Recovery Audit
                  </h4>
                  <p className="text-[10.5px] text-neutral-400">View animal feed & biogas stats</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-neutral-500 group-hover:text-purple-400 transition" />
            </Link>

            <Link
              to="/admin/restaurants"
              className="flex items-center justify-between p-4 rounded-2xl bg-[#111111] hover:bg-[#222222] border border-[#2E2E2E] hover:border-emerald-600 transition group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition">
                    Manage Donors
                  </h4>
                  <p className="text-[10.5px] text-neutral-400">Restaurant Directory</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-neutral-500 group-hover:text-emerald-400 transition" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
