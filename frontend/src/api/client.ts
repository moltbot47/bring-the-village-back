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

export const submitWaitlist = (data: WaitlistData) =>
  api.post('/waitlist/', data)

export const getWaitlistCount = () =>
  api.get<WaitlistCountResponse>('/waitlist/count/')

export const getDonationStats = () =>
  api.get<DonationStatsResponse>('/donations/stats/')

export default api
