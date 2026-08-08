import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, MapPin, Clock, HeartHandshake, AlertCircle, RefreshCw, CheckCircle2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
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
      showToast(resData.message || 'Donation reserved successfully!')
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h1 className="text-2xl font-bold text-white tracking-tight">Available Food Donations</h1>
        <p className="text-sm text-slate-400">Discover fresh surplus meals donated by verified local restaurants.</p>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-center space-x-3 text-xs text-emerald-400">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Action Error Alert */}
      {actionError && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-center justify-between text-xs text-rose-300">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="text-rose-400 font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          placeholder="Search food title or restaurant..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Error State Banner */}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 animate-pulse">
              <div className="h-4 bg-slate-800 rounded w-24" />
              <div className="h-6 bg-slate-800 rounded w-48" />
              <div className="h-3 bg-slate-800/60 rounded w-36" />
              <div className="h-9 bg-slate-800 rounded-xl w-full pt-4" />
            </div>
          ))}
        </div>
      ) : donations.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 space-y-3">
          <HeartHandshake className="h-10 w-10 mx-auto text-slate-600" />
          <p className="font-bold text-slate-300">No donations available.</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Check back later for fresh surplus meal donations published by partner restaurants.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {donations.map((item) => {
            const isReservingThis = reservingId === item.id

            return (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {item.foodType}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">
                      {item.estimatedServings || item.quantity} Servings
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white leading-snug">{item.title}</h3>
                    <p className="text-xs text-cyan-400 font-medium">{item.restaurant?.name}</p>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800">
                    {item.pickupAddress && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{item.pickupAddress}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span>Expires: {new Date(item.expiresAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => reserveMutation.mutate(item.id)}
                  disabled={isReservingThis}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                >
                  {isReservingThis ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Reserving...</span>
                    </>
                  ) : (
                    <>
                      <HeartHandshake className="h-4 w-4" />
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
        <div className="px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-400">
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
