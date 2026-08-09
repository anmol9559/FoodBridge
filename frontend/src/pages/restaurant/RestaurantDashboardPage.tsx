import React from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Package,
  CalendarCheck,
  CheckCircle2,
  Clock,
  PlusCircle,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Utensils,
  ChevronRight,
  TrendingUp,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { getRestaurantDashboardSummary } from '../../api/restaurant.api'

function formatTimeAgo(dateString?: string): string {
  if (!dateString) return 'recently'
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  return `${Math.floor(diffInSeconds / 86400)} days ago`
}

export const RestaurantDashboardPage: React.FC = () => {
  const {
    data: summary,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['restaurantDashboardSummary'],
    queryFn: getRestaurantDashboardSummary,
  })

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass-card p-6 sm:p-8 rounded-3xl border border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Donor Overview Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Restaurant Food Rescue Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Publish surplus food listings, manage incoming NGO bookings, and view 6-digit pickup PIN codes.
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
            to="/restaurant/donations"
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs py-2.5 px-4 rounded-2xl flex items-center space-x-2 transition shadow-lg shadow-emerald-500/25"
          >
            <PlusCircle className="h-4 w-4 stroke-[2.5]" />
            <span>Post Surplus Meal</span>
          </Link>
        </div>
      </div>

      {/* Error Banner */}
      {isError && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-rose-300">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-200">Failed to load restaurant dashboard summary</p>
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

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Active Donations */}
        <div className="glass-card p-6 rounded-3xl space-y-3 hover:border-emerald-500/40 transition-all group">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-extrabold uppercase tracking-wider">Active Listings</span>
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Package className="h-5 w-5" />
            </div>
          </div>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-9 bg-slate-800 rounded-lg w-20" />
              <div className="h-3 bg-slate-800/60 rounded w-32" />
            </div>
          ) : (
            <div>
              <p className="text-3xl lg:text-4xl font-black text-white">{summary?.activeDonationsCount ?? 0}</p>
              <p className="text-[11px] text-emerald-400 font-bold mt-1">Available for NGO booking</p>
            </div>
          )}
        </div>

        {/* Pending Bookings */}
        <div className="glass-card p-6 rounded-3xl space-y-3 hover:border-amber-500/40 transition-all group">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-extrabold uppercase tracking-wider">Pending Confirmation</span>
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-9 bg-slate-800 rounded-lg w-20" />
              <div className="h-3 bg-slate-800/60 rounded w-36" />
            </div>
          ) : (
            <div>
              <p className="text-3xl lg:text-4xl font-black text-white">{summary?.pendingReservationsCount ?? 0}</p>
              <p className="text-[11px] text-amber-400 font-bold mt-1">Awaiting restaurant confirmation</p>
            </div>
          )}
        </div>

        {/* Confirmed Pickups */}
        <div className="glass-card p-6 rounded-3xl space-y-3 hover:border-cyan-500/40 transition-all group">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-extrabold uppercase tracking-wider">Confirmed & PIN Issued</span>
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <CalendarCheck className="h-5 w-5" />
            </div>
          </div>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-9 bg-slate-800 rounded-lg w-20" />
              <div className="h-3 bg-slate-800/60 rounded w-32" />
            </div>
          ) : (
            <div>
              <p className="text-3xl lg:text-4xl font-black text-white">{summary?.confirmedPickupsCount ?? 0}</p>
              <p className="text-[11px] text-cyan-400 font-bold mt-1">Ready for NGO arrival & PIN handoff</p>
            </div>
          )}
        </div>

        {/* Meals Saved */}
        <div className="glass-card p-6 rounded-3xl space-y-3 hover:border-teal-500/40 transition-all group">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-extrabold uppercase tracking-wider">Total Meals Saved</span>
            <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-9 bg-slate-800 rounded-lg w-24" />
              <div className="h-3 bg-slate-800/60 rounded w-36" />
            </div>
          ) : (
            <div>
              <p className="text-3xl lg:text-4xl font-black text-white">{summary?.totalMealsSaved ?? 0}</p>
              <p className="text-[11px] text-slate-400 font-bold mt-1">Total servings donated to community</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Activity Stream & Quick Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Donation Activity (2 Cols) */}
        <div className="lg:col-span-2 glass-card p-6 sm:p-8 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-white flex items-center space-x-2">
              <Utensils className="h-5 w-5 text-emerald-400" />
              <span>Recent Donation Activity</span>
            </h3>
            <Link to="/restaurant/donations" className="text-xs font-bold text-emerald-400 hover:underline flex items-center space-x-1">
              <span>View All Listings</span>
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
                      <div className="h-3 bg-slate-800/60 rounded w-32" />
                    </div>
                    <div className="h-6 bg-slate-800 rounded-full w-20" />
                  </div>
                ))}
              </div>
            ) : !summary?.recentDonations || summary.recentDonations.length === 0 ? (
              <div className="py-8 text-center text-slate-500 space-y-2">
                <Package className="h-8 w-8 mx-auto text-slate-600" />
                <p className="text-xs text-slate-400 font-semibold">No recent donation activity.</p>
                <Link to="/restaurant/donations" className="inline-block text-xs font-bold text-emerald-400 hover:underline">
                  Create Your First Food Listing
                </Link>
              </div>
            ) : (
              summary.recentDonations.map((item) => (
                <div key={item.id} className="py-3.5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-white leading-tight">{item.title}</p>
                    <p className="text-xs text-slate-400">
                      {item.estimatedServings || item.quantity} Meals • Posted {formatTimeAgo(item.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-3 py-1 rounded-full border ${
                      item.status === 'AVAILABLE'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : item.status === 'RESERVED'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : item.status === 'COMPLETED'
                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
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

        {/* Quick Shortcuts & PIN Guide (1 Col) */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4">
          <h3 className="text-lg font-extrabold text-white flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-cyan-400" />
            <span>Donor Action Shortcuts</span>
          </h3>

          <div className="space-y-3 text-xs pt-1">
            <Link
              to="/restaurant/reservations"
              className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 transition group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CalendarCheck className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition">
                    View Incoming Bookings
                  </h4>
                  <p className="text-[10.5px] text-slate-400">Confirm requests & generate PINs</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 transition" />
            </Link>

            <Link
              to="/restaurant/donations"
              className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 transition group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <PlusCircle className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition">
                    Post Surplus Food
                  </h4>
                  <p className="text-[10.5px] text-slate-400">List cooked meals or bakery items</p>
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
