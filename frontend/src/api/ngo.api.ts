import api from '../lib/axios'
import { ApiResponse, FoodDonation, Reservation, Pagination } from '../types'

export interface NgoDonationsResponse {
  donations: FoodDonation[]
  pagination: Pagination
}

export interface NgoReservationsResponse {
  reservations: Reservation[]
  pagination: Pagination
}

export interface NgoDashboardSummary {
  availableDonationsCount: number
  activeReservationsCount: number
  completedPickupsCount: number
  totalMealsRescued: number
  recentReservations: Reservation[]
}

export async function getNgoAvailableDonations(params?: {
  page?: number
  limit?: number
  search?: string
}): Promise<NgoDonationsResponse> {
  const response = await api.get<ApiResponse<NgoDonationsResponse>>('/ngo/donations', {
    params,
  })
  return response.data.data
}

export async function getNgoReservations(params?: {
  page?: number
  limit?: number
  status?: string
}): Promise<NgoReservationsResponse> {
  const response = await api.get<ApiResponse<NgoReservationsResponse>>('/ngo/reservations', {
    params,
  })
  return response.data.data
}

export async function verifyNgoPickupApi(
  id: string,
  code: string
): Promise<ApiResponse<unknown>> {
  const response = await api.post<ApiResponse<unknown>>(`/ngo/reservations/${id}/verify-pickup`, {
    code,
  })
  return response.data
}

export async function completeNgoReservationApi(
  id: string,
  pickupCode?: string
): Promise<ApiResponse<unknown>> {
  const response = await api.post<ApiResponse<unknown>>(`/ngo/reservations/${id}/verify-pickup`, {
    code: pickupCode,
  })
  return response.data
}

export async function getNgoDashboardSummary(): Promise<NgoDashboardSummary> {
  const [availableDonationsRes, pendingRes, confirmedRes, completedRes, recentReservationsRes] =
    await Promise.all([
      getNgoAvailableDonations({ limit: 1 }),
      getNgoReservations({ status: 'PENDING', limit: 1 }),
      getNgoReservations({ status: 'CONFIRMED', limit: 1 }),
      getNgoReservations({ status: 'COMPLETED', limit: 100 }),
      getNgoReservations({ page: 1, limit: 5 }),
    ])

  const pendingCount = pendingRes.pagination?.totalItems ?? 0
  const confirmedCount = confirmedRes.pagination?.totalItems ?? 0
  const completedCount = completedRes.pagination?.totalItems ?? 0

  const totalMealsRescued = completedRes.reservations.reduce(
    (sum, r) => sum + (r.donation?.estimatedServings || Number(r.donation?.quantity) || 0),
    0
  )

  return {
    availableDonationsCount: availableDonationsRes.pagination?.totalItems ?? 0,
    activeReservationsCount: pendingCount + confirmedCount,
    completedPickupsCount: completedCount,
    totalMealsRescued,
    recentReservations: recentReservationsRes.reservations ?? [],
  }
}
