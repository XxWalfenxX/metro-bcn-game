<script>
export default {
  setup() {},
  data() {
    return {
      lineasMetro: null
    }
  },
  async created() {
    const response = await fetch(
      `https://api.tmb.cat/v1/transit/linies/metro/?app_id=${
        import.meta.env.VITE_TMB_APP_ID
      }&app_key=${import.meta.env.VITE_TMB_APP_KEY}`
    )
    this.lineasMetro = await response.json()

    this.lineasMetro.features.sort((a, b) => a.properties.ORDRE_LINIA - b.properties.ORDRE_LINIA)
  }
}
</script>
<script setup>
import LineSelectComponent from "../../components/LineSelectComponent.vue"
</script>
<template>
  <div class="px-4 mx-auto h-fit max-w-screen-xl text-center py-24 lg:py-56">
    <h1
        class="mb-4 text-4xl font-extrabold tracking-tight leading-none dark:text-white md:text-5xl lg:text-6xl"
      >
        Elige una liniea para empezar
      </h1>
    <div class="flex flex-wrap gap-5 justify-center">
      <LineSelectComponent
        v-for="linea in lineasMetro?.features"
        v-bind:key="linea.properties.ID_LINIA"
        :name="linea.properties.NOM_LINIA"
        :color="linea.properties.COLOR_LINIA"
        :link="linea.properties.CODI_LINIA"
      />
    </div>
  </div>
</template>
