import React, { useState } from 'react'
import { XCircle, AlertTriangle, LogOut, Send, Loader2, Building2, Phone, Globe, FileText } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { resubmitOrganizationApi } from '../../api/auth.api'

export const OrganizationRejectedPage: React.FC = () => {
  const { user, organization, logout } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState(organization?.name || '')
  const [phone, setPhone] = useState(organization?.phone || user?.phone || '')
  const [description, setDescription] = useState(organization?.description || '')
  const [websiteUrl, setWebsiteUrl] = useState(organization?.websiteUrl || '')
  const [registrationNumber, setRegistrationNumber] = useState(organization?.registrationNumber || '')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const handleResubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const response = await resubmitOrganizationApi({
        name,
        phone,
        description,
        websiteUrl,
        registrationNumber,
      })

      if (response.success) {
        // Force refresh / redirect to pending page
        window.location.href = '/verification-pending'
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { error?: { message?: string } } }; message?: string }
      setErrorMessage(
        errorObj.response?.data?.error?.message || errorObj.message || 'Failed to resubmit organization details.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center space-x-3 text-rose-400 border-b border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
            <XCircle className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Organization Verification Rejected</h1>
            <p className="text-xs text-rose-300">Your organization registration was reviewed and rejected by an administrator.</p>
          </div>
        </div>

        {/* Rejection Reason Notice */}
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl text-xs space-y-1.5 text-rose-200">
          <div className="flex items-center space-x-2 font-bold text-rose-300">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>Rejection Reason / Guidance:</span>
          </div>
          <p className="text-rose-200/90 leading-relaxed pl-6">
            {organization?.rejectionReason ||
              'Your submission contained incomplete or unverifiable business details. Please update your organization information below and resubmit for verification.'}
          </p>
        </div>

        {/* Resubmission Error Banner */}
        {errorMessage && (
          <div className="bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-xl text-xs text-rose-300">
            {errorMessage}
          </div>
        )}

        {/* Edit & Resubmit Form */}
        <form onSubmit={handleResubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
              Organization Name *
            </label>
            <div className="relative">
              <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                placeholder="Organization Name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  placeholder="Phone Number"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                Registration / License No.
              </label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  placeholder="GST / FSSAI / Reg No."
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
              Website URL (Optional)
            </label>
            <div className="relative">
              <Globe className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                placeholder="https://www.organization.org"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
              Organization Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              placeholder="Explain your organization background..."
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 transition"
            >
              <LogOut className="h-4 w-4 text-rose-400" />
              <span>Log Out</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-2.5 px-6 rounded-xl flex items-center justify-center space-x-2 transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Resubmitting...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Resubmit for Verification</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
