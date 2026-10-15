<script setup>
import { ref } from 'vue'

defineProps({
  open: { type: Boolean, default: false },
  kotaList: { type: Array, default: () => [] },
  detail: { type: Array, default: () => [] },
})

const emit = defineEmits(['close', 'select-city'])

const keyword = ref('')

const cari = () => {
  if (!keyword.value.trim()) return
  emit('select-city', keyword.value.trim())
  keyword.value = ''
}
</script>

<template>
  <!-- Overlay (HP) -->
  <div
    v-if="open"
    class="fixed inset-0 z-30 bg-black/40 lg:hidden"
    @click="emit('close')"
  ></div>

  <aside
    class="fixed inset-y-0 right-0 z-40 w-80 max-w-[85%] bg-slate-800/70 text-white backdrop-blur-md
           transform transition-transform duration-300
           lg:w-[34%] lg:max-w-none lg:translate-x-0"
    :class="open ? 'translate-x-0' : 'translate-x-full'"
  >
    <div class="h-full overflow-y-auto px-8 pt-24 pb-8 lg:px-12">
      <!-- Input lokasi -->
      <form @submit.prevent="cari">
        <input
          v-model="keyword"
          type="text"
          placeholder="Lokasi lain"
          class="w-full bg-transparent border-b border-white/30 pb-2 text-sm placeholder-white/50
                 focus:outline-none focus:border-white/70"
        />
      </form>

      <!-- Daftar kota -->
      <ul class="mt-8 space-y-4 text-sm text-white/60">
        <li v-for="kota in kotaList" :key="kota">
          <button
            @click="emit('select-city', kota)"
            class="transition hover:text-white"
          >
            {{ kota }}
          </button>
        </li>
      </ul>

      <hr class="my-8 border-white/20" />

      <!-- Detail cuaca -->
      <h2 class="text-sm font-medium">Detail Cuaca</h2>
      <ul class="mt-6 space-y-5 text-sm">
        <li
          v-for="d in detail"
          :key="d.label"
          class="flex items-center justify-between text-white/60"
        >
          <span>{{ d.label }}</span>
          <span class="text-white">{{ d.nilai }}</span>
        </li>
      </ul>

      <hr class="my-8 border-white/20" />
    </div>
  </aside>
</template>