import { axiosInstance } from '../utils/axiosInstance'

export async function getAllUsers() {
  const { data } = await axiosInstance.get('/users/admin/all')
  return data.data || []
}
