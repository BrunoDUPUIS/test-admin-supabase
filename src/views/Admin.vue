<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase'

const currentSection = ref('Accueil')

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
  const { data } = await supabase.auth.getSession()

  if (!data.session) {
    router.replace('/login')
    return
  }

  loadContent('Accueil')
})

const changeSection = (section) => {
  currentSection.value = section
  loadContent(section)
}

const loadContent = async (section) => {
  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    .eq('section', section)
    .single()

  if (error) {
    console.error(error)
    return
  }

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
  <div class="admin-layout">
    <aside class="sidebar">
      <h2>Administration</h2>

      <ul>
        <li :class="{ active: currentSection === 'Accueil' }" @click="changeSection('Accueil')">
          🏠 Accueil
        </li>

        <li :class="{ active: currentSection === 'Services' }" @click="changeSection('Services')">
          🛠 Services
        </li>

        <li :class="{ active: currentSection === 'Contact' }" @click="changeSection('Contact')">
          📞 Contact
        </li>
      </ul>
    </aside>

    <main class="content">
      <div class="card">
        <h1>Modifier la page {{ currentSection }}</h1>

        <label>Titre</label>
        <input type="text" v-model="contenu.title" />

        <label>Texte</label>
        <textarea v-model="contenu.content"></textarea>

        <label>Image</label>
        <input type="file" accept="image/*" @change="uploadImage" />

        <img v-if="contenu.image_url" :src="contenu.image_url" class="preview" />

        <div class="actions">
          <button class="btn btn-save" @click="save">Sauvegarder</button>

          <button class="btn btn-delete" @click="removeImage">Supprimer l'image</button>

          <button class="btn btn-logout" @click="logout">Déconnexion</button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.sidebar li.active {
  background: #2563eb;
}

.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f4f6f9;
}

/* Sidebar */

.sidebar {
  width: 250px;
  background: #1e293b;
  color: white;
  padding: 20px;
}

.sidebar h2 {
  margin-bottom: 30px;
  text-align: center;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s;
}

.sidebar li:hover {
  background: #334155;
}

/* Contenu */

.content {
  flex: 1;
  padding: 40px;
}

.card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
}

/* Formulaire */

label {
  display: block;
  margin-top: 15px;
  margin-bottom: 5px;
  font-weight: bold;
}

input[type='text'],
textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

textarea {
  min-height: 180px;
  resize: vertical;
}

/* Image */

.preview {
  display: block;
  margin: 20px auto;
  max-width: 400px;
  border-radius: 10px;
}

/* Boutons */

.actions {
  margin-top: 25px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
}

.btn-save {
  background: #16a34a;
  color: white;
}

.btn-delete {
  background: #dc2626;
  color: white;
}

.btn-logout {
  background: #475569;
  color: white;
}

/* Mobile */

@media (max-width: 768px) {
  .admin-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }

  .content {
    padding: 20px;
  }
}
</style>
