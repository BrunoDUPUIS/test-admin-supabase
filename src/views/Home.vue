<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'

const contenu = ref({})

onMounted(async () => {
  const { data } = await supabase.from('site_content').select('*').eq('section', 'Accueil').single()

  contenu.value = data
})
</script>

<template>
  <h1>{{ contenu.title }}</h1>

  <p>{{ contenu.content }}</p>

  <img v-if="contenu.image_url" :src="contenu.image_url" class="image" />
</template>

<style scoped>
.image {
  max-width: 100%;
  display: block;
  margin: 20px auto;
}
</style>
