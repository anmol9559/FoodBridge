import React, { useState } from 'react'
import {
  X,
  Building2,
  MapPin,
  Phone,
  Mail,
  Navigation,
  Clock,
  CheckCircle2,
  Utensils,
  AlertTriangle,
  FileText,
  KeyRound,
  Loader2,
  History,
  ExternalLink,
} from 'lucide-react'
import { Reservation } from '../../../types'
import { verifyNgoPickupApi } from '../../../api/ngo.api'
import { useQueryClient } from '@tanstack/react-query'

interface NgoReservationDetailsModalProps {
  reservation: Reservation
  onClose: () => void
}

export const NgoReservationDetailsModal: React.FC<NgoReservationDetailsModalProps> = ({
  reservation,
  onClose,
}) => {
  const queryClient = useQueryClient()

  const [pickupCodeInput, setPickupCodeInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isCompletedState, setIsCompletedState] = useState(reservation.status === 'COMPLETED')

  const donation = reservation.donation
  const restaurant = donation?.restaurant
  const owner = restaurant?.users?.[0]
  const location = restaurant?.locations?.[0]

  const contactPhone = restaurant?.phone || owner?.phone || ''
  const contactEmail = restaurant?.email || owner?.email || ''
  const contactName = owner ? `${owner.firstName} ${owner.lastName}` : restaurant?.name || 'Restaurant Staff'

  const streetAddress = donation?.pickupAddress || location?.addressLine1 || 'Contact restaurant for exact pickup spot'
  const cityState = location ? `${location.city}, ${location.state} ${location.postalCode || ''}` : ''

  const latitude = donation?.latitude || location?.latitude
  const longitude = donation?.longitude || location?.longitude

  const googleMapsUrl =
    latitude && longitude
      ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(streetAddress + ' ' + cityState)}`

  const handleVerifyAndComplete = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const response = await verifyNgoPickupApi(reservation.id, pickupCodeInput.trim())
      if (response.success) {
        setIsCompletedState(true)
        setSuccessMessage('Pickup completed successfully! PIN verified and donation collected.')
        queryClient.invalidateQueries({ queryKey: ['ngoReservations'] })
        queryClient.invalidateQueries({ queryKey: ['ngoDashboardSummary'] })
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { error?: { code?: string; message?: string } } }; message?: string }
      const errCode = errorObj.response?.data?.error?.code
      let msg = errorObj.response?.data?.error?.message

      if (errCode === 'INVALID_PICKUP_CODE') {
        msg = 'Invalid pickup code'
      } else if (errCode === 'PICKUP_CODE_EXPIRED') {
        msg = 'Pickup code expired'
      }

      setErrorMessage(msg || 'Invalid pickup code')
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentStatus = isCompletedState ? 'COMPLETED' : reservation.status

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl space-y-6 p-6 sm:p-8 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Utensils className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white tracking-tight">{donation?.title || 'Food Donation'}</h2>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    currentStatus === 'COMPLETED'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : currentStatus === 'CONFIRMED'
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                      : currentStatus === 'REJECTED' || currentStatus === 'CANCELLED'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}
                >
                  {currentStatus}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Reservation ID: <span className="font-mono text-slate-300">{reservation.id}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Success Alert Banner with Animation */}
        {successMessage && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center space-x-3 text-xs text-emerald-400 animate-in zoom-in-95">
            <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-400" />
            <div>
              <p className="font-bold text-sm text-emerald-300">Pickup Completed Successfully</p>
              <p className="text-emerald-400/90 text-xs">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex items-center space-x-3 text-xs text-rose-300 animate-in fade-in">
            <AlertTriangle className="h-5 w-5 shrink-0 text-rose-400" />
            <span className="font-semibold">{errorMessage}</span>
          </div>
        )}

        {/* Section 1: Quick Action Bar */}
        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] pl-1">Quick Contact & Nav</span>
          <div className="flex items-center space-x-2">
            {contactPhone && (
              <a
                href={`tel:${contactPhone}`}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-3 py-1.5 rounded-xl inline-flex items-center space-x-1.5 transition border border-slate-700"
              >
                <Phone className="h-3.5 w-3.5 text-emerald-400" />
                <span>Call Staff</span>
              </a>
            )}

            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-3 py-1.5 rounded-xl inline-flex items-center space-x-1.5 transition border border-slate-700"
              >
                <Mail className="h-3.5 w-3.5 text-cyan-400" />
                <span>Email</span>
              </a>
            )}

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-3 py-1.5 rounded-xl inline-flex items-center space-x-1.5 transition shadow-lg shadow-emerald-500/20"
            >
              <Navigation className="h-3.5 w-3.5" />
              <span>Navigate</span>
            </a>
          </div>
        </div>

        {/* Section 2: Pickup Verification Workflow */}
        {!isCompletedState && reservation.status === 'CONFIRMED' && (
          <div className="bg-gradient-to-r from-emerald-500/10 via-slate-900 to-cyan-500/10 border border-emerald-500/30 p-5 rounded-2xl space-y-4 text-xs">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
              <KeyRound className="h-5 w-5 shrink-0" />
              <span>Pickup Verification</span>
            </div>

            {/* Instructions */}
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1 text-slate-300 text-[11px]">
              <p className="font-bold text-white uppercase tracking-wider text-[10px]">Verification Instructions:</p>
              <ol className="list-decimal list-inside space-y-0.5 text-slate-300 pl-1">
                <li>Arrive at the restaurant pickup location.</li>
                <li>Ask restaurant staff for the 6-digit Pickup PIN.</li>
                <li>Enter the PIN in the input field below.</li>
                <li>Click <strong>Verify Pickup</strong> to complete the handoff.</li>
              </ol>
            </div>

            <form onSubmit={handleVerifyAndComplete} className="flex flex-col sm:flex-row items-center gap-2 pt-1">
              <div className="relative w-full sm:w-64">
                <KeyRound className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  disabled={isSubmitting || isCompletedState}
                  value={pickupCodeInput}
                  onChange={(e) => setPickupCodeInput(e.target.value)}
                  placeholder="Enter 6-Digit PIN..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-2 text-xs text-white font-mono font-bold tracking-widest focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !pickupCodeInput.trim() || isCompletedState}
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-5 py-2 rounded-xl flex items-center justify-center space-x-2 transition shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Verify Pickup</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Section 3: Food Donation Details */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
          <h3 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center space-x-2">
            <Utensils className="h-4 w-4 text-emerald-400" />
            <span>Surplus Food Items</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px]">
            <div>
              <span className="text-slate-500 block">Quantity & Unit</span>
              <span className="text-slate-200 font-bold text-xs">
                {donation?.quantity} {donation?.quantityUnit}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block">Est. Servings</span>
              <span className="text-slate-200 font-bold text-xs">
                {donation?.estimatedServings ? `${donation.estimatedServings} Meals` : 'N/A'}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block">Food Category</span>
              <span className="text-emerald-400 font-semibold">{donation?.foodType}</span>
            </div>

            <div>
              <span className="text-slate-500 block">Expiry Date & Time</span>
              <span className="text-rose-400 font-semibold flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{donation?.expiresAt ? new Date(donation.expiresAt).toLocaleString() : 'N/A'}</span>
              </span>
            </div>

            <div>
              <span className="text-slate-500 block">Packaging</span>
              <span className="text-slate-300">{donation?.packagingType || 'Container Packed'}</span>
            </div>

            <div>
              <span className="text-slate-500 block">Dietary Attributes</span>
              <span className="text-slate-300">
                {donation?.isVegetarian ? '🌱 Vegetarian' : '🍖 Non-Vegetarian'} {donation?.isVegan ? '• Vegan' : ''}
              </span>
            </div>
          </div>

          {donation?.specialInstructions && (
            <div className="pt-2 border-t border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Special Pickup Instructions</span>
              <p className="text-slate-300 leading-relaxed mt-0.5">{donation.specialInstructions}</p>
            </div>
          )}
        </div>

        {/* Section 4: Restaurant Donor & Contact */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
          <h3 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center space-x-2">
            <Building2 className="h-4 w-4 text-cyan-400" />
            <span>Restaurant Donor Profile</span>
          </h3>

          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 overflow-hidden">
              {restaurant?.logoImageUrl ? (
                <img src={restaurant.logoImageUrl} alt={restaurant.name} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="h-6 w-6 text-emerald-400" />
              )}
            </div>
            <div className="space-y-0.5 text-[11px]">
              <h4 className="font-bold text-white text-sm">{restaurant?.name || 'Restaurant Partner'}</h4>
              <p className="text-slate-400">Contact Person: <strong className="text-slate-200">{contactName}</strong></p>
              <p className="text-slate-400">Phone: <span className="text-slate-200">{contactPhone || 'N/A'}</span> • Email: <span className="text-slate-200">{contactEmail || 'N/A'}</span></p>
            </div>
          </div>
        </div>

        {/* Section 5: Physical Pickup Address & Interactive Map */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-amber-400" />
              <span>Pickup Location & Directions</span>
            </h3>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 font-semibold text-[11px] hover:underline flex items-center space-x-1"
            >
              <span>Open Google Maps</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="text-[11px] space-y-1">
            <p className="text-slate-200 font-bold">{streetAddress}</p>
            {cityState && <p className="text-slate-400">{cityState}</p>}
          </div>

          {latitude && longitude && (
            <div className="w-full h-44 rounded-xl overflow-hidden border border-slate-800 bg-slate-900 mt-2">
              <iframe
                title="Pickup Location Map"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(longitude) - 0.008},${Number(latitude) - 0.008},${Number(longitude) + 0.008},${Number(latitude) + 0.008}&layer=mapnik&marker=${latitude},${longitude}`}
              />
            </div>
          )}
        </div>

        {/* Section 6: Logistics Activity Timeline */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
          <h3 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center space-x-2">
            <History className="h-4 w-4 text-emerald-400" />
            <span>Reservation Audit Timeline</span>
          </h3>

          <div className="space-y-2 pl-2 border-l-2 border-slate-800 text-[11px]">
            <div className="relative pl-4">
              <span className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <p className="font-semibold text-slate-200">Reservation Requested</p>
              <p className="text-slate-500 text-[10px]">
                {reservation.createdAt ? new Date(reservation.createdAt).toLocaleString() : 'N/A'}
              </p>
            </div>

            {!isCompletedState && reservation.status === 'CONFIRMED' && (
              <div className="relative pl-4">
                <span className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <p className="font-semibold text-cyan-400">Restaurant Confirmed & Pickup PIN Issued</p>
                <p className="text-slate-400 text-[10px]">Awaiting NGO arrival & PIN verification.</p>
              </div>
            )}

            {isCompletedState && (
              <div className="relative pl-4">
                <span className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <p className="font-semibold text-emerald-400">Pickup Completed & Handoff Verified</p>
                <p className="text-slate-500 text-[10px]">
                  {reservation.updatedAt ? new Date(reservation.updatedAt).toLocaleString() : new Date().toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Section 7: Exchanged Notes */}
        {reservation.notes && (
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1 text-xs">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] flex items-center space-x-1">
              <FileText className="h-3.5 w-3.5 text-slate-400" />
              <span>Reservation Notes</span>
            </span>
            <p className="text-slate-300 leading-relaxed">{reservation.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-5 py-2 rounded-xl text-xs transition"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  )
}
