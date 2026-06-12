<template>
  <router-view />
</template>
<script>
import { onMounted } from 'vue'
import { supabase } from './supabase'

onMounted(async () => {
  await supabase.auth.getSession()
})
</script>
