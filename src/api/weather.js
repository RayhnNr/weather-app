import axios from 'axios'

const geo = axios.create({
    baseURL: 'https://geocoding-api.open-meteo.com/v1',
})

const weather = axios.create({
    baseURL: 'https://api.open-meteo.com/v1',
})

// Nama kota -> koordinat
export const searchCity = async (name) => {
    const res = await geo.get('/search', {
        params: {
            name,
            count: 1,
            language: 'id',
        },
    })
    return res.data.results?.[0] ?? null
}

// Koordinat -> cuaca saat ini
export const getForecast = async (lat, lon) => {
    const res = await weather.get('/forecast', {
        params: {
            latitude: lat,
            longitude: lon,
            current:
                'temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,cloud_cover,weather_code',
            timezone: 'auto',
        },
    })

    return res.data
}

export const suggestCities = async (name) => {
    const res = await geo.get('/search', {
        params: { name, count: 5, language: 'id' },
    })
    return res.data.results ?? []
}