import axios from 'axios'

// const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001"
// const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://aayubakwath-backend-production-e12c.up.railway.app"
// production url
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://aayubakwath-backend-production-2e7f.up.railway.app"

export const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  withCredentials: true,
})

// Request interceptor - attach token from localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle 401 (unauthorized) and network errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If 401 and we haven't already retried, try to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = localStorage.getItem('admin_refresh_token')
      if (refreshToken) {
        try {
          const res = await axios.post(`${BASE_URL}/api/v1/auth/refresh-token`, {
            refreshToken,
          })

          const data = res.data?.data || res.data
          const newToken = data.token

          localStorage.setItem('admin_token', newToken)
          if (data.refreshToken) {
            localStorage.setItem('admin_refresh_token', data.refreshToken)
          }

          // Update user data if returned
          if (data.id || data.name || data.email) {
            const userData = {
              id: data.id,
              name: data.name,
              email: data.email,
              role: data.role,
            }
            localStorage.setItem('admin_user', JSON.stringify(userData))
          }

          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return axiosInstance(originalRequest)
        } catch (refreshError) {
          // Refresh failed - clear auth and redirect to login
          localStorage.removeItem('admin_token')
          localStorage.removeItem('admin_refresh_token')
          localStorage.removeItem('admin_user')
          window.location.href = '/login'
          return Promise.reject(refreshError)
        }
      } else {
        // No refresh token - redirect to login
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_refresh_token')
        localStorage.removeItem('admin_user')
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export const API_URL = 'https://aayubakwath-backend-production-2e7f.up.railway.app/'