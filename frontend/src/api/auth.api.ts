import api from '../lib/axios'
import { ApiResponse, User } from '../types'
import { LoginInput, RegisterInput, LoginResponseData, RegisterResponseData } from '../types/auth'

export async function loginApi(input: LoginInput): Promise<ApiResponse<LoginResponseData>> {
  const response = await api.post<ApiResponse<LoginResponseData>>('/auth/login', input)
  return response.data
}

export async function registerApi(input: RegisterInput): Promise<ApiResponse<RegisterResponseData>> {
  const response = await api.post<ApiResponse<RegisterResponseData>>('/auth/register', input)
  return response.data
}

export async function getMeApi(): Promise<ApiResponse<User>> {
  const response = await api.get<ApiResponse<User>>('/auth/me')
  return response.data
}

export interface ResubmitOrganizationInput {
  name?: string
  phone?: string
  description?: string
  websiteUrl?: string
  registrationNumber?: string
}

export async function resubmitOrganizationApi(input: ResubmitOrganizationInput): Promise<ApiResponse<unknown>> {
  const response = await api.post<ApiResponse<unknown>>('/auth/organization/resubmit', input)
  return response.data
}
