import React from 'react'
import { Search, MapPin, Clock, Utensils, HeartHandshake } from 'lucide-react'

export const NgoBrowseDonationsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h1 className="text-2xl font-bold text-white tracking-tight">Available Food Donations</h1>
        <p className="text-sm text-slate-400">Discover fresh surplus meals donated by verified local restaurants.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search food title, type, or restaurant..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[
          { id: 'don_101', title: 'Fresh Vegetable Biryani', restaurant: 'Green Bites Restaurant', qty: '40 Servings', type: 'COOKED', expires: 'Today at 21:00', address: '123 Market Street, Downtown' },
          { id: 'don_102', title: 'Assorted Sandwich Packs', restaurant: 'Bakehouse & Cafe', qty: '25 Servings', type: 'BAKERY', expires: 'Tomorrow at 12:00', address: '456 Central Ave, Westside' },
          { id: 'don_103', title: 'Steamed Rice & Dal', restaurant: 'Spice Garden Eatery', qty: '50 Servings', type: 'COOKED', expires: 'Today at 22:30', address: '789 Food Court, East District' },
        ].map((item) => (
          <div key={item.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {item.type}
                </span>
                <span className="text-xs text-slate-400 font-semibold">{item.qty}</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white leading-snug">{item.title}</h3>
                <p className="text-xs text-cyan-400 font-medium">{item.restaurant}</p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{item.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  <span>Expires: {item.expires}</span>
                </div>
              </div>
            </div>

            <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow-lg shadow-cyan-500/20">
              <HeartHandshake className="h-4 w-4" />
              <span>Reserve Food Donation</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
