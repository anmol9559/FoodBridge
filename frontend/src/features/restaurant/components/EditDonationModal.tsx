import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, Edit3, Loader2, AlertCircle, AlertTriangle } from 'lucide-react'
import { donationFormSchema, DonationFormData, foodTypes } from '../donation.schemas'
import { updateDonationApi, CreateDonationPayload } from '../../../api/restaurant.api'
import { FoodDonation } from '../../../types'

interface EditDonationModalProps {
  donation: FoodDonation | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

function formatDateForInput(dateString?: string): string {
  if (!dateString) return ''
  const d = new Date(dateString)
  return d.toISOString().slice(0, 16)
}

export const EditDonationModal: React.FC<EditDonationModalProps> = ({ donation, isOpen, onClose, onSuccess }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const isEditable = donation?.status === 'AVAILABLE'

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DonationFormData>({
    resolver: zodResolver(donationFormSchema),
  })

  useEffect(() => {
    if (donation) {
      reset({
        title: donation.title,
        description: donation.description || '',
        quantity: donation.quantity,
        quantityUnit: donation.quantityUnit,
        foodType: donation.foodType as (typeof foodTypes)[number],
        mealType: donation.mealType || '',
        packagingType: donation.packagingType || '',
        isVegetarian: donation.isVegetarian || false,
        isVegan: donation.isVegan || false,
        estimatedServings: donation.estimatedServings || undefined,
        cookedAt: formatDateForInput(donation.cookedAt),
        expiresAt: formatDateForInput(donation.expiresAt),
        pickupAddress: donation.pickupAddress || '',
        specialInstructions: donation.specialInstructions || '',
      })
    }
  }, [donation, reset])

  if (!isOpen || !donation) return null

  const onSubmit = async (data: DonationFormData) => {
    setErrorMessage(null)

    if (!isEditable) {
      setErrorMessage(`Donation cannot be updated in its current status (${donation.status}).`)
      return
    }

    const payload: Partial<CreateDonationPayload> = {
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
      await updateDonationApi(donation.id, payload)
      onSuccess()
      onClose()
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { error?: { message?: string } } }; message?: string }
      const backendMessage =
        errorObj.response?.data?.error?.message || errorObj.message || 'Failed to update food donation.'
      setErrorMessage(backendMessage)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-6 my-8">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Edit3 className="h-5 w-5 text-emerald-400" />
            <span>Edit Food Donation</span>
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        {!isEditable && (
          <div className="mx-6 bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start space-x-3 text-xs text-amber-300">
            <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-200">Updates Restricted</p>
              <p className="text-amber-300/80">
                Donations in status <strong className="uppercase">{donation.status}</strong> cannot be edited. Only AVAILABLE donations may be updated.
              </p>
            </div>
          </div>
        )}

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
              disabled={!isEditable || isSubmitting}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
            />
            {errors.title && <p className="text-rose-400 mt-1">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider">Food Type *</label>
              <select
                {...register('foodType')}
                disabled={!isEditable || isSubmitting}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
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
                disabled={!isEditable || isSubmitting}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
              />
              {errors.quantity && <p className="text-rose-400 mt-1">{errors.quantity.message}</p>}
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider">Quantity Unit *</label>
              <input
                type="text"
                {...register('quantityUnit')}
                disabled={!isEditable || isSubmitting}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
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
                disabled={!isEditable || isSubmitting}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider">Meal Type</label>
              <input
                type="text"
                {...register('mealType')}
                disabled={!isEditable || isSubmitting}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider">Cooked At</label>
              <input
                type="datetime-local"
                {...register('cookedAt')}
                disabled={!isEditable || isSubmitting}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider">Expires At *</label>
              <input
                type="datetime-local"
                {...register('expiresAt')}
                disabled={!isEditable || isSubmitting}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
              />
              {errors.expiresAt && <p className="text-rose-400 mt-1">{errors.expiresAt.message}</p>}
            </div>
          </div>

          <div className="flex space-x-6 pt-2">
            <label className="flex items-center space-x-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                {...register('isVegetarian')}
                disabled={!isEditable || isSubmitting}
                className="rounded accent-emerald-500 h-4 w-4 disabled:opacity-50"
              />
              <span>Vegetarian</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                {...register('isVegan')}
                disabled={!isEditable || isSubmitting}
                className="rounded accent-emerald-500 h-4 w-4 disabled:opacity-50"
              />
              <span>Vegan</span>
            </label>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              disabled={!isEditable || isSubmitting}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
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
            {isEditable && (
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-2.5 px-5 rounded-xl flex items-center space-x-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
