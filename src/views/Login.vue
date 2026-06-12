<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase'
import { onMounted } from 'vue'

onMounted(async () => {
  const { data, error } = await supabase.auth.getSessionFromUrl()

  if (data.session) {
    router.push('/admin')
  }
})

supabase.auth.getSessionFromUrl()
const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const login = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  if (error) {
    errorMessage.value = error.message
    return
  }

  router.push('/admin')
}
</script>

<template>
  <div class="login-container">
    <h1>Administration</h1>

    <input v-model="email" type="email" placeholder="Email" />

    <input v-model="password" type="password" placeholder="Mot de passe" />

    <button @click="login">Se connecter</button>

    <p>{{ errorMessage }}</p>
  </div>
</template>
