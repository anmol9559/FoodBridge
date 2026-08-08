import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Building2, Users, Package, CalendarCheck, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react'
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

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Overview Dashboard</h1>
          <p className="text-sm text-slate-400">System-wide transactional analytics and management insights.</p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5">
          <ShieldCheck className="h-4 w-4" />
          <span>System Administrator</span>
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

      {/* Grid of Analytics Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Restaurants */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Restaurants</span>
            <Building2 className="h-5 w-5 text-amber-400" />
          </div>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-9 bg-slate-800 rounded-lg w-20" />
              <div className="h-3 bg-slate-800/60 rounded w-32" />
            </div>
          ) : (
            <>
              <p className="text-3xl font-extrabold text-white">{stats?.totalRestaurants ?? 0}</p>
              <p className="text-[10px] text-slate-400">Active registered donors</p>
            </>
          )}
        </div>

        {/* Total NGOs */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total NGOs</span>
            <Users className="h-5 w-5 text-cyan-400" />
          </div>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-9 bg-slate-800 rounded-lg w-20" />
              <div className="h-3 bg-slate-800/60 rounded w-36" />
            </div>
          ) : (
            <>
              <p className="text-3xl font-extrabold text-white">{stats?.totalNgos ?? 0}</p>
              <p className="text-[10px] text-slate-400">Verified distribution partners</p>
            </>
          )}
        </div>

        {/* Total Donations */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Donations</span>
            <Package className="h-5 w-5 text-emerald-400" />
          </div>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-9 bg-slate-800 rounded-lg w-24" />
              <div className="h-3 bg-slate-800/60 rounded w-40" />
            </div>
          ) : (
            <>
              <p className="text-3xl font-extrabold text-white">{stats?.totalDonations ?? 0}</p>
              <p className="text-[10px] text-emerald-400">
                {stats?.completedDonations ?? 0} Completed • {stats?.availableDonations ?? 0} Active
              </p>
            </>
          )}
        </div>

        {/* Total Reservations */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Reservations</span>
            <CalendarCheck className="h-5 w-5 text-teal-400" />
          </div>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-9 bg-slate-800 rounded-lg w-24" />
              <div className="h-3 bg-slate-800/60 rounded w-44" />
            </div>
          ) : (
            <>
              <p className="text-3xl font-extrabold text-white">{stats?.totalReservations ?? 0}</p>
              <p className="text-[10px] text-slate-400">
                {stats?.pendingReservations ?? 0} PENDING • {stats?.confirmedReservations ?? 0} CONFIRMED
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
