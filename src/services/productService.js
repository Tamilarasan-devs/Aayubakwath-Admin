import { axiosInstance } from '../utils/axiosInstance'

export async function getAllProducts(params = {}) {
  console.log(params);
  const { data } = await axiosInstance.get('/products', { params })
  return data
}

export async function getProduct(id) {
  const { data } = await axiosInstance.get(`/products/${id}`)
  return data.data
}

export async function createProduct(formData) {
  const { data } = await axiosInstance.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function updateProduct(id, formData) {
  const { data } = await axiosInstance.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function deleteProduct(id) {
  const { data } = await axiosInstance.delete(`/products/${id}`)
  return data
}
