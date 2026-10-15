export const kondisi = (code, isDay = 1) => {
    if (code === 0) {
        return isDay
            ? { text: 'Cerah', icon: 'fa-sun' }
            : { text: 'Cerah', icon: 'fa-moon' }
    }
    if ([1, 2].includes(code)) {
        return isDay
            ? { text: 'Cerah berawan', icon: 'fa-cloud-sun' }
            : { text: 'Cerah berawan', icon: 'fa-cloud-moon' }
    }
    if (code === 3) return { text: 'Berawan', icon: 'fa-cloud' }
    if ([45, 48].includes(code)) return { text: 'Berkabut', icon: 'fa-smog' }
    if (code >= 51 && code <= 67) return { text: 'Hujan', icon: 'fa-cloud-rain' }
    if (code >= 80 && code <= 82) return { text: 'Hujan lebat', icon: 'fa-cloud-showers-heavy' }
    if (code >= 95) return { text: 'Badai petir', icon: 'fa-cloud-bolt' }
    return { text: 'Tidak diketahui', icon: 'fa-question' }
}