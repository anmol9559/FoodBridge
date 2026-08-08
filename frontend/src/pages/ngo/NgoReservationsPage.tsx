import React from 'react'
import { CalendarCheck, CheckCircle2 } from 'lucide-react'

export const NgoReservationsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h1 className="text-2xl font-bold text-white tracking-tight">My Reservations</h1>
        <p className="text-sm text-slate-400">Track reserved food donations and confirm pickup completion.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Reservation ID</th>
                <th className="py-3.5 px-4">Donation Title</th>
                <th className="py-3.5 px-4">Restaurant</th>
                <th className="py-3.5 px-4">Reserved Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {[
                { id: 'res_501', donation: 'Steamed Rice & Dal', restaurant: 'Spice Garden Eatery', date: '2026-08-08 12:00', status: 'CONFIRMED' },
                { id: 'res_502', donation: 'Assorted Sandwich Packs', restaurant: 'Bakehouse & Cafe', date: '2026-08-08 10:00', status: 'COMPLETED' },
              ].map((res) => (
                <tr key={res.id} className="hover:bg-slate-800/50 transition">
                  <td className="py-3 px-4 font-mono text-cyan-400 font-semibold">{res.id}</td>
                  <td className="py-3 px-4 font-medium text-white">{res.donation}</td>
                  <td className="py-3 px-4 text-slate-300">{res.restaurant}</td>
                  <td className="py-3 px-4 text-slate-400">{res.date}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        res.status === 'CONFIRMED'
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}
                    >
                      {res.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {res.status === 'CONFIRMED' ? (
                      <button className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-lg border border-emerald-500/30 text-[11px] font-semibold flex items-center space-x-1 ml-auto">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Complete Pickup</span>
                      </button>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
