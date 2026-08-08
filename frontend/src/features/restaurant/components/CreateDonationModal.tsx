import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, PlusCircle, Loader2, AlertCircle } from 'lucide-react'
import { donationFormSchema, DonationFormData, foodTypes } from '../donation.schemas'
import { createDonationApi, CreateDonationPayload } from '../../../api/restaurant.api'

interface CreateDonationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export const CreateDonationModal: React.FC<CreateDonationModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DonationFormData>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      foodType: 'COOKED',
      quantity: 10,
      quantityUnit: 'Servings',
      isVegetarian: false,
      isVegan: false,
    },
  })

  if (!isOpen) return null

  const onSubmit = async (data: DonationFormData) => {
    setErrorMessage(null)

    const payload: CreateDonationPayload = {
      title: data.title,
      description: data.description || undefined,
      quantity: Number(data.quantity),
      quantityUnit: data.quantityUnit,
      foodType: data.foodType,
      mealType: data.mealType || undefined,
      packagingType: data.packagingType || undefined,
      isVegetarian: Boolean(data.isVegetarian),
      isVegan: Boolean(data.isVegan),
      estimatedServings: data.estimatedServings ? Number(data.estimatedServings) : undefined,
      cookedAt: data.cookedAt ? new Date(data.cookedAt).toISOString() : undefined,
      expiresAt: new Date(data.expiresAt).toISOString(),
      pickupAddress: data.pickupAddress || undefined,
      specialInstructions: data.specialInstructions || undefined,
    }

    try {
      await createDonationApi(payload)
      reset()
      onSuccess()
      onClose()
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { error?: { message?: string } } }; message?: string }
      const backendMessage =
        errorObj.response?.data?.error?.message || errorObj.message || 'Failed to create food donation.'
      setErrorMessage(backendMessage)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-6 my-8">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <PlusCircle className="h-5 w-5 text-emerald-400" />
            <span>Create Surplus Food Donation</span>
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mx-6 bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-xl flex items-start space-x-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-6 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider">Donation Title *</label>
            <input
              type="text"
              {...register('title')}
              placeholder="e.g. Fresh Veg Biryani Containers"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            {errors.title && <p className="text-rose-400 mt-1">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider">Food Type *</label>
              <select
                {...register('foodType')}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                {foodTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider">Quantity *</label>
              <input
                type="number"
                step="any"
                {...register('quantity')}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              {errors.quantity && <p className="text-rose-400 mt-1">{errors.quantity.message}</p>}
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider">Quantity Unit *</label>
              <input
                type="text"
                {...register('quantityUnit')}
                placeholder="Boxes / KG / Servings"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              {errors.quantityUnit && <p className="text-rose-400 mt-1">{errors.quantityUnit.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider">Estimated Servings</label>
              <input
                type="number"
                {...register('estimatedServings')}
                placeholder="25"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider">Meal Type</label>
              <input
                type="text"
                {...register('mealType')}
                placeholder="Lunch / Dinner / Snacks"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider">Cooked At (Optional)</label>
              <input
                type="datetime-local"
                {...register('cookedAt')}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider">Expires At *</label>
              <input
                type="datetime-local"
                {...register('expiresAt')}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
              {errors.expiresAt && <p className="text-rose-400 mt-1">{errors.expiresAt.message}</p>}
            </div>
          </div>

          <div className="flex space-x-6 pt-2">
            <label className="flex items-center space-x-2 cursor-pointer text-slate-300">
              <input type="checkbox" {...register('isVegetarian')} className="rounded accent-emerald-500 h-4 w-4" />
              <span>Vegetarian</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer text-slate-300">
              <input type="checkbox" {...register('isVegan')} className="rounded accent-emerald-500 h-4 w-4" />
              <span>Vegan</span>
            </label>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider">Pickup Address</label>
            <input
              type="text"
              {...register('pickupAddress')}
              placeholder="Restaurant pickup counter address"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider">Description & Special Instructions</label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Provide details about packaging, storage instructions, or pickup notes..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 px-4 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-2.5 px-5 rounded-xl flex items-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <span>Publish Donation</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
