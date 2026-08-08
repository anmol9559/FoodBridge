import React from 'react'
import { X, Package, Clock, MapPin, Tag, Utensils, CheckCircle2 } from 'lucide-react'
import { FoodDonation } from '../../../types'

interface DonationDetailsModalProps {
  donation: FoodDonation | null
  isOpen: boolean
  onClose: () => void
}

export const DonationDetailsModal: React.FC<DonationDetailsModalProps> = ({ donation, isOpen, onClose }) => {
  if (!isOpen || !donation) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl space-y-6 my-8">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Donation Details</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-5 text-xs">
          {/* Header Info */}
          <div className="space-y-2 pb-4 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                {donation.foodType}
              </span>
              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                  donation.status === 'AVAILABLE'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : donation.status === 'RESERVED'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                STATUS: {donation.status}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white">{donation.title}</h3>
            {donation.description && <p className="text-slate-300 leading-relaxed">{donation.description}</p>}
          </div>

          {/* Key Attributes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Quantity</p>
              <p className="font-bold text-white">
                {donation.quantity} {donation.quantityUnit}
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Est. Servings</p>
              <p className="font-bold text-emerald-400">{donation.estimatedServings || donation.quantity} Servings</p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Meal Type</p>
              <p className="font-bold text-white">{donation.mealType || 'General'}</p>
            </div>
          </div>

          {/* Dietary Tags */}
          <div className="flex items-center space-x-3">
            {donation.isVegetarian && (
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-lg font-semibold text-[11px] flex items-center space-x-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Vegetarian</span>
              </span>
            )}
            {donation.isVegan && (
              <span className="bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2.5 py-1 rounded-lg font-semibold text-[11px] flex items-center space-x-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Vegan</span>
              </span>
            )}
          </div>

          {/* Timestamps & Address */}
          <div className="space-y-2 pt-2 border-t border-slate-800 text-slate-300">
            {donation.pickupAddress && (
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Pickup Location</p>
                  <p className="text-slate-400">{donation.pickupAddress}</p>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-amber-400 shrink-0" />
              <span>Expires At: {new Date(donation.expiresAt).toLocaleString()}</span>
            </div>

            {donation.cookedAt && (
              <div className="flex items-center space-x-2">
                <Utensils className="h-4 w-4 text-slate-500 shrink-0" />
                <span>Cooked At: {new Date(donation.cookedAt).toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2 px-5 rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
