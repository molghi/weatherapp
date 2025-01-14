import { API_KEY } from '../config.js'
import { Logic, Visual } from '../../Controller.js'   // needed to show and then hide the spinner: Visual.toggleSpinner

async function fetchWeather(coordsArr) {
    try {
        const hourlyParams = `temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,weather_code,cloud_cover,visibility,wind_gusts_10m`
        const dailyParams = `weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant`
        const timezoneParams = `Europe%2FIstanbul`

        // temperature_2m,precipitation_probability,precipitation,weathercode // hourly
        // weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,uv_index_clear_sky_max,precipitation_hours,precipitation_probability_max // daily

        Visual.toggleSpinner()

        const API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${coordsArr[0]}&longitude=${coordsArr[1]}&hourly=${hourlyParams}&daily=${dailyParams}&current_weather=true&past_days=7&timezone=${timezoneParams}` 
        const response = await fetch(API_URL)
        if(!response.ok) throw new Error('>> Failed to fetch the weather')

        Visual.toggleSpinner('hide')

        const data = await response.json()
        const myObj = {
            temp: data.current_weather.temperature,
            weathercode: data.current_weather.weathercode,
            winddirection: data.current_weather.winddirection,
            windspeed: data.current_weather.windspeed,
            daily: data.daily,
            daily_units: data.daily_units,
            elevation: data.elevation,
            hourly: data.hourly,
            hourly_units: data.hourly_units,
            fetchedAt: {
                fullTime: new Date(),
                hoursMinutes: `${new Date().getHours()}:${new Date().getMinutes().toString().padStart(2,0)}`,
                date: `${new Date().getDate().toString().padStart(2,0)}/${(new Date().getMonth()+1).toString().padStart(2,0)}/${new Date().getFullYear()}`
            }
        }
        return myObj
    } catch (error) {
        console.log(error)
        Visual.toggleSpinner('hide')
        Visual.showError()
    }
}


// ================================================================================================


async function fetchTimezone(coordsArr) {
    try {
        const [lat, lng] = coordsArr
        const API_URL = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${API_KEY}`
        const response = await fetch(API_URL)
        if(!response.ok) throw new Error('>> Failed to fetch the timezone')
        const data = await response.json()
        const myObj = {
            continent: data.results[0].components.continent,
            country: data.results[0].components.country,
            city: data.results[0].components.city,
            flag: data.results[0].annotations.flag,
            sun: data.results[0].annotations.sun,
            timezone: data.results[0].annotations.timezone,
            coords: data.results[0].geometry,
            fetchedAt: {
                fullTime: new Date(),
                hoursMinutes: `${new Date().getHours()}:${new Date().getMinutes().toString().padStart(2,0)}`,
                date: `${new Date().getDate().toString().padStart(2,0)}/${(new Date().getMonth()+1).toString().padStart(2,0)}/${new Date().getFullYear()}`
            }
        }
        return myObj
    } catch (error) {
        console.log(error)
    }
}


export { fetchWeather, fetchTimezone }