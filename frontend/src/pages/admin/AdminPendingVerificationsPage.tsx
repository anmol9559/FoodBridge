import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Search,
  Eye,
  Building2,
  Mail,
  Phone,
  User,
  MapPin,
  Globe,
  FileText,
  Clock,
  ShieldCheck,
  X,
  AlertTriangle,
  History,
  Lock,
  EyeOff,
  ExternalLink,
  Loader2,
} from 'lucide-react'
import { getPendingOrganizationsApi, verifyOrganizationApi, AdminOrganizationItem } from '../../api/admin.api'

const REJECTION_PRESETS = [
  'Invalid Documents',
  'Duplicate Registration',
  'Fake Organization',
  'Missing Address',
  'Other',
]

export const AdminPendingVerificationsPage: React.FC = () => {
  const queryClient = useQueryClient()

  // Selected Organization Details Modal State
  const [selectedOrg, setSelectedOrg] = useState<AdminOrganizationItem | null>(null)

  // Approval Modal State
  const [approvingOrg, setApprovingOrg] = useState<AdminOrganizationItem | null>(null)
  const [approvalConfirmText, setApprovalConfirmText] = useState('')

  // Rejection Modal State
  const [rejectingOrg, setRejectingOrg] = useState<AdminOrganizationItem | null>(null)
  const [rejectionConfirmText, setRejectionConfirmText] = useState('')
  const [rejectionPreset, setRejectionPreset] = useState<string>('Invalid Documents')
  const [rejectionNotes, setRejectionNotes] = useState('')

  // Admin Password & UI Controls
  const [adminPassword, setAdminPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Filter States
  const [statusFilter, setStatusFilter] = useState<string>('PENDING')
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Feedback Toasts & Errors
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [isSubmittingAction, setIsSubmittingAction] = useState(false)

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
    queryKey: ['adminPendingOrganizations', statusFilter, typeFilter, searchQuery],
    queryFn: () =>
      getPendingOrganizationsApi({
        status: statusFilter || undefined,
        type: typeFilter || undefined,
        search: searchQuery || undefined,
      }),
  })

  const organizations = data?.organizations || []

  // Close all dialogs & reset form inputs
  const resetModals = () => {
    setApprovingOrg(null)
    setRejectingOrg(null)
    setApprovalConfirmText('')
    setRejectionConfirmText('')
    setRejectionPreset('Invalid Documents')
    setRejectionNotes('')
    setAdminPassword('')
    setShowPassword(false)
    setActionError(null)
    setIsSubmittingAction(false)
  }

  // Open Approval Modal
  const handleOpenApproveModal = (org: AdminOrganizationItem) => {
    resetModals()
    setApprovingOrg(org)
  }

  // Open Rejection Modal
  const handleOpenRejectModal = (org: AdminOrganizationItem) => {
    resetModals()
    setRejectingOrg(org)
  }

  // Submit Approval Action
  const handleConfirmApproval = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!approvingOrg) return
    if (approvalConfirmText.trim() !== 'APPROVE') {
      setActionError('Please type APPROVE exactly to confirm.')
      return
    }
    if (!adminPassword) {
      setActionError('Admin password is required to approve this organization.')
      return
    }

    setIsSubmittingAction(true)
    setActionError(null)

    try {
      await verifyOrganizationApi(approvingOrg.id, 'VERIFIED', adminPassword)
      setSelectedOrg(null)
      resetModals()
      showToast(`Organization "${approvingOrg.name}" has been approved & verified successfully.`)
      queryClient.invalidateQueries({ queryKey: ['adminPendingOrganizations'] })
      queryClient.invalidateQueries({ queryKey: ['adminDashboardStats'] })
      queryClient.invalidateQueries({ queryKey: ['adminRestaurants'] })
      queryClient.invalidateQueries({ queryKey: ['adminNgos'] })
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { error?: { message?: string } } }; message?: string }
      setActionError(
        errorObj.response?.data?.error?.message ||
          errorObj.message ||
          'Invalid admin password or verification error.'
      )
    } finally {
      setIsSubmittingAction(false)
    }
  }

  // Submit Rejection Action
  const handleConfirmRejection = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rejectingOrg) return
    if (rejectionConfirmText.trim() !== 'REJECT') {
      setActionError('Please type REJECT exactly to confirm.')
      return
    }
    if (!adminPassword) {
      setActionError('Admin password is required to reject this organization.')
      return
    }

    const finalReason =
      rejectionPreset === 'Other'
        ? rejectionNotes.trim()
        : rejectionNotes.trim()
        ? `${rejectionPreset}: ${rejectionNotes.trim()}`
        : rejectionPreset

    if (!finalReason) {
      setActionError('A mandatory rejection reason is required.')
      return
    }

    setIsSubmittingAction(true)
    setActionError(null)

    try {
      await verifyOrganizationApi(rejectingOrg.id, 'REJECTED', adminPassword, finalReason)
      setSelectedOrg(null)
      resetModals()
      showToast(`Organization "${rejectingOrg.name}" status updated to REJECTED.`)
      queryClient.invalidateQueries({ queryKey: ['adminPendingOrganizations'] })
      queryClient.invalidateQueries({ queryKey: ['adminDashboardStats'] })
      queryClient.invalidateQueries({ queryKey: ['adminRestaurants'] })
      queryClient.invalidateQueries({ queryKey: ['adminNgos'] })
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { error?: { message?: string } } }; message?: string }
      setActionError(
        errorObj.response?.data?.error?.message ||
          errorObj.message ||
          'Invalid admin password or verification error.'
      )
    } finally {
      setIsSubmittingAction(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#181818] border border-[#2E2E2E] p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
            <span>Organization Verification Portal</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">Review registration applications, inspect verification proofs, and execute secure approvals with admin authentication.</p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="bg-[#111111] hover:bg-[#222222] border border-[#333333] text-neutral-300 font-bold px-3.5 py-2 rounded-2xl text-xs flex items-center space-x-2 transition disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Success Toast Banner */}
      {toastMessage && (
        <div className="bg-emerald-950/60 border border-emerald-800/40 p-4 rounded-2xl flex items-center space-x-3 text-xs text-emerald-300 animate-in fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Action Error Banner */}
      {actionError && (
        <div className="bg-rose-950/40 border border-rose-800/40 p-4 rounded-2xl flex items-center justify-between text-xs text-rose-300 animate-in fade-in">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="text-rose-400 font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Fetch Error State Banner */}
      {isError && (
        <div className="bg-rose-950/40 border border-rose-800/40 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-rose-300">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-200">Failed to load organizations</p>
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
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl flex items-center space-x-2 transition disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Control Filter Bar */}
      <div className="bg-[#181818] border border-[#2E2E2E] p-4 rounded-3xl flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 shadow-xl">
        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1.5 bg-[#111111] p-1.5 rounded-2xl border border-[#2E2E2E]">
          {[
            { id: 'PENDING', label: 'Pending Approval' },
            { id: 'VERIFIED', label: 'Verified' },
            { id: 'REJECTED', label: 'Rejected' },
            { id: '', label: 'All Orgs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                statusFilter === tab.id
                  ? 'bg-emerald-600 text-white font-extrabold shadow-md shadow-emerald-950/40'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Type Filter Selector */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-[#141414] border border-[#333333] text-neutral-300 text-xs px-3.5 py-2.5 rounded-2xl focus:outline-none focus:border-emerald-600 cursor-pointer"
          >
            <option value="">All Types (Restaurant & NGO)</option>
            <option value="RESTAURANT">Restaurants & Hotels</option>
            <option value="NGO">NGO Partners</option>
          </select>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search org name, email..."
              className="w-full bg-[#141414] border border-[#333333] text-xs text-white placeholder-neutral-500 pl-9 pr-3 py-2.5 rounded-2xl focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>
      </div>

      {/* Main Table List */}
      <div className="bg-[#181818] border border-[#2E2E2E] rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111111] border-b border-[#2E2E2E] text-neutral-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-4 px-4">Organization Name</th>
                <th className="py-4 px-4">Type</th>
                <th className="py-4 px-4">License / Reg Number</th>
                <th className="py-4 px-4">Primary Contact</th>
                <th className="py-4 px-4">Location</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E2E2E] text-neutral-200">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-4"><div className="h-4 bg-[#222222] rounded w-44" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-[#222222] rounded w-20" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-[#222222] rounded w-28" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-[#222222] rounded w-36" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-[#222222] rounded w-32" /></td>
                    <td className="py-4 px-4"><div className="h-5 bg-[#222222] rounded-full w-20" /></td>
                    <td className="py-4 px-4 text-right"><div className="h-6 bg-[#222222] rounded-xl w-24 ml-auto" /></td>
                  </tr>
                ))
              ) : organizations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500 space-y-2">
                    <Building2 className="h-8 w-8 mx-auto text-neutral-600" />
                    <p className="font-bold text-neutral-300">No organizations found.</p>
                    <p className="text-[11px] text-neutral-500">No organization records match your current status or filter criteria.</p>
                  </td>
                </tr>
              ) : (
                organizations.map((org) => {
                  const primaryLoc = org.locations?.[0]
                  const owner = org.users?.[0] || org.owner

                  return (
                    <tr key={org.id} className="hover:bg-[#202020] transition">
                      <td className="py-4 px-4 font-bold text-white">
                        <div className="flex items-center space-x-2.5">
                          <div className="p-2 rounded-xl bg-[#111111] border border-[#2E2E2E] text-emerald-400 shrink-0">
                            <Building2 className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-white font-extrabold">{org.name}</p>
                            <p className="text-[10.5px] text-neutral-400 font-normal">Registered {new Date(org.createdAt || Date.now()).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            org.type === 'RESTAURANT'
                              ? 'bg-amber-950/60 text-amber-400 border-amber-800/40'
                              : 'bg-blue-950/60 text-blue-400 border-blue-800/40'
                          }`}
                        >
                          {org.type}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-mono font-semibold text-neutral-300">
                        {org.registrationNumber || <span className="text-neutral-500 font-normal">Pending submission</span>}
                      </td>

                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-neutral-200">{owner ? `${owner.firstName} ${owner.lastName}` : 'N/A'}</p>
                          <p className="text-[10.5px] text-neutral-400">{org.email || owner?.email}</p>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-neutral-300">
                        {primaryLoc ? (
                          <div className="space-y-0.5">
                            <p className="font-medium text-white truncate max-w-[160px]">{primaryLoc.addressLine1}</p>
                            <p className="text-[10.5px] text-neutral-400">{primaryLoc.city}, {primaryLoc.state || ''} {primaryLoc.postalCode || ''}</p>
                          </div>
                        ) : (
                          <span className="text-neutral-500 font-normal">No address provided.</span>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            org.verificationStatus === 'VERIFIED'
                              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                              : org.verificationStatus === 'REJECTED'
                              ? 'bg-rose-950/60 text-rose-400 border-rose-800/40'
                              : 'bg-amber-950/60 text-amber-400 border-amber-800/40'
                          }`}
                        >
                          {org.verificationStatus || 'PENDING'}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => setSelectedOrg(org)}
                            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-[#222222] transition"
                            title="Inspect Organization Proofs & Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {org.verificationStatus !== 'VERIFIED' && (
                            <button
                              onClick={() => handleOpenApproveModal(org)}
                              className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center space-x-1 transition shadow-sm"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Approve</span>
                            </button>
                          )}

                          {org.verificationStatus !== 'REJECTED' && (
                            <button
                              onClick={() => handleOpenRejectModal(org)}
                              className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-600/30 transition"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              <span>Reject</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 1. SECURE APPROVAL MODAL WITH ADMIN PASSWORD & "APPROVE" TEXT      */}
      {/* ------------------------------------------------------------------ */}
      {approvingOrg && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#181818] border border-[#2E2E2E] rounded-3xl p-6 shadow-2xl space-y-5 text-white animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-[#2E2E2E] pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-400">
                  <ShieldCheck className="h-6 w-6 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Approve & Verify Organization</h3>
                  <p className="text-xs text-neutral-400">{approvingOrg.name}</p>
                </div>
              </div>
              <button onClick={resetModals} className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-[#222222]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-800/30 text-xs text-emerald-300 leading-relaxed">
              <span className="font-bold text-emerald-400 block mb-0.5">Elevate to Verified Partner</span>
              Approving this organization will allow them to post surplus food donations or reserve active food listings.
            </div>

            {actionError && (
              <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-800/40 text-xs text-rose-300 flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{actionError}</span>
              </div>
            )}

            <form onSubmit={handleConfirmApproval} className="space-y-4">
              {/* Type APPROVE Confirmation */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
                  Confirmation Text <span className="text-emerald-500">*</span>
                </label>
                <p className="text-[11px] text-neutral-400">
                  Type <strong className="text-white font-mono uppercase">APPROVE</strong> to enable activation.
                </p>
                <input
                  type="text"
                  value={approvalConfirmText}
                  onChange={(e) => setApprovalConfirmText(e.target.value)}
                  placeholder="APPROVE"
                  className="w-full bg-[#141414] border border-[#333333] rounded-2xl px-4 py-3 text-xs text-white font-mono focus:outline-none focus:border-emerald-600 transition"
                  required
                />
              </div>

              {/* Admin Password Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
                  Admin Password <span className="text-emerald-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter your administrator password"
                    className="w-full bg-[#141414] border border-[#333333] rounded-2xl pl-4 pr-10 py-3 text-xs text-white focus:outline-none focus:border-emerald-600 transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-neutral-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-[#2E2E2E]">
                <button
                  type="button"
                  onClick={resetModals}
                  className="px-5 py-2.5 rounded-2xl text-xs font-bold text-neutral-400 hover:text-white hover:bg-[#222222]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={approvalConfirmText.trim() !== 'APPROVE' || !adminPassword || isSubmittingAction}
                  className="px-6 py-2.5 rounded-2xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center space-x-2 transition shadow-lg shadow-emerald-950/40 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSubmittingAction ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Verifying Password...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Confirm & Approve</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 2. SECURE REJECTION MODAL WITH ADMIN PASSWORD & "REJECT" TEXT        */}
      {/* ------------------------------------------------------------------ */}
      {rejectingOrg && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#181818] border border-[#2E2E2E] rounded-3xl p-6 shadow-2xl space-y-5 text-white animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-[#2E2E2E] pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-800/40 text-rose-400">
                  <XCircle className="h-6 w-6 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Reject Organization</h3>
                  <p className="text-xs text-neutral-400">{rejectingOrg.name}</p>
                </div>
              </div>
              <button onClick={resetModals} className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-[#222222]">
                <X className="h-5 w-5" />
              </button>
            </div>

            {actionError && (
              <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-800/40 text-xs text-rose-300 flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{actionError}</span>
              </div>
            )}

            <form onSubmit={handleConfirmRejection} className="space-y-4">
              {/* Preset Reason Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
                  Mandatory Rejection Reason <span className="text-rose-500">*</span>
                </label>
                <select
                  value={rejectionPreset}
                  onChange={(e) => setRejectionPreset(e.target.value)}
                  className="w-full bg-[#141414] border border-[#333333] rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-rose-600 transition"
                  required
                >
                  {REJECTION_PRESETS.map((preset) => (
                    <option key={preset} value={preset}>
                      {preset}
                    </option>
                  ))}
                </select>
              </div>

              {/* Additional Notes Textarea */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
                  Detailed Explanation / Notes <span className="text-neutral-500">(Optional)</span>
                </label>
                <textarea
                  value={rejectionNotes}
                  onChange={(e) => setRejectionNotes(e.target.value)}
                  placeholder="Provide specific details regarding missing certificates or invalid proof..."
                  rows={2}
                  className="w-full bg-[#141414] border border-[#333333] rounded-2xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-600 transition"
                />
              </div>

              {/* Type REJECT Confirmation */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
                  Confirmation Text <span className="text-rose-500">*</span>
                </label>
                <p className="text-[11px] text-neutral-400">
                  Type <strong className="text-white font-mono uppercase">REJECT</strong> to enable action.
                </p>
                <input
                  type="text"
                  value={rejectionConfirmText}
                  onChange={(e) => setRejectionConfirmText(e.target.value)}
                  placeholder="REJECT"
                  className="w-full bg-[#141414] border border-[#333333] rounded-2xl px-4 py-3 text-xs text-white font-mono focus:outline-none focus:border-rose-600 transition"
                  required
                />
              </div>

              {/* Admin Password Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
                  Admin Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter your administrator password"
                    className="w-full bg-[#141414] border border-[#333333] rounded-2xl pl-4 pr-10 py-3 text-xs text-white focus:outline-none focus:border-rose-600 transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-neutral-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-[#2E2E2E]">
                <button
                  type="button"
                  onClick={resetModals}
                  className="px-5 py-2.5 rounded-2xl text-xs font-bold text-neutral-400 hover:text-white hover:bg-[#222222]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={rejectionConfirmText.trim() !== 'REJECT' || !adminPassword || isSubmittingAction}
                  className="px-6 py-2.5 rounded-2xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white flex items-center space-x-2 transition shadow-lg shadow-rose-950/40 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSubmittingAction ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Verifying Password...</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4" />
                      <span>Confirm & Reject</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 3. ORGANIZATION DETAILS INSPECTION MODAL (WITH FULL ADDRESS & MAP)  */}
      {/* ------------------------------------------------------------------ */}
      {selectedOrg && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#181818] border border-[#2E2E2E] rounded-3xl p-6 shadow-2xl space-y-6 text-white my-8 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-[#2E2E2E] pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-400">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-bold text-white">{selectedOrg.name}</h2>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase ${
                        selectedOrg.verificationStatus === 'VERIFIED'
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                          : selectedOrg.verificationStatus === 'REJECTED'
                          ? 'bg-rose-950/60 text-rose-400 border-rose-800/40'
                          : 'bg-amber-950/60 text-amber-400 border-amber-800/40'
                      }`}
                    >
                      {selectedOrg.verificationStatus || 'PENDING'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Organization Type: <strong className="text-white">{selectedOrg.type}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrg(null)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-xl hover:bg-[#222222]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Audit Log / Rejection Banner */}
            {(selectedOrg.verificationStatus === 'VERIFIED' || selectedOrg.verificationStatus === 'REJECTED') && (
              <div className="bg-[#111111] p-4 rounded-2xl border border-[#2E2E2E] space-y-2 text-xs">
                <h3 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center space-x-2">
                  <History className="h-4 w-4 text-purple-400" />
                  <span>Audit Log & Verification Metadata</span>
                </h3>

                {selectedOrg.verificationStatus === 'VERIFIED' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-neutral-500 block text-[10px] uppercase font-bold">Approved By</span>
                      <span className="text-emerald-400 font-semibold">
                        {selectedOrg.verifiedBy
                          ? `${selectedOrg.verifiedBy.firstName} ${selectedOrg.verifiedBy.lastName} (${selectedOrg.verifiedBy.email})`
                          : 'Authorized Admin'}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[10px] uppercase font-bold">Approval Time</span>
                      <span className="text-white font-semibold">
                        {selectedOrg.verifiedAt ? new Date(selectedOrg.verifiedAt).toLocaleString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                )}

                {selectedOrg.verificationStatus === 'REJECTED' && (
                  <div className="space-y-2 text-[11px]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <span className="text-neutral-500 block text-[10px] uppercase font-bold">Rejected By</span>
                        <span className="text-rose-400 font-semibold">
                          {selectedOrg.rejectedBy
                            ? `${selectedOrg.rejectedBy.firstName} ${selectedOrg.rejectedBy.lastName} (${selectedOrg.rejectedBy.email})`
                            : 'Authorized Admin'}
                        </span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block text-[10px] uppercase font-bold">Rejection Time</span>
                        <span className="text-white font-semibold">
                          {selectedOrg.rejectedAt ? new Date(selectedOrg.rejectedAt).toLocaleString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[10px] uppercase font-bold">Rejection Reason</span>
                      <p className="text-rose-300 bg-rose-950/40 border border-rose-800/40 p-2.5 rounded-xl font-medium leading-relaxed">
                        {selectedOrg.rejectionReason || 'No reason specified.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Grid 1: Personal & Owner Info */}
            <div className="bg-[#111111] p-4 rounded-2xl border border-[#2E2E2E] space-y-3 text-xs">
              <h3 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center space-x-2">
                <User className="h-4 w-4 text-emerald-400" />
                <span>Account Owner Details</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-[11px]">
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold">Account Name</span>
                  <span className="text-white font-semibold">
                    {selectedOrg.users?.[0]
                      ? `${selectedOrg.users[0].firstName} ${selectedOrg.users[0].lastName}`
                      : selectedOrg.owner
                      ? `${selectedOrg.owner.firstName} ${selectedOrg.owner.lastName}`
                      : 'N/A'}
                  </span>
                </div>

                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold">User Email</span>
                  <span className="text-white font-semibold flex items-center space-x-1">
                    <Mail className="h-3 w-3 text-neutral-500" />
                    <span>{selectedOrg.users?.[0]?.email || selectedOrg.email || 'N/A'}</span>
                  </span>
                </div>

                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold">Phone Number</span>
                  <span className="text-white font-semibold flex items-center space-x-1">
                    <Phone className="h-3 w-3 text-neutral-500" />
                    <span>{selectedOrg.users?.[0]?.phone || selectedOrg.phone || 'N/A'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Grid 2: Organization Profile & Tax Details */}
            <div className="bg-[#111111] p-4 rounded-2xl border border-[#2E2E2E] space-y-3 text-xs">
              <h3 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center space-x-2">
                <Building2 className="h-4 w-4 text-cyan-400" />
                <span>Organization Profile & Licenses</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold">Organization Name</span>
                  <span className="text-white font-bold text-xs">{selectedOrg.name}</span>
                </div>

                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold">Website URL</span>
                  {selectedOrg.websiteUrl ? (
                    <a
                      href={selectedOrg.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 font-semibold hover:underline flex items-center space-x-1 truncate"
                    >
                      <Globe className="h-3 w-3" />
                      <span>{selectedOrg.websiteUrl}</span>
                    </a>
                  ) : (
                    <span className="text-neutral-400">N/A</span>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold">Description</span>
                  <p className="text-neutral-300 leading-relaxed mt-0.5">{selectedOrg.description || 'No description provided.'}</p>
                </div>

                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold">
                    {selectedOrg.type === 'RESTAURANT' ? 'FSSAI License / Reg No' : 'NGO DARPAN / Reg No'}
                  </span>
                  <span className="text-white font-mono font-semibold">
                    {selectedOrg.registrationNumber || 'N/A'}
                  </span>
                </div>

                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold">Registration Date</span>
                  <span className="text-neutral-300">
                    {selectedOrg.createdAt ? new Date(selectedOrg.createdAt).toLocaleString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Grid 3: Physical Location & Address (FIXED ADDRESS DISPLAY) */}
            <div className="bg-[#111111] p-4 rounded-2xl border border-[#2E2E2E] space-y-3 text-xs">
              <h3 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-amber-400" />
                <span>Physical Location & Address</span>
              </h3>

              {selectedOrg.locations && selectedOrg.locations.length > 0 ? (
                selectedOrg.locations.map((loc, idx) => {
                  const googleMapsUrl =
                    loc.googleMapsUrl ||
                    (loc.latitude && loc.longitude
                      ? `https://www.google.com/maps?q=${loc.latitude},${loc.longitude}`
                      : undefined)

                  return (
                    <div key={idx} className="space-y-3 text-[11px]">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <span className="text-neutral-500 block text-[10px] uppercase font-bold">Street Address</span>
                          <span className="text-white font-semibold">{loc.addressLine1 || 'N/A'}</span>
                        </div>

                        <div>
                          <span className="text-neutral-500 block text-[10px] uppercase font-bold">Landmark / Suite</span>
                          <span className="text-white font-semibold">{loc.addressLine2 || 'N/A'}</span>
                        </div>

                        <div>
                          <span className="text-neutral-500 block text-[10px] uppercase font-bold">City & State</span>
                          <span className="text-white font-semibold">
                            {loc.city ? `${loc.city}, ${loc.state || ''}` : 'N/A'}
                          </span>
                        </div>

                        <div>
                          <span className="text-neutral-500 block text-[10px] uppercase font-bold">Country & Pincode</span>
                          <span className="text-white font-semibold">
                            {loc.countryCode || 'IN'} — {loc.postalCode || 'N/A'}
                          </span>
                        </div>
                      </div>

                      {/* Google Maps Link Button */}
                      {googleMapsUrl ? (
                        <div className="pt-2 border-t border-[#2E2E2E] flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-emerald-400 font-mono text-[10.5px]">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>
                              GPS: {Number(loc.latitude).toFixed(4)}° N, {Number(loc.longitude).toFixed(4)}° E
                            </span>
                          </div>
                          <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/50 text-emerald-300 font-bold px-3.5 py-1.5 rounded-xl text-[11px] inline-flex items-center space-x-1.5 transition shadow-sm"
                          >
                            <Globe className="h-3.5 w-3.5 text-emerald-400" />
                            <span>Open in Google Maps</span>
                            <ExternalLink className="h-3 w-3 ml-0.5" />
                          </a>
                        </div>
                      ) : (
                        <p className="text-neutral-500 text-[10.5px]">No GPS coordinates / map URL available.</p>
                      )}
                    </div>
                  )
                })
              ) : (
                <div className="p-3.5 rounded-xl bg-[#141414] border border-[#2E2E2E] text-neutral-400 text-[11px] flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-neutral-500 shrink-0" />
                  <span>No address provided.</span>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-[#2E2E2E] flex items-center justify-between">
              <button
                onClick={() => setSelectedOrg(null)}
                className="bg-[#222222] hover:bg-[#2A2A2A] text-neutral-200 font-bold py-2.5 px-5 rounded-2xl text-xs"
              >
                Close Details
              </button>

              <div className="flex items-center space-x-2">
                {selectedOrg.verificationStatus !== 'REJECTED' && (
                  <button
                    onClick={() => {
                      const target = selectedOrg
                      setSelectedOrg(null)
                      handleOpenRejectModal(target)
                    }}
                    className="bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold py-2.5 px-4 rounded-2xl text-xs border border-rose-600/30 transition flex items-center space-x-1.5"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Reject</span>
                  </button>
                )}

                {selectedOrg.verificationStatus !== 'VERIFIED' && (
                  <button
                    onClick={() => {
                      const target = selectedOrg
                      setSelectedOrg(null)
                      handleOpenApproveModal(target)
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-5 rounded-2xl text-xs flex items-center space-x-1.5 transition shadow-lg shadow-emerald-950/40"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Approve & Verify</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
