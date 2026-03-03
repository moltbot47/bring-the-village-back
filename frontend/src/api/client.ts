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

// Matching
export interface MatchSuggestion {
  id: number
  profile: UserProfile
  total_score: number
  proximity_score: number
  age_overlap_score: number
  schedule_score: number
  needs_offers_score: number
  ai_reason: string
}

export interface MatchRequestItem {
  id: number
  from_user: number
  to_user: number
  from_user_name: string
  to_user_name: string
  status: string
  message: string
  created_at: string
}

export interface ConnectionItem {
  id: number
  user_id: number
  display_name: string
  bio: string
  kids_ages: string
  chapter: string
  connected_at: string
}

export const getMatchSuggestions = () =>
  api.get<{ suggestions: MatchSuggestion[] }>('/matches/suggestions/')

export const sendMatchRequest = (to_user: number, message: string) =>
  api.post('/matches/request/', { to_user, message })

export const respondMatchRequest = (requestId: number, action: 'accept' | 'decline') =>
  api.patch(`/matches/request/${requestId}/respond/`, { action })

export const getMyRequests = () =>
  api.get<{ incoming: MatchRequestItem[]; outgoing: MatchRequestItem[] }>('/matches/requests/')

export const getMyConnections = () =>
  api.get<{ connections: ConnectionItem[] }>('/matches/connections/')

export default api
