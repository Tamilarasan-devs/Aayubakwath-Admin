import { axiosInstance } from '../utils/axiosInstance'

export async function getCoupons(page = 1, limit = 50) {
  const { data } = await axiosInstance.get('/coupons', { params: { page, limit } })
  return {
    items: data.data || [],
    total: data.meta?.total || 0,
    page: data.meta?.page || 1,
    totalPages: data.meta?.totalPages || 1,
  }
}

export async function createCoupon(payload) {
  const { data } = await axiosInstance.post('/coupons', payload)
  return data.data
}

export async function updateCoupon(id, payload) {
  const { data } = await axiosInstance.put(`/coupons/${id}`, payload)
  return data.data
}

export async function deleteCoupon(id) {
  const { data } = await axiosInstance.delete(`/coupons/${id}`)
  return data
}

