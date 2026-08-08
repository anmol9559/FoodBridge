import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Package, CalendarCheck, CheckCircle2, Clock, PlusCircle, AlertCircle, RefreshCw } from 'lucide-react'
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
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Restaurant Dashboard</h1>
          <p className="text-sm text-slate-400">Manage surplus food donations and monitor incoming NGO pickup requests.</p>
        </div>
        <Link
          to="/restaurant/donations"
          className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center space-x-2 transition shadow-lg shadow-emerald-500/20"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Food Donation</span>
        </Link>
      </div>

      {/* Error State Banner with Retry */}
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
            <span>Retry Loading</span>
          </button>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Donations */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Donations</span>
            <Package className="h-5 w-5 text-emerald-400" />
          </div>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-9 bg-slate-800 rounded-lg w-20" />
              <div className="h-3 bg-slate-800/60 rounded w-32" />
            </div>
          ) : (
            <>
              <p className="text-3xl font-extrabold text-white">{summary?.activeDonationsCount ?? 0}</p>
              <p className="text-[10px] text-emerald-400 font-medium">Available for NGO booking</p>
            </>
          )}
        </div>

        {/* Pending Bookings */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Bookings</span>
            <Clock className="h-5 w-5 text-amber-400" />
          </div>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-9 bg-slate-800 rounded-lg w-20" />
              <div className="h-3 bg-slate-800/60 rounded w-36" />
            </div>
          ) : (
            <>
              <p className="text-3xl font-extrabold text-white">{summary?.pendingReservationsCount ?? 0}</p>
              <p className="text-[10px] text-amber-400 font-medium">Awaiting restaurant confirmation</p>
            </>
          )}
        </div>

        {/* Confirmed Pickups */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Confirmed Pickups</span>
            <CalendarCheck className="h-5 w-5 text-cyan-400" />
          </div>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-9 bg-slate-800 rounded-lg w-20" />
              <div className="h-3 bg-slate-800/60 rounded w-32" />
            </div>
          ) : (
            <>
              <p className="text-3xl font-extrabold text-white">{summary?.confirmedPickupsCount ?? 0}</p>
              <p className="text-[10px] text-cyan-400 font-medium">Ready for NGO collection</p>
            </>
          )}
        </div>

        {/* Meals Saved */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Meals Saved</span>
            <CheckCircle2 className="h-5 w-5 text-teal-400" />
          </div>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-9 bg-slate-800 rounded-lg w-24" />
              <div className="h-3 bg-slate-800/60 rounded w-36" />
            </div>
          ) : (
            <>
              <p className="text-3xl font-extrabold text-white">{summary?.totalMealsSaved ?? 0}</p>
              <p className="text-[10px] text-slate-400 font-medium">Total servings redistributed</p>
            </>
          )}
        </div>
      </div>

      {/* Activity Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white">Recent Donation Activity</h3>
        <div className="divide-y divide-slate-800">
          {isLoading ? (
            <div className="space-y-4 py-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex items-center justify-between py-2">
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-800 rounded w-48" />
                    <div className="h-3 bg-slate-800/60 rounded w-32" />
                  </div>
                  <div className="h-6 bg-slate-800 rounded-full w-20" />
                </div>
              ))}
            </div>
          ) : !summary?.recentDonations || summary.recentDonations.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No recent donation activity found.</p>
          ) : (
            summary.recentDonations.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-100">{item.title}</p>
                  <p className="text-xs text-slate-400">
                    {item.estimatedServings || item.quantity} Servings • Posted {formatTimeAgo(item.createdAt)}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
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
    </div>
  )
}
