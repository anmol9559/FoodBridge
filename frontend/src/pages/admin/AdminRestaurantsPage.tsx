import React, { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Building2, Search, ChevronLeft, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react'
import { getAdminRestaurants } from '../../api/admin.api'

export const AdminRestaurantsPage: React.FC = () => {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [search, setSearch] = useState('')

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['adminRestaurants', page, limit, search],
    queryFn: () => getAdminRestaurants({ page, limit, search: search || undefined }),
  })

  const restaurants = data?.restaurants || []
  const pagination = data?.pagination

  const filteredRestaurants = useMemo(() => {
    if (!search.trim()) return restaurants
    const q = search.toLowerCase()
    return restaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        (r.registrationNumber && r.registrationNumber.toLowerCase().includes(q))
    )
  }, [restaurants, search])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h1 className="text-2xl font-bold text-white tracking-tight">Restaurant Directory</h1>
        <p className="text-sm text-slate-400">View and audit all registered restaurant organizations and their owner contacts.</p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search restaurant name or email..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Error State */}
      {isError && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-rose-300">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-200">Failed to load restaurant directory</p>
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
                <th className="py-3.5 px-4">Organization</th>
                <th className="py-3.5 px-4">Reg Number</th>
                <th className="py-3.5 px-4">Contact Phone</th>
                <th className="py-3.5 px-4">Owner Name</th>
                <th className="py-3.5 px-4 text-right">Owner Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-3.5 px-4"><div className="h-4 bg-slate-800 rounded w-40" /></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-slate-800 rounded w-24" /></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-slate-800 rounded w-28" /></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-slate-800 rounded w-32" /></td>
                    <td className="py-3.5 px-4 text-right"><div className="h-4 bg-slate-800 rounded w-40 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredRestaurants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 space-y-2">
                    <Building2 className="h-8 w-8 mx-auto text-slate-600" />
                    <p className="font-bold text-slate-300">No restaurants found.</p>
                    <p className="text-[11px] text-slate-500">There are no restaurant organizations matching your search query.</p>
                  </td>
                </tr>
              ) : (
                filteredRestaurants.map((org) => (
                  <tr key={org.id} className="hover:bg-slate-800/50 transition">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4 text-amber-400 shrink-0" />
                        <span className="truncate max-w-[200px]">{org.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{org.registrationNumber || 'N/A'}</td>
                    <td className="py-3.5 px-4 text-slate-300">{org.phone || 'N/A'}</td>
                    <td className="py-3.5 px-4">
                      {org.owner ? `${org.owner.firstName} ${org.owner.lastName}` : 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-right">{org.email || org.owner?.email || 'N/A'}</td>
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
