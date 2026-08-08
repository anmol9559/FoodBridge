import React, { useState, useEffect, useRef } from 'react'
import { Navigation, Search, MapPin, Loader2, AlertCircle, CheckCircle2, Globe } from 'lucide-react'

export interface LocationData {
  latitude: number
  longitude: number
  streetAddress?: string
  city?: string
  state?: string
  pincode?: string
  country?: string
}

interface LocationPickerProps {
  onLocationSelect: (location: LocationData) => void
  initialLat?: number
  initialLng?: number
}

interface SearchResult {
  place_id: number
  display_name: string
  lat: string
  lon: string
  address?: {
    road?: string
    suburb?: string
    neighbourhood?: string
    city?: string
    town?: string
    village?: string
    county?: string
    state?: string
    postcode?: string
    country?: string
  }
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  initialLat = 28.6139, // Default New Delhi
  initialLng = 77.209,
}) => {
  const [lat, setLat] = useState<number>(initialLat)
  const [lng, setLng] = useState<number>(initialLng)
  const [isLocating, setIsLocating] = useState(false)
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Autocomplete Search States
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  // Click outside listener for search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Reverse Geocoding helper function using Nominatim API
  const reverseGeocode = async (latitude: number, longitude: number) => {
    setIsGeocoding(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
      )
      const data = await response.json()

      if (data && data.address) {
        const addr = data.address
        const street =
          addr.road || addr.suburb || addr.neighbourhood || addr.amenity || data.display_name?.split(',')[0] || ''
        const city = addr.city || addr.town || addr.village || addr.county || addr.state_district || ''
        const state = addr.state || ''
        const pincode = addr.postcode || ''
        const country = addr.country || 'India'

        onLocationSelect({
          latitude,
          longitude,
          streetAddress: street,
          city,
          state,
          pincode,
          country,
        })
      } else {
        onLocationSelect({ latitude, longitude })
      }
    } catch {
      onLocationSelect({ latitude, longitude })
    } finally {
      setIsGeocoding(false)
    }
  }

  // Handle Geolocation API request
  const handleUseCurrentLocation = () => {
    setGeoError(null)
    setSuccessMessage(null)

    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.')
      return
    }

    setIsLocating(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setLat(latitude)
        setLng(longitude)
        setIsLocating(false)
        setSuccessMessage('Current location detected successfully!')
        setTimeout(() => setSuccessMessage(null), 3000)
        await reverseGeocode(latitude, longitude)
      },
      (error) => {
        setIsLocating(false)
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGeoError('Location permission denied. Please search for your location above or enter address manually.')
            break;
          case error.POSITION_UNAVAILABLE:
            setGeoError('Location information unavailable. Please search for your location.')
            break;
          case error.TIMEOUT:
            setGeoError('Location detection request timed out.')
            break;
          default:
            setGeoError('An error occurred while retrieving location.')
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    )
  }

  // Handle Autocomplete Search Query Change
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 3) {
      setSearchResults([])
      return
    }

    const timer = setTimeout(async () => {
      setIsSearching(true)
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            searchQuery
          )}&addressdetails=1&limit=5&countrycodes=in`
        )
        const results = await response.json()
        setSearchResults(results || [])
        setShowDropdown(true)
      } catch {
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Select location from search suggestions
  const handleSelectResult = (result: SearchResult) => {
    const selectedLat = parseFloat(result.lat)
    const selectedLng = parseFloat(result.lon)
    setLat(selectedLat)
    setLng(selectedLng)
    setShowDropdown(false)
    setSearchQuery(result.display_name)

    const addr = result.address
    const street =
      addr?.road || addr?.suburb || addr?.neighbourhood || result.display_name.split(',')[0] || ''
    const city = addr?.city || addr?.town || addr?.village || addr?.county || ''
    const state = addr?.state || ''
    const pincode = addr?.postcode || ''
    const country = addr?.country || 'India'

    onLocationSelect({
      latitude: selectedLat,
      longitude: selectedLng,
      streetAddress: street,
      city,
      state,
      pincode,
      country,
    })
  }

  return (
    <div className="space-y-3.5 text-xs">
      {/* Geolocation Button & Search Bar Header */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        {/* Use Current Location Button */}
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLocating || isGeocoding}
          className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 transition shadow-lg shadow-emerald-500/20 disabled:opacity-50 text-xs shrink-0"
        >
          {isLocating || isGeocoding ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Detecting Location...</span>
            </>
          ) : (
            <>
              <Navigation className="h-4 w-4" />
              <span>Use My Current Location</span>
            </>
          )}
        </button>

        {/* Address Autocomplete Search Input */}
        <div ref={searchContainerRef} className="relative flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
              placeholder="Search area, landmark, or city..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-8 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-2.5 h-4 w-4 text-emerald-400 animate-spin" />
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute z-50 left-0 right-0 top-12 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden divide-y divide-slate-800 max-h-56 overflow-y-auto">
              {searchResults.map((res) => (
                <button
                  key={res.place_id}
                  type="button"
                  onClick={() => handleSelectResult(res)}
                  className="w-full p-3 text-left hover:bg-slate-800/80 transition flex items-start space-x-2.5 text-slate-200"
                >
                  <MapPin className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-tight line-clamp-2">{res.display_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Geolocation Success Banner */}
      {successMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl flex items-center space-x-2 text-[11px] text-emerald-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Geolocation Error Banner */}
      {geoError && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl flex items-start space-x-2 text-[11px] text-rose-300">
          <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{geoError}</span>
        </div>
      )}

      {/* Interactive Map Preview Card */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-inner space-y-2">
        <div className="p-3 bg-slate-900 border-b border-slate-800 flex justify-between items-center text-[11px]">
          <div className="flex items-center space-x-2 text-slate-300 font-semibold">
            <Globe className="h-3.5 w-3.5 text-emerald-400" />
            <span>Interactive Location Pin</span>
          </div>
          <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            {lat.toFixed(4)}° N, {lng.toFixed(4)}° E
          </span>
        </div>

        {/* Embedded Interactive Map View */}
        <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
          <iframe
            title="Location Map"
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.008}%2C${
              lat - 0.008
            }%2C${lng + 0.008}%2C${lat + 0.008}&layer=mapnik&marker=${lat}%2C${lng}`}
            className="w-full h-full filter invert-[0.9] hue-rotate-180 brightness-95 contrast-125 rounded-b-xl"
          />
        </div>
      </div>
    </div>
  )
}
