<template>
  <div>
    <div v-if="loading" class="text-center py-5"><div class="spinner-border text-primary" style="width:3rem;height:3rem"></div><p class="mt-2 text-muted">Cargando...</p></div>
    <div v-else-if="error" class="text-center py-5">
      <i class="bi bi-exclamation-triangle text-warning fs-1 d-block mb-3"></i>
      <h5>Campaña no encontrada</h5>
      <p class="text-muted">El enlace no es válido o la campaña está inactiva.</p>
    </div>

    <div v-else-if="campaign" class="dynamic-landing">
      <section class="hero-section py-5 d-flex align-items-center" :style="heroStyle">
        <div class="container">
          <div class="row align-items-center g-5">
            <div class="col-lg-6">
              <h1 class="display-4 fw-bold mb-3" :style="{ color: campaign.landingPage.primaryColor }">{{ heroTitle }}</h1>
              <div v-if="heroSection?.content?.text" v-html="heroSection.content.text" class="lead text-muted mb-4 rich-content"></div>
              <p v-else class="lead text-muted mb-4">{{ heroText }}</p>
              <div v-if="heroSection?.content?.imageUrl" class="mb-3">
                <img :src="heroSection.content.imageUrl" class="img-fluid rounded-3 shadow-sm" alt="" style="max-height:300px" />
              </div>
              <div v-if="heroSection?.content?.youtubeUrl">
                <div class="ratio ratio-16x9">
                  <iframe :src="youtubeEmbedUrl(heroSection.content.youtubeUrl)" frameborder="0" allowfullscreen></iframe>
                </div>
              </div>
            </div>
            <div class="col-lg-5 offset-lg-1">
              <div class="card border-0 shadow-lg rounded-4">
                <div class="card-body p-4 p-lg-5">
                  <div class="text-center mb-4">
                    <div class="icon-circle mx-auto mb-3 d-flex align-items-center justify-content-center" :style="{ background: `linear-gradient(135deg, ${campaign.landingPage.primaryColor}, ${campaign.landingPage.secondaryColor})` }">
                      <i class="bi bi-person-plus-fill fs-3 text-white"></i>
                    </div>
                    <h5 class="fw-bold">Participa y Gana</h5>
                    <p class="text-muted small">Regístrate, comparte tu enlace y desbloquea premios</p>
                  </div>
                  <form @submit.prevent="handleRegister">
                    <div class="mb-3">
                      <input v-model="form.fullName" class="form-control" placeholder="Nombre completo" required />
                    </div>
                    <div class="mb-3">
                      <input v-model="form.email" type="email" class="form-control" placeholder="Email" required />
                    </div>
                    <div class="mb-4">
                      <input v-model="form.whatsapp" type="tel" class="form-control" placeholder="WhatsApp +521234567890" required />
                    </div>
                    <div v-if="registerSuccess" class="alert alert-success py-2 small">{{ registerSuccess }}</div>
                    <div v-if="registerError" class="alert alert-danger py-2 small">{{ registerError }}</div>
                    <button type="submit" class="btn w-100 py-3 fw-semibold text-white border-0" :disabled="submitting" :style="{ background: campaign.landingPage.primaryColor }">
                      <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
                      <span v-else><i class="bi bi-rocket-takeoff me-2"></i>Obtener Acceso</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-if="benefitsSection" class="py-5" :style="sectionStyle(benefitsSection)">
        <div class="container">
          <h2 class="text-center fw-bold mb-5">{{ benefitsSection.title }}</h2>
          <div class="row g-4">
            <div v-for="(item, i) in benefitsSection.content.items" :key="i" class="col-md-4">
              <div class="card border-0 shadow-sm h-100 text-center p-4">
                <i :class="item.icon || 'bi bi-star'" class="fs-1 mb-3" :style="{ color: campaign.landingPage.primaryColor }"></i>
                <h5 class="fw-bold">{{ item.title }}</h5>
                <p class="small text-muted mb-0">{{ item.text }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-if="testimonialsSection" class="py-5" :style="sectionStyle(testimonialsSection)">
        <div class="container">
          <h2 class="text-center fw-bold mb-5">{{ testimonialsSection.title }}</h2>
          <div class="row g-4">
            <div v-for="(item, i) in testimonialsSection.content.items" :key="i" class="col-md-6">
              <div class="card border-0 shadow-sm h-100 p-4">
                <div class="mb-3"><i class="bi bi-quote fs-4 text-muted"></i> <span v-html="item.text"></span></div>
                <div class="d-flex align-items-center">
                  <div class="rounded-circle text-white d-flex align-items-center justify-content-center me-2 fw-bold" style="width:40px;height:40px" :style="{ background: campaign.landingPage.primaryColor }">{{ item.name?.charAt(0) }}</div>
                  <div><div class="fw-semibold small">{{ item.name }}</div><small class="text-muted">{{ item.role }}</small></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-if="faqSection" class="py-5" :style="sectionStyle(faqSection)">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-8">
              <h2 class="text-center fw-bold mb-5">{{ faqSection.title }}</h2>
              <div v-for="(item, i) in faqSection.content.items" :key="i" class="mb-3">
                <div class="card border-0 shadow-sm">
                  <div class="card-body">
                    <h6 class="fw-bold">{{ item.question }}</h6>
                    <div class="small text-muted mb-0" v-html="item.answer"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-for="sec in customSections" :key="sec.id" class="py-5" :style="sectionStyle(sec)">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-8 text-center">
              <h2 v-if="sec.title" class="fw-bold mb-4">{{ sec.title }}</h2>
              <div v-if="sec.content.text" v-html="sec.content.text" class="text-muted mb-4 rich-content"></div>
              <div v-if="sec.content.imageUrl" class="mb-4">
                <img :src="sec.content.imageUrl" class="img-fluid rounded-3 shadow-sm" alt="" />
              </div>
              <div v-if="sec.content.youtubeUrl">
                <div class="ratio ratio-16x9">
                  <iframe :src="youtubeEmbedUrl(sec.content.youtubeUrl)" frameborder="0" allowfullscreen></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer class="py-4 text-center text-muted small border-top">
        <p class="mb-0">Powered by <strong>SG Referidos</strong></p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { publicApi } from '../../services/api'

const route = useRoute()
const router = useRouter()
const campaign = ref(null)
const sections = ref([])
const loading = ref(true)
const error = ref(null)
const submitting = ref(false)
const registerError = ref('')
const registerSuccess = ref('')
const form = reactive({ fullName: '', email: '', whatsapp: '' })

const heroSection = computed(() => sections.value.find((s) => s.type === 'hero'))
const benefitsSection = computed(() => sections.value.find((s) => s.type === 'benefits'))
const testimonialsSection = computed(() => sections.value.find((s) => s.type === 'testimonials'))
const faqSection = computed(() => sections.value.find((s) => s.type === 'faq'))
const customSections = computed(() => sections.value.filter((s) => !['hero', 'benefits', 'testimonials', 'faq'].includes(s.type)))

const heroTitle = computed(() => heroSection.value?.title || campaign.value?.name || 'Consigue Acceso Exclusivo')
const heroText = computed(() => heroSection.value?.content?.text || 'Regístrate, comparte tu enlace y desbloquea premios exclusivos.')

const sectionStyle = (sec) => {
  const bg = sec?.content || {}
  const styles = {}
  if (bg.bgColor) styles.backgroundColor = bg.bgColor
  if (bg.bgImage) { styles.backgroundImage = `url(${bg.bgImage})`; styles.backgroundSize = 'cover'; styles.backgroundPosition = 'center'; styles.backgroundRepeat = 'no-repeat' }
  if (bg.textColor) styles.color = bg.textColor
  return styles
}

const heroStyle = computed(() => {
  const gradient = `linear-gradient(135deg, ${campaign.value?.landingPage?.primaryColor}08, ${campaign.value?.landingPage?.secondaryColor}15)`
  const custom = sectionStyle(heroSection.value)
  if (custom.backgroundColor || custom.backgroundImage) return custom
  return { background: gradient }
})

const youtubeEmbedUrl = (url) => {
  if (!url) return ''
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
  return m ? `https://www.youtube.com/embed/${m[1]}` : ''
}

onMounted(async () => {
  try {
    const res = await publicApi.getCampaign(route.params.slug)
    campaign.value = res.data.data || res.data
    sections.value = campaign.value?.landingPage?.sections || []
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
})

const handleRegister = async () => {
  registerError.value = ''
  registerSuccess.value = ''
  submitting.value = true
  try {
    const refCode = route.query.ref || ''
    const payload = {
      fullName: form.fullName,
      email: form.email,
      whatsapp: form.whatsapp,
      campaignSlug: route.params.slug,
    }
    if (refCode) payload.ref = refCode
    const res = await publicApi.registerLead(payload)
    const data = res.data.data || res.data
    registerSuccess.value = '¡Registro exitoso! Redirigiendo...'
    setTimeout(() => router.push(`/referral/${data.uuid}`), 1200)
  } catch (e) {
    registerError.value = e.response?.data?.message || 'Error al registrarse'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.dynamic-landing { font-family: var(--bs-body-font-family); }
.hero-section { min-height: 80vh; }
.icon-circle { width: 60px; height: 60px; border-radius: 50%; }
</style>

<style>
.rich-content img { max-width: 100%; height: auto; border-radius: 8px; margin: 1rem 0; }
.rich-content iframe { max-width: 100%; border-radius: 8px; aspect-ratio: 16/9; width: 100%; }
.rich-content h2 { font-size: 1.5rem; margin-top: 1rem; }
.rich-content h3 { font-size: 1.25rem; margin-top: 0.75rem; }
.rich-content blockquote { border-left: 3px solid var(--bs-primary, #0d6efd); padding-left: 1rem; color: #6c757d; }
.rich-content ul, .rich-content ol { padding-left: 1.5rem; text-align: left; }
</style>
