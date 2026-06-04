<template>
  <div class="user-layout">
    <div class="sidebar" :class="{ show: sidebarOpen }">
      <div class="sidebar-header p-3">
        <router-link to="/dashboard" class="text-white text-decoration-none fw-bold fs-5">
          <i class="bi bi-share-fill me-2"></i>SG Referidos
        </router-link>
      </div>
      <nav class="sidebar-nav p-3">
        <router-link to="/dashboard" class="nav-item" :class="{ active: $route.path === '/dashboard' }">
          <i class="bi bi-speedometer2 me-3"></i>Dashboard
        </router-link>
        <router-link to="/campaigns" class="nav-item" :class="{ active: $route.path.startsWith('/campaigns') }">
          <i class="bi bi-megaphone me-3"></i>Campañas
        </router-link>
        <a href="#" @click.prevent="auth.logout()" class="nav-item text-danger">
          <i class="bi bi-box-arrow-right me-3"></i>Cerrar Sesión
        </a>
      </nav>
    </div>
    <div class="sidebar-overlay" @click="sidebarOpen = false" :class="{ show: sidebarOpen }"></div>
    <div class="main-area">
      <header class="topbar px-4">
        <button class="btn btn-link text-dark d-md-none" @click="sidebarOpen = !sidebarOpen">
          <i class="bi bi-list fs-4"></i>
        </button>
        <div class="ms-auto d-flex align-items-center gap-3">
          <a v-if="upgradeBanner" :href="upgradeBanner.link" target="_blank" class="badge rounded-pill text-decoration-none bg-warning text-dark">
            <i class="bi bi-star-fill me-1"></i>{{ upgradeBanner.text }}
          </a>
          <span class="small text-muted">{{ auth.userName }}</span>
          <span class="badge rounded-pill" :class="planBadgeClass">{{ auth.planName }}</span>
        </div>
      </header>
      <main class="content p-4">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { configApi } from '../services/api'

const auth = useAuthStore()
const route = useRoute()
const sidebarOpen = ref(false)
const upgradeBanner = ref(null)

const planBadgeClass = auth.isAdmin ? 'bg-danger' : (
  auth.plan === 'paid_1' ? 'bg-warning text-dark' :
  auth.plan === 'paid_2' ? 'bg-info text-dark' :
  auth.plan === 'paid_3' ? 'bg-success' : 'bg-secondary'
)

const loadConfig = async () => {
  if (auth.plan !== 'free') { upgradeBanner.value = null; return }
  try {
    const r = await configApi.get()
    const text = r.data?.upgrade_text
    const link = r.data?.upgrade_link
    upgradeBanner.value = text && link ? { text, link } : null
  } catch { upgradeBanner.value = null }
}

onMounted(loadConfig)
watch(() => route.path, loadConfig)
</script>

<style scoped>
.user-layout { display: flex; min-height: 100vh; background: #f5f7fb; }
.sidebar {
  width: 260px; background: linear-gradient(180deg, #0d6efd 0%, #6610f2 100%);
  position: fixed; top: 0; left: 0; height: 100vh; z-index: 1000;
  transform: translateX(-100%); transition: transform 0.3s ease;
}
.sidebar.show { transform: translateX(0); }
@media (min-width: 768px) { .sidebar { transform: translateX(0); } }
.sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 999; display: none; }
.sidebar-overlay.show { display: block; }
@media (min-width: 768px) { .sidebar-overlay { display: none !important; } }
.sidebar-nav { display: flex; flex-direction: column; gap: 0.5rem; }
.nav-item {
  color: rgba(255,255,255,0.8); text-decoration: none; padding: 0.75rem 1rem;
  border-radius: 10px; transition: all 0.2s; display: flex; align-items: center;
}
.nav-item:hover, .nav-item.active { background: rgba(255,255,255,0.15); color: white; }
.main-area { flex: 1; margin-left: 0; }
@media (min-width: 768px) { .main-area { margin-left: 260px; } }
.topbar {
  height: 64px; background: white; display: flex; align-items: center;
  border-bottom: 1px solid rgba(0,0,0,0.05); position: sticky; top: 0; z-index: 100;
}
.content { min-height: calc(100vh - 64px); }
</style>
