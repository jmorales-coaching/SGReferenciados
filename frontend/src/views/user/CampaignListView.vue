<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="fw-bold mb-0"><i class="bi bi-megaphone me-2 text-primary"></i>Campañas</h4>
      <div class="d-flex align-items-center gap-2">
        <span class="small text-muted">{{ campaigns.list.length }} / {{ auth.maxCampaigns === Infinity ? '∞' : auth.maxCampaigns }} campañas</span>
        <button class="btn btn-primary" @click="showCreate = true" :disabled="limitReached">
          <i class="bi bi-plus-lg me-1"></i>Crear
        </button>
      </div>
    </div>

    <!-- Create Modal -->
    <div v-if="showCreate" class="modal-backdrop" @click.self="showCreate = false">
      <div class="modal-card">
        <div class="p-4">
          <h6 class="fw-bold mb-3">Nueva Campaña</h6>
          <div v-if="limitReached" class="alert alert-warning py-2 small mb-3">
            Has alcanzado el límite de {{ auth.maxCampaigns }} campañas de tu plan {{ auth.planName }}. Actualiza tu plan para crear más.
          </div>
          <form @submit.prevent="handleCreate">
            <div class="mb-3">
              <input v-model="newCampaign.name" class="form-control" placeholder="Nombre de la campaña" required />
            </div>
            <div class="mb-3">
              <textarea v-model="newCampaign.description" class="form-control" rows="2" placeholder="Descripción (opcional)"></textarea>
            </div>
            <div class="d-flex gap-2 justify-content-end">
              <button type="button" class="btn btn-light" @click="showCreate = false">Cancelar</button>
              <button type="submit" class="btn btn-primary" :disabled="creating">
                <span v-if="creating" class="spinner-border spinner-border-sm me-1"></span>Crear
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div v-if="campaigns.loading" class="text-center py-5"><div class="spinner-border text-primary"></div></div>
    <div v-else-if="!campaigns.list.length" class="text-center py-5 text-muted">
      <i class="bi bi-megaphone fs-1 d-block mb-2"></i>
      <p>Aún no tienes campañas. ¡Crea tu primera campaña!</p>
      <p class="small">Plan {{ auth.planName }} — hasta {{ auth.maxCampaigns === Infinity ? 'ilimitadas' : auth.maxCampaigns }} campañas</p>
    </div>
    <div v-else class="row g-3">
      <div v-for="campaign in campaigns.list" :key="campaign.id" class="col-md-6 col-lg-4">
        <div class="card border-0 shadow-sm h-100 rounded-3">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h6 class="fw-bold mb-0">{{ campaign.name }}</h6>
              <span class="badge" :class="statusBadge(campaign.status)">{{ campaign.status }}</span>
            </div>
            <p v-if="campaign.description" class="small text-muted mb-3">{{ campaign.description }}</p>
            <div class="small text-muted mb-3">
              <span class="me-3"><i class="bi bi-people me-1"></i>{{ campaign.totalLeads }} leads</span>
              <span><i class="bi bi-share me-1"></i>{{ campaign.totalReferrals }} refs</span>
            </div>
            <div class="d-flex gap-2">
              <router-link :to="`/campaigns/${campaign.id}`" class="btn btn-sm btn-outline-primary">
                <i class="bi bi-pencil me-1"></i>Editar
              </router-link>
              <button class="btn btn-sm btn-outline-info" @click="viewReferrals(campaign)">
                <i class="bi bi-people me-1"></i>Referidos
              </button>
              <button class="btn btn-sm btn-outline-danger" @click="handleDelete(campaign.id)"><i class="bi bi-trash"></i></button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Referrals Modal -->
    <div v-if="showReferrals" class="modal-backdrop" @click.self="showReferrals = false">
      <div class="modal-card" style="max-width:640px">
        <div class="p-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="fw-bold mb-0"><i class="bi bi-people me-2 text-primary"></i>Referidos — {{ selectedCampaign?.name }}</h6>
            <div class="d-flex gap-2">
              <button v-if="referrals.length" class="btn btn-sm btn-outline-success" @click="exportExcel">
                <i class="bi bi-file-earmark-excel me-1"></i>Excel
              </button>
              <button class="btn-close" @click="showReferrals = false"></button>
            </div>
          </div>
          <div v-if="referralsLoading" class="text-center py-4"><div class="spinner-border spinner-border-sm text-primary"></div></div>
          <div v-else-if="!referrals.length" class="text-center py-4 text-muted small">
            <i class="bi bi-people fs-2 d-block mb-2"></i>
            <p>Aún no hay referidos en esta campaña</p>
          </div>
          <div v-else class="table-responsive" style="max-height:400px;overflow-y:auto">
            <table class="table table-sm mb-0">
              <thead class="table-light"><tr>
                <th>Nombre</th><th>Email</th><th>WhatsApp</th><th>Referidos</th><th>Registro</th>
              </tr></thead>
              <tbody>
                <tr v-for="r in referrals" :key="r.id">
                  <td class="small">{{ r.fullName }}</td>
                  <td class="small">{{ r.email }}</td>
                  <td class="small">{{ r.whatsapp || '-' }}</td>
                  <td class="small">{{ r.referralCount }}</td>
                  <td class="small text-muted">{{ new Date(r.createdAt).toLocaleDateString() }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import * as XLSX from 'xlsx'
import { useCampaignStore } from '../../stores/campaigns'
import { useAuthStore } from '../../stores/auth'
import { useToastStore } from '../../stores/toast'
import { campaignApi } from '../../services/api'

const campaigns = useCampaignStore()
const auth = useAuthStore()
const toast = useToastStore()
const showCreate = ref(false)
const creating = ref(false)
const newCampaign = reactive({ name: '', description: '' })
const showReferrals = ref(false)
const referralsLoading = ref(false)
const referrals = ref([])
const selectedCampaign = ref(null)

const limitReached = computed(() => auth.maxCampaigns !== Infinity && campaigns.list.length >= auth.maxCampaigns)

onMounted(() => campaigns.fetchAll())

const statusBadge = (s) => ({ draft: 'bg-secondary', active: 'bg-success', paused: 'bg-warning text-dark' }[s] || 'bg-secondary')

const handleCreate = async () => {
  creating.value = true
  try {
    await campaigns.create({ ...newCampaign })
    showCreate.value = false
    newCampaign.name = ''
    newCampaign.description = ''
    toast.add('Campaña creada', 'success')
  } catch { toast.add('Error al crear', 'danger') } finally { creating.value = false }
}

const handleDelete = async (id) => {
  if (!confirm('¿Eliminar campaña?')) return
  try { await campaigns.remove(id); toast.add('Campaña eliminada', 'success') } catch { toast.add('Error al eliminar', 'danger') }
}

const viewReferrals = async (campaign) => {
  selectedCampaign.value = campaign
  showReferrals.value = true
  referralsLoading.value = true
  try {
    const r = await campaignApi.referrals(campaign.id)
    referrals.value = r.data
  } catch {
    referrals.value = []
  } finally {
    referralsLoading.value = false
  }
}

const exportExcel = () => {
  const data = referrals.value.map((r) => ({
    Nombre: r.fullName,
    Email: r.email,
    WhatsApp: r.whatsapp || '-',
    'Referidos aportados': r.referralCount,
    'Código de referido': r.referralCode || '-',
    Registro: new Date(r.createdAt).toLocaleDateString(),
  }))
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Referidos')
  const name = selectedCampaign.value?.name?.replace(/[\\/:*?"<>|]/g, '_') || 'campaign'
  XLSX.writeFile(wb, `${name}_referidos.xlsx`)
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex;
  align-items: center; justify-content: center; z-index: 2000;
}
.modal-card { background: white; border-radius: 16px; width: 90%; max-width: 480px; }
</style>
