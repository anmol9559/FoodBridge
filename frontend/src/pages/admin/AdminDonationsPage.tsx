import React from 'react'
import { Package, Search } from 'lucide-react'

export const AdminDonationsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h1 className="text-2xl font-bold text-white tracking-tight">Platform Food Donations</h1>
        <p className="text-sm text-slate-400">Audit all food donations published across all restaurant organizations.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search donation title or restaurant..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Title</th>
                <th className="py-3.5 px-4">Restaurant</th>
                <th className="py-3.5 px-4">Quantity</th>
                <th className="py-3.5 px-4">Food Type</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {[
                { id: 'don_1', title: 'Vegetable Biryani Trays', restaurant: 'Green Bites Restaurant', qty: '30 Boxes', type: 'COOKED', status: 'AVAILABLE' },
                { id: 'don_2', title: 'Packaged Bread Loaves', restaurant: 'Bakehouse & Cafe', qty: '50 Units', type: 'BAKERY', status: 'COMPLETED' },
              ].map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/50 transition">
                  <td className="py-3 px-4 font-semibold text-white flex items-center space-x-2">
                    <Package className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{item.title}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{item.restaurant}</td>
                  <td className="py-3 px-4">{item.qty}</td>
                  <td className="py-3 px-4">{item.type}</td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {item.status}
                    </span>
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
