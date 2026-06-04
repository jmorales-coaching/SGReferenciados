<template>
  <div>
    <h4 class="fw-bold mb-4"><i class="bi bi-shield-fill me-2 text-danger"></i>Admin Dashboard</h4>
    <div v-if="loading" class="text-center py-5"><div class="spinner-border text-danger"></div></div>
    <template v-else-if="stats">
      <div class="row g-3 mb-4">
        <div class="col-6 col-lg-3">
          <div class="stat-card p-3 rounded-3 bg-white shadow-sm"><h3 class="fw-bold text-primary mb-1">{{ stats.totalUsers }}</h3><small class="text-muted">Usuarios</small></div>
        </div>
        <div class="col-6 col-lg-3">
          <div class="stat-card p-3 rounded-3 bg-white shadow-sm"><h3 class="fw-bold text-success mb-1">{{ stats.activeUsers }}</h3><small class="text-muted">Activos</small></div>
        </div>
        <div class="col-6 col-lg-3">
          <div class="stat-card p-3 rounded-3 bg-white shadow-sm"><h3 class="fw-bold text-info mb-1">{{ stats.totalCampaigns }}</h3><small class="text-muted">Campañas</small></div>
        </div>
        <div class="col-6 col-lg-3">
          <div class="stat-card p-3 rounded-3 bg-white shadow-sm"><h3 class="fw-bold text-warning mb-1">{{ stats.activeCampaigns }}</h3><small class="text-muted">Activas</small></div>
        </div>
      </div>
      <div class="row g-3 mb-4">
        <div class="col-6"><div class="stat-card p-3 rounded-3 bg-white shadow-sm"><h3 class="fw-bold mb-1">{{ stats.totalLeads }}</h3><small class="text-muted">Total Leads</small></div></div>
        <div class="col-6"><div class="stat-card p-3 rounded-3 bg-white shadow-sm"><h3 class="fw-bold mb-1">{{ stats.totalReferrals }}</h3><small class="text-muted">Total Referidos</small></div></div>
      </div>

      <div class="row g-3">
        <div class="col-md-6">
          <div class="card border-0 shadow-sm rounded-3">
            <div class="card-body p-4">
              <h6 class="fw-bold mb-3">Usuarios Recientes</h6>
              <div class="table-responsive">
                <table class="table table-borderless mb-0 small">
                  <thead class="table-light"><tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Fecha</th></tr></thead>
                  <tbody>
                    <tr v-for="u in stats.recentUsers" :key="u.id">
                      <td>{{ u.fullName }}</td><td>{{ u.email }}</td>
                      <td><span class="badge" :class="u.role === 'admin' ? 'bg-danger' : 'bg-primary'">{{ u.role }}</span></td>
                      <td>{{ new Date(u.createdAt).toLocaleDateString() }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card border-0 shadow-sm rounded-3">
            <div class="card-body p-4">
              <h6 class="fw-bold mb-3">Top Campañas</h6>
              <div v-if="stats.topCampaigns?.length">
                <div v-for="c in stats.topCampaigns" :key="c.id" class="d-flex justify-content-between align-items-center py-2 border-bottom">
                  <div><span class="fw-semibold small">{{ c.name }}</span><br /><small class="text-muted">{{ c.owner?.fullName }}</small></div>
                  <span class="badge bg-primary rounded-pill">{{ c.totalLeads }} leads</span>
                </div>
              </div>
              <p v-else class="text-muted small mb-0">Sin campañas</p>
            </div>
          </div>
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
  try { const r = await dashboardApi.adminStats(); stats.value = r.data } catch {} finally { loading.value = false }
})
</script>
