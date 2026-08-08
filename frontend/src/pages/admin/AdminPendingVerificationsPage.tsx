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
} from 'lucide-react'
import { getPendingOrganizationsApi, verifyOrganizationApi, AdminOrganizationItem } from '../../api/admin.api'

export const AdminPendingVerificationsPage: React.FC = () => {
  const queryClient = useQueryClient()
  const [selectedOrg, setSelectedOrg] = useState<AdminOrganizationItem | null>(null)
  const [rejectingOrg, setRejectingOrg] = useState<AdminOrganizationItem | null>(null)
  const [rejectionReasonInput, setRejectionReasonInput] = useState('')

  // Filter States
  const [statusFilter, setStatusFilter] = useState<string>('PENDING')
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const [toastMessage, setToastMessage] = useState<string | null>(null)
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
    queryKey: ['adminPendingOrganizations', statusFilter, typeFilter, searchQuery],
    queryFn: () =>
      getPendingOrganizationsApi({
        status: statusFilter || undefined,
        type: typeFilter || undefined,
        search: searchQuery || undefined,
      }),
  })

  const organizations = data?.organizations || []

  // Verify / Reject Mutation
  const verifyMutation = useMutation({
    mutationFn: ({ id, status, reason }: { id: string; status: 'VERIFIED' | 'REJECTED'; reason?: string }) =>
      verifyOrganizationApi(id, status, reason),
    onSuccess: (_, variables) => {
      setSelectedOrg(null)
      setRejectingOrg(null)
      setRejectionReasonInput('')
      const actionText = variables.status === 'VERIFIED' ? 'approved & verified' : 'rejected'
      showToast(`Organization status updated to ${actionText}.`)
      queryClient.invalidateQueries({ queryKey: ['adminPendingOrganizations'] })
      queryClient.invalidateQueries({ queryKey: ['adminDashboardStats'] })
      queryClient.invalidateQueries({ queryKey: ['adminRestaurants'] })
      queryClient.invalidateQueries({ queryKey: ['adminNgos'] })
    },
    onError: (err: unknown) => {
      const errorObj = err as { response?: { data?: { error?: { message?: string } } }; message?: string }
      setActionError(
        errorObj.response?.data?.error?.message || errorObj.message || 'Failed to update organization verification status.'
      )
    },
  })

  const handleOpenRejectModal = (org: AdminOrganizationItem) => {
    setRejectingOrg(org)
    setRejectionReasonInput('')
  }

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!rejectingOrg) return
    if (!rejectionReasonInput.trim()) {
      setActionError('A rejection reason is required before rejecting an organization.')
      return
    }
    verifyMutation.mutate({
      id: rejectingOrg.id,
      status: 'REJECTED',
      reason: rejectionReasonInput.trim(),
    })
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
            <span>Organization Verification Portal</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Review registration applications, inspect verification details, and manage organization approvals.</p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center space-x-2 transition disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Success Toast Banner */}
      {toastMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-center space-x-3 text-xs text-emerald-400 animate-in fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Action Error Banner */}
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

      {/* Fetch Error State Banner */}
      {isError && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-rose-300">
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
            className="bg-rose-500 hover:bg-rose-600 text-slate-950 font-bold px-4 py-2 rounded-xl flex items-center space-x-2 transition disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Control Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {[
            { id: 'PENDING', label: 'Pending Approval' },
            { id: 'VERIFIED', label: 'Verified' },
            { id: 'REJECTED', label: 'Rejected' },
            { id: '', label: 'All Orgs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === tab.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
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
            className="w-full sm:w-auto bg-slate-950 border border-slate-800 text-slate-300 font-semibold text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
          >
            <option value="">All Types (Restaurant & NGO)</option>
            <option value="RESTAURANT">Restaurant Donor</option>
            <option value="NGO">NGO Partner</option>
          </select>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, email, phone..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Main Organizations Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Organization</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Contact Person</th>
                <th className="py-3.5 px-4">Phone / Email</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Submitted Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-3.5 px-4"><div className="h-4 bg-slate-800 rounded w-40" /></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-slate-800 rounded w-20" /></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-slate-800 rounded w-32" /></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-slate-800 rounded w-36" /></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-slate-800 rounded w-24" /></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-slate-800 rounded w-24" /></td>
                    <td className="py-3.5 px-4"><div className="h-5 bg-slate-800 rounded-full w-20" /></td>
                    <td className="py-3.5 px-4 text-right"><div className="h-6 bg-slate-800 rounded w-24 ml-auto" /></td>
                  </tr>
                ))
              ) : organizations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 space-y-2">
                    <Building2 className="h-8 w-8 mx-auto text-slate-600" />
                    <p className="font-bold text-slate-300">No organizations found matching filters.</p>
                    <p className="text-[11px] text-slate-500">All registered organizations have been reviewed or try adjusting search filters.</p>
                  </td>
                </tr>
              ) : (
                organizations.map((org) => {
                  const owner = org.users && org.users.length > 0 ? org.users[0] : org.owner
                  const location = org.locations && org.locations.length > 0 ? org.locations[0] : null
                  const cityState = location ? `${location.city}, ${location.state}` : 'N/A'

                  return (
                    <tr key={org.id} className="hover:bg-slate-800/50 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
                            {org.logoImageUrl ? (
                              <img src={org.logoImageUrl} alt={org.name} className="w-full h-full object-cover" />
                            ) : (
                              <Building2 className="h-4 w-4 text-emerald-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-white leading-tight">{org.name}</p>
                            <p className="text-[10px] text-slate-400">Reg: {org.registrationNumber || 'N/A'}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            org.type === 'RESTAURANT'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                          }`}
                        >
                          {org.type}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">
                        {owner ? `${owner.firstName} ${owner.lastName}` : 'N/A'}
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="text-slate-200">{org.email || 'N/A'}</p>
                        <p className="text-[10px] text-slate-400">{org.phone || owner?.phone || 'N/A'}</p>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">{cityState}</td>

                      <td className="py-3.5 px-4 text-slate-400">
                        {org.createdAt ? new Date(org.createdAt).toLocaleDateString() : 'N/A'}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            org.verificationStatus === 'VERIFIED'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : org.verificationStatus === 'REJECTED'
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}
                        >
                          {org.verificationStatus || 'PENDING'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedOrg(org)}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3 py-1.5 rounded-xl text-[11px] inline-flex items-center space-x-1 transition border border-slate-700"
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
      </div>

      {/* ========================================================= */}
      {/* ORGANIZATION DETAILS MODAL (SUPABASE / STRIPE ADMIN STYLE) */}
      {/* ========================================================= */}
      {selectedOrg && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
                  {selectedOrg.logoImageUrl ? (
                    <img src={selectedOrg.logoImageUrl} alt={selectedOrg.name} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="h-6 w-6 text-emerald-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-bold text-white">{selectedOrg.name}</h2>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        selectedOrg.verificationStatus === 'VERIFIED'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : selectedOrg.verificationStatus === 'REJECTED'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {selectedOrg.verificationStatus || 'PENDING'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedOrg.type} Organization • Reg No: {selectedOrg.registrationNumber || 'N/A'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrg(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Rejection Alert Banner (if status is REJECTED) */}
            {selectedOrg.verificationStatus === 'REJECTED' && (
              <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl text-xs text-rose-300 space-y-1">
                <div className="flex items-center space-x-2 font-bold text-rose-400">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>Rejection History & Reason</span>
                </div>
                <p className="text-rose-200/90 pl-6 leading-relaxed">
                  {selectedOrg.rejectionReason || 'Verification rejected by administrator during compliance audit.'}
                </p>
              </div>
            )}

            {/* Grid 1: Personal & Owner Info */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <h3 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center space-x-2">
                <User className="h-4 w-4 text-emerald-400" />
                <span>Account Owner Details</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-[11px]">
                <div>
                  <span className="text-slate-500 block">First & Last Name</span>
                  <span className="text-slate-200 font-semibold">
                    {selectedOrg.users?.[0]
                      ? `${selectedOrg.users[0].firstName} ${selectedOrg.users[0].lastName}`
                      : selectedOrg.owner
                      ? `${selectedOrg.owner.firstName} ${selectedOrg.owner.lastName}`
                      : 'N/A'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block">User Email</span>
                  <span className="text-slate-200 font-semibold flex items-center space-x-1">
                    <Mail className="h-3 w-3 text-slate-500" />
                    <span>{selectedOrg.users?.[0]?.email || selectedOrg.email || 'N/A'}</span>
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block">Phone Number</span>
                  <span className="text-slate-200 font-semibold flex items-center space-x-1">
                    <Phone className="h-3 w-3 text-slate-500" />
                    <span>{selectedOrg.users?.[0]?.phone || selectedOrg.phone || 'N/A'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Grid 2: Organization Profile & Tax Details */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <h3 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center space-x-2">
                <Building2 className="h-4 w-4 text-cyan-400" />
                <span>Organization Profile & Licenses</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                <div>
                  <span className="text-slate-500 block">Organization Name</span>
                  <span className="text-slate-200 font-bold text-xs">{selectedOrg.name}</span>
                </div>

                <div>
                  <span className="text-slate-500 block">Website URL</span>
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
                    <span className="text-slate-400">N/A</span>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <span className="text-slate-500 block">Description</span>
                  <p className="text-slate-300 leading-relaxed mt-0.5">{selectedOrg.description || 'No description provided.'}</p>
                </div>

                <div>
                  <span className="text-slate-500 block">
                    {selectedOrg.type === 'RESTAURANT' ? 'FSSAI License / Reg No' : 'NGO DARPAN / Reg No'}
                  </span>
                  <span className="text-slate-200 font-mono font-semibold">
                    {selectedOrg.registrationNumber || 'N/A'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block">Registration Date</span>
                  <span className="text-slate-300">
                    {selectedOrg.createdAt ? new Date(selectedOrg.createdAt).toLocaleString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Grid 3: Location Details */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <h3 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-amber-400" />
                <span>Physical Location & Address</span>
              </h3>
              {selectedOrg.locations && selectedOrg.locations.length > 0 ? (
                selectedOrg.locations.map((loc, idx) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Street Address</span>
                      <span className="text-slate-200 font-semibold">{loc.addressLine1} {loc.addressLine2 || ''}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">City, State & Pincode</span>
                      <span className="text-slate-200 font-semibold">{loc.city}, {loc.state} - {loc.postalCode}</span>
                    </div>
                    {loc.latitude && loc.longitude && (
                      <div className="sm:col-span-2 pt-1 border-t border-slate-800/80 flex items-center space-x-2">
                        <span className="text-slate-500">GPS Coordinates:</span>
                        <span className="text-emerald-400 font-mono font-semibold">
                          {Number(loc.latitude).toFixed(4)}° N, {Number(loc.longitude).toFixed(4)}° E
                        </span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-[11px]">Address records set via registration profile.</p>
              )}
            </div>

            {/* Complete Verification Audit Timeline */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <h3 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center space-x-2">
                <History className="h-4 w-4 text-emerald-400" />
                <span>Verification Activity Audit Timeline</span>
              </h3>
              <div className="space-y-2 pl-2 border-l-2 border-slate-800 text-[11px]">
                <div className="relative pl-4">
                  <span className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <p className="font-semibold text-slate-200">Account Registered</p>
                  <p className="text-slate-500 text-[10px]">
                    {selectedOrg.createdAt ? new Date(selectedOrg.createdAt).toLocaleString() : 'N/A'}
                  </p>
                </div>

                {selectedOrg.verifiedAt && (
                  <div className="relative pl-4">
                    <span className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <p className="font-semibold text-emerald-400">Verified & Approved</p>
                    <p className="text-slate-500 text-[10px]">{new Date(selectedOrg.verifiedAt).toLocaleString()}</p>
                  </div>
                )}

                {selectedOrg.verificationStatus === 'REJECTED' && (
                  <div className="relative pl-4">
                    <span className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <p className="font-semibold text-rose-400">Rejected by Admin</p>
                    <p className="text-slate-400 text-[10px]">{selectedOrg.rejectionReason}</p>
                  </div>
                )}

                {selectedOrg.verificationStatus === 'PENDING' && (
                  <div className="relative pl-4">
                    <span className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                    <p className="font-semibold text-amber-400">Awaiting Admin Verification</p>
                    <p className="text-slate-500 text-[10px]">Submitted details pending administrator review.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3">
              <button
                onClick={() => setSelectedOrg(null)}
                className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2 rounded-xl text-xs"
              >
                Close
              </button>

              <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                {selectedOrg.verificationStatus === 'PENDING' && (
                  <>
                    <button
                      onClick={() => handleOpenRejectModal(selectedOrg)}
                      className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 font-bold px-4 py-2 rounded-xl text-xs transition"
                    >
                      Reject Application
                    </button>
                    <button
                      onClick={() => verifyMutation.mutate({ id: selectedOrg.id, status: 'VERIFIED' })}
                      className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs transition shadow-lg shadow-emerald-500/20"
                    >
                      Approve & Verify
                    </button>
                  </>
                )}

                {selectedOrg.verificationStatus === 'VERIFIED' && (
                  <span className="text-emerald-400 font-bold text-xs flex items-center space-x-1 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Verified Organization</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* REJECTION REASON DIALOG MODAL */}
      {/* ========================================================= */}
      {rejectingOrg && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleConfirmReject}
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95"
          >
            <div className="flex items-center space-x-3 text-rose-400 border-b border-slate-800 pb-3">
              <XCircle className="h-6 w-6 shrink-0" />
              <div>
                <h3 className="font-bold text-white text-sm">Reject Organization Registration</h3>
                <p className="text-[11px] text-slate-400">Rejecting {rejectingOrg.name}</p>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                Rejection Reason *
              </label>
              <textarea
                required
                rows={4}
                value={rejectionReasonInput}
                onChange={(e) => setRejectionReasonInput(e.target.value)}
                placeholder="Explain why this organization was rejected (e.g., Invalid FSSAI license number, unverified address details)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setRejectingOrg(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2 rounded-xl text-xs"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-5 py-2 rounded-xl text-xs transition shadow-lg shadow-rose-500/20"
              >
                Confirm Rejection
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
