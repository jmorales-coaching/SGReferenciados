<template>
  <div class="auth-page">
    <div class="container">
      <div class="row justify-content-center align-items-center min-vh-100">
        <div class="col-md-5">
          <div class="card border-0 shadow-lg rounded-4">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <router-link to="/" class="text-decoration-none">
                  <h3 class="fw-bold text-primary"><i class="bi bi-share-fill me-2"></i>SG Referidos</h3>
                </router-link>
                <p class="text-muted">Crea tu cuenta gratuita</p>
              </div>
              <form @submit.prevent="handleRegister">
                <div class="mb-3">
                  <label class="form-label small fw-semibold">Nombre</label>
                  <input v-model="form.fullName" class="form-control" placeholder="Tu nombre" required />
                </div>
                <div class="mb-3">
                  <label class="form-label small fw-semibold">Email</label>
                  <input v-model="form.email" type="email" class="form-control" placeholder="tu@email.com" required />
                </div>
                <div class="mb-3">
                  <label class="form-label small fw-semibold">WhatsApp</label>
                  <input v-model="form.whatsapp" class="form-control" placeholder="+521234567890" />
                </div>
                <div class="mb-3">
                  <label class="form-label small fw-semibold">Empresa <span class="text-muted">(opcional)</span></label>
                  <input v-model="form.company" class="form-control" placeholder="Tu empresa" />
                </div>
                <div class="mb-4">
                  <label class="form-label small fw-semibold">Contraseña</label>
                  <input v-model="form.password" type="password" class="form-control" placeholder="Mínimo 6 caracteres" required />
                </div>
                <div v-if="error" class="alert alert-danger py-2 small">{{ error }}</div>
                <button type="submit" class="btn btn-primary w-100 py-3 fw-semibold" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  <span v-else>Crear Cuenta</span>
                </button>
              </form>
              <p class="text-center mt-4 mb-0 small">
                ¿Ya tienes cuenta? <router-link to="/login" class="fw-semibold">Inicia sesión</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const form = reactive({ fullName: '', email: '', password: '', whatsapp: '', company: '' })
const error = ref('')
const loading = ref(false)

const handleRegister = async () => {
  error.value = ''
  loading.value = true
  try {
    await auth.register(form)
    router.push('/dashboard')
  } catch (e) {
    error.value = e.message || 'Error al registrarse'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page { background: linear-gradient(135deg, #f0f4ff 0%, #f8f9ff 100%); min-height: 100vh; }
</style>
