import { User, Organization, UserRole } from './index'

export interface LoginInput {
  email: string
  password: string
}

export interface OrganizationLocationInput {
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  postalCode?: string
  countryCode?: string
  latitude?: number
  longitude?: number
  googleMapsUrl?: string
}

export interface RegisterInput {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
  role: UserRole
  organization: {
    name: string
    registrationNumber?: string
    email?: string
    phone?: string
    description?: string
    websiteUrl?: string
    location?: OrganizationLocationInput
  }
}

export interface LoginResponseData {
  accessToken: string
  refreshToken: string
  role: UserRole
  user: User
  organization: Organization | null
}

export interface RegisterResponseData {
  user: User
  organization: Organization
}

export interface AuthContextType {
  user: User | null
  organization: Organization | null
  token: string | null
  role: UserRole | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (data: LoginResponseData) => void
  logout: () => void
  refreshUser: () => Promise<void>
}
