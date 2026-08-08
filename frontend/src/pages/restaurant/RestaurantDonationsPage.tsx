import React from 'react'
import { PlusCircle, Search, Filter, Package } from 'lucide-react'

export const RestaurantDonationsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">My Food Donations</h1>
          <p className="text-sm text-slate-400">View, update, or soft-delete food listings published by your restaurant.</p>
        </div>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center space-x-2 transition shadow-lg shadow-emerald-500/20">
          <PlusCircle className="h-4 w-4" />
          <span>Create New Listing</span>
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search donation title..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <button className="bg-slate-900 border border-slate-800 text-slate-300 px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 hover:bg-slate-800">
          <Filter className="h-4 w-4 text-slate-400" />
          <span>Filter Status</span>
        </button>
      </div>

      {/* Table Placeholder */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Donation Title</th>
                <th className="py-3.5 px-4">Quantity</th>
                <th className="py-3.5 px-4">Food Type</th>
                <th className="py-3.5 px-4">Expires At</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {[
                { id: 'don_1', title: 'Vegetable Biryani Trays', qty: '30 Boxes', type: 'COOKED', expires: '2026-08-08 20:00', status: 'AVAILABLE' },
                { id: 'don_2', title: 'Packaged Bread Loaves', qty: '50 Units', type: 'BAKERY', expires: '2026-08-09 18:00', status: 'AVAILABLE' },
                { id: 'don_3', title: 'Fresh Salad Containers', qty: '20 Bowls', type: 'COOKED', expires: '2026-08-08 14:00', status: 'RESERVED' },
              ].map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/50 transition">
                  <td className="py-3 px-4 font-semibold text-white flex items-center space-x-2">
                    <Package className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{item.title}</span>
                  </td>
                  <td className="py-3 px-4">{item.qty}</td>
                  <td className="py-3 px-4">{item.type}</td>
                  <td className="py-3 px-4 text-slate-400">{item.expires}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        item.status === 'AVAILABLE'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button className="text-emerald-400 hover:underline text-[11px] font-medium">Edit</button>
                    <button className="text-rose-400 hover:underline text-[11px] font-medium">Delete</button>
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
