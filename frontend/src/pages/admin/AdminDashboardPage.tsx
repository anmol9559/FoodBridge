import React from 'react'
import { Building2, Users, Package, CalendarCheck, ShieldCheck } from 'lucide-react'

export const AdminDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Overview Dashboard</h1>
          <p className="text-sm text-slate-400">System-wide transactional analytics and management insights.</p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5">
          <ShieldCheck className="h-4 w-4" />
          <span>System Administrator</span>
        </div>
      </div>

      {/* Grid of Analytics Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Restaurants</span>
            <Building2 className="h-5 w-5 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">42</p>
          <p className="text-[10px] text-slate-400">Active registered donors</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total NGOs</span>
            <Users className="h-5 w-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">28</p>
          <p className="text-[10px] text-slate-400">Verified distribution partners</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Donations</span>
            <Package className="h-5 w-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">185</p>
          <p className="text-[10px] text-emerald-400">120 Completed • 25 Active</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Reservations</span>
            <CalendarCheck className="h-5 w-5 text-teal-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">142</p>
          <p className="text-[10px] text-slate-400">8 PENDING • 14 CONFIRMED</p>
        </div>
      </div>
    </div>
  )
}
