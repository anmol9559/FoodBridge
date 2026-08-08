import api from '../lib/axios'
import { ApiResponse } from '../types'

export interface PublicPlatformStats {
  verifiedRestaurants: number
  verifiedNgos: number
  totalDonations: number
  completedPickups: number
  mealsSaved: number
}

export async function getPublicStatsApi(): Promise<PublicPlatformStats> {
  const response = await api.get<ApiResponse<PublicPlatformStats>>('/public/stats')
  return response.data.data
}
