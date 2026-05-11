import { axiosInstance } from '../utils/axiosInstance'

export async function getKPIs(range = '30d') {
  const { data } = await axiosInstance.get('/analytics/kpis', { params: { range } })
  return data.data
}

export async function getRevenueOverTime(range = '30d') {
  const { data } = await axiosInstance.get('/analytics/revenue-over-time', { params: { range } })
  return data.data
}

export async function getRevenueByCategory() {
  const { data } = await axiosInstance.get('/analytics/revenue-by-category')
  return data.data
}

export async function getTopProducts(limit = 10) {
  const { data } = await axiosInstance.get('/analytics/top-products', { params: { limit } })
  return data.data
}

export async function getOrderStatusDistribution(range = '30d') {
  const { data } = await axiosInstance.get('/analytics/order-status', { params: { range } })
  return data.data
}

export async function getOrdersOverTime(range = '30d') {
  const { data } = await axiosInstance.get('/analytics/orders-over-time', { params: { range } })
  return data.data
}

export async function getUserGrowth(range = '30d') {
  const { data } = await axiosInstance.get('/analytics/user-growth', { params: { range } })
  return data.data
}

export async function getUserRoleDistribution() {
  const { data } = await axiosInstance.get('/analytics/user-roles')
  return data.data
}

export async function getUserOrderFrequency() {
  const { data } = await axiosInstance.get('/analytics/user-frequency')
  return data.data
}

export async function getCartStats() {
  const { data } = await axiosInstance.get('/analytics/cart-stats')
  return data.data
}

export async function getWishlistStats() {
  const { data } = await axiosInstance.get('/analytics/wishlist-stats')
  return data.data
}

export async function getCategoryPerformance() {
  const { data } = await axiosInstance.get('/analytics/category-performance')
  return data.data
}

export async function getFulfillmentMetrics() {
  const { data } = await axiosInstance.get('/analytics/fulfillment')
  return data.data
}

export async function getRecentActivity(limit = 20) {
  const { data } = await axiosInstance.get('/analytics/recent-activity', { params: { limit } })
  return data.data
}

export async function getLowPerformingProducts(days = 30) {
  const { data } = await axiosInstance.get('/analytics/low-performing-products', { params: { days } })
  return data.data
}
