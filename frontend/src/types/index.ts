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

export type FoodType = 'COOKED' | 'PACKAGED' | 'RAW' | 'BAKERY' | 'BEVERAGE' | 'OTHER'

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED'

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
  status: FoodDonationStatus
  estimatedServings?: number
  pickupAddress?: string
  createdAt: string
  expiresAt: string
  restaurant?: {
    id: string
    name: string
    email?: string
    phone?: string
  }
}

export interface Reservation {
  id: string
  status: ReservationStatus
  notes?: string
  createdAt: string
  donation?: FoodDonation
  ngo?: {
    id: string
    name: string
    email?: string
    phone?: string
  }
  reservedBy?: User
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
