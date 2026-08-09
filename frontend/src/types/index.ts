export type UserRole = 'RESTAURANT' | 'NGO' | 'ADMIN' | 'RECYCLER'

export type OrganizationType = 'RESTAURANT' | 'NGO' | 'RECYCLER'

export type VerificationStatus = 'PENDING' | 'IN_REVIEW' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED'

export type FoodDonationStatus =
  | 'AVAILABLE'
  | 'RESERVED'
  | 'APPROVED'
  | 'PICKED_UP'
  | 'COLLECTED'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'RECOVERY_PENDING'
  | 'RECOVERED'

export type RecoveryMethod =
  | 'CATTLE_FEED'
  | 'COMPOST'
  | 'BIOGAS'
  | 'ORGANIC_FERTILIZER'
  | 'ANIMAL_SHELTER'
  | 'SAFE_DISPOSAL'

export type FoodType = 'COOKED' | 'PACKAGED' | 'RAW' | 'BAKERY' | 'BEVERAGE' | 'OTHER'

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED' | 'REJECTED'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: UserRole
  organizationId?: string
  profileImageUrl?: string
}

export interface OrganizationLocation {
  id?: string
  label?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  postalCode?: string
  countryCode?: string
  latitude?: number
  longitude?: number
}

export interface OrganizationUser {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  profileImageUrl?: string
}

export interface Organization {
  id: string
  name: string
  type: OrganizationType
  description?: string
  logoImageUrl?: string
  websiteUrl?: string
  registrationNumber?: string
  email?: string
  phone?: string
  verificationStatus: VerificationStatus
  users?: OrganizationUser[]
  locations?: OrganizationLocation[]
}

export interface FoodDonation {
  id: string
  title: string
  description?: string
  quantity: number
  quantityUnit: string
  foodType: FoodType
  mealType?: string
  packagingType?: string
  isVegetarian: boolean
  isVegan: boolean
  cookedAt?: string
  status: FoodDonationStatus
  estimatedServings?: number
  specialInstructions?: string
  pickupAddress?: string
  latitude?: number
  longitude?: number
  createdAt: string
  expiresAt: string
  restaurant?: Organization
  recoveryMethod?: RecoveryMethod
  recoveryNotes?: string
  recoveredAt?: string
  recoveredBy?: {
    id: string
    firstName: string
    lastName: string
    email?: string
  }
}

export interface Reservation {
  id: string
  status: ReservationStatus
  pickupCode?: string
  notes?: string
  reservedAt?: string
  createdAt: string
  updatedAt?: string
  donation?: FoodDonation
  ngo?: Organization
  reservedBy?: User
}

export interface RestaurantAnalytics {
  totalDonations: number
  mealsDonated: number
  mealsSaved: number
  expiredDonations: number
  recoveredDonations: number
  recoveryRate: number
  recoveryMethods: Record<RecoveryMethod, number>
}

export interface AdminDashboardStats {
  totalRestaurants: number
  totalNgos: number
  totalDonations: number
  availableDonations: number
  reservedDonations: number
  completedDonations: number
  cancelledDonations: number
  expiredDonations: number
  recoveredDonations: number
  recoveryPendingDonations: number
  cattleFeedDonations: number
  compostDonations: number
  biogasDonations: number
  organicFertilizerDonations: number
  animalShelterDonations: number
  safeDisposalDonations: number
  recoveryPercentage: number
  totalReservations: number
  pendingReservations: number
  confirmedReservations: number
  completedReservations: number
}

export interface Pagination {
  page: number
  limit: number
  totalItems: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  error?: {
    code: string
    message: string
    details?: Array<{ field: string; message: string }>
  }
}
