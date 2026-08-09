import React from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Search,
  CalendarCheck,
  CheckCircle2,
  MapPin,
  HeartHandshake,
  AlertCircle,
  RefreshCw,
  Sparkles,
  TrendingUp,
  ChevronRight,
  Clock,
  Utensils,
  Heart,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { getNgoDashboardSummary } from '../../api/ngo.api'

function formatTimeAgo(dateString?: string): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  return `${Math.floor(diffInSeconds / 86400)} days ago`
}

export const NgoDashboardPage: React.FC = () => {
  const {
    data: summary,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['ngoDashboardSummary'],
    queryFn: getNgoDashboardSummary,
  })

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass-card p-6 sm:p-8 rounded-3xl border border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-extrabold mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>NGO Partner Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Community Food Rescue Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Browse available surplus food listings, manage pickup schedules, and verify handoff PINs.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold px-3.5 py-2.5 rounded-2xl text-xs flex items-center space-x-2 transition disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <Link
            to="/ngo/donations"
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs py-2.5 px-4 rounded-2xl flex items-center space-x-2 transition shadow-lg shadow-emerald-500/20"
          >
            <Search className="h-4 w-4 stroke-[2.5]" />
            <span>Browse Surplus Meals</span>
          </Link>
        </div>
      </div>

      {/* Error Banner */}
      {isError && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-rose-300">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-200">Failed to load NGO dashboard summary</p>
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
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Available Donations */}
        <div className="glass-card p-6 rounded-3xl space-y-3 hover:border-emerald-500/40 transition-all group">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-extrabold uppercase tracking-wider">Available Surplus</span>
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <MapPin className="h-5 w-5" />
            </div>
          </div>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-9 bg-slate-800 rounded-lg w-20" />
              <div className="h-3 bg-slate-800/60 rounded w-32" />
            </div>
          ) : (
            <div>
              <p className="text-3xl lg:text-4xl font-black text-white">{summary?.availableDonationsCount ?? 0}</p>
              <p className="text-[11px] text-emerald-400 font-bold mt-1">Ready for immediate NGO booking</p>
            </div>
          )}
        </div>

        {/* Active Bookings */}
        <div className="glass-card p-6 rounded-3xl space-y-3 hover:border-cyan-500/40 transition-all group">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-extrabold uppercase tracking-wider">Active Bookings</span>
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <CalendarCheck className="h-5 w-5" />
            </div>
          </div>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-9 bg-slate-800 rounded-lg w-20" />
              <div className="h-3 bg-slate-800/60 rounded w-36" />
            </div>
          ) : (
            <div>
              <p className="text-3xl lg:text-4xl font-black text-white">{summary?.activeReservationsCount ?? 0}</p>
              <p className="text-[11px] text-cyan-400 font-bold mt-1">Pending or confirmed PIN pickups</p>
            </div>
          )}
        </div>

        {/* Completed Pickups */}
        <div className="glass-card p-6 rounded-3xl space-y-3 hover:border-teal-500/40 transition-all group">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-extrabold uppercase tracking-wider">Verified Handoffs</span>
            <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-9 bg-slate-800 rounded-lg w-20" />
              <div className="h-3 bg-slate-800/60 rounded w-36" />
            </div>
          ) : (
            <div>
              <p className="text-3xl lg:text-4xl font-black text-white">{summary?.completedPickupsCount ?? 0}</p>
              <p className="text-[11px] text-slate-400 font-bold mt-1">Total successful food rescues</p>
            </div>
          )}
        </div>

        {/* Meals Rescued */}
        <div className="glass-card p-6 rounded-3xl space-y-3 hover:border-amber-500/40 transition-all group">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-extrabold uppercase tracking-wider">Meals Rescued</span>
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <HeartHandshake className="h-5 w-5" />
            </div>
          </div>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-9 bg-slate-800 rounded-lg w-24" />
              <div className="h-3 bg-slate-800/60 rounded w-36" />
            </div>
          ) : (
            <div>
              <p className="text-3xl lg:text-4xl font-black text-white">{summary?.totalMealsRescued ?? 0}</p>
              <p className="text-[11px] text-amber-400 font-bold mt-1">Servings distributed to Indian families</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Recent Activity & Impact Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Reservations Stream (2 Cols) */}
        <div className="lg:col-span-2 glass-card p-6 sm:p-8 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-white flex items-center space-x-2">
              <Clock className="h-5 w-5 text-cyan-400" />
              <span>Recent Reservation Activity</span>
            </h3>
            <Link to="/ngo/reservations" className="text-xs font-bold text-emerald-400 hover:underline flex items-center space-x-1">
              <span>View All Reservations</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="divide-y divide-slate-800/80">
            {isLoading ? (
              <div className="space-y-4 py-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex items-center justify-between py-3">
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-800 rounded w-48" />
                      <div className="h-3 bg-slate-800/60 rounded w-36" />
                    </div>
                    <div className="h-6 bg-slate-800 rounded-full w-20" />
                  </div>
                ))}
              </div>
            ) : !summary?.recentReservations || summary.recentReservations.length === 0 ? (
              <div className="py-8 text-center text-slate-500 space-y-2">
                <Utensils className="h-8 w-8 mx-auto text-slate-600" />
                <p className="text-xs text-slate-400 font-semibold">No active reservation activity yet.</p>
                <Link to="/ngo/donations" className="inline-block text-xs font-bold text-emerald-400 hover:underline">
                  Browse Surplus Meals & Make a Reservation
                </Link>
              </div>
            ) : (
              summary.recentReservations.map((item) => (
                <div key={item.id} className="py-3.5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-white leading-tight">{item.donation?.title}</p>
                    <p className="text-xs text-slate-400">
                      {item.donation?.restaurant?.name && `${item.donation.restaurant.name} • `}
                      {item.donation?.estimatedServings || item.donation?.quantity || 0} Meals
                      {item.createdAt && ` • Reserved ${formatTimeAgo(item.createdAt)}`}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-3 py-1 rounded-full border ${
                      item.status === 'PENDING'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : item.status === 'CONFIRMED'
                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                        : item.status === 'COMPLETED'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Impact & Quick Guide Card (1 Col) */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4">
          <h3 className="text-lg font-extrabold text-white flex items-center space-x-2">
            <Heart className="h-5 w-5 text-emerald-400" />
            <span>Pickup Logistics Guide</span>
          </h3>
          <p className="text-xs text-slate-400">Follow these standard steps when picking up surplus food from donor restaurants.</p>

          <div className="space-y-3 text-xs pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-emerald-400 font-bold text-[10.5px] uppercase block">Step 1: Reserve Meal</span>
              <p className="text-slate-300 text-[11px]">Select an active donation and reserve it for your NGO.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-cyan-400 font-bold text-[10.5px] uppercase block">Step 2: Restaurant Confirms</span>
              <p className="text-slate-300 text-[11px]">Restaurant generates a 6-digit verification PIN.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-amber-400 font-bold text-[10.5px] uppercase block">Step 3: Verify PIN at Location</span>
              <p className="text-slate-300 text-[11px]">Arrive, ask staff for the PIN, enter PIN in modal, and complete pickup.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
