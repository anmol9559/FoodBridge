import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CalendarCheck,
  Check,
  X,
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  Loader2,
  Copy,
  KeyRound,
  ShieldAlert,
  Clock,
} from 'lucide-react'
import {
  getRestaurantReservations,
  confirmReservationApi,
  rejectReservationApi,
  regeneratePickupPinApi,
} from '../../api/restaurant.api'

export const RestaurantReservationsPage: React.FC = () => {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  const handleCopyPin = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    showToast('Pickup PIN copied to clipboard!')
    setTimeout(() => setCopiedId(null), 3000)
  }

  // Fetch incoming reservations query
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['restaurantReservations', page, limit, statusFilter],
    queryFn: () =>
      getRestaurantReservations({
        page,
        limit,
        status: statusFilter || undefined,
      }),
  })

  const reservations = data?.reservations || []
  const pagination = data?.pagination

  // Confirm Reservation Mutation
  const confirmMutation = useMutation({
    mutationFn: (id: string) => confirmReservationApi(id),
    onMutate: (id) => {
      setProcessingId(id)
      setActionError(null)
    },
    onSuccess: (resData) => {
      setProcessingId(null)
      showToast(resData.message || 'Reservation confirmed! Pickup PIN generated.')
      queryClient.invalidateQueries({ queryKey: ['restaurantReservations'] })
      queryClient.invalidateQueries({ queryKey: ['restaurantDashboardSummary'] })
    },
    onError: (err: unknown) => {
      setProcessingId(null)
      const errorObj = err as { response?: { data?: { error?: { message?: string } } }; message?: string }
      setActionError(
        errorObj.response?.data?.error?.message || errorObj.message || 'Failed to confirm reservation.'
      )
    },
  })

  // Regenerate PIN Mutation
  const regeneratePinMutation = useMutation({
    mutationFn: (id: string) => regeneratePickupPinApi(id),
    onMutate: (id) => {
      setProcessingId(id)
      setActionError(null)
    },
    onSuccess: () => {
      setProcessingId(null)
      showToast('New Pickup PIN generated successfully!')
      queryClient.invalidateQueries({ queryKey: ['restaurantReservations'] })
    },
    onError: (err: unknown) => {
      setProcessingId(null)
      const errorObj = err as { response?: { data?: { error?: { message?: string } } }; message?: string }
      setActionError(
        errorObj.response?.data?.error?.message || errorObj.message || 'Failed to regenerate PIN.'
      )
    },
  })

  // Reject Reservation Mutation
  const rejectMutation = useMutation({
    mutationFn: (id: string) => rejectReservationApi(id),
    onMutate: (id) => {
      setProcessingId(id)
      setActionError(null)
    },
    onSuccess: (resData) => {
      setProcessingId(null)
      showToast(resData.message || 'Reservation rejected successfully.')
      queryClient.invalidateQueries({ queryKey: ['restaurantReservations'] })
      queryClient.invalidateQueries({ queryKey: ['restaurantDashboardSummary'] })
    },
    onError: (err: unknown) => {
      setProcessingId(null)
      const errorObj = err as { response?: { data?: { error?: { message?: string } } }; message?: string }
      setActionError(
        errorObj.response?.data?.error?.message || errorObj.message || 'Failed to reject reservation.'
      )
    },
  })

  const formatExpiryCountdown = (expiresAtStr?: string) => {
    if (!expiresAtStr) return '24h Expiry'
    const expires = new Date(expiresAtStr).getTime()
    const now = new Date().getTime()
    const diffMs = expires - now
    if (diffMs <= 0) return 'Expired'
    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    return `Expires in ${hours}h ${minutes}m`
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <CalendarCheck className="h-6 w-6 text-emerald-400" />
            <span>Incoming NGO Reservations</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Confirm booking requests, view generated Pickup PIN codes, and manage NGO pickups.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center space-x-2 transition disabled:opacity-50 border border-slate-700"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(1)
              }}
              className="bg-slate-950 border border-slate-800 text-slate-300 px-4 py-2 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500 appearance-none pr-8 cursor-pointer"
            >
              <option value="">All Reservation Statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="EXPIRED">EXPIRED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
            <Filter className="absolute right-3 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {toastMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-center space-x-3 text-xs text-emerald-400 animate-in fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Action Error Alert */}
      {actionError && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-center justify-between text-xs text-rose-300 animate-in fade-in">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="text-rose-400 font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Fetch Error State */}
      {isError && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-rose-300">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-200">Failed to load incoming reservations</p>
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

      {/* Table Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Reservation ID</th>
                <th className="py-3.5 px-4">Donation Listing</th>
                <th className="py-3.5 px-4">NGO Partner</th>
                <th className="py-3.5 px-4">Verification PIN / Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-3.5 px-4"><div className="h-4 bg-slate-800 rounded w-24" /></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-slate-800 rounded w-40" /></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-slate-800 rounded w-32" /></td>
                    <td className="py-3.5 px-4"><div className="h-5 bg-slate-800 rounded-full w-28" /></td>
                    <td className="py-3.5 px-4 text-right"><div className="h-6 bg-slate-800 rounded w-28 ml-auto" /></td>
                  </tr>
                ))
              ) : reservations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 space-y-2">
                    <CalendarCheck className="h-8 w-8 mx-auto text-slate-600" />
                    <p className="font-semibold text-slate-300">No incoming reservations found.</p>
                    <p className="text-[11px] text-slate-500">When NGOs reserve your food listings, booking details will appear here.</p>
                  </td>
                </tr>
              ) : (
                reservations.map((res) => {
                  const isPending = res.status === 'PENDING'
                  const isConfirmed = res.status === 'CONFIRMED'
                  const isCurrentProcessing = processingId === res.id
                  const pinCode = res.pickupVerificationCode || res.pickupCode

                  return (
                    <tr key={res.id} className="hover:bg-slate-800/50 transition">
                      <td className="py-4 px-4 font-mono text-emerald-400 font-semibold truncate max-w-[120px]" title={res.id}>
                        {res.id}
                      </td>

                      <td className="py-4 px-4">
                        <p className="font-bold text-white leading-tight">{res.donation?.title || 'Food Listing'}</p>
                        <p className="text-[10px] text-slate-400">
                          {res.donation?.quantity} {res.donation?.quantityUnit}
                        </p>
                      </td>

                      <td className="py-4 px-4">
                        <p className="font-bold text-slate-200">{res.ngo?.name || 'NGO Partner'}</p>
                        <p className="text-[10px] text-slate-400">{res.ngo?.phone || res.ngo?.email || 'N/A'}</p>
                      </td>

                      {/* Verification Status & PIN Column */}
                      <td className="py-4 px-4">
                        {isConfirmed && pinCode ? (
                          <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-2xl space-y-2 max-w-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1">
                                <KeyRound className="h-3 w-3" />
                                <span>Pickup Verification PIN</span>
                              </span>
                              <span className="text-[9px] font-semibold text-emerald-300/80 flex items-center space-x-1">
                                <Clock className="h-2.5 w-2.5" />
                                <span>{formatExpiryCountdown(res.pickupVerificationExpiresAt)}</span>
                              </span>
                            </div>

                            {/* Large PIN Display */}
                            <div className="flex items-center justify-between bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                              <span className="text-xl font-black font-mono tracking-widest text-white">
                                {pinCode.split('').join(' ')}
                              </span>
                              <button
                                onClick={() => handleCopyPin(pinCode, res.id)}
                                className="text-emerald-400 hover:text-emerald-300 p-1 rounded-lg hover:bg-slate-900 transition flex items-center space-x-1"
                                title="Copy PIN"
                              >
                                {copiedId === res.id ? (
                                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </button>
                            </div>

                            {/* PIN Warning & Regenerate */}
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-slate-400 text-[9.5px] flex items-center space-x-1">
                                <ShieldAlert className="h-3 w-3 text-amber-400 shrink-0" />
                                <span>Share PIN only upon NGO arrival</span>
                              </span>
                              <button
                                onClick={() => regeneratePinMutation.mutate(res.id)}
                                disabled={isCurrentProcessing}
                                className="text-emerald-400 hover:underline font-bold text-[10px] shrink-0"
                              >
                                Regenerate
                              </button>
                            </div>
                          </div>
                        ) : (
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                              res.status === 'PENDING'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                : res.status === 'COMPLETED'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}
                          >
                            {res.status}
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-right">
                        {isPending ? (
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => confirmMutation.mutate(res.id)}
                              disabled={isCurrentProcessing}
                              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1 transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                            >
                              {isCurrentProcessing ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                              )}
                              <span>Confirm</span>
                            </button>

                            <button
                              onClick={() => rejectMutation.mutate(res.id)}
                              disabled={isCurrentProcessing}
                              className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 px-3 py-1.5 rounded-xl border border-rose-500/30 text-xs font-semibold flex items-center space-x-1 transition disabled:opacity-50"
                            >
                              {isCurrentProcessing ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <X className="h-3.5 w-3.5" />
                              )}
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : isConfirmed ? (
                          <span className="text-emerald-400 font-bold text-xs flex items-center justify-end space-x-1">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            <span>Confirmed & PIN Issued</span>
                          </span>
                        ) : (
                          <span className="text-slate-500 text-xs font-medium capitalize">
                            {res.status.toLowerCase()}
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-4 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing Page <strong className="text-white">{pagination.page}</strong> of{' '}
              <strong className="text-white">{pagination.totalPages}</strong> ({pagination.totalItems} items)
            </span>

            <div className="flex space-x-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
