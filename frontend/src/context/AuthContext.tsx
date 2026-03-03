import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { UserProfile, getMe, login as apiLogin, logout as apiLogout, register as apiRegister, RegisterData, LoginData } from '../api/client'

interface AuthState {
  user: UserProfile | null
  loading: boolean
  login: (data: LoginData) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      const res = await getMe()
      setUser(res.data.user)
    } catch {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    refreshUser().finally(() => setLoading(false))
  }, [refreshUser])

  const login = async (data: LoginData) => {
    const res = await apiLogin(data)
    setUser(res.data.user)
  }

  const register = async (data: RegisterData) => {
    const res = await apiRegister(data)
    setUser(res.data.user)
  }

  const logout = async () => {
    await apiLogout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
