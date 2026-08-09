import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Search,
  MapPin,
  Clock,
  HeartHandshake,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Building2,
  Utensils,
  Sparkles,
} from 'lucide-react'
import { getNgoAvailableDonations } from '../../api/ngo.api'
import api from '../../lib/axios'
import { ApiResponse } from '../../types'

export const NgoBrowseDonationsPage: React.FC = () => {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [limit] = useState(9)
  const [search, setSearch] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [reservingId, setReservingId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['ngoAvailableDonations', page, limit, search],
    queryFn: () => getNgoAvailableDonations({ page, limit, search: search || undefined }),
  })

  const donations = data?.donations || []
  const pagination = data?.pagination

  const reserveMutation = useMutation({
    mutationFn: async (donationId: string) => {
      const response = await api.post<ApiResponse<unknown>>(`/ngo/donations/${donationId}/reserve`)
      return response.data
    },
    onMutate: (donationId) => {
      setReservingId(donationId)
      setActionError(null)
    },
    onSuccess: (resData) => {
      setReservingId(null)
      showToast(resData.message || 'Donation reserved successfully! Pickup verification PIN issued.')
      queryClient.invalidateQueries({ queryKey: ['ngoAvailableDonations'] })
      queryClient.invalidateQueries({ queryKey: ['ngoDashboardSummary'] })
      queryClient.invalidateQueries({ queryKey: ['ngoReservations'] })
    },
    onError: (err: unknown) => {
      setReservingId(null)
      const errorObj = err as { response?: { data?: { error?: { message?: string } } }; message?: string }
      setActionError(
        errorObj.response?.data?.error?.message || errorObj.message || 'Failed to reserve donation.'
      )
    },
  })

  // Stock Indian Food Imagery CDN mappings for high resolution visual appeal
  const foodImages = [
    'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
  ]

  const getFoodImage = (id: string, idx: number) => {
    return foodImages[idx % foodImages.length]
  }

  const formatExpiryCountdown = (expiresAtStr: string) => {
    const expires = new Date(expiresAtStr).getTime()
    const now = new Date().getTime()
    const diffMs = expires - now
    if (diffMs <= 0) return 'Expired'
    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m remaining`
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass-card p-6 sm:p-8 rounded-3xl border border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-extrabold mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Real-Time Indian Meal Rescue</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Surplus Food Listings
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Browse verified Indian restaurant donations ready for immediate pickup and distribution.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center space-x-2 transition disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          <span>Refresh Listings</span>
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center space-x-3 text-xs text-emerald-400 animate-in fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Action Error Alert */}
      {actionError && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex items-center justify-between text-xs text-rose-300 animate-in fade-in">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="text-rose-400 font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          placeholder="Search by food title, restaurant name, or Indian city..."
          className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition shadow-inner"
        />
      </div>

      {/* Fetch Error Banner */}
      {isError && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-rose-300">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-200">Failed to load available food donations</p>
              <p className="text-rose-400/80">
                {(error as { response?: { data?: { error?: { message?: string } } }; message?: string })?.response?.data?.error?.message ||
                  (error as Error)?.message ||
                  'An unexpected error occurred.'}
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

      {/* Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card p-5 rounded-3xl space-y-4 animate-pulse">
              <div className="h-44 bg-slate-800/80 rounded-2xl" />
              <div className="h-6 bg-slate-800 rounded w-48" />
              <div className="h-3 bg-slate-800/60 rounded w-36" />
              <div className="h-10 bg-slate-800 rounded-xl w-full" />
            </div>
          ))}
        </div>
      ) : donations.length === 0 ? (
        <div className="glass-card rounded-3xl p-16 text-center text-slate-500 space-y-3 border border-slate-800">
          <HeartHandshake className="h-12 w-12 mx-auto text-slate-600" />
          <p className="font-bold text-slate-300 text-base">No active food donations available right now.</p>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Check back shortly or refresh the page. When partner Indian restaurants list new surplus meals, they appear here immediately.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donations.map((item, idx) => {
            const isReservingThis = reservingId === item.id

            return (
              <div
                key={item.id}
                className="glass-card p-5 rounded-3xl flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-all duration-300 group shadow-xl"
              >
                <div className="space-y-3">
                  {/* Food Image Banner with Overlay Badges */}
                  <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                    <img
                      src={getFoodImage(item.id, idx)}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                    <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                        {item.foodType}
                      </span>
                      {item.isVegetarian && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 uppercase tracking-wider">
                          🌱 Veg
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <div className="flex items-center space-x-1.5 font-bold">
                        <Utensils className="h-3.5 w-3.5 text-emerald-400" />
                        <span>{item.estimatedServings || item.quantity} Meals</span>
                      </div>

                      <div className="flex items-center space-x-1 text-[10px] font-bold text-amber-300 bg-slate-950/80 px-2 py-0.5 rounded-lg border border-amber-500/30">
                        <Clock className="h-3 w-3" />
                        <span>{formatExpiryCountdown(item.expiresAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Title & Restaurant Info */}
                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-white leading-snug group-hover:text-emerald-300 transition">
                      {item.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-xs text-cyan-400 font-bold">
                      <Building2 className="h-3.5 w-3.5 shrink-0" />
                      <span>{item.restaurant?.name || 'Restaurant Partner'}</span>
                    </div>
                  </div>

                  {/* Address Details */}
                  <div className="space-y-1 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                    {item.pickupAddress && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{item.pickupAddress}</span>
                      </div>
                    )}
                    {item.specialInstructions && (
                      <p className="text-[11px] text-slate-400 italic line-clamp-2">
                        "{item.specialInstructions}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => reserveMutation.mutate(item.id)}
                  disabled={isReservingThis}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold py-3 px-4 rounded-2xl text-xs flex items-center justify-center space-x-2 transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  {isReservingThis ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Reserving Meal Package...</span>
                    </>
                  ) : (
                    <>
                      <HeartHandshake className="h-4 w-4 stroke-[2.5]" />
                      <span>Reserve Food Donation</span>
                    </>
                  )}
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination Footer */}
      {pagination && pagination.totalPages > 1 && (
        <div className="px-4 py-3 glass-card rounded-2xl flex items-center justify-between text-xs text-slate-400">
          <span>
            Showing Page <strong className="text-white">{pagination.page}</strong> of{' '}
            <strong className="text-white">{pagination.totalPages}</strong> ({pagination.totalItems} items)
          </span>

          <div className="flex space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page >= pagination.totalPages}
              className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
