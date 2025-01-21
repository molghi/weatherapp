import {getLocalTime} from './getLocal.js'
import defineBigIcon from './defineBigIcon.js'
import {defineDayTime} from './smallFunctions.js'
import myObject from './weathercodes.js'

// formatting the obj that I am passing here in a neat, ready-to-be-rendered format
function formatHourly(obj, getWeatherDescription) {
    const time = obj.time.map(timeStr => `${new Date(timeStr).getHours()}:${new Date(timeStr).getMinutes().toString().padStart(2,0)}`)
    const tempFeelsLike = obj.apparent_temperature
    const tempGeneral = obj.temperature_2m
    const weathercodes = obj.weather_code.map(code => getWeatherDescription(code))
    const precipitation = obj.precipitation
    const precipitationProbability = obj.precipitation_probability
    const humidity = obj.relative_humidity_2m
    const rain = obj.rain
    const showers = obj.showers
    const snowfall = obj.snowfall
    const snowDepth = obj.snow_depth
    const cloudCover = obj.cloud_cover
    const formattedObj = {time, tempFeelsLike, tempGeneral, weathercodes, precipitation, precipitationProbability, humidity, rain, showers, snowfall, snowDepth, cloudCover}
    return formattedObj
}

// ================================================================================================

// formatting the obj that I am passing here in a neat, ready-to-be-rendered format
function formatDaily(obj, getWeatherDescription, offsetInSeconds) {
    const myObj = JSON.parse(JSON.stringify(obj))
    myObj.apparent_temperature_max = myObj.apparent_temperature_max.map(temp => Math.floor(temp))
    myObj.apparent_temperature_min = myObj.apparent_temperature_min.map(temp => Math.floor(temp))
    myObj.daylight_duration = myObj.daylight_duration.map(durInSec => `${Math.trunc(durInSec/3600)} ${Math.floor((durInSec % 3600) / 60)}`)
    myObj.sunshine_duration = myObj.sunshine_duration.map(durInSec => `${Math.trunc(durInSec/3600)} ${Math.floor((durInSec % 3600) / 60)}`)
    myObj.sunrise = returnCorrectSuntimes(myObj.sunrise, offsetInSeconds)
    myObj.sunset = returnCorrectSuntimes(myObj.sunset, offsetInSeconds)
    myObj.weathercodes = myObj.weather_code.map(code => getWeatherDescription(code))
    myObj.temperature_2m_max = myObj.temperature_2m_max.map(temp => Math.floor(temp))
    myObj.temperature_2m_min = myObj.temperature_2m_min.map(temp => Math.floor(temp))

    delete myObj.wind_direction_10m_dominant
    delete myObj.wind_gusts_10m_max
    delete myObj.wind_speed_10m_max
    delete myObj.weather_code

    return myObj
}

// ================================================================================================

// dependency of 'formatDaily' 
function returnCorrectSuntimes(arr, offsetInSeconds) {
    const newArr = arr.map(dateTimeStr => {
        const time = new Date(dateTimeStr)
        time.setSeconds(time.getSeconds() + offsetInSeconds);
        let string = time.toISOString().slice(11, 16);
        if(string.startsWith('0')) string = string.replace('0', '');
        return string;
    })
    return newArr 
}

// ================================================================================================

// upon fetching the new batch of data for Saved Locations, I need to return an obj of stuff ready to be rendered, I need to filter the API response
function formatSavedLocations(arr) {
    const result = []

    arr.forEach(location => {
        const obj = {}
        // readying the prerequisites:
        const timezoneObj = location[0]
        const weatherObj = location[1]
        const localTime = getLocalTime(timezoneObj.timezone.offset_sec, undefined, undefined, 'in the background')
        const dayTime = defineDayTime(localTime[0])
        const todayString = `${new Date().getFullYear()}-${(new Date().getMonth()+1).toString().padStart(2,0)}-${(new Date().getDate()).toString().padStart(2,0)}`
        const nowTime = `${(new Date().getHours()).toString().padStart(2,0)}:00`
        const nowMoment = `${todayString}T${nowTime}`
        const indexOfNowInHourly = weatherObj.hourly.time.findIndex(entry => entry === nowMoment)

        obj.cityName = timezoneObj.city;
        obj.country = timezoneObj.country;
        obj.coords = [timezoneObj.coords.lat.toFixed(2), timezoneObj.coords.lng.toFixed(2)];
        obj.localTime = localTime; 
        obj.temp = Math.floor(weatherObj.temp)
        obj.feelsLikeTemp = Math.floor(weatherObj.hourly.apparent_temperature[indexOfNowInHourly])
        obj.description = myObject[String(weatherObj.weathercode)]
        obj.icon = defineBigIcon(weatherObj.weathercode, dayTime)
        
        result.push(obj)
    })

    return result
}

// ================================================================================================

export { formatHourly, formatDaily, formatSavedLocations }