<script setup>
const modeAdmin = ref(false)
import { ref, onMounted } from 'vue'
import { supabase } from './supabase'

const contenu = ref({})

onMounted(async () => {
  const { data, error } = await supabase.from('site_content').select('*')

  console.log('DATA =', data)
  console.log('ERROR =', error)

  if (data && data.length > 0) {
    contenu.value = data[0]
  }
})
const save = async () => {
  await supabase
    .from('site_content')
    .update({
      title: contenu.value.title,
      content: contenu.value.content,
    })
    .eq('id', 1)

  alert('Sauvegardé')
}
</script>

<template>
  <button @click="modeAdmin = !modeAdmin">Admin</button>
  <h1>Test Admin avec Supabase</h1>

  <div>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla eligendi inventore, sunt nam
      perspiciatis dolores cupiditate saepe ut mollitia officia laborum facere molestias quae in.
      Neque distinctio expedita veritatis voluptas.
    </p>
  </div>
  <div v-if="!modeAdmin">
    <h1>{{ contenu.title }}</h1>
    <p>{{ contenu.content }}</p>
  </div>

  <div v-else>
    <input v-model="contenu.title" />

    <textarea v-model="contenu.content"></textarea>

    <button @click="save">Sauvegarder</button>
  </div>
  <div>
    <img src="../public/images/1.jpg" alt="logo artisan" class="image" />
  </div>
</template>

<style scoped>
.image {
  margin: 0 auto;
  width: 500px;
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
