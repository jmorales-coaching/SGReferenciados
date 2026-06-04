import { defineStore } from 'pinia'
import { ref } from 'vue'
import { campaignApi } from '../services/api'

export const useCampaignStore = defineStore('campaigns', () => {
  const list = ref([])
  const current = ref(null)
  const loading = ref(false)

  async function fetchAll() {
    loading.value = true
    try {
      const res = await campaignApi.list()
      list.value = res.data
    } finally {
      loading.value = false
    }
  }

  async function fetchOne(id) {
    loading.value = true
    try {
      const res = await campaignApi.get(id)
      current.value = res.data
      return res.data
    } finally {
      loading.value = false
    }
  }

  async function create(data) {
    const res = await campaignApi.create(data)
    list.value.unshift(res.data)
    return res.data
  }

  async function update(id, data) {
    const res = await campaignApi.update(id, data)
    const idx = list.value.findIndex((c) => c.id === id)
    if (idx >= 0) list.value[idx] = res.data
    return res.data
  }

  async function remove(id) {
    await campaignApi.remove(id)
    list.value = list.value.filter((c) => c.id !== id)
  }

  return { list, current, loading, fetchAll, fetchOne, create, update, remove }
})
