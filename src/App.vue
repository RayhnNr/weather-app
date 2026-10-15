<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import WeatherSidebar from '@/components/WeatherSidebar.vue'
import { getForecast, searchCity } from './api/weather'
import { kondisi } from './utils/weatherCode'

const searchOpen = ref(false)
const loading = ref(true)
const error = ref(null)

// Data manual sementara
const cuaca = ref({
  kota: '',
  suhu: 0,
  kondisi: '',
  waktu: '',
})
const kotaList = ['Surabaya', 'Jakarta', 'Bandung', 'Yogyakarta']
const detail = ref([])

const formatWaktu = (iso) => {
    return new Date(iso).toLocaleString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

const pilihKota = async (nama) => {
    loading.value = true
    error.value = null
    try {
        const kota = await searchCity(nama)
        if (!kota){
            error.value = `kota "${nama}" tidak ditemukan`
            return
        }

        const data = await getForecast(kota.latitude, kota.longitude)
        const c = data.current

        cuaca.value = {
            kota: kota.name,
            suhu: Math.round(c.temperature_2m),
            kondisi: kondisi(c.weather_code),
            waktu: formatWaktu(c.time)
        }

        detail.value = [
            { label: 'Berawan', nilai: `${c.cloud_cover}%` },
            { label: 'Kelembapan', nilai: `${c.relative_humidity_2m}%` },
            { label: 'Angin', nilai: `${c.wind_speed_10m} km/j` },
            { label: 'Hujan', nilai: `${c.precipitation} mm` },
        ]
        searchOpen.value = false
    } catch (e) {
        error.value = 'Gagal mengambil data cuaca. Periksa koneksi internet.'
        console.error(e)
    } finally {
        loading.value = false
    }
}

onMounted(() => pilihKota('Surabaya'))
</script>

<template>
  <div class="relative min-h-screen overflow-hidden bg-gradient-to-b from-sky-500 to-sky-200 text-white">
    <Navbar @toggle-search="searchOpen = !searchOpen" />

    <!-- Info cuaca utama (kiri bawah) -->
    <section class="absolute bottom-10 left-6 sm:left-10 flex items-end gap-5">
      <p class="text-7xl sm:text-8xl font-light leading-none">{{ cuaca.suhu }}°</p>
      <div>
        <h1 class="text-3xl sm:text-4xl font-light">{{ cuaca.kota }}</h1>
        <p class="text-xs text-white/80">{{ cuaca.waktu }}</p>
      </div>
      <p class="text-sm">{{ cuaca.kondisi }}</p>
    </section>

    <WeatherSidebar
      :open="searchOpen"
      :kota-list="kotaList"
      :detail="detail"
      @close="searchOpen = false"
      @select-city="pilihKota"
    />
  </div>
</template>