import { axiosInstance } from '../utils/axiosInstance'

export async function getAllProductContents() {
  const { data } = await axiosInstance.get('/product-contents')
  return data.data || []
}

export async function getProductContent(productId) {
  const { data } = await axiosInstance.get(`/product-contents/${productId}`)
  return data.data
}

export async function saveProductContent(productId, content) {
  const { data } = await axiosInstance.post('/product-contents', { productId, content })
  return data
}

export async function deleteProductContent(id) {
  const { data } = await axiosInstance.delete(`/product-contents/${id}`)
  return data
}
