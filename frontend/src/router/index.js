import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/LoginView.vue'),
    meta: { guest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/auth/RegisterView.vue'),
    meta: { guest: true },
  },
  {
    path: '/dashboard',
    component: () => import('../layouts/UserLayout.vue'),
    meta: { auth: true },
    children: [
      { path: '', name: 'UserDashboard', component: () => import('../views/user/DashboardView.vue') },
    ],
  },
  {
    path: '/campaigns',
    component: () => import('../layouts/UserLayout.vue'),
    meta: { auth: true },
    children: [
      { path: '', name: 'CampaignList', component: () => import('../views/user/CampaignListView.vue') },
      { path: ':id', name: 'CampaignDetail', component: () => import('../views/user/CampaignDetailView.vue') },
    ],
  },
  {
    path: '/admin',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { auth: true, admin: true },
    children: [
      { path: '', name: 'AdminDashboard', component: () => import('../views/admin/DashboardView.vue') },
      { path: 'users', name: 'AdminUsers', component: () => import('../views/admin/UsersView.vue') },
      { path: 'campaigns', name: 'AdminCampaigns', component: () => import('../views/admin/CampaignsView.vue') },
      { path: 'config', name: 'AdminConfig', component: () => import('../views/admin/ConfigView.vue') },
    ],
  },
  {
    path: '/c/:slug',
    name: 'CampaignLanding',
    component: () => import('../views/public/CampaignLanding.vue'),
  },
  {
    path: '/referral/:uuid',
    name: 'ReferralDashboard',
    component: () => import('../views/public/ReferralDashboard.vue'),
  },
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null

  if (to.meta.auth && !token) {
    return next('/login')
  }

  if (to.meta.admin && user?.role !== 'admin') {
    return next('/dashboard')
  }

  if (to.meta.guest && token) {
    return next(user?.role === 'admin' ? '/admin' : '/dashboard')
  }

  next()
})

export default router
