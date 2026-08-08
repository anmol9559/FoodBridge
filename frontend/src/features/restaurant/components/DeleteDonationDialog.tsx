import React, { useState } from 'react'
import { Trash2, AlertTriangle, Loader2, X } from 'lucide-react'
import { deleteDonationApi } from '../../../api/restaurant.api'
import { FoodDonation } from '../../../types'

interface DeleteDonationDialogProps {
  donation: FoodDonation | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export const DeleteDonationDialog: React.FC<DeleteDonationDialogProps> = ({ donation, isOpen, onClose, onSuccess }) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  if (!isOpen || !donation) return null

  const handleDelete = async () => {
    setIsDeleting(true)
    setErrorMessage(null)

    try {
      await deleteDonationApi(donation.id)
      setIsDeleting(false)
      onSuccess()
      onClose()
    } catch (err: unknown) {
      setIsDeleting(false)
      const errorObj = err as { response?: { data?: { error?: { message?: string } } }; message?: string }
      const backendMessage =
        errorObj.response?.data?.error?.message || errorObj.message || 'Failed to delete donation.'
      setErrorMessage(backendMessage)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-5">
        <div className="flex justify-between items-start">
          <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white">Delete Food Donation</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Are you sure you want to delete <strong className="text-white">"{donation.title}"</strong>? This will remove the surplus food listing from NGO browse feeds.
          </p>
        </div>

        {errorMessage && (
          <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl text-xs text-rose-300">
            {errorMessage}
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-2">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2 px-4 rounded-xl text-xs"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-rose-500 hover:bg-rose-600 text-slate-950 font-bold py-2 px-4 rounded-xl text-xs flex items-center space-x-1.5 shadow-lg shadow-rose-500/20 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="h-3.5 w-3.5" />
                <span>Confirm Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
