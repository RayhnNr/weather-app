<script setup>
import { ref, watch } from 'vue'
import { suggestCities } from '@/api/weather'

const props = defineProps({
    open: { type: Boolean, default: false },
    kotaList: { type: Array, default: () => [] },
    detail: { type: Array, default: () => [] },
    activeCity: { type: String, default: '' },
})

// select-city  : kirim nama kota (Enter atau kota populer)
// select-place : kirim objek kota lengkap dengan koordinat (dari saran)
const emit = defineEmits(['close', 'select-city', 'select-place'])

const keyword = ref('')
const suggestions = ref([])
const loadingSuggest = ref(false)
let timer

watch(keyword, (val) => {
    clearTimeout(timer)
    const q = val.trim()

    // minimal 2 huruf
    if (q.length < 2) {
        suggestions.value = []
        loadingSuggest.value = false
        return
    }

    timer = setTimeout(async () => {
        loadingSuggest.value = true
        try {
            suggestions.value = await suggestCities(q)
        } catch (e) {
            suggestions.value = []
            console.error(e)
        } finally {
            loadingSuggest.value = false
        }
    }, 400)
})

const bersihkan = () => {
    keyword.value = ''
    suggestions.value = []
}

const cari = () => {
    const q = keyword.value.trim()
    if (!q) return
    emit('select-city', q)
    bersihkan()
}

const pilihSaran = (kota) => {
    emit('select-place', kota)
    bersihkan()
}

// "Kota Surabaya" tetap dianggap cocok dengan "Surabaya"
const isActive = (kota) =>
    props.activeCity.toLowerCase().includes(kota.toLowerCase())

const ikonDetail = {
    Berawan: 'fa-cloud',
    Kelembapan: 'fa-droplet',
    Angin: 'fa-wind',
    Hujan: 'fa-cloud-rain',
}
</script>

<template>
    <!-- Overlay (HP) -->
    <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        leave-active-class="transition-opacity duration-300"
        leave-to-class="opacity-0"
    >
        <div
            v-if="open"
            class="fixed inset-0 z-30 bg-black/40 lg:hidden"
            @click="emit('close')"
        ></div>
    </Transition>

    <aside
        class="fixed inset-y-0 right-0 z-40 flex w-80 max-w-[85%] flex-col bg-slate-900/60 text-white
               shadow-2xl backdrop-blur-xl transition-transform duration-300
               lg:w-[34%] lg:max-w-none lg:translate-x-0"
        :class="open ? 'translate-x-0' : 'translate-x-full'"
    >
        <div
            class="flex-1 overflow-y-auto px-8 pb-6 pt-24 lg:px-12
                   [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.25)_transparent]"
        >
            <!-- Input lokasi -->
            <form @submit.prevent="cari" class="relative">
                <i
                    class="fa-solid fa-location-dot absolute left-0 top-1/2 -translate-y-1/2 text-xs text-white/50"
                ></i>
                <input
                    v-model="keyword"
                    type="text"
                    placeholder="Cari lokasi lain..."
                    autocomplete="off"
                    class="w-full border-b border-white/30 bg-transparent py-2 pl-6 pr-8 text-sm
                           placeholder-white/50 transition focus:border-white/80 focus:outline-none"
                />
                <button
                    type="submit"
                    aria-label="Cari"
                    class="absolute right-0 top-1/2 -translate-y-1/2 text-white/60 transition hover:text-white"
                >
                    <i class="fa-solid fa-arrow-right text-sm"></i>
                </button>
            </form>

            <!-- Daftar saran -->
            <ul
                v-if="suggestions.length || loadingSuggest"
                class="mt-2 overflow-hidden rounded-xl bg-slate-800/90 text-sm shadow-lg ring-1 ring-white/10"
            >
                <li v-if="loadingSuggest" class="px-4 py-3 text-white/50">Mencari...</li>

                <li v-for="kota in suggestions" :key="kota.id">
                    <button
                        @click="pilihSaran(kota)"
                        class="flex w-full items-center justify-between px-4 py-2.5 text-left transition hover:bg-white/10"
                    >
                        <span>
                            {{ kota.name }}
                            <span class="text-white/50">
                                {{ [kota.admin1, kota.country].filter(Boolean).join(', ') }}
                            </span>
                        </span>
                        <i class="fa-solid fa-location-arrow text-xs text-white/40"></i>
                    </button>
                </li>
            </ul>

            <!-- Lokasi populer -->
            <p class="mt-8 text-xs uppercase tracking-widest text-white/40">Lokasi populer</p>
            <ul class="mt-4 flex flex-wrap gap-2">
                <li v-for="kota in kotaList" :key="kota">
                    <button
                        @click="emit('select-city', kota)"
                        class="rounded-full border px-4 py-1.5 text-sm transition"
                        :class="
                            isActive(kota)
                                ? 'border-white bg-white font-medium text-slate-800'
                                : 'border-white/25 text-white/70 hover:border-white/60 hover:text-white'
                        "
                    >
                        {{ kota }}
                    </button>
                </li>
            </ul>

            <hr class="my-8 border-white/15" />

            <!-- Detail cuaca -->
            <h2 class="text-sm font-medium tracking-wide">Detail Cuaca</h2>

            <p v-if="detail.length === 0" class="mt-6 text-sm text-white/50">
                Data belum tersedia.
            </p>

            <ul v-else class="mt-6 space-y-5 text-sm">
                <li
                    v-for="d in detail"
                    :key="d.label"
                    class="flex items-center justify-between"
                >
                    <span class="flex items-center gap-3 text-white/60">
                        <i
                            :class="[
                                'fa-solid w-4 text-center text-xs',
                                ikonDetail[d.label] ?? 'fa-circle-info',
                            ]"
                        ></i>
                        {{ d.label }}
                    </span>
                    <span class="font-medium text-white">{{ d.nilai }}</span>
                </li>
            </ul>
        </div>

        <!-- Atribusi -->
        <p class="px-8 pb-5 text-xs text-white/35 lg:px-12">
            Data cuaca oleh
            <a
                href="https://open-meteo.com"
                target="_blank"
                rel="noopener"
                class="underline hover:text-white/70"
            >
                Open-Meteo
            </a>
        </p>
    </aside>
</template>