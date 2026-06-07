<template>
  <div>
    <router-link to="/campaigns" class="btn btn-sm btn-light mb-3"><i class="bi bi-arrow-left me-1"></i>Volver</router-link>
    <div v-if="campaigns.loading" class="text-center py-5"><div class="spinner-border text-primary"></div></div>
    <template v-else-if="campaigns.current">
      <div class="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h4 class="fw-bold mb-1">{{ campaigns.current.name }}</h4>
          <span class="badge me-2" :class="statusBadge(campaigns.current.status)">{{ campaigns.current.status }}</span>
          <router-link :to="`/c/${campaigns.current.slug}`" target="_blank" class="small text-muted">
            <i class="bi bi-box-arrow-up-right me-1"></i>Ver landing
          </router-link>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-outline-secondary" @click="duplicateCampaign"><i class="bi bi-files me-1"></i>Duplicar</button>
          <button class="btn btn-sm btn-outline-primary" @click="toggleStatus">
            {{ campaigns.current.status === 'active' ? 'Pausar' : 'Activar' }}
          </button>
        </div>
      </div>

      <div class="row g-3">
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm rounded-3 mb-3">
            <div class="card-body p-4">
              <h6 class="fw-bold mb-3"><i class="bi bi-palette me-2 text-primary"></i>Landing Page</h6>
              <div class="mb-3">
                <label class="form-label small">Título SEO</label>
                <input v-model="page.seoTitle" class="form-control" @change="savePage" />
              </div>
              <div class="mb-3">
                <label class="form-label small">Título del formulario</label>
                <input v-model="page.formTitle" class="form-control" placeholder="Participa y Gana" @change="savePage" />
                <div class="d-flex gap-2 mt-1">
                  <label class="d-flex align-items-center gap-1 small text-muted">Tamaño:<select v-model="page.formTitleSize" class="form-select form-select-sm" style="width:95px" @change="savePage"><option value="">Default</option><option value="h4">h4</option><option value="h5">h5</option><option value="16px">16px</option><option value="18px">18px</option><option value="20px">20px</option><option value="24px">24px</option><option value="28px">28px</option></select></label>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label small">Subtítulo del formulario</label>
                <input v-model="page.formSubtitle" class="form-control" placeholder="Regístrate, comparte tu enlace y desbloquea premios" @change="savePage" />
                <div class="d-flex gap-2 mt-1">
                  <label class="d-flex align-items-center gap-1 small text-muted">Tamaño:<select v-model="page.formSubtitleSize" class="form-select form-select-sm" style="width:95px" @change="savePage"><option value="">Default</option><option value="12px">12px</option><option value="14px">14px</option><option value="16px">16px</option><option value="18px">18px</option><option value="20px">20px</option></select></label>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label small">Ícono del formulario</label>
                <div class="d-flex align-items-center gap-2">
                  <div class="icon-circle d-flex align-items-center justify-content-center flex-shrink-0" :style="{ background: `linear-gradient(135deg, ${page.primaryColor}, ${page.secondaryColor})`, width: '48px', height: '48px', borderRadius: '50%' }">
                    <img v-if="page.formIcon" :src="page.formIcon" style="width:28px;height:28px;border-radius:50%;object-fit:cover" />
                    <i v-else class="bi bi-person-plus-fill text-white" style="font-size:1.25rem"></i>
                  </div>
                  <button class="btn btn-sm btn-outline-primary" @click="triggerFormIconUpload">Subir</button>
                  <button v-if="page.formIcon" class="btn btn-sm btn-outline-danger" @click="page.formIcon = ''; savePage()">Quitar</button>
                  <input type="file" ref="formIconInput" accept="image/*" class="d-none" @change="handleFormIconUpload" />
                </div>
              </div>
              <div class="row g-2 mb-3">
                <div class="col-4"><label class="form-label small">Color primario</label><input v-model="page.primaryColor" type="color" class="form-control form-control-color" @change="savePage" /></div>
                <div class="col-4"><label class="form-label small">Color secundario</label><input v-model="page.secondaryColor" type="color" class="form-control form-control-color" @change="savePage" /></div>
                <div class="col-4"><label class="form-label small">Fuente</label><select v-model="page.fontFamily" class="form-select" @change="savePage">
                  <option value="Inter">Inter</option><option value="Roboto">Roboto</option><option value="Poppins">Poppins</option>
                </select></div>
              </div>
              <button class="btn btn-primary btn-sm" @click="publish"><i class="bi bi-cloud-arrow-up me-1"></i>Publicar</button>
            </div>
          </div>

          <div class="card border-0 shadow-sm rounded-3">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="fw-bold mb-0"><i class="bi bi-layers me-2 text-primary"></i>Secciones</h6>
                <button class="btn btn-sm btn-outline-primary" @click="showAddSection = true"><i class="bi bi-plus-lg me-1"></i>Añadir</button>
              </div>
              <div v-if="!sections.length" class="text-muted small py-3 text-center">Sin secciones. ¡Añade tu primera sección!</div>
              <div v-for="(sec, i) in sections" :key="sec.id || i" class="section-item p-3 mb-2 rounded-3 border bg-white">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <span class="badge bg-light text-dark me-2">{{ sec.type }}</span>
                    <span class="small fw-semibold">{{ sec.title || 'Sin título' }}</span>
                  </div>
                  <div class="d-flex gap-1">
                    <button class="btn btn-sm text-danger" @click="removeSection(i)" title="Eliminar"><i class="bi bi-trash"></i></button>
                  </div>
                </div>

                <!-- Title -->
                <input v-model="sec.title" class="form-control form-control-sm mb-2" placeholder="Título de la sección" @change="saveSection(sec)" />

                <!-- Background -->
                <details class="mb-2 small">
                  <summary class="text-muted fw-semibold" style="cursor:pointer">Fondo</summary>
                  <div class="d-flex gap-2 mt-1 align-items-center">
                    <input v-model="sec.content.bgColor" type="color" class="form-control form-control-color p-0" style="width:38px;height:34px" title="Color de fondo" @change="saveSection(sec)" />
                    <input v-model="sec.content.bgColor" class="form-control form-control-sm flex-grow-1" placeholder="#ffffff" @change="saveSection(sec)" />
                    <button class="btn btn-sm btn-outline-secondary" @click="triggerBgUpload(i)" title="Imagen de fondo"><i class="bi bi-image"></i></button>
                  </div>
                  <div v-if="sec.content.bgImage" class="mt-1 d-flex gap-1 align-items-center">
                    <img :src="sec.content.bgImage" class="rounded" style="max-height:36px;max-width:80px" />
                    <span class="small text-muted text-truncate">{{ sec.content.bgImage }}</span>
                    <button class="btn btn-sm btn-outline-danger ms-auto" @click="sec.content.bgImage = ''; saveSection(sec)"><i class="bi bi-x"></i></button>
                  </div>
                  <input type="file" :ref="el => { if (el) bgInputs[i] = el }" accept="image/*" class="d-none" @change="handleBgUpload($event, i)" />
                </details>

                <!-- Text color -->
                <details class="mb-2 small">
                  <summary class="text-muted fw-semibold" style="cursor:pointer">Color del texto</summary>
                  <div class="d-flex gap-2 mt-1 align-items-center">
                    <input v-model="sec.content.textColor" type="color" class="form-control form-control-color p-0" style="width:38px;height:34px" title="Color del texto" @change="saveSection(sec)" />
                    <input v-model="sec.content.textColor" class="form-control form-control-sm flex-grow-1" placeholder="#000000" @change="saveSection(sec)" />
                    <button class="btn btn-sm btn-outline-danger" @click="sec.content.textColor = ''; saveSection(sec)" title="Quitar color"><i class="bi bi-x"></i></button>
                  </div>
                </details>
                <!-- Rich text content -->
                <RichTextEditor v-model="sec.content.text" :height="sec.type === 'hero' ? '300px' : '200px'" placeholder="Escribe el contenido aquí..." @update:model-value="debounceSave(sec)" />

                <!-- Benefits items editor -->
                <div v-if="sec.type === 'benefits'">
                  <hr class="my-2" />
                  <p class="small fw-semibold mb-1">Items de beneficios</p>
                  <div v-for="(item, idx) in sec.content.items || []" :key="idx" class="border rounded p-2 mb-1">
                    <div class="d-flex gap-1 mb-1">
                      <input v-model="item.icon" class="form-control form-control-sm" style="width:90px" placeholder="Icono" @change="saveSection(sec)" />
                      <input v-model="item.title" class="form-control form-control-sm" placeholder="Título" @change="saveSection(sec)" />
                      <input v-model="item.text" class="form-control form-control-sm" placeholder="Texto" @change="saveSection(sec)" />
                      <button class="btn btn-sm btn-outline-danger" @click="removeBenefitItem(sec, idx)"><i class="bi bi-x"></i></button>
                    </div>
                    <div class="d-flex gap-2 small">
                      <label class="d-flex align-items-center gap-1"><span class="text-muted">Título:</span><select v-model="item.titleSize" class="form-select form-select-sm" style="width:80px" @change="saveSection(sec)"><option value="">Default</option><option value="h4">h4</option><option value="h5">h5</option><option value="h6">h6</option><option value="16px">16px</option><option value="18px">18px</option><option value="20px">20px</option><option value="24px">24px</option></select></label>
                      <label class="d-flex align-items-center gap-1"><span class="text-muted">Texto:</span><select v-model="item.textSize" class="form-select form-select-sm" style="width:80px" @change="saveSection(sec)"><option value="">Default</option><option value="12px">12px</option><option value="14px">14px</option><option value="16px">16px</option><option value="18px">18px</option></select></label>
                    </div>
                  </div>
                  <button class="btn btn-sm btn-outline-primary mt-1" @click="addBenefitItem(sec)"><i class="bi bi-plus"></i> Item</button>
                </div>

                <!-- Testimonials items editor -->
                <div v-if="sec.type === 'testimonials'">
                  <hr class="my-2" />
                  <p class="small fw-semibold mb-1">Items de testimonios</p>
                  <div v-for="(item, idx) in sec.content.items || []" :key="idx" class="border rounded p-2 mb-1">
                    <div class="d-flex gap-1 mb-1">
                      <input v-model="item.name" class="form-control form-control-sm" placeholder="Nombre" @change="saveSection(sec)" />
                      <input v-model="item.role" class="form-control form-control-sm" placeholder="Rol" @change="saveSection(sec)" />
                    </div>
                    <RichTextEditor v-model="item.text" height="120px" placeholder="Testimonio..." @update:model-value="saveSection(sec)" />
                    <button class="btn btn-sm btn-outline-danger mt-1" @click="removeTestimonialItem(sec, idx)"><i class="bi bi-x"></i></button>
                  </div>
                  <button class="btn btn-sm btn-outline-primary mt-1" @click="addTestimonialItem(sec)"><i class="bi bi-plus"></i> Testimonio</button>
                </div>

                <!-- FAQ items editor -->
                <div v-if="sec.type === 'faq'">
                  <hr class="my-2" />
                  <p class="small fw-semibold mb-1">Preguntas frecuentes</p>
                  <div v-for="(item, idx) in sec.content.items || []" :key="idx" class="border rounded p-2 mb-1">
                    <input v-model="item.question" class="form-control form-control-sm mb-1" placeholder="Pregunta" @change="saveSection(sec)" />
                    <RichTextEditor v-model="item.answer" height="120px" placeholder="Respuesta..." @update:model-value="saveSection(sec)" />
                    <button class="btn btn-sm btn-outline-danger mt-1" @click="removeFaqItem(sec, idx)"><i class="bi bi-x"></i></button>
                  </div>
                  <button class="btn btn-sm btn-outline-primary mt-1" @click="addFaqItem(sec)"><i class="bi bi-plus"></i> Pregunta</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Add Section Modal -->
          <div v-if="showAddSection" class="modal-backdrop" @click.self="showAddSection = false">
            <div class="modal-card p-4">
              <h6 class="fw-bold mb-3">Añadir sección</h6>
              <div class="row g-2">
                <div v-for="t in sectionTypes" :key="t.value" class="col-6">
                  <button class="btn btn-outline-primary w-100 py-3 text-start" @click="addSection(t.value)">
                    <i :class="t.icon" class="d-block fs-4 mb-1"></i>
                    <small class="fw-semibold">{{ t.label }}</small>
                  </button>
                </div>
              </div>
              <button class="btn btn-sm btn-light mt-3 w-100" @click="showAddSection = false">Cancelar</button>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card border-0 shadow-sm rounded-3 mb-3">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="fw-bold mb-0"><i class="bi bi-trophy me-2 text-primary"></i>Recompensas</h6>
                <button class="btn btn-sm btn-outline-primary" @click="openRewardModal(null)"><i class="bi bi-plus-lg me-1"></i>Agregar</button>
              </div>
              <div v-if="!campaigns.current.rewards?.length" class="text-muted small mb-3">Sin recompensas configuradas</div>
              <div v-for="r in campaigns.current.rewards" :key="r.id" class="mb-2 p-2 rounded-2 bg-light">
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <div class="fw-semibold small">{{ r.name }}</div>
                    <div class="small text-muted">{{ r.referralsRequired }} referidos</div>
                    <div v-if="r.description" class="small text-muted mt-1">{{ r.description }}</div>
                    <div v-if="r.link" class="small mt-1"><i class="bi bi-link-45deg me-1"></i><a :href="r.link" target="_blank" rel="noopener" class="text-break">{{ r.link }}</a></div>
                  </div>
                  <div class="d-flex gap-1 flex-shrink-0 ms-2">
                    <button class="btn btn-sm btn-outline-secondary" @click="openRewardModal(r)" title="Editar"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-outline-danger" @click="deleteReward(r.id)" title="Eliminar"><i class="bi bi-trash"></i></button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Reward Modal -->
          <div v-if="showRewardModal" class="modal-backdrop" @click.self="showRewardModal = false">
            <div class="modal-card p-4">
              <h6 class="fw-bold mb-3">{{ editingReward ? 'Editar' : 'Nueva' }} recompensa</h6>
              <form @submit.prevent="saveReward">
                <input v-model="rewardForm.name" class="form-control form-control-sm mb-2" placeholder="Nombre" required />
                <input v-model="rewardForm.referralsRequired" type="number" class="form-control form-control-sm mb-2" placeholder="Referidos necesarios" min="0" required />
                <textarea v-model="rewardForm.description" class="form-control form-control-sm mb-2" rows="2" placeholder="Descripción"></textarea>
                <input v-model="rewardForm.link" class="form-control form-control-sm mb-2" placeholder="Enlace (opcional)" />
                <div class="d-flex gap-2">
                  <button type="button" class="btn btn-sm btn-light w-50" @click="showRewardModal = false">Cancelar</button>
                  <button type="submit" class="btn btn-sm btn-primary w-50">{{ editingReward ? 'Actualizar' : 'Guardar' }}</button>
                </div>
              </form>
            </div>
          </div>

          <div class="card border-0 shadow-sm rounded-3">
            <div class="card-body p-4">
              <h6 class="fw-bold mb-3"><i class="bi bi-link-45deg me-2 text-primary"></i>Link Público</h6>
              <div class="input-group input-group-sm">
                <input :value="publicUrl" class="form-control" readonly id="publicUrl" />
                <button class="btn btn-outline-primary" @click="copyUrl"><i class="bi bi-clipboard"></i></button>
              </div>
              <small class="text-muted mt-2 d-block">Comparte este link para recibir leads</small>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCampaignStore } from '../../stores/campaigns'
import { useToastStore } from '../../stores/toast'
import { campaignApi, landingApi, rewardApi, uploadApi } from '../../services/api'
import RichTextEditor from '../../components/RichTextEditor.vue'

const route = useRoute()
const campaigns = useCampaignStore()
const toast = useToastStore()

const sections = ref([])
const page = reactive({ seoTitle: '', formTitle: 'Participa y Gana', formSubtitle: 'Regístrate, comparte tu enlace y desbloquea premios', formTitleSize: '', formSubtitleSize: '', formIcon: '', primaryColor: '#0d6efd', secondaryColor: '#6610f2', fontFamily: 'Inter' })
const showRewardModal = ref(false)
const editingReward = ref(null)
const rewardForm = reactive({ name: '', referralsRequired: 0, description: '', link: '' })
const showAddSection = ref(false)
const fileInputs = ref({})
const bgInputs = ref({})
const formIconInput = ref(null)

const sectionTypes = [
  { value: 'hero', label: 'Hero', icon: 'bi bi-house-door' },
  { value: 'benefits', label: 'Beneficios', icon: 'bi bi-gift' },
  { value: 'testimonials', label: 'Testimonios', icon: 'bi bi-chat-quote' },
  { value: 'faq', label: 'FAQ', icon: 'bi bi-question-circle' },
  { value: 'custom', label: 'Personalizada', icon: 'bi bi-pencil-square' },
]

const youtubeId = (url) => {
  if (!url) return null
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : null
}

const publicUrl = computed(() => `${window.location.origin}/c/${campaigns.current?.slug}`)

const loadData = async () => {
  const c = await campaigns.fetchOne(route.params.id)
  if (c?.landingPage) {
    Object.assign(page, c.landingPage)
    sections.value = (c.landingPage.sections || []).map((s) => ({ ...s, _uid: s.id || Date.now() + Math.random() }))
  }
}
onMounted(loadData)

const savePage = async () => {
  try { await landingApi.updatePage(route.params.id, page); toast.add('Guardado', 'success') } catch {}
}

const publish = async () => {
  try { await landingApi.updatePage(route.params.id, { ...page, publish: true }); toast.add('¡Publicado!', 'success') } catch {}
}

const toggleStatus = async () => {
  const newStatus = campaigns.current.status === 'active' ? 'paused' : 'active'
  try { await campaignApi.updateStatus(route.params.id, newStatus); await loadData(); toast.add('Estado actualizado', 'success') } catch {}
}

const duplicateCampaign = async () => {
  try { await campaignApi.duplicate(route.params.id); toast.add('Duplicada', 'success') } catch {}
}

const addSection = (type = 'custom') => {
  const defaults = {
    hero: { text: '' },
    benefits: { items: [{ icon: 'bi-gift', title: '', text: '', titleSize: '', textSize: '' }] },
    testimonials: { items: [{ name: '', role: '', text: '' }] },
    faq: { items: [{ question: '', answer: '' }] },
    custom: { text: '' },
  }
  sections.value.push({ type, title: '', content: defaults[type] || { text: '' }, _temp: true, _uid: Date.now() + Math.random() })
  showAddSection.value = false
}

const addBenefitItem = (sec) => {
  if (!sec.content.items) sec.content.items = []
  sec.content.items.push({ icon: 'bi-star', title: '', text: '', titleSize: '', textSize: '' })
}
const removeBenefitItem = (sec, idx) => { sec.content.items.splice(idx, 1); saveSection(sec) }

const addTestimonialItem = (sec) => {
  if (!sec.content.items) sec.content.items = []
  sec.content.items.push({ name: '', role: '', text: '' })
}
const removeTestimonialItem = (sec, idx) => { sec.content.items.splice(idx, 1); saveSection(sec) }

const addFaqItem = (sec) => {
  if (!sec.content.items) sec.content.items = []
  sec.content.items.push({ question: '', answer: '' })
}
const removeFaqItem = (sec, idx) => { sec.content.items.splice(idx, 1); saveSection(sec) }

const triggerImageUpload = (i) => { fileInputs.value[i]?.click() }

const handleImageUpload = async (event, i) => {
  const file = event.target.files[0]
  if (!file) return
  try {
    const data = await uploadApi.upload(file)
    sections.value[i].content.imageUrl = data.data?.url || data.url
    await saveSection(sections.value[i])
    toast.add('Imagen subida', 'success')
  } catch { toast.add('Error al subir imagen', 'danger') }
  event.target.value = ''
}

const triggerBgUpload = (i) => { bgInputs.value[i]?.click() }

const handleBgUpload = async (event, i) => {
  const file = event.target.files[0]
  if (!file) return
  try {
    const data = await uploadApi.upload(file)
    sections.value[i].content.bgImage = data.data?.url || data.url
    await saveSection(sections.value[i])
    toast.add('Fondo subido', 'success')
  } catch { toast.add('Error al subir fondo', 'danger') }
  event.target.value = ''
}

const triggerFormIconUpload = () => formIconInput.value?.click()

const handleFormIconUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  try {
    const data = await uploadApi.upload(file)
    page.formIcon = data.data?.url || data.url
    await savePage()
    toast.add('Ícono subido', 'success')
  } catch { toast.add('Error al subir ícono', 'danger') }
  event.target.value = ''
}

let saveTimers = {}
const debounceSave = (sec) => {
  if (saveTimers[sec._uid]) clearTimeout(saveTimers[sec._uid])
  saveTimers[sec._uid] = setTimeout(() => saveSection(sec), 300)
}

const saveSection = async (sec) => {
  try {
    const res = await landingApi.upsertSection(route.params.id, sec)
    if (res?.data && !sec.id) {
      sec.id = res.data.id
      sec._temp = false
    }
  } catch {}
}

const removeSection = async (i) => {
  const sec = sections.value[i]
  if (sec.id) try { await landingApi.deleteSection(route.params.id, sec.id) } catch {}
  sections.value.splice(i, 1)
  toast.add('Sección eliminada', 'success')
}

const resetRewardForm = () => Object.assign(rewardForm, { name: '', referralsRequired: 0, description: '', link: '' })

const openRewardModal = (r) => {
  editingReward.value = r
  if (r) {
    Object.assign(rewardForm, { name: r.name, referralsRequired: r.referralsRequired, description: r.description || '', link: r.link || '' })
  } else {
    resetRewardForm()
  }
  showRewardModal.value = true
}

const saveReward = async () => {
  try {
    if (editingReward.value) {
      await rewardApi.update(editingReward.value.id, route.params.id, rewardForm)
      toast.add('Recompensa actualizada', 'success')
    } else {
      await rewardApi.create(route.params.id, rewardForm)
      toast.add('Recompensa creada', 'success')
    }
    await loadData()
    showRewardModal.value = false
  } catch (e) {
    toast.add(e.message || 'Error al guardar recompensa', 'danger')
  }
}

const deleteReward = async (id) => {
  if (!confirm('¿Eliminar esta recompensa?')) return
  try {
    await rewardApi.remove(id, route.params.id)
    await loadData()
    toast.add('Recompensa eliminada', 'success')
  } catch (e) {
    toast.add(e.message || 'Error al eliminar recompensa', 'danger')
  }
}

const statusBadge = (s) => ({ draft: 'bg-secondary', active: 'bg-success', paused: 'bg-warning text-dark' }[s] || 'bg-secondary')

const copyUrl = () => {
  const text = publicUrl.value
  const el = document.getElementById('publicUrl')
  el.select()
  try { navigator.clipboard.writeText(text); toast.add('Link copiado', 'success') } catch {
    document.execCommand('copy')
    toast.add('Link copiado', 'success')
  }
}
</script>

<style scoped>
.section-item { background: #f8f9fa; }
.modal-backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex;
  align-items: center; justify-content: center; z-index: 2000;
}
.modal-card { background: white; border-radius: 16px; width: 90%; max-width: 480px; }
</style>
