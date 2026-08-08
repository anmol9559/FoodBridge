import React, { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Package, Search, Filter, ChevronLeft, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react'
import { getAdminDonations } from '../../api/admin.api'

export const AdminDonationsPage: React.FC = () => {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['adminDonations', page, limit, statusFilter, search],
    queryFn: () => getAdminDonations({ page, limit, status: statusFilter || undefined, search: search || undefined }),
  })

  const donations = data?.donations || []
  const pagination = data?.pagination

  const filteredDonations = useMemo(() => {
    if (!search.trim()) return donations
    const q = search.toLowerCase()
    return donations.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.restaurant?.name?.toLowerCase().includes(q) ||
        d.foodType.toLowerCase().includes(q)
    )
  }, [donations, search])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Platform Food Donations</h1>
          <p className="text-sm text-slate-400">Audit all food donations published across all restaurant organizations.</p>
        </div>

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
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="RESERVED">RESERVED</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="EXPIRED">EXPIRED</option>
          </select>
          <Filter className="absolute right-3 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search donation title or restaurant..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Error State */}
      {isError && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-rose-300">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-200">Failed to load platform donations</p>
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

      {/* Table Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Title</th>
                <th className="py-3.5 px-4">Restaurant</th>
                <th className="py-3.5 px-4">Quantity</th>
                <th className="py-3.5 px-4">Food Type</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-3.5 px-4"><div className="h-4 bg-slate-800 rounded w-40" /></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-slate-800 rounded w-32" /></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-slate-800 rounded w-20" /></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-slate-800 rounded w-16" /></td>
                    <td className="py-3.5 px-4 text-right"><div className="h-5 bg-slate-800 rounded-full w-20 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredDonations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 space-y-2">
                    <Package className="h-8 w-8 mx-auto text-slate-600" />
                    <p className="font-bold text-slate-300">No donations found.</p>
                    <p className="text-[11px] text-slate-500">There are no food donations matching your search or filter.</p>
                  </td>
                </tr>
              ) : (
                filteredDonations.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/50 transition">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-emerald-400 shrink-0" />
                        <span className="truncate max-w-[200px]">{item.title}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{item.restaurant?.name}</td>
                    <td className="py-3.5 px-4">{item.quantity} {item.quantityUnit}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {item.foodType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
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
                    </td>
                  </tr>
                ))
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
