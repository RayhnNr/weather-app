<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import WeatherSidebar from '@/components/WeatherSidebar.vue'
import { searchCity, getForecast } from '@/api/weather'
import { kondisi } from '@/utils/weatherCode'

const searchOpen = ref(false)
const loading = ref(true)
const error = ref(null)

const cuaca = ref({ kota: '', suhu: 0, kondisi: '', ikon: 'fa-sun', waktu: '' })
const detail = ref([])
const kotaList = ['Surabaya', 'Jakarta', 'Bandung', 'Yogyakarta']

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

// Dipakai bersama: ambil cuaca dari objek kota yang sudah punya koordinat
const tampilkanCuaca = async (kota) => {
    const data = await getForecast(kota.latitude, kota.longitude)
    const c = data.current
    const k = kondisi(c.weather_code, c.is_day)

    cuaca.value = {
        kota: kota.name.replace(/^Kota /, ''),
        suhu: Math.round(c.temperature_2m),
        kondisi: k.text,
        ikon: k.icon,
        waktu: formatWaktu(c.time),
    }

    detail.value = [
        { label: 'Berawan', nilai: `${c.cloud_cover}%` },
        { label: 'Kelembapan', nilai: `${c.relative_humidity_2m}%` },
        { label: 'Angin', nilai: `${c.wind_speed_10m} km/j` },
        { label: 'Hujan', nilai: `${c.precipitation} mm` },
    ]
}

// Pilih lewat nama (Enter di input atau kota populer)
const pilihKota = async (nama) => {
    loading.value = true
    error.value = null
    try {
        const kota = await searchCity(nama)
        if (!kota) {
            error.value = `Kota "${nama}" tidak ditemukan`
            return
        }
        await tampilkanCuaca(kota)
        searchOpen.value = false
    } catch (e) {
        error.value = 'Gagal mengambil data cuaca. Periksa koneksi internet.'
        console.error(e)
    } finally {
        loading.value = false
    }
}

// Pilih lewat saran (sudah ada koordinat, tanpa geocoding ulang)
const pilihTempat = async (kota) => {
    loading.value = true
    error.value = null
    try {
        await tampilkanCuaca(kota)
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
    <div
        class="relative min-h-screen overflow-hidden bg-gradient-to-b from-sky-500 to-sky-200 text-white"
    >
        <Navbar @toggle-search="searchOpen = !searchOpen" />

        <p
            v-if="error"
            class="absolute left-6 top-24 rounded-lg bg-red-500/80 px-3 py-2 text-sm sm:left-10"
        >
            {{ error }}
        </p>

        <p v-if="loading" class="absolute bottom-10 left-6 text-white/80 sm:left-10">
            Memuat cuaca...
        </p>

        <!-- Info cuaca utama (kiri bawah) -->
        <section v-else class="absolute bottom-10 left-6 flex items-end gap-5 sm:left-10">
            <p class="text-7xl font-light leading-none sm:text-8xl">{{ cuaca.suhu }}°</p>
            <div>
                <h1 class="text-3xl font-light sm:text-4xl">{{ cuaca.kota }}</h1>
                <p class="text-xs text-white/80">{{ cuaca.waktu }}</p>
            </div>
            <div class="flex flex-col items-center gap-1 text-sm">
                <i :class="['fa-solid', cuaca.ikon, 'text-2xl']"></i>
                <span>{{ cuaca.kondisi }}</span>
            </div>
        </section>

        <WeatherSidebar
            :open="searchOpen"
            :kota-list="kotaList"
            :detail="detail"
            :active-city="cuaca.kota"
            @close="searchOpen = false"
            @select-city="pilihKota"
            @select-place="pilihTempat"
        />
    </div>
</template>