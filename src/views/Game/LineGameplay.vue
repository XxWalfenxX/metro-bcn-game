<script>
export default {
    setup() { },
    data() {
        return {
            estaciones: null
        }
    },
    async created() {
        const response = await fetch(
            `https://api.tmb.cat/v1/transit/linies/metro/${this.$route.params.linea}/estacions?app_id=${import.meta.env.VITE_TMB_APP_ID
            }&app_key=${import.meta.env.VITE_TMB_APP_KEY}`
        )
        this.estaciones = await response.json()

        this.estaciones.features.sort((a, b) => a.properties.ORDRE_ESTACIO
            - b.properties.ORDRE_ESTACIO
        )

    }
}
</script>
<template>
    <ol class="items-center sm:flex">
        <li class="relative mb-6 sm:mb-0" v-for="estacion in estaciones?.features"
            v-bind:key="estacion.properties.ID_ESTACIO">
            <div class="flex items-center">
                <div
                    class="z-10 flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full ring-0 ring-white dark:bg-blue-900 sm:ring-8 dark:ring-gray-900 shrink-0">
                </div>
                <div class="hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
            </div>
            <div class="mt-3 sm:pe-8">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ estacion.properties.NOM_ESTACIO }}</h3>
            </div>
        </li>
    </ol>
</template>