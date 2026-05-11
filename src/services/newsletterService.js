import { axiosInstance } from '../utils/axiosInstance'

export const getSubscribers = async (page = 1, limit = 20) => {
  const { data } = await axiosInstance.get(`/newsletter/subscribers`, { params: { page, limit } })
  return {
    items: data.data || [],
    total: data.meta?.total || 0,
    page: data.meta?.page || 1,
    totalPages: data.meta?.totalPages || 1,
  }
}

export const deleteSubscriber = async (id) => {
  const res = await axiosInstance.delete(`/newsletter/subscribers/${id}`)
  return res.data
}
