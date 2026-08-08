import React from 'react'
import { Clock, ShieldAlert, LogOut, RefreshCw } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export const OrganizationPendingPage: React.FC = () => {
  const { user, organization, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-8 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
          <Clock className="h-8 w-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Verification Status: Pending
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight">Organization Verification Pending</h1>
          <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
            Your organization <strong className="text-white">{organization?.name || 'profile'}</strong> has been registered successfully and is waiting for administrator approval.
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 text-left text-xs space-y-2">
          <div className="flex items-center space-x-2 text-slate-400 font-semibold">
            <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0" />
            <span>Why am I seeing this screen?</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            FoodBridge requires all Restaurant food donors and NGO distribution partners to be verified by a platform administrator before publishing surplus food listings or booking donations.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleRefresh}
            className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 px-5 rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow-lg shadow-amber-500/20"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Check Approval Status</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 px-5 rounded-xl text-xs flex items-center justify-center space-x-2 transition"
          >
            <LogOut className="h-4 w-4 text-rose-400" />
            <span>Log Out ({user?.firstName})</span>
          </button>
        </div>
      </div>
    </div>
  )
}
