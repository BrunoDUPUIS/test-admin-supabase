import { createApp } from 'vue'
import App from './App.vue'

import router from './router'

import { supabase } from './supabase'

supabase.auth.getSession()

createApp(App).use(router).mount('#app')
