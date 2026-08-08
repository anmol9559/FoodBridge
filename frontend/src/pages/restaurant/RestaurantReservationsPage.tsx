import React from 'react'
import { CalendarCheck, Check, X } from 'lucide-react'

export const RestaurantReservationsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h1 className="text-2xl font-bold text-white tracking-tight">Incoming Reservations</h1>
        <p className="text-sm text-slate-400">Review pending booking requests from NGOs and confirm or reject pickups.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Reservation ID</th>
                <th className="py-3.5 px-4">Donation Title</th>
                <th className="py-3.5 px-4">Reserved By NGO</th>
                <th className="py-3.5 px-4">Date Reserved</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {[
                { id: 'res_991', donation: 'Fresh Salad Containers', ngo: 'City Hope Foundation', date: '2026-08-08 11:30', status: 'PENDING' },
                { id: 'res_992', donation: 'Veg Lunch Thali', ngo: 'Care & Share NGO', date: '2026-08-08 09:15', status: 'CONFIRMED' },
              ].map((res) => (
                <tr key={res.id} className="hover:bg-slate-800/50 transition">
                  <td className="py-3 px-4 font-mono text-emerald-400 font-semibold">{res.id}</td>
                  <td className="py-3 px-4 font-medium text-white">{res.donation}</td>
                  <td className="py-3 px-4 text-slate-300">{res.ngo}</td>
                  <td className="py-3 px-4 text-slate-400">{res.date}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        res.status === 'PENDING'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                      }`}
                    >
                      {res.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {res.status === 'PENDING' ? (
                      <div className="flex items-center justify-end space-x-2">
                        <button className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 p-1.5 rounded-lg border border-emerald-500/30 text-[11px] flex items-center space-x-1">
                          <Check className="h-3.5 w-3.5" />
                          <span>Confirm</span>
                        </button>
                        <button className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 p-1.5 rounded-lg border border-rose-500/30 text-[11px] flex items-center space-x-1">
                          <X className="h-3.5 w-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Confirmed</span>
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
