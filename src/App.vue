<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './supabase'
const modeAdmin = ref(false)

const save = async () => {
  const { error } = await supabase
    .from('site_content')
    .update({
      title: contenu.value.title,
      content: contenu.value.content,
      image_url: contenu.value.image_url,
    })
    .eq('id', contenu.value.id)

  if (error) {
    console.error(error)
    alert('Erreur')
  } else {
    alert('Sauvegardé')
  }
}
const uploadImage = async (event) => {
  const file = event.target.files[0]

  if (!file) return

  const fileName = Date.now() + '-' + file.name

  const { error } = await supabase.storage.from('images').upload(fileName, file)

  if (error) {
    console.error(error)
    alert('Erreur upload')
    return
  }

  const { data } = supabase.storage.from('images').getPublicUrl(fileName)

  contenu.value.image_url = data.publicUrl

  alert('Image envoyée')
}
const contenu = ref({
  id: null,
  title: '',
  content: '',
  image_url: '',
})

onMounted(async () => {
  const { data, error } = await supabase.from('site_content').select('*').eq('id', 3).single()

  console.log(data)

  contenu.value = data
})
</script>

<template>
  <pre>{{ contenu }}</pre>
  <button @click="modeAdmin = !modeAdmin">
    {{ modeAdmin ? 'Voir le site' : 'Admin' }}
  </button>

  <div v-if="!modeAdmin">
    <h1>{{ contenu.title }}</h1>

    <p>{{ contenu.content }}</p>

    <img v-if="contenu.image_url" :src="contenu.image_url" alt="logo artisan" class="image" />
  </div>

  <div v-else>
    <h2>Administration</h2>

    <input v-model="contenu.title" placeholder="Titre" />

    <br /><br />

    <textarea v-model="contenu.content" rows="5" cols="40" />

    <br /><br />
    <input type="file" accept="image/*" @change="uploadImage" />

    <br /><br />
    <button @click="save">Sauvegarder</button>
  </div>
</template>

<style scoped>
.image {
  display: block;
  margin: 20px auto;
  max-width: 100%;
  height: auto;
}
h1 {
  color: blueviolet;
  text-align: center;
}

p {
  text-align: center;
}

div {
  margin: 0 auto;
  border: 2px red solid;
  width: 500px;
}
</style>
