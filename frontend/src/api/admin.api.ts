import api from '../lib/axios'
import { ApiResponse, Reservation, FoodDonation, Pagination } from '../types'

export interface AdminDashboardStats {
  totalRestaurants: number
  totalNgos: number
  totalDonations: number
  availableDonations: number
  reservedDonations: number
  completedDonations: number
  cancelledDonations: number
  totalReservations: number
  pendingReservations: number
  confirmedReservations: number
  completedReservations: number
}

export interface AdminReservationsResponse {
  reservations: Reservation[]
  pagination: Pagination
}

export interface AdminDonationsResponse {
  donations: FoodDonation[]
  pagination: Pagination
}

export interface AdminOrganizationLocation {
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

export interface AdminOrganizationUser {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  profileImageUrl?: string
  createdAt?: string
}

export interface AdminOrganizationItem {
  id: string
  name: string
  email: string
  phone: string
  type: string
  description?: string
  logoImageUrl?: string
  websiteUrl?: string
  registrationNumber?: string
  verificationStatus?: string
  rejectionReason?: string
  verifiedAt?: string
  createdAt?: string
  updatedAt?: string
  users?: AdminOrganizationUser[]
  locations?: AdminOrganizationLocation[]
  owner?: AdminOrganizationUser | null
}

export interface AdminRestaurantsResponse {
  restaurants: AdminOrganizationItem[]
  pagination: Pagination
}

export interface AdminNgosResponse {
  ngos: AdminOrganizationItem[]
  pagination: Pagination
}

export interface PendingOrganizationsResponse {
  organizations: AdminOrganizationItem[]
}

export async function getDashboardStats(): Promise<AdminDashboardStats> {
  const response = await api.get<ApiResponse<AdminDashboardStats>>('/admin/dashboard')
  return response.data.data
}

export async function getAdminReservations(params?: {
  page?: number
  limit?: number
  status?: string
}): Promise<AdminReservationsResponse> {
  const response = await api.get<ApiResponse<AdminReservationsResponse>>('/admin/reservations', {
    params,
  })
  return response.data.data
}

export async function getAdminDonations(params?: {
  page?: number
  limit?: number
  status?: string
  search?: string
}): Promise<AdminDonationsResponse> {
  const response = await api.get<ApiResponse<AdminDonationsResponse>>('/admin/donations', {
    params,
  })
  return response.data.data
}

export async function getAdminRestaurants(params?: {
  page?: number
  limit?: number
  search?: string
}): Promise<AdminRestaurantsResponse> {
  const response = await api.get<ApiResponse<AdminRestaurantsResponse>>('/admin/restaurants', {
    params,
  })
  return response.data.data
}

export async function getAdminNgos(params?: {
  page?: number
  limit?: number
  search?: string
}): Promise<AdminNgosResponse> {
  const response = await api.get<ApiResponse<AdminNgosResponse>>('/admin/ngos', {
    params,
  })
  return response.data.data
}

export async function getPendingOrganizationsApi(params?: {
  status?: string
  type?: string
  search?: string
}): Promise<PendingOrganizationsResponse> {
  const response = await api.get<ApiResponse<PendingOrganizationsResponse>>('/admin/organizations/pending', {
    params,
  })
  return response.data.data
}

export async function verifyOrganizationApi(
  id: string,
  status: 'VERIFIED' | 'REJECTED',
  reason?: string
): Promise<AdminOrganizationItem> {
  const response = await api.patch<ApiResponse<AdminOrganizationItem>>(`/admin/organizations/${id}/verify`, {
    status,
    reason,
  })
  return response.data.data
}
