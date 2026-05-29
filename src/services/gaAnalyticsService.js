import { axiosInstance } from '../utils/axiosInstance'

export async function getGaOverview(days = 30) {
  const { data } = await axiosInstance.get('/ga-analytics/overview', { params: { days } })
  return data.data
}

export async function getGaTrafficSources(days = 30) {
  const { data } = await axiosInstance.get('/ga-analytics/traffic-sources', { params: { days } })
  return data.data
}

export async function getGaTopPages(days = 30) {
  const { data } = await axiosInstance.get('/ga-analytics/top-pages', { params: { days } })
  return data.data
}

export async function getGaTopProducts(days = 30) {
  const { data } = await axiosInstance.get('/ga-analytics/top-products', { params: { days } })
  return data.data
}
