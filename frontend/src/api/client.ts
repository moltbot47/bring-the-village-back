import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface WaitlistData {
  email: string
  full_name: string
  zip_code: string
  kids_ages: string
  needs?: string
  offers?: string
  chapter: string
}

export interface WaitlistCountResponse {
  count: number
}

export interface DonationStatsResponse {
  total_raised: number
  sponsor_pool: number
  donor_count: number
}

export interface UserProfile {
  id: number
  email: string
  display_name: string
  bio: string
  zip_code: string
  chapter: string
  kids_ages: string
  needs: string
  offers: string
  availability: string[]
  photo_url: string
  is_onboarded: boolean
  is_sponsor_eligible: boolean
  created_at: string
}

export interface RegisterData {
  email: string
  password: string
  display_name: string
  zip_code: string
  kids_ages: string
  chapter: string
}

export interface LoginData {
  email: string
  password: string
}

// Auth
export const register = (data: RegisterData) =>
  api.post<{ user: UserProfile }>('/auth/register/', data)

export const login = (data: LoginData) =>
  api.post<{ user: UserProfile }>('/auth/login/', data)

export const logout = () =>
  api.post('/auth/logout/')

export const getMe = () =>
  api.get<{ user: UserProfile }>('/auth/me/')

export const updateProfile = (data: Partial<UserProfile>) =>
  api.patch<{ user: UserProfile }>('/auth/me/update/', data)

// Waitlist
export const submitWaitlist = (data: WaitlistData) =>
  api.post('/waitlist/', data)

export const getWaitlistCount = () =>
  api.get<WaitlistCountResponse>('/waitlist/count/')

export const getDonationStats = () =>
  api.get<DonationStatsResponse>('/donations/stats/')

export default api
