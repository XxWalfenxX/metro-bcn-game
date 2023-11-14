<script>
import { ref } from "vue"
import Swal from 'sweetalert2'
import LineComponent from "../../components/LineComponent.vue"
export default {

    data() {
        return {
            estaciones: null,
            colorLinia: "",
            nombreEstacionInput: "",
            nombreEstacionInput2: "",
            longitudEstaciones: 0,
            tiempoRestante: 300, // 300 segundos = 5 minutos
            minutos: 5,
            segundos: 0,
            inputDeshabilitado: false,
            tiempoInicio: 0,
            tiempoTranscurrido: null,
            endgame: false,
        };
    },
    async created() {
        const response = await fetch(`https://api.tmb.cat/v1/transit/linies/metro/${this.$route.params.linea}/estacions?app_id=${import.meta.env.VITE_TMB_APP_ID}&app_key=${import.meta.env.VITE_TMB_APP_KEY}`);
        this.estaciones = await response.json();

        this.estaciones.features.sort((a, b) => a.properties.ORDRE_ESTACIO
            - b.properties.ORDRE_ESTACIO);

        this.estaciones.features.forEach(estacion => {
            estacion.properties.encontrado = "no";
        });

        this.longitudEstaciones = this.estaciones.features.length;

        this.colorLinia = ref("after:border-[#" + this.estaciones.features[0].properties.COLOR_LINIA + "]");
        //console.log(this.estaciones);
    },
    mounted() {
        this.iniciarContador();
        this.tiempoInicio = Date.now();

    },
    unmounted() {
        clearInterval(this.contador)
    },
    components: { LineComponent },
    computed: {
        formattedMinutes() {
            return this.padWithZero(this.minutos);
        },
        formattedSeconds() {
            return this.padWithZero(this.segundos);
        },
        isInputDisabled() {
            return this.tiempoRestante === 0 | this.endgame === true;
        },
    },
    methods: {
        shouldShowEstacion(estacion) {
            let nombreEstacionNormalizado = estacion.properties.NOM_ESTACIO.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            let nombreIntroducidoNormalizado = this.nombreEstacionInput.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

            // Obtener la parte de la palabra normalizada después del punto
            let partesNombreEstacion = nombreEstacionNormalizado.split(/\s*[.|]\s*/);
            //console.log(partesNombreEstacion);
            const parteDespuesDelPunto = partesNombreEstacion.length > 1 ? partesNombreEstacion[1] : partesNombreEstacion[0];


            if (nombreEstacionNormalizado == nombreIntroducidoNormalizado | parteDespuesDelPunto == nombreIntroducidoNormalizado | nombreIntroducidoNormalizado == partesNombreEstacion[0] | nombreIntroducidoNormalizado == partesNombreEstacion[1]) {
                estacion.properties.encontrado = 'si'
                this.nombreEstacionInput = ""
                this.nombreEstacionInput2 = ""
                this.comprobarEncontrado()
            }
            return estacion.properties.encontrado == 'si';
        },
        enviar(event) {
            if (event.keyCode === 13) {

                this.nombreEstacionInput = this.nombreEstacionInput2
            }

        },
        iniciarContador() {
            this.contador = setInterval(() => {
                if (this.tiempoRestante > 0) {
                    this.tiempoRestante--;
                    this.actualizarTiempo();
                } else {
                    Swal.fire({
                        icon: "warning",
                        title: "¡Se ha agotado el tiempo!",
                        customClass: {
                            popup: 'dark:bg-gray-800',
                            title: 'dark:text-white',
                        }
                    });
                    clearInterval(this.contador);
                    this.$emit('timerunout');
                }
            }, 1000);
        },
        actualizarTiempo() {
            this.minutos = Math.floor(this.tiempoRestante / 60);
            this.segundos = this.tiempoRestante % 60;
        },
        padWithZero(value) {
            return value.toString().padStart(2, '0');
        },
        informarTiempoTranscurrido() {
            const tiempoActual = Date.now();
            const tiempoDiferencia = tiempoActual - this.tiempoInicio;
            const segundosTranscurridos = Math.floor(tiempoDiferencia / 1000);
            this.tiempoTranscurrido = `${Math.floor(segundosTranscurridos / 60)} minutos y ${segundosTranscurridos % 60} segundos`;
        },
        comprobarEncontrado() {
            var todosSonSi = Object.values(this.estaciones.features).every(function (feature) {
                return feature.properties.encontrado === "si";
            });

            // Mostrar un mensaje si todos son "si"
            if (todosSonSi) {
                this.endgame = true
                this.informarTiempoTranscurrido()
                Swal.fire({
                    icon: "success",
                    title: "¡Lo has completado en " + this.tiempoTranscurrido + "!",
                    allowEnterKey: false,
                    customClass: {
                        popup: 'dark:bg-gray-800',
                        title: 'dark:text-white',
                    }
                });
                clearInterval(this.contador);
            }
        }


    }

}
</script>
<template>
    <div class="flex mx-5 mt-5  justify-around">
        <LineComponent :name="estaciones?.features[0].properties.NOM_LINIA"
            :color="estaciones?.features[0].properties.COLOR_LINIA" />
        <p class="mb-4 text-4xl font-bold text-center tracking-tight leading-none dark:text-white md:text-5xl lg:text-6xl">
            {{ formattedMinutes }}:{{ formattedSeconds }}</p>
    </div>
    <div class="flex items-center justify-center  flex-col">
        <ol class="flex items-center w-3/5 mb-5 mt-60">
            <template v-for="(estacion, index) in estaciones?.features" :key="estacion.properties.ID_ESTACIO">
                <li class="flex w-full items-center after:content-[''] after:w-full after:h-1 after:inline-block relative"
                    :class="[colorLinia]" v-if="index === longitudEstaciones - 1">
                    <div :style="`background-color: #${estacion.properties.COLOR_LINIA};`"
                        class="flex items-center justify-center rounded-full h-5 w-5 shrink-0">
                    </div>
                    <p class="font-arial text-base font-normal absolute bottom-3 left-0 dark:text-white"
                        style="transform-origin: 0 0; transform: rotate(300deg); white-space: nowrap;"
                        v-if="shouldShowEstacion(estacion)">
                        {{ estacion.properties.NOM_ESTACIO }} </p>
                    <p class="font-arial text-base font-normal absolute bottom-3 left-0 text-red-600"
                        style="transform-origin: 0 0; transform: rotate(300deg); white-space: nowrap;"
                        v-if="isInputDisabled & estacion.properties.encontrado == 'no'">
                        {{ estacion.properties.NOM_ESTACIO }} </p>
                </li>
                <li class="flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-4 after:inline-block relative"
                    :class="[colorLinia]" v-else>
                    <div :style="`background-color: #${estacion.properties.COLOR_LINIA};`"
                        class="flex items-center justify-center rounded-full h-5 w-5 shrink-0">
                    </div>
                    <p class="font-arial text-base font-normal absolute bottom-3 left-0 dark:text-white"
                        style="transform-origin: 0 0; transform: rotate(300deg); white-space: nowrap;"
                        v-if="shouldShowEstacion(estacion)">
                        {{ estacion.properties.NOM_ESTACIO }} </p>
                    <p class="font-arial text-base font-normal absolute bottom-3 left-0 text-red-600"
                        style="transform-origin: 0 0; transform: rotate(300deg); white-space: nowrap;"
                        v-if="isInputDisabled & estacion.properties.encontrado == 'no'">
                        {{ estacion.properties.NOM_ESTACIO }} </p>
                </li>
            </template>

        </ol>
        <div class="mb-6">
            <input type="text" id="estacion_input" v-model="nombreEstacionInput2" :disabled="isInputDisabled"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Introduce el nombre de la estación" @keydown="enviar">
        </div>
        <button type="button" v-if="isInputDisabled" @click="$router.go(0)"
            class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Volver
            a empezar</button>
        <router-link to="/play" v-if="isInputDisabled"
            class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Salir</router-link>
    </div>
</template>


