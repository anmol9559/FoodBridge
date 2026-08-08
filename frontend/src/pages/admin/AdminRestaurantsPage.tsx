import React from 'react'
import { Building2, Search } from 'lucide-react'

export const AdminRestaurantsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h1 className="text-2xl font-bold text-white tracking-tight">Restaurant Directory</h1>
        <p className="text-sm text-slate-400">View and audit all registered restaurant organizations and their owner contacts.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search restaurant name or email..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Organization</th>
                <th className="py-3.5 px-4">Reg Number</th>
                <th className="py-3.5 px-4">Contact Phone</th>
                <th className="py-3.5 px-4">Owner Name</th>
                <th className="py-3.5 px-4">Owner Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {[
                { id: 'org_1', name: 'Green Bites Restaurant', reg: 'REG-9912', phone: '+1234567890', owner: 'John Doe', email: 'john@greenbites.com' },
                { id: 'org_2', name: 'Bakehouse & Cafe', reg: 'REG-5521', phone: '+1987654321', owner: 'Sarah Connor', email: 'sarah@bakehouse.com' },
              ].map((org) => (
                <tr key={org.id} className="hover:bg-slate-800/50 transition">
                  <td className="py-3 px-4 font-semibold text-white flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-amber-400 shrink-0" />
                    <span>{org.name}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">{org.reg}</td>
                  <td className="py-3 px-4 text-slate-300">{org.phone}</td>
                  <td className="py-3 px-4">{org.owner}</td>
                  <td className="py-3 px-4 text-slate-400">{org.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
