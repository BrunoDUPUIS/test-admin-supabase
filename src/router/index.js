import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Admin from '../views/Admin.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/admin', component: Admin, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) return true

  const { data } = await supabase.auth.getSession()

  const session = data.session

  if (!session) {
    return '/login'
  }

  return true
})
