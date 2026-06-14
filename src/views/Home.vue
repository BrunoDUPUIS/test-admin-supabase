<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'

const sections = ref([])

onMounted(async () => {
  const { data, error } = await supabase.from('site_content').select('*').order('display_order')

  console.log(data)
  console.log(error)

  sections.value = data || []
})
</script>

<template>
  <div v-for="section in sections" :key="section.id" class="section">
    <h2>{{ section.title }}</h2>

    <p>{{ section.content }}</p>

    <img v-if="section.image_url" :src="section.image_url" :alt="section.title" class="image" />
  </div>
</template>

<style scoped>
.section {
  max-width: 1200px;
  margin: 50px auto;
  padding: 30px;
  text-align: center;
}

.section h2 {
  margin-bottom: 20px;
}

.section p {
  margin-bottom: 20px;
  line-height: 1.6;
}

.image {
  max-width: 100%;
  border-radius: 10px;
}
</style>
