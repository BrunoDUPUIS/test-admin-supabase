<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase'

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
  <div class="login-page">
    <div class="login-card">
      <img src="../logo.jpg" alt="Logo" class="logo" />
      <h1>{{ contenu }}</h1>
      <h1>Espace Administration</h1>

      <p class="subtitle">Connectez-vous pour gérer votre site.</p>

      <input v-model="email" type="email" placeholder="Adresse email" />

      <input v-model="password" type="password" placeholder="Mot de passe" />

      <button @click="login">Se connecter</button>

      <p v-if="errorMessage" class="error">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>
<style scoped>
.logo {
  display: block;
  width: 100px;
  margin: 0 auto 20px;
}
.login-page {
  min-height: 100vh;
  background: #f4f6f9;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.login-card h1 {
  text-align: center;
  margin-bottom: 10px;
  color: #1e293b;
}

.subtitle {
  text-align: center;
  color: #64748b;
  margin-bottom: 30px;
}

input {
  width: 100%;
  padding: 14px;
  margin-bottom: 15px;
  border: 1px solid #dbe2ea;
  border-radius: 8px;
  font-size: 15px;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #2563eb;
}

button {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
}

button:hover {
  background: #1d4ed8;
}

.error {
  margin-top: 15px;
  color: #dc2626;
  text-align: center;
}

@media (max-width: 768px) {
  .login-card {
    padding: 25px;
  }
}
</style>
