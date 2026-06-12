<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase'

const removeImage = async () => {
  if (!contenu.value.image_url) return

  await deleteOldImage(contenu.value.image_url)

  contenu.value.image_url = ''

  await save()

  alert('Image supprimée')
}

const getFileNameFromUrl = (url) => {
  if (!url) return null

  try {
    const u = new URL(url)
    return u.pathname.split('/images/')[1]
  } catch {
    return null
  }
}

const deleteOldImage = async (oldUrl) => {
  const fileName = getFileNameFromUrl(oldUrl)

  if (!fileName) return

  const { error } = await supabase.storage.from('images').remove([fileName])

  if (error) {
    console.error(error)
  }
}

const uploadImage = async (event) => {
  const file = event.target.files[0]

  if (!file) return

  if (contenu.value.image_url) {
    await deleteOldImage(contenu.value.image_url)
  }

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

const router = useRouter()

const contenu = ref({
  id: null,
  title: '',
  content: '',
  image_url: '',
})

onMounted(async () => {
  const { data, error } = await supabase.auth.getUser()

  const user = data?.user

  if (error || !user) {
    router.replace('/login')
    return
  }

  loadContent()
})

const loadContent = async () => {
  const { data } = await supabase.from('site_content').select('*').eq('section', 'Accueil').single()

  contenu.value = data
}

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
    alert('Erreur')
  } else {
    alert('Sauvegardé')
  }
}

const logout = async () => {
  await supabase.auth.signOut()
  router.push('/login')
}
</script>

<template>
  <h1>Administration du site</h1>

  <input v-model="contenu.title" placeholder="Titre" />

  <br /><br />

  <textarea v-model="contenu.content" rows="5" cols="50" />

  <input type="file" accept="image/*" @change="uploadImage" />

  <br /><br />

  <div v-if="contenu.image_url">
    <img :src="contenu.image_url" class="preview" alt="Aperçu" />
  </div>

  <button v-if="contenu.image_url" @click="removeImage">Supprimer l'image</button>

  <button @click="save">Sauvegarder</button>

  <button @click="logout">Déconnexion</button>
</template>

<style>
.preview {
  display: block;
  max-width: 400px;
  margin: 20px auto;
  border-radius: 8px;
}
</style>
