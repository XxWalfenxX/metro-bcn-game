<script setup></script>
<template>
  <section
    class="flex justify-center items-center w-full full-screen bg-center bg-cover bg-no-repeat bg-[url('/tmb171204_031.jpg')] bg-gray-700 bg-blend-multiply"
  >
    <div class="px-4 mx-auto h-fit max-w-screen-xl text-center py-24 lg:py-56">
      <h1
        class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl"
      >
        Adivina las estaciones de metro
      </h1>
      <p class="mb-8 text-lg font-normal text-gray-300 lg:text-xl sm:px-16 lg:px-48">
        ¿Podrás escribir todas las estaciones del metro de Barcelona antes que se acabe el tiempo?
      </p>
      <div class="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
        <router-link
        to="/play"
          class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
        >
          Jugar
        </router-link>
        
      </div>
    </div>
  </section>
</template>
