import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([])
  let id = 0

  function add(message, type = 'success', duration = 4000) {
    const toastId = ++id
    toasts.value.push({ id: toastId, message, type })
    setTimeout(() => { toasts.value = toasts.value.filter((t) => t.id !== toastId) }, duration)
  }

  function remove(toastId) {
    toasts.value = toasts.value.filter((t) => t.id !== toastId)
  }

  return { toasts, add, remove }
})
