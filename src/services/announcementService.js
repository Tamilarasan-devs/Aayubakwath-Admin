import { axiosInstance } from '../utils/axiosInstance'

export async function getAllAnnouncements() {
  const { data } = await axiosInstance.get('/announcements')
  return data.data || []
}

export async function createAnnouncement(title) {
  const { data } = await axiosInstance.post('/announcements', { title })
  return data
}

export async function updateAnnouncement(id, title) {
  const { data } = await axiosInstance.put(`/announcements/${id}`, { title })
  return data
}

export async function deleteAnnouncement(id) {
  const { data } = await axiosInstance.delete(`/announcements/${id}`)
  return data
}
