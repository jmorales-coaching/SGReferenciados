<template>
  <div>
    <h4 class="fw-bold mb-4"><i class="bi bi-speedometer2 me-2 text-primary"></i>Dashboard</h4>
    <div v-if="loading" class="text-center py-5"><div class="spinner-border text-primary"></div></div>
    <template v-else-if="stats">
      <div class="row g-3 mb-4">
        <div class="col-6 col-lg-3">
          <div class="stat-card p-3 rounded-3 bg-white shadow-sm"><h3 class="fw-bold text-primary mb-1">{{ stats.totalCampaigns }}</h3><small class="text-muted">Campañas</small></div>
        </div>
        <div class="col-6 col-lg-3">
          <div class="stat-card p-3 rounded-3 bg-white shadow-sm"><h3 class="fw-bold text-success mb-1">{{ stats.activeCampaigns }}</h3><small class="text-muted">Activas</small></div>
        </div>
        <div class="col-6 col-lg-3">
          <div class="stat-card p-3 rounded-3 bg-white shadow-sm"><h3 class="fw-bold text-info mb-1">{{ stats.totalLeads }}</h3><small class="text-muted">Leads</small></div>
        </div>
        <div class="col-6 col-lg-3">
          <div class="stat-card p-3 rounded-3 bg-white shadow-sm"><h3 class="fw-bold text-warning mb-1">{{ stats.totalReferrals }}</h3><small class="text-muted">Referidos</small></div>
        </div>
      </div>
      <div class="card border-0 shadow-sm rounded-3">
        <div class="card-body p-4">
          <h6 class="fw-bold mb-3">Referidos recientes</h6>
          <div v-if="stats.recentReferrals?.length" class="table-responsive">
            <table class="table table-borderless mb-0">
              <thead class="table-light"><tr><th>Nombre</th><th>Email</th><th>Fecha</th></tr></thead>
              <tbody>
                <tr v-for="r in stats.recentReferrals" :key="r.id">
                  <td>{{ r.referred?.fullName || '—' }}</td>
                  <td>{{ r.referred?.email || '—' }}</td>
                  <td class="small text-muted">{{ new Date(r.createdAt).toLocaleDateString() }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-else class="text-muted small mb-0">Aún no tienes referidos.</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { dashboardApi } from '../../services/api'

const stats = ref(null)
const loading = ref(true)
onMounted(async () => {
  try { const r = await dashboardApi.userStats(); stats.value = r.data } catch {} finally { loading.value = false }
})
</script>

<style scoped>
.stat-card { transition: transform 0.2s; }
.stat-card:hover { transform: translateY(-2px); }
</style>
