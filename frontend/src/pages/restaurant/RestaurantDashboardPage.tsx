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
  Recycle,
  Leaf,
  ShieldCheck,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { getRestaurantDashboardSummary, getRestaurantAnalyticsApi } from '../../api/restaurant.api'

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
    isLoading: isLoadingSummary,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['restaurantDashboardSummary'],
    queryFn: getRestaurantDashboardSummary,
  })

  const { data: analytics, isLoading: isLoadingAnalytics } = useQuery({
    queryKey: ['restaurantAnalytics'],
    queryFn: getRestaurantAnalyticsApi,
  })

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#181818] border border-[#2E2E2E] p-6 sm:p-8 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-xs font-extrabold mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Donor & Sustainability Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Restaurant Food Rescue & Recovery
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            Publish surplus meals, verify NGO PIN pickups, and track food recovery into compost, biogas & animal feed.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="bg-[#111111] hover:bg-[#222222] border border-[#333333] text-neutral-300 font-bold px-3.5 py-2.5 rounded-2xl text-xs flex items-center space-x-2 transition disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <Link
            to="/restaurant/donations"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2.5 px-4 rounded-2xl flex items-center space-x-2 transition shadow-lg shadow-emerald-950/40"
          >
            <PlusCircle className="h-4 w-4 stroke-[2.5]" />
            <span>Post Surplus Meal</span>
          </Link>
        </div>
      </div>

      {/* Error Banner */}
      {isError && (
        <div className="bg-rose-950/40 border border-rose-800/40 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-rose-300">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-200">Failed to load dashboard metrics</p>
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
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Meals Donated */}
        <div className="bg-[#181818] border border-[#2E2E2E] p-5 rounded-3xl space-y-2 hover:border-emerald-500/40 transition-all group">
          <div className="flex justify-between items-center text-neutral-400">
            <span className="text-xs font-extrabold uppercase tracking-wider">Meals Donated</span>
            <div className="p-2 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
              <Package className="h-4 w-4" />
            </div>
          </div>
          {isLoadingAnalytics ? (
            <div className="animate-pulse space-y-2">
              <div className="h-8 bg-[#222222] rounded-lg w-16" />
            </div>
          ) : (
            <div>
              <p className="text-2xl lg:text-3xl font-black text-white">{analytics?.mealsDonated ?? 0}</p>
              <p className="text-[10.5px] text-emerald-400 font-bold mt-1">Total servings published</p>
            </div>
          )}
        </div>

        {/* Meals Saved */}
        <div className="bg-[#181818] border border-[#2E2E2E] p-5 rounded-3xl space-y-2 hover:border-teal-500/40 transition-all group">
          <div className="flex justify-between items-center text-neutral-400">
            <span className="text-xs font-extrabold uppercase tracking-wider">Meals Saved</span>
            <div className="p-2 rounded-xl bg-teal-950/60 text-teal-400 border border-teal-800/40">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          {isLoadingAnalytics ? (
            <div className="animate-pulse space-y-2">
              <div className="h-8 bg-[#222222] rounded-lg w-16" />
            </div>
          ) : (
            <div>
              <p className="text-2xl lg:text-3xl font-black text-white">{analytics?.mealsSaved ?? 0}</p>
              <p className="text-[10.5px] text-teal-400 font-bold mt-1">Delivered to NGOs & community</p>
            </div>
          )}
        </div>

        {/* Expired Donations */}
        <div className="bg-[#181818] border border-[#2E2E2E] p-5 rounded-3xl space-y-2 hover:border-rose-500/40 transition-all group">
          <div className="flex justify-between items-center text-neutral-400">
            <span className="text-xs font-extrabold uppercase tracking-wider">Expired Listings</span>
            <div className="p-2 rounded-xl bg-rose-950/60 text-rose-400 border border-rose-800/40">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          {isLoadingAnalytics ? (
            <div className="animate-pulse space-y-2">
              <div className="h-8 bg-[#222222] rounded-lg w-16" />
            </div>
          ) : (
            <div>
              <p className="text-2xl lg:text-3xl font-black text-white">{analytics?.expiredDonations ?? 0}</p>
              <p className="text-[10.5px] text-rose-400 font-bold mt-1">Awaiting sustainable recovery</p>
            </div>
          )}
        </div>

        {/* Recovered Donations */}
        <div className="bg-[#181818] border border-[#2E2E2E] p-5 rounded-3xl space-y-2 hover:border-purple-500/40 transition-all group">
          <div className="flex justify-between items-center text-neutral-400">
            <span className="text-xs font-extrabold uppercase tracking-wider">Recovered Food</span>
            <div className="p-2 rounded-xl bg-purple-950/60 text-purple-400 border border-purple-800/40">
              <Recycle className="h-4 w-4" />
            </div>
          </div>
          {isLoadingAnalytics ? (
            <div className="animate-pulse space-y-2">
              <div className="h-8 bg-[#222222] rounded-lg w-16" />
            </div>
          ) : (
            <div>
              <p className="text-2xl lg:text-3xl font-black text-white">{analytics?.recoveredDonations ?? 0}</p>
              <p className="text-[10.5px] text-purple-400 font-bold mt-1">Diverted to compost & feed</p>
            </div>
          )}
        </div>

        {/* Recovery Rate */}
        <div className="bg-[#181818] border border-[#2E2E2E] p-5 rounded-3xl space-y-2 hover:border-amber-500/40 transition-all group">
          <div className="flex justify-between items-center text-neutral-400">
            <span className="text-xs font-extrabold uppercase tracking-wider">Recovery Rate</span>
            <div className="p-2 rounded-xl bg-amber-950/60 text-amber-400 border border-amber-800/40">
              <Leaf className="h-4 w-4" />
            </div>
          </div>
          {isLoadingAnalytics ? (
            <div className="animate-pulse space-y-2">
              <div className="h-8 bg-[#222222] rounded-lg w-16" />
            </div>
          ) : (
            <div>
              <p className="text-2xl lg:text-3xl font-black text-white">{analytics?.recoveryRate ?? 0}%</p>
              <p className="text-[10.5px] text-amber-400 font-bold mt-1">Waste prevention efficiency</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Recent Activity & Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-[#181818] border border-[#2E2E2E] p-6 sm:p-8 rounded-3xl space-y-4 shadow-xl">
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

          <div className="divide-y divide-[#2E2E2E]">
            {isLoadingSummary ? (
              <div className="space-y-4 py-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex items-center justify-between py-3">
                    <div className="space-y-2">
                      <div className="h-4 bg-[#222222] rounded w-48" />
                      <div className="h-3 bg-[#222222]/60 rounded w-32" />
                    </div>
                    <div className="h-6 bg-[#222222] rounded-full w-20" />
                  </div>
                ))}
              </div>
            ) : !summary?.recentDonations || summary.recentDonations.length === 0 ? (
              <div className="py-8 text-center text-neutral-500 space-y-2">
                <Package className="h-8 w-8 mx-auto text-neutral-600" />
                <p className="text-xs text-neutral-400 font-semibold">No recent donation activity.</p>
                <Link to="/restaurant/donations" className="inline-block text-xs font-bold text-emerald-400 hover:underline">
                  Create Your First Food Listing
                </Link>
              </div>
            ) : (
              summary.recentDonations.map((item) => (
                <div key={item.id} className="py-3.5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-white leading-tight">{item.title}</p>
                    <p className="text-xs text-neutral-400">
                      {item.estimatedServings || item.quantity} Meals • Posted {formatTimeAgo(item.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-3 py-1 rounded-full border ${
                      item.status === 'AVAILABLE'
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                        : item.status === 'RESERVED'
                        ? 'bg-blue-950/60 text-blue-400 border-blue-800/40'
                        : item.status === 'COMPLETED'
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                        : item.status === 'RECOVERED'
                        ? 'bg-purple-950/60 text-purple-400 border-purple-800/40'
                        : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Shortcuts */}
        <div className="bg-[#181818] border border-[#2E2E2E] p-6 sm:p-8 rounded-3xl space-y-4 shadow-xl">
          <h3 className="text-lg font-extrabold text-white flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            <span>Donor Shortcuts</span>
          </h3>

          <div className="space-y-3 text-xs pt-1">
            <Link
              to="/restaurant/reservations"
              className="flex items-center justify-between p-4 rounded-2xl bg-[#111111] hover:bg-[#222222] border border-[#2E2E2E] hover:border-emerald-600 transition group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                  <CalendarCheck className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition">
                    View Incoming Bookings
                  </h4>
                  <p className="text-[10.5px] text-neutral-400">Confirm requests & generate PINs</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-neutral-500 group-hover:text-emerald-400 transition" />
            </Link>

            <Link
              to="/restaurant/donations"
              className="flex items-center justify-between p-4 rounded-2xl bg-[#111111] hover:bg-[#222222] border border-[#2E2E2E] hover:border-emerald-600 transition group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                  <Recycle className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition">
                    Recover Expired Food
                  </h4>
                  <p className="text-[10.5px] text-neutral-400">Divert waste to animal feed & compost</p>
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
