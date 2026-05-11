import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../utils/axiosInstance'

const AuthContext = createContext(null)

const TOKEN_KEY = 'admin_token'
const REFRESH_TOKEN_KEY = 'admin_refresh_token'
const USER_KEY = 'admin_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const isAuthenticated = !!user && !!localStorage.getItem(TOKEN_KEY)

  // Check auth on mount - verify token is still valid
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setLoading(false)
      return
    }

    const verifyAuth = async () => {
      try {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
        const res = await axiosInstance.get('/auth/profile')
        const userData = res.data?.data || res.data
        setUser(userData)
        localStorage.setItem(USER_KEY, JSON.stringify(userData))
      } catch {
        // Token is invalid/expired - try refresh
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
        if (refreshToken) {
          try {
            const res = await axiosInstance.post('/auth/refresh-token', { refreshToken })
            const { token: newToken, refreshToken: newRefreshToken, user: userData } = res.data?.data || res.data
            localStorage.setItem(TOKEN_KEY, newToken)
            if (newRefreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken)
            if (userData) {
              setUser(userData)
              localStorage.setItem(USER_KEY, JSON.stringify(userData))
            }
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
          } catch {
            clearAuth()
            navigate('/login', { replace: true })
          }
        } else {
          clearAuth()
          navigate('/login', { replace: true })
        }
      } finally {
        setLoading(false)
      }
    }

    verifyAuth()
  }, [])

  const clearAuth = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    delete axiosInstance.defaults.headers.common['Authorization']
    setUser(null)
  }, [])

  const login = useCallback(async (email, password) => {
    const res = await axiosInstance.post('/auth/login', { email, password })
    const data = res.data?.data || res.data

    localStorage.setItem(TOKEN_KEY, data.token)
    if (data.refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken)

    const userData = {
      id: data.id || data.user?.id,
      name: data.name || data.user?.name || email.split('@')[0],
      email: data.email || data.user?.email || email,
      role: data.role || data.user?.role || 'ADMIN',
    }

    localStorage.setItem(USER_KEY, JSON.stringify(userData))
    setUser(userData)

    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.token}`

    return userData
  }, [])

  const logout = useCallback(() => {
    clearAuth()
    navigate('/login', { replace: true })
  }, [clearAuth, navigate])

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}