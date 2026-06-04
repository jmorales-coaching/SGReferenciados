<template>
  <div>
    <h4 class="fw-bold mb-4"><i class="bi bi-megaphone me-2 text-danger"></i>Campañas</h4>
    <div v-if="loading" class="text-center py-5"><div class="spinner-border text-danger"></div></div>
    <div v-else class="card border-0 shadow-sm rounded-3">
      <div class="card-body p-4">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light"><tr>
              <th>Nombre</th><th>Usuario</th><th>Estado</th><th>Leads</th><th>Referidos</th><th>Creada</th><th>Acción</th>
            </tr></thead>
            <tbody>
              <tr v-for="c in campaigns" :key="c.id">
                <td class="fw-semibold small">{{ c.name }}</td>
                <td class="small">{{ c.owner?.fullName || '—' }}</td>
                <td><span class="badge" :class="statusBadge(c.status)">{{ c.status }}</span></td>
                <td class="small">{{ c.totalLeads }}</td>
                <td class="small">{{ c.totalReferrals }}</td>
                <td class="small text-muted">{{ new Date(c.createdAt).toLocaleDateString() }}</td>
                <td>
                  <button class="btn btn-sm btn-outline-warning" @click="toggleCampaign(c.id)">
                    {{ c.status === 'active' ? 'Pausar' : 'Activar' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminApi } from '../../services/api'
import { useToastStore } from '../../stores/toast'

const campaigns = ref([])
const loading = ref(true)
const toast = useToastStore()

onMounted(async () => {
  try { const r = await adminApi.campaigns(); campaigns.value = r.data.campaigns } catch {} finally { loading.value = false }
})

const statusBadge = (s) => ({ draft: 'bg-secondary', active: 'bg-success', paused: 'bg-warning text-dark' }[s] || 'bg-secondary')

const toggleCampaign = async (id) => {
  try { await adminApi.toggleCampaign(id); const r = await adminApi.campaigns(); campaigns.value = r.data.campaigns; toast.add('Estado actualizado', 'success') } catch {}
}
</script>
