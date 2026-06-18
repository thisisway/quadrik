'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import { api } from '@/lib/api'

export interface AuthUser {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  clubId: string | null
  role: string | null
  accessToken: string
  refreshToken: string
}

interface LoginResponse {
  user: { id: string; name: string; email: string; avatarUrl: string | null }
  clubId: string | null
  role: string | null
  accessToken: string
  refreshToken: string
}

interface RegisterResponse {
  user: { id: string; name: string; email: string }
  accessToken: string
  refreshToken: string
}

interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)
const KEY = 'quadrik_auth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      try {
        setUser(JSON.parse(raw) as AuthUser)
      } catch {
        localStorage.removeItem(KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post<LoginResponse>('/auth/login', { email, password }, false)
    const authUser: AuthUser = {
      ...res.user,
      clubId: res.clubId,
      role: res.role,
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
    }
    localStorage.setItem(KEY, JSON.stringify(authUser))
    setUser(authUser)
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    const res = await api.post<RegisterResponse>('/auth/register', { name, email, password }, false)
    const authUser: AuthUser = {
      id: res.user.id,
      name: res.user.name,
      email: res.user.email,
      avatarUrl: null,
      clubId: null,
      role: null,
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
    }
    localStorage.setItem(KEY, JSON.stringify(authUser))
    setUser(authUser)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(KEY)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
