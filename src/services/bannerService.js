import { axiosInstance } from '../utils/axiosInstance'

export async function getHomeBanners() {
  const { data } = await axiosInstance.get('/home-banners')
  return data.data || []
}

export async function createHomeBanner(formData) {
  const { data } = await axiosInstance.post('/home-banners', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function deleteHomeBanner(id) {
  const { data } = await axiosInstance.delete(`/home-banners/${id}`)
  return data
}

export async function deleteAllHomeBanners() {
  const { data } = await axiosInstance.delete('/home-banners/bulk')
  return data
}

export async function getOfferBanners() {
  const { data } = await axiosInstance.get('/offer-banners')
  return data.data || []
}

export async function createOfferBanner(formData) {
  const { data } = await axiosInstance.post('/offer-banners', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function deleteOfferBanner(id) {
  const { data } = await axiosInstance.delete(`/offer-banners/${id}`)
  return data
}

export async function deleteAllOfferBanners() {
  const { data } = await axiosInstance.delete('/offer-banners/bulk')
  return data
}

export async function getCategoryBanners() {
  const { data } = await axiosInstance.get('/category-banners')
  return data.data || []
}

export async function createCategoryBanner(formData) {
  const { data } = await axiosInstance.post('/category-banners', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function deleteCategoryBanner(id) {
  const { data } = await axiosInstance.delete(`/category-banners/${id}`)
  return data
}

export async function deleteAllCategoryBanners() {
  const { data } = await axiosInstance.delete('/category-banners/bulk')
  return data
}
