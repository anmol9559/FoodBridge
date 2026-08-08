import api from '../lib/axios'
import { ApiResponse, FoodDonation, Reservation, Pagination } from '../types'

export interface RestaurantDonationsResponse {
  donations: FoodDonation[]
  pagination: Pagination
}

export interface RestaurantReservationsResponse {
  reservations: Reservation[]
  pagination: Pagination
}

export interface RestaurantDashboardSummary {
  activeDonationsCount: number
  pendingReservationsCount: number
  confirmedPickupsCount: number
  totalMealsSaved: number
  recentDonations: FoodDonation[]
}

export interface CreateDonationPayload {
  title: string
  description?: string
  quantity: number
  quantityUnit: string
  foodType: string
  mealType?: string
  packagingType?: string
  isVegetarian?: boolean
  isVegan?: boolean
  estimatedServings?: number
  cookedAt?: string
  expiresAt: string
  pickupAddress?: string
  specialInstructions?: string
}

export async function getRestaurantDonations(params?: {
  page?: number
  limit?: number
  status?: string
  search?: string
}): Promise<RestaurantDonationsResponse> {
  const response = await api.get<ApiResponse<RestaurantDonationsResponse>>('/restaurant/donations', {
    params,
  })
  return response.data.data
}

export async function getSingleDonationApi(id: string): Promise<FoodDonation> {
  const response = await api.get<ApiResponse<FoodDonation>>(`/restaurant/donations/${id}`)
  return response.data.data
}

export async function createDonationApi(payload: CreateDonationPayload): Promise<FoodDonation> {
  const response = await api.post<ApiResponse<FoodDonation>>('/restaurant/donations', payload)
  return response.data.data
}

export async function updateDonationApi(id: string, payload: Partial<CreateDonationPayload>): Promise<FoodDonation> {
  const response = await api.put<ApiResponse<FoodDonation>>(`/restaurant/donations/${id}`, payload)
  return response.data.data
}

export async function deleteDonationApi(id: string): Promise<void> {
  await api.delete(`/restaurant/donations/${id}`)
}

export async function getRestaurantReservations(params?: {
  page?: number
  limit?: number
  status?: string
}): Promise<RestaurantReservationsResponse> {
  const response = await api.get<ApiResponse<RestaurantReservationsResponse>>('/restaurant/reservations', {
    params,
  })
  return response.data.data
}

export async function confirmReservationApi(id: string): Promise<ApiResponse<unknown>> {
  const response = await api.patch<ApiResponse<unknown>>(`/restaurant/reservations/${id}/confirm`)
  return response.data
}

export async function regeneratePickupPinApi(id: string): Promise<ApiResponse<unknown>> {
  const response = await api.patch<ApiResponse<unknown>>(`/restaurant/reservations/${id}/regenerate-pin`)
  return response.data
}

export async function rejectReservationApi(id: string): Promise<ApiResponse<unknown>> {
  const response = await api.patch<ApiResponse<unknown>>(`/restaurant/reservations/${id}/reject`)
  return response.data
}

export async function getRestaurantDashboardSummary(): Promise<RestaurantDashboardSummary> {
  const [availableDonationsRes, pendingRes, confirmedRes, recentDonationsRes, completedDonationsRes] =
    await Promise.all([
      getRestaurantDonations({ status: 'AVAILABLE', limit: 1 }),
      getRestaurantReservations({ status: 'PENDING', limit: 1 }),
      getRestaurantReservations({ status: 'CONFIRMED', limit: 1 }),
      getRestaurantDonations({ page: 1, limit: 5 }),
      getRestaurantDonations({ status: 'COMPLETED', limit: 100 }),
    ])

  const totalMealsSaved = completedDonationsRes.donations.reduce(
    (sum, d) => sum + (Number(d.estimatedServings) || Number(d.quantity) || 0),
    0
  )

  return {
    activeDonationsCount: availableDonationsRes.pagination.totalItems ?? 0,
    pendingReservationsCount: pendingRes.pagination.totalItems ?? 0,
    confirmedPickupsCount: confirmedRes.pagination.totalItems ?? 0,
    totalMealsSaved,
    recentDonations: recentDonationsRes.donations ?? [],
  }
}
