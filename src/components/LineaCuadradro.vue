<script setup>
defineProps({
  name: String,
  color: String,
  link: String
})
</script>
<template>
  <router-link
    :to="{
      name: 'Gameplay',
      params: {
        linea: link
      }
    }"
    :style="`background-color: #${color};`"
    class="break-words shadow-lg text-6xl max-w-fit max-h-fit text-white focus:ring-4 focus:outline-none font-bold font-arial p-5 text-center inline-flex items-center"
  >
    {{ name }}
  </router-link>
</template>
