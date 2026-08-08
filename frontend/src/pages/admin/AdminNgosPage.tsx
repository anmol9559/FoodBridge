import React from 'react'
import { Users, Search } from 'lucide-react'

export const AdminNgosPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h1 className="text-2xl font-bold text-white tracking-tight">NGO Directory</h1>
        <p className="text-sm text-slate-400">View and audit registered charitable NGO partners.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search NGO name or email..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">NGO Organization</th>
                <th className="py-3.5 px-4">Reg Number</th>
                <th className="py-3.5 px-4">Contact Phone</th>
                <th className="py-3.5 px-4">Representative</th>
                <th className="py-3.5 px-4">Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {[
                { id: 'ngo_1', name: 'City Hope Foundation', reg: 'NGO-8821', phone: '+1122334455', rep: 'Alice Smith', email: 'contact@cityhope.org' },
                { id: 'ngo_2', name: 'Care & Share NGO', reg: 'NGO-3344', phone: '+1554433221', rep: 'Bob Johnson', email: 'info@careshare.org' },
              ].map((ngo) => (
                <tr key={ngo.id} className="hover:bg-slate-800/50 transition">
                  <td className="py-3 px-4 font-semibold text-white flex items-center space-x-2">
                    <Users className="h-4 w-4 text-cyan-400 shrink-0" />
                    <span>{ngo.name}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">{ngo.reg}</td>
                  <td className="py-3 px-4 text-slate-300">{ngo.phone}</td>
                  <td className="py-3 px-4">{ngo.rep}</td>
                  <td className="py-3 px-4 text-slate-400">{ngo.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
