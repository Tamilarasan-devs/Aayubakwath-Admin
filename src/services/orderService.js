import { axiosInstance } from '../utils/axiosInstance'

export async function getAllOrders() {
  const { data } = await axiosInstance.get('/orders/admin/all')
  return data.data || []
}

export async function updateOrderStatus(id, status) {
  const { data } = await axiosInstance.patch(`/orders/${id}/status`, { status })
  return data
}
