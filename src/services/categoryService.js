import { axiosInstance } from '../utils/axiosInstance'

export async function getAllCategories() {
  const { data } = await axiosInstance.get('/categories')
  return data.data || []
}

export async function createCategory(formData) {
  const { data } = await axiosInstance.post('/categories', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function updateCategory(id, formData) {
  const { data } = await axiosInstance.put(`/categories/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function deleteCategory(id) {
  const { data } = await axiosInstance.delete(`/categories/${id}`)
  return data
}
