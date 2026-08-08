import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CalendarCheck, Filter, ChevronLeft, ChevronRight, AlertCircle, RefreshCw, Eye, MapPin, Building2, Utensils } from 'lucide-react'
import { getNgoReservations } from '../../api/ngo.api'
import { Reservation } from '../../types'
import { NgoReservationDetailsModal } from '../../features/ngo/components/NgoReservationDetailsModal'

export const NgoReservationsPage: React.FC = () => {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['ngoReservations', page, limit, statusFilter],
    queryFn: () => getNgoReservations({ page, limit, status: statusFilter || undefined }),
  })

  const reservations = data?.reservations || []
  const pagination = data?.pagination

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <CalendarCheck className="h-6 w-6 text-emerald-400" />
            <span>My Food Reservations</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage reserved surplus food donations, inspect pickup details, and verify handoff PIN codes.</p>
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
              <option value="">All Statuses</option>
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

      {/* Fetch Error State Banner */}
      {isError && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-rose-300">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-200">Failed to load reservations</p>
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
                <th className="py-3.5 px-4">Surplus Item</th>
                <th className="py-3.5 px-4">Restaurant Donor</th>
                <th className="py-3.5 px-4">Quantity / Servings</th>
                <th className="py-3.5 px-4">Pickup Address</th>
                <th className="py-3.5 px-4">Expiry Time</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-3.5 px-4"><div className="h-4 bg-slate-800 rounded w-40" /></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-slate-800 rounded w-32" /></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-slate-800 rounded w-24" /></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-slate-800 rounded w-36" /></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-slate-800 rounded w-28" /></td>
                    <td className="py-3.5 px-4"><div className="h-5 bg-slate-800 rounded-full w-20" /></td>
                    <td className="py-3.5 px-4 text-right"><div className="h-6 bg-slate-800 rounded w-24 ml-auto" /></td>
                  </tr>
                ))
              ) : reservations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 space-y-2">
                    <CalendarCheck className="h-8 w-8 mx-auto text-slate-600" />
                    <p className="font-semibold text-slate-300">No food reservations found matching filters.</p>
                    <p className="text-[11px] text-slate-500">Browse active surplus donations on the portal to reserve meals.</p>
                  </td>
                </tr>
              ) : (
                reservations.map((res) => {
                  const donation = res.donation
                  const restaurant = donation?.restaurant
                  const location = restaurant?.locations?.[0]
                  const addressText = donation?.pickupAddress || location?.addressLine1 || 'Contact Restaurant'

                  return (
                    <tr key={res.id} className="hover:bg-slate-800/50 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                            <Utensils className="h-4 w-4 text-emerald-400" />
                          </div>
                          <div>
                            <p className="font-bold text-white leading-tight">{donation?.title || 'Food Donation'}</p>
                            <p className="text-[10px] text-slate-400 font-mono">ID: {res.id}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2 text-slate-200 font-semibold">
                          <Building2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                          <span>{restaurant?.name || 'Restaurant Partner'}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-100">{donation?.quantity} {donation?.quantityUnit}</p>
                        <p className="text-[10px] text-slate-400">~{donation?.estimatedServings || 'N/A'} Servings</p>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">
                        <div className="flex items-center space-x-1 max-w-[180px] truncate" title={addressText}>
                          <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                          <span className="truncate">{addressText}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-rose-300 font-semibold">
                        {donation?.expiresAt ? new Date(donation.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            res.status === 'COMPLETED'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : res.status === 'CONFIRMED'
                              ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                              : res.status === 'REJECTED' || res.status === 'CANCELLED'
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}
                        >
                          {res.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedReservation(res)}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3 py-1.5 rounded-xl text-[11px] inline-flex items-center space-x-1.5 transition border border-slate-700"
                        >
                          <Eye className="h-3.5 w-3.5 text-emerald-400" />
                          <span>View Details</span>
                        </button>
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

      {/* NGO RESERVATION DETAILS MODAL */}
      {selectedReservation && (
        <NgoReservationDetailsModal
          reservation={selectedReservation}
          onClose={() => setSelectedReservation(null)}
        />
      )}
    </div>
  )
}
