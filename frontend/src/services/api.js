import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    const message = error.response?.data?.message || error.message || 'Server error'
    const errors = error.response?.data?.errors || null
    return Promise.reject({ message, errors, status: error.response?.status })
  }
)

export const authApi = {
  register(data) { return api.post('/auth/register', data) },
  login(data) { return api.post('/auth/login', data) },
  profile() { return api.get('/auth/profile') },
}

export const campaignApi = {
  list() { return api.get('/campaigns') },
  get(id) { return api.get(`/campaigns/${id}`) },
  create(data) { return api.post('/campaigns', data) },
  update(id, data) { return api.put(`/campaigns/${id}`, data) },
  updateStatus(id, status) { return api.patch(`/campaigns/${id}/status`, { status }) },
  duplicate(id) { return api.post(`/campaigns/${id}/duplicate`) },
  remove(id) { return api.delete(`/campaigns/${id}`) },
  stats() { return api.get('/campaigns/stats') },
  referrals(id) { return api.get(`/campaigns/${id}/referrals`) },
}

export const landingApi = {
  updatePage(campaignId, data) { return api.put(`/landing/${campaignId}/page`, data) },
  getSections(landingPageId) { return api.get(`/landing/${landingPageId}/sections`) },
  upsertSection(campaignId, data) { return api.post(`/landing/${campaignId}/sections`, data) },
  deleteSection(campaignId, sectionId) { return api.delete(`/landing/${campaignId}/sections/${sectionId}`) },
  reorderSections(campaignId, order) { return api.put(`/landing/${campaignId}/sections/reorder`, { order }) },
}

export const rewardApi = {
  create(campaignId, data) { return api.post(`/rewards/${campaignId}`, data) },
  update(id, campaignId, data) { return api.put(`/rewards/${id}/campaigns/${campaignId}`, data) },
  remove(id, campaignId) { return api.delete(`/rewards/${id}/campaigns/${campaignId}`) },
  attachFile(id, campaignId, file) {
    const fd = new FormData()
    fd.append('file', file)
    return api.post(`/rewards/${id}/campaigns/${campaignId}/files`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  removeFile(fileId, campaignId) { return api.delete(`/rewards/files/${fileId}/campaigns/${campaignId}`) },
}

export const uploadApi = {
  upload(file) {
    const fd = new FormData()
    fd.append('file', file)
    return api.post('/uploads', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  list() { return api.get('/uploads') },
  remove(id) { return api.delete(`/uploads/${id}`) },
}

export const dashboardApi = {
  userStats() { return api.get('/dashboard/user') },
  adminStats() { return api.get('/dashboard/admin') },
}

export const adminApi = {
  users(page = 1, role = '') { return api.get(`/admin/users?page=${page}&role=${role}`) },
  createUser(data) { return api.post('/admin/users', data) },
  updateUser(id, data) { return api.put(`/admin/users/${id}`, data) },
  toggleUser(id) { return api.patch(`/admin/users/${id}/toggle`) },
  campaigns(page = 1) { return api.get(`/admin/campaigns?page=${page}`) },
  toggleCampaign(id) { return api.patch(`/admin/campaigns/${id}/toggle`) },
}

export const publicApi = {
  getCampaign(slug) { return api.get(`/c/${slug}`) },
}

export const configApi = {
  get() { return api.get('/config') },
  update(key, value) { return api.put('/config', { key, value }) },
}

export default api
