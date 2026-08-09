import React from 'react'
import { X, Package, Clock, MapPin, Utensils, CheckCircle2, Recycle, Leaf, Factory, Heart, Trash2, User } from 'lucide-react'
import { FoodDonation } from '../../../types'

interface DonationDetailsModalProps {
  donation: FoodDonation | null
  isOpen: boolean
  onClose: () => void
}

export const DonationDetailsModal: React.FC<DonationDetailsModalProps> = ({ donation, isOpen, onClose }) => {
  if (!isOpen || !donation) return null

  const getRecoveryMethodBadge = (method?: string) => {
    switch (method) {
      case 'CATTLE_FEED':
        return { label: 'Cattle Feed / Livestock', color: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40' }
      case 'COMPOST':
        return { label: 'Composting & Organic Waste', color: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40' }
      case 'BIOGAS':
        return { label: 'Biogas Plant', color: 'bg-cyan-950/60 text-cyan-400 border-cyan-800/40' }
      case 'ORGANIC_FERTILIZER':
        return { label: 'Organic Fertilizer', color: 'bg-teal-950/60 text-teal-400 border-teal-800/40' }
      case 'ANIMAL_SHELTER':
        return { label: 'Animal Shelter Feed', color: 'bg-purple-950/60 text-purple-400 border-purple-800/40' }
      case 'SAFE_DISPOSAL':
        return { label: 'Safe Disposal', color: 'bg-neutral-800 text-neutral-400 border-neutral-700' }
      default:
        return { label: method || 'Recovered', color: 'bg-neutral-800 text-neutral-300 border-neutral-700' }
    }
  }

  const recoveryBadge = getRecoveryMethodBadge(donation.recoveryMethod)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#181818] border border-[#2E2E2E] rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl space-y-6 my-8 text-white">
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#2E2E2E]">
          <div className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Donation Details</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-[#222222]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-5 text-xs">
          {/* Header Info */}
          <div className="space-y-2 pb-4 border-b border-[#2E2E2E]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 uppercase">
                {donation.foodType}
              </span>
              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                  donation.status === 'AVAILABLE'
                    ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                    : donation.status === 'RESERVED'
                    ? 'bg-blue-950/60 text-blue-400 border-blue-800/40'
                    : donation.status === 'COMPLETED'
                    ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                    : donation.status === 'RECOVERED'
                    ? 'bg-purple-950/60 text-purple-400 border-purple-800/40'
                    : donation.status === 'EXPIRED'
                    ? 'bg-rose-950/60 text-rose-400 border-rose-800/40'
                    : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                }`}
              >
                STATUS: {donation.status}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white">{donation.title}</h3>
            {donation.description && <p className="text-neutral-300 leading-relaxed">{donation.description}</p>}
          </div>

          {/* Key Attributes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-[#111111] p-3 rounded-2xl border border-[#2E2E2E] space-y-1">
              <p className="text-[10px] text-neutral-400 font-semibold uppercase">Quantity</p>
              <p className="font-bold text-white">
                {donation.quantity} {donation.quantityUnit}
              </p>
            </div>

            <div className="bg-[#111111] p-3 rounded-2xl border border-[#2E2E2E] space-y-1">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Est. Servings</p>
              <p className="font-bold text-emerald-400">{donation.estimatedServings || donation.quantity} Servings</p>
            </div>

            <div className="bg-[#111111] p-3 rounded-2xl border border-[#2E2E2E] space-y-1">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Meal Type</p>
              <p className="font-bold text-white">{donation.mealType || 'General'}</p>
            </div>
          </div>

          {/* Dietary Tags */}
          <div className="flex items-center space-x-3">
            {donation.isVegetarian && (
              <span className="bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 px-2.5 py-1 rounded-xl font-semibold text-[11px] flex items-center space-x-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Vegetarian</span>
              </span>
            )}
            {donation.isVegan && (
              <span className="bg-teal-950/60 text-teal-400 border border-teal-800/40 px-2.5 py-1 rounded-xl font-semibold text-[11px] flex items-center space-x-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Vegan</span>
              </span>
            )}
          </div>

          {/* FOOD RECOVERY INFORMATION SECTION */}
          {donation.status === 'RECOVERED' && (
            <div className="p-4 rounded-2xl bg-[#111111] border border-[#2E2E2E] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Recycle className="h-4 w-4 text-emerald-400" />
                  <span className="font-extrabold text-white text-xs uppercase tracking-wider">Recovery Information</span>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${recoveryBadge.color}`}>
                  {recoveryBadge.label}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-neutral-300 text-[11px]">
                {donation.recoveredAt && (
                  <div>
                    <span className="text-neutral-500 block text-[10px] uppercase font-bold">Recovered At</span>
                    <span className="font-semibold text-white">{new Date(donation.recoveredAt).toLocaleString()}</span>
                  </div>
                )}

                {donation.recoveredBy && (
                  <div>
                    <span className="text-neutral-500 block text-[10px] uppercase font-bold">Recovered By</span>
                    <span className="font-semibold text-white">
                      {donation.recoveredBy.firstName} {donation.recoveredBy.lastName}
                    </span>
                  </div>
                )}
              </div>

              {donation.recoveryNotes && (
                <div className="pt-2 border-t border-[#2E2E2E]">
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold">Recovery Notes</span>
                  <p className="text-neutral-300 leading-relaxed text-xs">{donation.recoveryNotes}</p>
                </div>
              )}
            </div>
          )}

          {/* Timestamps & Address */}
          <div className="space-y-2 pt-2 border-t border-[#2E2E2E] text-neutral-300">
            {donation.pickupAddress && (
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-neutral-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Pickup Location</p>
                  <p className="text-neutral-400">{donation.pickupAddress}</p>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-amber-400 shrink-0" />
              <span>Expires At: {new Date(donation.expiresAt).toLocaleString()}</span>
            </div>

            {donation.cookedAt && (
              <div className="flex items-center space-x-2">
                <Utensils className="h-4 w-4 text-neutral-500 shrink-0" />
                <span>Cooked At: {new Date(donation.cookedAt).toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#2E2E2E] flex justify-end">
            <button
              onClick={onClose}
              className="bg-[#222222] hover:bg-[#2A2A2A] text-neutral-200 font-bold py-2.5 px-5 rounded-2xl text-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
