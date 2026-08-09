import React, { useState } from 'react'
import { X, Recycle, Leaf, Factory, Trash2, CheckCircle2, AlertCircle, Loader2, Info } from 'lucide-react'
import { FoodDonation, RecoveryMethod } from '../../../types'
import { recoverDonationApi } from '../../../api/restaurant.api'

interface RecoverFoodModalProps {
  donation: FoodDonation | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const RECOVERY_OPTIONS: Array<{
  value: RecoveryMethod
  label: string
  description: string
  iconName: string
}> = [
  {
    value: 'CATTLE_FEED',
    label: 'Cattle Feed / Livestock',
    description: 'Surplus grains, vegetables & bread diverted to local dairy farms & cattle.',
    iconName: 'Cow',
  },
  {
    value: 'COMPOST',
    label: 'Composting & Organic Waste',
    description: 'Converted into nutrient-rich compost for community gardens & agriculture.',
    iconName: 'Leaf',
  },
  {
    value: 'BIOGAS',
    label: 'Biogas & Energy Recovery',
    description: 'Sent to anaerobic digestion facilities to generate renewable biogas fuel.',
    iconName: 'Factory',
  },
  {
    value: 'ORGANIC_FERTILIZER',
    label: 'Organic Fertilizer',
    description: 'Processed into eco-friendly soil conditioners and organic farm inputs.',
    iconName: 'Recycle',
  },
  {
    value: 'ANIMAL_SHELTER',
    label: 'Animal Shelter Feed',
    description: 'Safe non-spoilable food diverted to local animal rescue centers.',
    iconName: 'Heart',
  },
  {
    value: 'SAFE_DISPOSAL',
    label: 'Safe Ecological Disposal',
    description: 'Responsibly discarded via certified municipal waste management.',
    iconName: 'Trash',
  },
]

export const RecoverFoodModal: React.FC<RecoverFoodModalProps> = ({
  donation,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [method, setMethod] = useState<RecoveryMethod>('CATTLE_FEED')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  if (!isOpen || !donation) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    try {
      await recoverDonationApi(donation.id, {
        recoveryMethod: method,
        recoveryNotes: notes.trim() || undefined,
      })
      onSuccess()
      onClose()
    } catch (err: unknown) {
      const errorResponse = err as { response?: { data?: { message?: string; error?: { message?: string } } }; message?: string }
      setErrorMsg(
        errorResponse.response?.data?.message ||
          errorResponse.response?.data?.error?.message ||
          errorResponse.message ||
          'Failed to record food recovery. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#181818] border border-[#2E2E2E] rounded-3xl p-6 shadow-2xl space-y-6 text-white animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#2E2E2E] pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400">
              <Recycle className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold tracking-tight">Responsible Food Recovery</h3>
              <p className="text-xs text-neutral-400">Divert expired food from landfills into sustainable streams.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-[#222222] transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Item Summary Banner */}
        <div className="p-3.5 rounded-2xl bg-[#111111] border border-[#2E2E2E] flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-500 block">Donation Item</span>
            <span className="font-extrabold text-white">{donation.title}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-neutral-500 block">Quantity / Servings</span>
            <span className="font-extrabold text-emerald-400">
              {donation.quantity} {donation.quantityUnit} ({donation.estimatedServings || donation.quantity} servings)
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Recovery Method Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
              Select Recovery Method <span className="text-emerald-500">*</span>
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as RecoveryMethod)}
              className="w-full bg-[#141414] border border-[#333333] rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
              required
            >
              {RECOVERY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Selected Method Helper Info */}
          <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-300 flex items-start space-x-2.5">
            <Info className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
            <p className="leading-relaxed">
              {RECOVERY_OPTIONS.find((o) => o.value === method)?.description}
            </p>
          </div>

          {/* Recovery Notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
              Recovery Notes / Destination Details <span className="text-neutral-500">(Optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Sent 20kg food waste to Green Earth Bio-Compost Facility in Pune."
              rows={3}
              className="w-full bg-[#141414] border border-[#333333] rounded-2xl p-3.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end space-x-3 border-t border-[#2E2E2E]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl text-xs font-bold text-neutral-400 hover:text-white hover:bg-[#222222] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-2xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center space-x-2 transition shadow-lg shadow-emerald-950/40 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Submit Recovery</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
