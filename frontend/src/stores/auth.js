import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '../services/api'
import router from '../router'

const PLAN_NAMES = { free: 'Gratuito', paid_3: 'Nivel 3', paid_2: 'Nivel 2', paid_1: 'Nivel 1' }
const PLAN_LIMITS = { free: 1, paid_3: 3, paid_2: 10, paid_1: Infinity }

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const token = ref(localStorage.getItem('token') || '')
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const userName = computed(() => user.value?.fullName || '')
  const plan = computed(() => user.value?.plan || 'free')
  const planName = computed(() => PLAN_NAMES[plan.value] || 'Gratuito')
  const maxCampaigns = computed(() => PLAN_LIMITS[plan.value] ?? 1)

  async function login(email, password) {
    loading.value = true
    try {
      const res = await authApi.login({ email, password })
      token.value = res.data.token
      user.value = res.data.user
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      return true
    } finally {
      loading.value = false
    }
  }

  async function register(data) {
    loading.value = true
    try {
      const res = await authApi.register(data)
      token.value = res.data.token
      user.value = res.data.user
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      return true
    } finally {
      loading.value = false
    }
  }

  function logout() {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  return { user, token, loading, isAuthenticated, isAdmin, userName, plan, planName, maxCampaigns, login, register, logout }
})
