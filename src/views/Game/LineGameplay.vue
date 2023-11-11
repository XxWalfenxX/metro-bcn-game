<script>
import { ref } from "vue"
export default {

    data() {

        const colorLinia = ""
        return {
            estaciones: null,
            colorLinia
        }
    },
    async created() {
        const response = await fetch(
            `https://api.tmb.cat/v1/transit/linies/metro/${this.$route.params.linea}/estacions?app_id=${import.meta.env.VITE_TMB_APP_ID
            }&app_key=${import.meta.env.VITE_TMB_APP_KEY}`
        )
        this.estaciones = await response.json()
        console.log(this.estaciones);

        this.estaciones.features.sort((a, b) => a.properties.ORDRE_ESTACIO
            - b.properties.ORDRE_ESTACIO
        )

        this.colorLinia = ref("after:border-[#" + this.estaciones.features[0].properties.COLOR_LINIA + "]")

    }
}
</script>
<template>
    <div class="flex items-center justify-center full-screen flex-col">
        <ol class="flex items-center w-3/5 mb-5 mt-32">
            <li class="flex w-full items-center  after:content-[''] after:w-full after:h-1 after:border-b after:border-4 after:inline-block relative"
                :class="colorLinia" v-for="estacion in estaciones?.features" v-bind:key="estacion.properties.ID_ESTACIO">
                <div :style="`background-color: #${estacion.properties.COLOR_LINIA};`"
                    class="flex items-center justify-center w-10 h-10 rounded-full lg:h-5 lg:w-5 shrink-0">
                </div>
                <p class="font-arial text-base font-normal absolute bottom-3 left-0 dark:text-white"
                    style="transform-origin: 0 0; transform: rotate(300deg); white-space: nowrap;">{{
                        estacion.properties.NOM_ESTACIO }}</p>
            </li>
        </ol>
        <div class="mb-6">
            <input type="text" id="estacion_input"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Introduce el nombre">
        </div>
    </div>
</template>


