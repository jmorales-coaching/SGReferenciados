<template>
  <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999">
    <div v-for="t in toast.toasts" :key="t.id" class="toast show align-items-center border-0" :class="'text-bg-' + t.type" role="alert">
      <div class="d-flex">
        <div class="toast-body"><i :class="iconClass(t.type)" class="me-2"></i>{{ t.message }}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" @click="toast.remove(t.id)"></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useToastStore } from '../stores/toast'
const toast = useToastStore()
const iconClass = (t) => ({ success: 'bi bi-check-circle', danger: 'bi bi-exclamation-triangle', warning: 'bi bi-exclamation-circle', info: 'bi bi-info-circle' }[t] || 'bi bi-info-circle')
</script>
