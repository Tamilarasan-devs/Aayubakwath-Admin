import { axiosInstance } from '../utils/axiosInstance'

export async function getAllOfferBars() {
  const { data } = await axiosInstance.get('/offer-bars')
  return data.data || []
}

export async function createOfferBar(text) {
  const { data } = await axiosInstance.post('/offer-bars', { text })
  return data
}

export async function updateOfferBar(id, text) {
  const { data } = await axiosInstance.put(`/offer-bars/${id}`, { text })
  return data
}

export async function deleteOfferBar(id) {
  const { data } = await axiosInstance.delete(`/offer-bars/${id}`)
  return data
}
