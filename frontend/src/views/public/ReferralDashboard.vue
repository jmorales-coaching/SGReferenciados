<template>
  <div class="referral-dashboard py-5" style="background:#f5f7fb;min-height:100vh">
    <div class="container">
      <div v-if="loading" class="text-center py-5"><div class="spinner-border text-primary"></div></div>

      <div v-else-if="error" class="text-center py-5">
        <i class="bi bi-exclamation-triangle text-warning fs-1 d-block mb-3"></i>
        <h5>No encontrado</h5>
        <p class="text-muted">El enlace no es válido.</p>
      </div>

      <template v-else-if="data">
        <div class="row justify-content-center mb-4">
          <div class="col-lg-8 text-center">
              <div class="card border-0 shadow-sm rounded-4 p-4 p-lg-5">
              <div class="success-icon mx-auto mb-3 d-flex align-items-center justify-content-center" style="width:70px;height:70px;border-radius:50%;background:linear-gradient(135deg,#198754,#20c997)">
                <i class="bi bi-check2-circle text-white fs-2"></i>
              </div>
              <h3 class="fw-bold mb-2">¡Bienvenido, {{ data.fullName }}!</h3>
              <p class="text-muted mb-1">Tu código de referido:</p>
              <h4 class="fw-bold text-primary">{{ data.referralCode }}</h4>
              <hr />
              <div class="text-start">
                <p class="small fw-semibold mb-1"><i class="bi bi-box-arrow-in-right me-1"></i>Tu enlace personal al panel:</p>
                <div class="input-group input-group-sm mb-3">
                  <input :value="panelLink" class="form-control" readonly id="panelLink" />
                  <button class="btn btn-outline-primary" @click="copyPanelLink"><i class="bi bi-clipboard"></i></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row g-4">
          <div class="col-lg-5">
            <div class="card border-0 shadow-sm rounded-4 h-100">
              <div class="card-body p-4">
                <h5 class="fw-bold mb-4"><i class="bi bi-graph-up-arrow me-2 text-primary"></i>Tu Progreso</h5>
                <div class="row g-3 mb-4">
                  <div class="col-6">
                    <div class="p-3 rounded-3 bg-white border text-center">
                      <h2 class="fw-bold text-primary mb-1">{{ data.referralCount }}</h2>
                      <small class="text-muted">Referidos</small>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="p-3 rounded-3 bg-white border text-center">
                      <h2 class="fw-bold text-warning mb-1">{{ data.nextReward?.remaining || 0 }}</h2>
                      <small class="text-muted">Pendientes</small>
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <div class="d-flex justify-content-between mb-1">
                    <span class="small fw-semibold">Progreso</span>
                    <span class="small text-muted">{{ data.progress }}%</span>
                  </div>
                  <div class="progress" style="height:12px;border-radius:10px">
                    <div class="progress-bar progress-bar-striped progress-bar-animated" :style="{width:data.progress+'%'}" :class="data.progress>=100?'bg-success':'bg-primary'"></div>
                  </div>
                </div>

                <div v-if="data.nextReward" class="text-center mt-3">
                  <p class="small text-muted mb-0">
                    Faltan <strong class="text-primary">{{ data.nextReward.remaining }}</strong> referidos para <strong>{{ data.nextReward.name }}</strong>
                  </p>
                </div>
                <div v-else class="text-center mt-3">
                  <span class="badge bg-success fs-6 px-3 py-2"><i class="bi bi-trophy-fill me-1"></i>¡Todos los premios desbloqueados!</span>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-7">
            <div class="card border-0 shadow-sm rounded-4 h-100">
              <div class="card-body p-4">
                <h5 class="fw-bold mb-4"><i class="bi bi-share-fill me-2 text-primary"></i>Comparte tu enlace</h5>
                <div class="input-group mb-3">
                  <input :value="referralLink" class="form-control" readonly id="refLink" />
                  <button class="btn btn-outline-primary" @click="copyLink"><i class="bi bi-clipboard"></i></button>
                </div>
                <div class="d-grid gap-2 mb-4">
                  <a :href="whatsappUrl" target="_blank" class="btn btn-success py-2"><i class="bi bi-whatsapp me-2"></i>Compartir en WhatsApp</a>
                </div>
              </div>
            </div>

            <div class="card border-0 shadow-sm rounded-4 mt-4">
              <div class="card-body p-4">
                <h5 class="fw-bold mb-4"><i class="bi bi-trophy me-2 text-primary"></i>Recompensas</h5>
                <div v-if="!data.rewards?.length" class="text-muted small">Sin recompensas configuradas</div>
                <div class="row g-3">
                  <div v-for="r in data.rewards" :key="r.id" class="col-md-6">
                    <div class="card border h-100" :class="r.unlocked ? 'border-success' : 'opacity-75'">
                      <div class="card-body text-center p-3">
                        <i class="bi fs-2 mb-2 d-block" :class="r.unlocked ? 'bi-trophy-fill text-success' : 'bi-lock-fill text-muted'"></i>
                        <span class="badge mb-2" :class="r.unlocked ? 'bg-success' : 'bg-secondary'">{{ r.unlocked ? 'Desbloqueado' : 'Bloqueado' }}</span>
                        <h6 class="fw-bold small">{{ r.name }}</h6>
                        <p class="small text-muted mb-1">{{ r.description }}</p>
                        <small class="text-muted">{{ r.referralsRequired }} referidos</small>
                        <div v-if="r.unlocked && r.link" class="mt-2">
                          <a :href="r.link" target="_blank" rel="noopener" class="btn btn-sm btn-primary w-100"><i class="bi bi-box-arrow-up-right me-1"></i>Acceder</a>
                        </div>
                        <div v-if="r.unlocked && r.files?.length" class="mt-2">
                          <a v-for="f in r.files" :key="f.id" :href="f.url" target="_blank" class="btn btn-sm btn-success"><i class="bi bi-download me-1"></i>Descargar</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const data = ref(null)
const loading = ref(true)
const error = ref(null)

const panelLink = computed(() => `${window.location.origin}/referral/${data.value?.uuid || ''}`)

const referralLink = computed(() => {
  const slug = data.value?.campaignSlug || ''
  return `${window.location.origin}/c/${slug}?ref=${data.value?.referralCode || ''}`
})

const whatsappUrl = computed(() => {
  const msg = encodeURIComponent(`¡Te invito a participar! Regístrate aquí: ${referralLink.value}`)
  return `https://wa.me/?text=${msg}`
})

onMounted(async () => {
  try {
    const res = await axios.get(`/api/leads/${route.params.uuid}/progress`)
    data.value = res.data.data || res.data
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
})

const copyToClipboard = (id, text) => {
  const el = document.getElementById(id)
  el?.select()
  try { navigator.clipboard.writeText(text) } catch { document.execCommand('copy') }
}

const copyLink = () => copyToClipboard('refLink', referralLink.value)
const copyPanelLink = () => copyToClipboard('panelLink', panelLink.value)
</script>
