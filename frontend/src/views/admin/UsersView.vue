<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="fw-bold mb-0"><i class="bi bi-people me-2 text-danger"></i>Usuarios</h4>
      <div class="d-flex gap-2 align-items-center">
        <select v-model="roleFilter" class="form-select form-select-sm" style="width:auto" @change="loadUsers">
          <option value="">Todos los roles</option>
          <option value="user">Usuario</option>
          <option value="admin">Admin</option>
          <option value="referenciado">Referenciado</option>
        </select>
        <button class="btn btn-danger btn-sm" @click="openCreateModal"><i class="bi bi-plus-lg me-1"></i>Crear Usuario</button>
      </div>
    </div>
    <div v-if="loading" class="text-center py-5"><div class="spinner-border text-danger"></div></div>
    <div v-else class="card border-0 shadow-sm rounded-3">
      <div class="card-body p-4">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light"><tr>
              <th>Nombre</th><th>Email</th><th>Rol</th><th>Plan</th><th>Estado</th><th>Campañas</th><th>Registro</th><th>Acción</th>
            </tr></thead>
            <tbody>
              <tr v-for="u in users" :key="u.id">
                <td><span class="fw-semibold small">{{ u.fullName }}</span></td>
                <td class="small">{{ u.email }}</td>
                <td><span class="badge" :class="u.role === 'admin' ? 'bg-danger' : u.role === 'referenciado' ? 'bg-success' : 'bg-primary'">{{ u.role }}</span></td>
                <td><span class="badge" :class="PLAN_BADGES[u.plan] || 'bg-secondary'">{{ PLAN_NAMES[u.plan] || u.plan }}</span></td>
                <td><span class="badge" :class="u.active ? 'bg-success' : 'bg-secondary'">{{ u.active ? 'Activo' : 'Inactivo' }}</span></td>
                <td class="small">{{ u.campaigns?.length || 0 }}</td>
                <td class="small text-muted">{{ new Date(u.createdAt).toLocaleDateString() }}</td>
                <td>
                  <div class="d-flex gap-1">
                    <button class="btn btn-sm btn-outline-primary" @click="openEditModal(u)" title="Editar"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm" :class="u.active ? 'btn-outline-warning' : 'btn-outline-success'" @click="toggleUser(u.id)">
                      {{ u.active ? 'Bloquear' : 'Activar' }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create/Edit User Modal -->
    <div v-if="showModal" class="modal-backdrop" @click.self="showModal = false">
      <div class="modal-card p-4">
        <h5 class="fw-bold mb-3"><i class="bi" :class="editingUser ? 'bi-pencil' : 'bi-person-plus'"></i> {{ editingUser ? 'Editar Usuario' : 'Crear Usuario' }}</h5>
        <form @submit.prevent="editingUser ? updateUser() : createUser()">
          <div class="mb-3">
            <label class="form-label small">Nombre completo</label>
            <input v-model="form.fullName" class="form-control form-control-sm" required />
          </div>
          <div class="mb-3">
            <label class="form-label small">Email</label>
            <input v-model="form.email" type="email" class="form-control form-control-sm" required />
          </div>
          <div class="mb-3">
            <label class="form-label small">Contraseña <span class="text-muted fw-normal">{{ editingUser ? '(dejar vacío para mantener)' : '' }}</span></label>
            <input v-model="form.password" type="password" class="form-control form-control-sm" :required="!editingUser" minlength="6" />
          </div>
          <div class="row mb-3">
            <div class="col">
              <label class="form-label small">Rol</label>
              <select v-model="form.role" class="form-select form-select-sm">
                <option value="user">Usuario</option>
                <option value="admin">Admin</option>
                <option value="referenciado">Referenciado</option>
              </select>
            </div>
            <div class="col">
              <label class="form-label small">Plan</label>
              <select v-model="form.plan" class="form-select form-select-sm">
                <option value="free">Gratuito</option>
                <option value="paid_3">Nivel 3 (3 campañas)</option>
                <option value="paid_2">Nivel 2 (10 campañas)</option>
                <option value="paid_1">Nivel 1 (ilimitado)</option>
              </select>
            </div>
            <div class="col">
              <label class="form-label small">WhatsApp</label>
              <input v-model="form.whatsapp" class="form-control form-control-sm" placeholder="+51999000000" />
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label small">Empresa</label>
            <input v-model="form.company" class="form-control form-control-sm" />
          </div>
          <div class="mb-3" v-if="editingUser">
            <label class="form-label small">Estado</label>
            <select v-model="form.active" class="form-select form-select-sm">
              <option :value="true">Activo</option>
              <option :value="false">Inactivo</option>
            </select>
          </div>
          <div class="d-flex gap-2 justify-content-end">
            <button type="button" class="btn btn-light btn-sm" @click="showModal = false">Cancelar</button>
            <button type="submit" class="btn btn-danger btn-sm" :disabled="saving">
              <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
              {{ editingUser ? 'Actualizar' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminApi } from '../../services/api'
import { useToastStore } from '../../stores/toast'

const PLAN_NAMES = { free: 'Gratuito', paid_3: 'Nivel 3', paid_2: 'Nivel 2', paid_1: 'Nivel 1' }
const PLAN_BADGES = { free: 'bg-secondary', paid_3: 'bg-success', paid_2: 'bg-info text-dark', paid_1: 'bg-warning text-dark' }

const users = ref([])
const loading = ref(true)
const roleFilter = ref('')
const toast = useToastStore()
const showModal = ref(false)
const saving = ref(false)
const editingUser = ref(null)
const form = ref({ fullName: '', email: '', password: '', role: 'user', plan: 'free', whatsapp: '', company: '', active: true })

const loadUsers = async () => {
  loading.value = true
  try { const r = await adminApi.users(1, roleFilter.value); users.value = r.data.users } catch {} finally { loading.value = false }
}

onMounted(loadUsers)

const toggleUser = async (id) => {
  try { await adminApi.toggleUser(id); await loadUsers(); toast.add('Estado actualizado', 'success') } catch {}
}

const openCreateModal = () => {
  editingUser.value = null
  form.value = { fullName: '', email: '', password: '', role: 'user', plan: 'free', whatsapp: '', company: '', active: true }
  showModal.value = true
}

const openEditModal = (user) => {
  editingUser.value = user
  form.value = {
    fullName: user.fullName,
    email: user.email,
    password: '',
    role: user.role,
    plan: user.plan || 'free',
    whatsapp: user.whatsapp || '',
    company: user.company || '',
    active: user.active,
  }
  showModal.value = true
}

const createUser = async () => {
  saving.value = true
  try {
    await adminApi.createUser(form.value)
    toast.add('Usuario creado exitosamente', 'success')
    showModal.value = false
    await loadUsers()
  } catch (e) {
    toast.add(e?.message || 'Error al crear usuario', 'danger')
  } finally {
    saving.value = false
  }
}

const updateUser = async () => {
  saving.value = true
  try {
    const payload = { ...form.value }
    if (!payload.password) delete payload.password
    await adminApi.updateUser(editingUser.value.id, payload)
    toast.add('Usuario actualizado exitosamente', 'success')
    showModal.value = false
    await loadUsers()
  } catch (e) {
    toast.add(e?.message || 'Error al actualizar usuario', 'danger')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 2000; }
.modal-card { background: white; border-radius: 16px; width: 90%; max-width: 480px; }
</style>