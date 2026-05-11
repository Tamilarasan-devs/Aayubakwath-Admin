import { axiosInstance } from '../utils/axiosInstance'

export async function getBulkOrders(page = 1, limit = 20) {
  const { data } = await axiosInstance.get('/inquiries/bulk-order', { params: { page, limit } })
  return {
    items: data.data || [],
    total: data.meta?.total || 0,
    page: data.meta?.page || 1,
    totalPages: data.meta?.totalPages || 1,
  }
}

export async function getContactInquiries(page = 1, limit = 20) {
  const { data } = await axiosInstance.get('/inquiries/contact', { params: { page, limit } })
  return {
    items: data.data || [],
    total: data.meta?.total || 0,
    page: data.meta?.page || 1,
    totalPages: data.meta?.totalPages || 1,
  }
}
