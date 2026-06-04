<template>
  <div>
    <h4 class="fw-bold mb-4"><i class="bi bi-gear me-2 text-danger"></i>Configuración</h4>
    <div class="card border-0 shadow-sm rounded-3">
      <div class="card-body p-4">
        <h6 class="fw-bold mb-3">Banner para usuarios gratuitos</h6>
        <form @submit.prevent="save">
          <div class="mb-3">
            <label class="form-label small">Texto del banner</label>
            <input v-model="form.upgrade_text" class="form-control" placeholder="Ej: Actualiza tu plan y obtén más beneficios" />
          </div>
          <div class="mb-3">
            <label class="form-label small">Enlace del banner</label>
            <input v-model="form.upgrade_link" class="form-control" placeholder="Ej: https://tusitio.com/planes" />
          </div>
          <button type="submit" class="btn btn-danger btn-sm" :disabled="saving">
            <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>Guardar
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { configApi } from '../../services/api'
import { useToastStore } from '../../stores/toast'

const toast = useToastStore()
const saving = ref(false)
const form = reactive({ upgrade_text: '', upgrade_link: '' })

import { ref } from 'vue'

onMounted(async () => {
  try {
    const r = await configApi.get()
    form.upgrade_text = r.data?.upgrade_text || ''
    form.upgrade_link = r.data?.upgrade_link || ''
  } catch {}
})

const save = async () => {
  saving.value = true
  try {
    await configApi.update('upgrade_text', form.upgrade_text)
    await configApi.update('upgrade_link', form.upgrade_link)
    toast.add('Configuración guardada', 'success')
  } catch {
    toast.add('Error al guardar', 'danger')
  } finally {
    saving.value = false
  }
}
</script>
