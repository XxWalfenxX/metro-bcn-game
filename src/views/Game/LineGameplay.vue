<script>
import { ref } from "vue"
import LineComponent from "../../components/LineComponent.vue"
export default {

    data() {
        const colorLinia = "";
        return {
            estaciones: null,
            colorLinia,
            nombreEstacionInput: ""
        };
    },
    async created() {
        const response = await fetch(`https://api.tmb.cat/v1/transit/linies/metro/${this.$route.params.linea}/estacions?app_id=${import.meta.env.VITE_TMB_APP_ID}&app_key=${import.meta.env.VITE_TMB_APP_KEY}`);
        this.estaciones = await response.json();

        this.estaciones.features.sort((a, b) => a.properties.ORDRE_ESTACIO
            - b.properties.ORDRE_ESTACIO);

        this.estaciones.features.forEach(estacion => {
            estacion.properties.encontrado = "no";
            // Puedes asignar el valor que desees a la nueva propiedad
        });

        this.colorLinia = ref("after:border-[#" + this.estaciones.features[0].properties.COLOR_LINIA + "]");
        //console.log(this.estaciones);
    },
    components: { LineComponent },
    methods: {
        shouldShowEstacion(estacion) {
            let nombreEstacionNormalizado = estacion.properties.NOM_ESTACIO.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            let nombreIntroducidoNormalizado = this.nombreEstacionInput.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

            // Obtener la parte de la palabra normalizada después del punto
            let partesNombreEstacion = nombreEstacionNormalizado.split(/\s*[.|]\s*/);
            //console.log(partesNombreEstacion);
            const parteDespuesDelPunto = partesNombreEstacion.length > 1 ? partesNombreEstacion[1] : partesNombreEstacion[0];
            if (nombreEstacionNormalizado == nombreIntroducidoNormalizado ) {
                estacion.properties.encontrado = 'si'
                this.nombreEstacionInput = ""
            }

            if (parteDespuesDelPunto == nombreIntroducidoNormalizado | nombreIntroducidoNormalizado == partesNombreEstacion[0] | nombreIntroducidoNormalizado == partesNombreEstacion[1] ) {
                estacion.properties.encontrado = 'si'
                this.nombreEstacionInput = ""
            }
            return estacion.properties.encontrado == 'si';
        }
    }

}
</script>
<template>
    <div class="flex mx-5 mt-5  justify-around">
        <LineComponent :name="estaciones?.features[0].properties.NOM_LINIA"
            :color="estaciones?.features[0].properties.COLOR_LINIA" />
            <p
        class="mb-4 text-4xl font-bold text-center tracking-tight leading-none dark:text-white md:text-5xl lg:text-6xl"
      >00:00</p>
    </div>
    <div class="flex items-center justify-center  flex-col">
        <ol class="flex items-center w-3/5 mb-5 mt-60">
            <li class="flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-4 after:inline-block relative"
                :class="[colorLinia]" v-for="estacion in estaciones?.features" :key="estacion.properties.ID_ESTACIO">
                <div :style="`background-color: #${estacion.properties.COLOR_LINIA};`"
                    class="flex items-center justify-center rounded-full h-5 w-5 shrink-0">
                </div>
                <p class="font-arial text-base font-normal absolute bottom-3 left-0 dark:text-white"
                    style="transform-origin: 0 0; transform: rotate(300deg); white-space: nowrap;"
                    v-if="shouldShowEstacion(estacion)">
                    {{ estacion.properties.NOM_ESTACIO }} </p>
            </li>
        </ol>
        <div class="mb-6">
            <input type="text" id="estacion_input" v-model="nombreEstacionInput"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Introduce el nombre">
        </div>
    </div>
</template>


