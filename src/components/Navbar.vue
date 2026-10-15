<script setup>
defineProps({
  appName: { type: String, default: 'the.weather' },
})

const emit = defineEmits(['toggle-search'])
</script>

<template>
  <header class="absolute inset-x-0 top-0 z-30 flex items-start justify-between">
    <!-- Logo -->
    <a href="#" class="px-6 py-6 sm:px-10 text-sm font-semibold tracking-wide text-white">
      {{ appName }}
    </a>

    <!-- Tombol search (pojok kanan atas) -->
    <button
      @click="emit('toggle-search')"
      aria-label="Cari lokasi"
      class="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-white/60 text-slate-700 backdrop-blur transition hover:bg-white/80"
    >
      <i class="fa-solid fa-magnifying-glass text-lg"></i>
    </button>
  </header>
</template>