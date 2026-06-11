<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './supabase'

const contenu = ref({ id: null, title: '', content: '' })

onMounted(async () => {
  const { data, error } = await supabase.from('site_content').select('*')

  console.log('DATA =', data)

  contenu.value = data?.[0] ?? {
    id: null,
    title: '',
    content: '',
  }
})
</script>

<template>
  <h1>Test Admin avec Supabase</h1>

  <div>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla eligendi inventore, sunt nam
      perspiciatis dolores cupiditate saepe ut mollitia officia laborum facere molestias quae in.
      Neque distinctio expedita veritatis voluptas.
    </p>
  </div>
  <div>
    <h1>{{ contenu.title }}</h1>
    <p>{{ contenu.content }}</p>
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
