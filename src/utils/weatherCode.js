export const kondisi = (code) => {
    if (code === 0) return 'Cerah'
    if ([1, 2].includes(code)) return 'Cerah berawan'
    if (code === 3) return 'Berawan'
    if ([45, 48].includes(code)) return 'Berkabut'
    if (code >= 51 && code <= 67) return 'Hujan'
    if (code >= 80 && code <= 82) return 'Hujan lebat'
    if (code >= 95) return 'Badai petir'
    return 'Tidak diketahui'
}