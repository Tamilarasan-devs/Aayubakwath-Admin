import { axiosInstance } from '../utils/axiosInstance'

export async function getAllOrders() {
  const { data } = await axiosInstance.get('/orders/admin/all')
  return data.data || []
}

export async function updateOrderStatus(id, status) {
  const { data } = await axiosInstance.patch(`/orders/${id}/status`, { status })
  return data
}

export async function updateOrderTracking(id, trackingId, courierName) {
  const { data } = await axiosInstance.patch(`/orders/${id}/tracking`, { trackingId, courierName })
  return data
}

