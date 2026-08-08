import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, CalendarCheck, CheckCircle2, MapPin, HeartHandshake, AlertCircle, RefreshCw } from 'lucide-react'
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
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">NGO Dashboard</h1>
          <p className="text-sm text-slate-400">Browse surplus food availability and manage active pickup reservations.</p>
        </div>
        <Link
          to="/ngo/donations"
          className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center space-x-2 transition shadow-lg shadow-cyan-500/20"
        >
          <Search className="h-4 w-4" />
          <span>Browse Available Meals</span>
        </Link>
      </div>

      {/* Error State Banner with Retry */}
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
            <span>Retry Loading</span>
          </button>
        </div>
      )}

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Donations */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Available Donations</span>
            <MapPin className="h-5 w-5 text-emerald-400" />
          </div>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-9 bg-slate-800 rounded-lg w-20" />
              <div className="h-3 bg-slate-800/60 rounded w-32" />
            </div>
          ) : (
            <>
              <p className="text-3xl font-extrabold text-white">{summary?.availableDonationsCount ?? 0}</p>
              <p className="text-[10px] text-emerald-400 font-medium">Ready for immediate booking</p>
            </>
          )}
        </div>

        {/* Active Bookings */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">My Active Bookings</span>
            <CalendarCheck className="h-5 w-5 text-cyan-400" />
          </div>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-9 bg-slate-800 rounded-lg w-20" />
              <div className="h-3 bg-slate-800/60 rounded w-36" />
            </div>
          ) : (
            <>
              <p className="text-3xl font-extrabold text-white">{summary?.activeReservationsCount ?? 0}</p>
              <p className="text-[10px] text-cyan-400 font-medium">Pending or confirmed pickups</p>
            </>
          )}
        </div>

        {/* Completed Pickups */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed Pickups</span>
            <CheckCircle2 className="h-5 w-5 text-teal-400" />
          </div>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-9 bg-slate-800 rounded-lg w-20" />
              <div className="h-3 bg-slate-800/60 rounded w-36" />
            </div>
          ) : (
            <>
              <p className="text-3xl font-extrabold text-white">{summary?.completedPickupsCount ?? 0}</p>
              <p className="text-[10px] text-slate-400 font-medium">Total successful distributions</p>
            </>
          )}
        </div>

        {/* Meals Rescued */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Meals Rescued</span>
            <HeartHandshake className="h-5 w-5 text-amber-400" />
          </div>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-9 bg-slate-800 rounded-lg w-24" />
              <div className="h-3 bg-slate-800/60 rounded w-36" />
            </div>
          ) : (
            <>
              <p className="text-3xl font-extrabold text-white">{summary?.totalMealsRescued ?? 0}</p>
              <p className="text-[10px] text-amber-400 font-medium">Servings distributed to community</p>
            </>
          )}
        </div>
      </div>

      {/* Recent Reservation Activity Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white">Recent Reservation Activity</h3>
        <div className="divide-y divide-slate-800">
          {isLoading ? (
            <div className="space-y-4 py-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex items-center justify-between py-2">
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-800 rounded w-48" />
                    <div className="h-3 bg-slate-800/60 rounded w-36" />
                  </div>
                  <div className="h-6 bg-slate-800 rounded-full w-20" />
                </div>
              ))}
            </div>
          ) : !summary?.recentReservations || summary.recentReservations.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No reservation activity yet.</p>
          ) : (
            summary.recentReservations.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-100">{item.donation?.title}</p>
                  <p className="text-xs text-slate-400">
                    {item.donation?.restaurant?.name && `${item.donation.restaurant.name} • `}
                    {item.donation?.estimatedServings || item.donation?.quantity || 0} Servings
                    {item.createdAt && ` • Reserved ${formatTimeAgo(item.createdAt)}`}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
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
    </div>
  )
}
