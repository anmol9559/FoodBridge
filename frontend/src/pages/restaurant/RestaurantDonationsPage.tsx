import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { PlusCircle, Search, Filter, Package, Eye, Edit3, Trash2, ChevronLeft, ChevronRight, AlertCircle, RefreshCw, CheckCircle2, Recycle } from 'lucide-react'
import { getRestaurantDonations } from '../../api/restaurant.api'
import { FoodDonation } from '../../types'
import { CreateDonationModal } from '../../features/restaurant/components/CreateDonationModal'
import { EditDonationModal } from '../../features/restaurant/components/EditDonationModal'
import { DonationDetailsModal } from '../../features/restaurant/components/DonationDetailsModal'
import { DeleteDonationDialog } from '../../features/restaurant/components/DeleteDonationDialog'
import { RecoverFoodModal } from '../../features/restaurant/components/RecoverFoodModal'

export const RestaurantDonationsPage: React.FC = () => {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedDonationForView, setSelectedDonationForView] = useState<FoodDonation | null>(null)
  const [selectedDonationForEdit, setSelectedDonationForEdit] = useState<FoodDonation | null>(null)
  const [selectedDonationForDelete, setSelectedDonationForDelete] = useState<FoodDonation | null>(null)
  const [selectedDonationForRecover, setSelectedDonationForRecover] = useState<FoodDonation | null>(null)

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null)

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
    queryKey: ['restaurantDonations', page, limit, statusFilter, search],
    queryFn: () =>
      getRestaurantDonations({
        page,
        limit,
        status: statusFilter || undefined,
        search: search || undefined,
      }),
  })

  const donations = data?.donations || []
  const pagination = data?.pagination

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#181818] border border-[#2E2E2E] p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">My Food Donations & Recovery</h1>
          <p className="text-sm text-neutral-400">View, create, update, or recover expired food listings to achieve Zero Waste.</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 px-5 rounded-2xl flex items-center space-x-2 transition shadow-lg shadow-emerald-950/40"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Create New Listing</span>
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-emerald-950/60 border border-emerald-800/40 p-4 rounded-2xl flex items-center space-x-3 text-xs text-emerald-300">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Search donation title or recovery notes..."
            className="w-full bg-[#141414] border border-[#333333] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setPage(1)
            }}
            className="bg-[#141414] border border-[#333333] text-neutral-300 px-4 py-2.5 rounded-2xl text-xs font-semibold focus:outline-none focus:border-emerald-600 appearance-none pr-8 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="RESERVED">RESERVED</option>

            <option value="COMPLETED">COMPLETED</option>
            <option value="EXPIRED">EXPIRED</option>
            <option value="RECOVERY_PENDING">RECOVERY_PENDING</option>
            <option value="RECOVERED">RECOVERED</option>
          </select>
          <Filter className="absolute right-3 top-3 h-3.5 w-3.5 text-neutral-400 pointer-events-none" />
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="bg-rose-950/40 border border-rose-800/40 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-rose-300">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-200">Failed to load food donations</p>
              <p className="text-rose-400/80">
                {(error as { response?: { data?: { error?: { message?: string } } }; message?: string })?.response?.data?.error?.message ||
                  (error as Error)?.message ||
                  'An unexpected error occurred while fetching your food listings.'}
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

      {/* Table Content Container */}
      <div className="bg-[#181818] border border-[#2E2E2E] rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111111] border-b border-[#2E2E2E] text-neutral-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Donation Title</th>
                <th className="py-3.5 px-4">Food Type</th>
                <th className="py-3.5 px-4">Quantity</th>
                <th className="py-3.5 px-4">Servings</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Expires At</th>
                <th className="py-3.5 px-4">Recovery Method</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E2E2E] text-neutral-200">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-3.5 px-4">
                      <div className="h-4 bg-[#222222] rounded w-40" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-4 bg-[#222222] rounded w-16" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-4 bg-[#222222] rounded w-20" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-4 bg-[#222222] rounded w-12" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-5 bg-[#222222] rounded-full w-20" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-4 bg-[#222222] rounded w-28" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-4 bg-[#222222] rounded w-24" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="h-4 bg-[#222222] rounded w-16 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : donations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-500 space-y-2">
                    <Package className="h-8 w-8 mx-auto text-neutral-600" />
                    <p className="font-semibold text-neutral-400">No food donations found.</p>
                    <p className="text-[11px] text-neutral-500">Create a new listing or adjust your search filters.</p>
                  </td>
                </tr>
              ) : (
                donations.map((item) => {
                  const isExpired = item.status === 'EXPIRED' || (item.expiresAt && new Date(item.expiresAt) < new Date() && item.status === 'AVAILABLE')
                  const canRecover = isExpired && item.status !== 'RECOVERED'

                  return (
                    <tr key={item.id} className="hover:bg-[#202020] transition">
                      <td className="py-3.5 px-4 font-semibold text-white">
                        <div className="flex items-center space-x-2">
                          <Package className="h-4 w-4 text-emerald-400 shrink-0" />
                          <span className="truncate max-w-[180px]">{item.title}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#111111] text-neutral-300 border border-[#2E2E2E]">
                          {item.foodType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {item.quantity} {item.quantityUnit}
                      </td>
                      <td className="py-3.5 px-4 text-emerald-400 font-semibold">
                        {item.estimatedServings || item.quantity}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            item.status === 'AVAILABLE'
                              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                              : item.status === 'RESERVED'
                              ? 'bg-blue-950/60 text-blue-400 border-blue-800/40'
                              : item.status === 'COMPLETED'
                              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                              : item.status === 'RECOVERED'
                              ? 'bg-purple-950/60 text-purple-400 border-purple-800/40'
                              : item.status === 'RECOVERY_PENDING'
                              ? 'bg-amber-950/60 text-amber-400 border-amber-800/40'
                              : item.status === 'EXPIRED' || isExpired
                              ? 'bg-rose-950/60 text-rose-400 border-rose-800/40'
                              : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                          }`}
                        >
                          {item.status === 'AVAILABLE' && isExpired ? 'EXPIRED' : item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-400">
                        {item.expiresAt ? new Date(item.expiresAt).toLocaleString() : 'N/A'}
                      </td>
                      <td className="py-3.5 px-4 text-neutral-300">
                        {item.recoveryMethod ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-800/40">
                            {item.recoveryMethod}
                          </span>
                        ) : (
                          <span className="text-neutral-500">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {canRecover && (
                            <button
                              onClick={() => setSelectedDonationForRecover(item)}
                              className="px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center space-x-1.5 transition shadow-sm"
                              title="Recover Expired Food"
                            >
                              <Recycle className="h-3.5 w-3.5" />
                              <span>Recover Food</span>
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedDonationForView(item)}
                            className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-[#222222] transition"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => setSelectedDonationForEdit(item)}
                            className="p-1.5 rounded-xl text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition"
                            title="Edit Donation"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => setSelectedDonationForDelete(item)}
                            className="p-1.5 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition"
                            title="Delete Donation"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
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
          <div className="px-4 py-3 bg-[#111111] border-t border-[#2E2E2E] flex items-center justify-between text-xs text-neutral-400">
            <span>
              Showing Page <strong className="text-white">{pagination.page}</strong> of{' '}
              <strong className="text-white">{pagination.totalPages}</strong> ({pagination.totalItems} items)
            </span>

            <div className="flex space-x-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-1.5 rounded-xl bg-[#141414] border border-[#333333] text-neutral-300 hover:bg-[#222222] disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
                className="p-1.5 rounded-xl bg-[#141414] border border-[#333333] text-neutral-300 hover:bg-[#222222] disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateDonationModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => {
          refetch()
          showToast('Food donation created successfully!')
        }}
      />

      <EditDonationModal
        donation={selectedDonationForEdit}
        isOpen={!!selectedDonationForEdit}
        onClose={() => setSelectedDonationForEdit(null)}
        onSuccess={() => {
          refetch()
          showToast('Food donation updated successfully!')
        }}
      />

      <DonationDetailsModal
        donation={selectedDonationForView}
        isOpen={!!selectedDonationForView}
        onClose={() => setSelectedDonationForView(null)}
      />

      <DeleteDonationDialog
        donation={selectedDonationForDelete}
        isOpen={!!selectedDonationForDelete}
        onClose={() => setSelectedDonationForDelete(null)}
        onSuccess={() => {
          refetch()
          showToast('Food donation deleted successfully.')
        }}
      />

      <RecoverFoodModal
        donation={selectedDonationForRecover}
        isOpen={!!selectedDonationForRecover}
        onClose={() => setSelectedDonationForRecover(null)}
        onSuccess={() => {
          refetch()
          showToast('Food recovery details submitted successfully! Status updated to RECOVERED.')
        }}
      />
    </div>
  )
}
