import React from 'react'
import { Search, CalendarCheck, CheckCircle2, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

export const NgoDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">NGO Dashboard</h1>
          <p className="text-sm text-slate-400">Browse surplus food availability and manage active pickup reservations.</p>
        </div>
        <Link
          to="/ngo/donations"
          className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center space-x-2 transition shadow-lg shadow-cyan-500/20"
        >
          <Search className="h-4 w-4" />
          <span>Browse Available Meals</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Nearby Available</span>
            <MapPin className="h-5 w-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">12</p>
          <p className="text-[10px] text-emerald-400 font-medium">Ready for immediate booking</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Bookings</span>
            <CalendarCheck className="h-5 w-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">4</p>
          <p className="text-[10px] text-cyan-400 font-medium">Pending or confirmed pickups</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Pickups Completed</span>
            <CheckCircle2 className="h-5 w-5 text-teal-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">48</p>
          <p className="text-[10px] text-slate-400 font-medium">Total successful distributions</p>
        </div>
      </div>
    </div>
  )
}
