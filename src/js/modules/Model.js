import { Value } from 'sass';
import { fetchWeather, fetchTimezone } from './model-dependencies/apis.js'
import myObject from './model-dependencies/weathercodes.js';
import defineBigIcon from './model-dependencies/defineBigIcon.js';
import defineWeatherType from './model-dependencies/defineWeatherType.js';

class Model {
    #state = {}
    constructor() {
        this.myCoords = [41.0082, 28.9784]  // lat & long of Istanbul
        this.sunriseTime = 0
        this.sunsetTime = 0
        this.timeOfTheDay = ''
        this.weathercode = 0
    }

    // ================================================================================================

    setSunriseTime(value) {
        const hours = new Date(value).getHours()
        const minutes = new Date(value).getMinutes()
        this.sunriseTime = `${hours}:${minutes}`
        console.log(`sunrise today:`, this.sunriseTime)
    }
    
    // ================================================================================================
    
    setSunsetTime(value) {
        const hours = new Date(value).getHours()
        const minutes = new Date(value).getMinutes()
        this.sunsetTime = `${hours}:${minutes}`
        console.log(`sunset today:`, this.sunsetTime)
    }

    // ================================================================================================

    getTodayString() {
        return `${new Date().getFullYear()}-${(new Date().getMonth()+1).toString().padStart(2,0)}-${(new Date().getDate()).toString().padStart(2,0)}`
    }

    // ================================================================================================

    getTomorrowString() {
        return `${new Date().getFullYear()}-${(new Date().getMonth()+1).toString().padStart(2,0)}-${(new Date().getDate()+1).toString().padStart(2,0)}`
    }

    // ================================================================================================

    getNowTime() {
        return `${new Date().getHours()}:${new Date().getMinutes().toString().padStart(2,0)}`
    }

    // ================================================================================================

    async fetchWeather(coordsArr) {
        const dataObj = await fetchWeather(coordsArr)
        return dataObj
    }

    // ================================================================================================

    async fetchTimezone(coordsArr) {
        const dataObj = await fetchTimezone(coordsArr)
        return dataObj
    }

    // ================================================================================================

    getLocalTime(offsetInSec) {   // returns an array: current hour and minutes (as numbers)
        const offsetInHours = offsetInSec / 3600
        const utcHours = new Date().getUTCHours()
        const utcMinutes = new Date().getUTCMinutes()

        let adjustedHours = utcHours + offsetInHours
        let adjustedMinutes = utcMinutes

        // handling the wrapping of time around a 24-hour clock
        // If adjustedHours exceeds 24, it means the calculated time has gone beyond midnight of the current day and entered the next day.
        // Subtracting 24 ensures the hours "wrap around" and stay within the valid 0–23 range.
        if (adjustedHours >= 24) {
            adjustedHours -= 24
        } else if (adjustedHours < 0) {
            adjustedHours += 24
        }

        return [adjustedHours, adjustedMinutes]
    }

    // ================================================================================================

    calcSunrise(time) {
        const sunriseMs = time
        const nowMs = Date.now()
        const differenceInMin = Math.floor((sunriseMs - nowMs)/1000/60)
        let hours = Math.trunc(differenceInMin/60)
        const minutes = differenceInMin%60
        if (hours >= 24) {
            hours -= 24
        } else if (hours < 0) {
            hours += 24
        }
        return [hours, minutes]
    }

    // ================================================================================================

    getWeatherDescription(weathercode) {
        return myObject[String(weathercode)]
    }

    // ================================================================================================

    getWindDirection(degrees) {
        const directions = [
            "North", "North-Northeast", "Northeast", "East-Northeast",
            "East", "East-Southeast", "Southeast", "South-Southeast",
            "South", "South-Southwest", "Southwest", "West-Southwest",
            "West", "West-Northwest", "Northwest", "North-Northwest"
        ];
        const index = Math.round(degrees / 22.5) % 16; // Divide by 22.5 to get 16 sectors --> The value 22.5 is used to divide a full circle (360°) into 16 equal compass sectors (directions), corresponding to the 16-point compass rose (e.g., North, North-Northeast, Northeast, etc.) --> 360° ÷ 16 = 22.5° per sector
        return directions[index];
    }

    // ================================================================================================

    defineDayTime(nowHours) {
        if(nowHours>=18  && nowHours <=23) return 'Evening'
        else if(nowHours>=0  && nowHours <8) return 'Night'
        else if(nowHours>=8  && nowHours <12) return 'Morning'
        else return 'Day'
    }

    // ================================================================================================

    defineBigIcon(weathercode, dayTime) {
        const path = defineBigIcon(weathercode, dayTime)  // I import it above
        return path 
    }

    // ================================================================================================

    // formatting the obj that I am passing here in a neat, ready-to-be-rendered format
    formatHourly(obj) {
        const time = obj.time.map(timeStr => `${new Date(timeStr).getHours()}:${new Date(timeStr).getMinutes().toString().padStart(2,0)}`)
        const tempFeelsLike = obj.apparent_temperature
        const tempGeneral = obj.temperature_2m
        const weathercodes = obj.weather_code.map(code => this.getWeatherDescription(code))
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
    formatDaily(obj) {
        const myObj = JSON.parse(JSON.stringify(obj))
        myObj.apparent_temperature_max = myObj.apparent_temperature_max.map(temp => Math.floor(temp))
        myObj.apparent_temperature_min = myObj.apparent_temperature_min.map(temp => Math.floor(temp))
        myObj.daylight_duration = myObj.daylight_duration.map(durInSec => `${Math.trunc(durInSec/3600)} ${Math.floor((durInSec % 3600) / 60)}`)
        myObj.sunshine_duration = myObj.sunshine_duration.map(durInSec => `${Math.trunc(durInSec/3600)} ${Math.floor((durInSec % 3600) / 60)}`)
        myObj.sunrise = myObj.sunrise.map(sunriseStr => `${new Date(sunriseStr).getHours()}:${new Date(sunriseStr).getMinutes().toString().padStart(2,0)}`)
        myObj.sunset = myObj.sunset.map(sunsetStr => `${new Date(sunsetStr).getHours()}:${new Date(sunsetStr).getMinutes().toString().padStart(2,0)}`)
        myObj.weathercodes = myObj.weather_code.map(code => this.getWeatherDescription(code))
        myObj.temperature_2m_max = myObj.temperature_2m_max.map(temp => Math.floor(temp))
        myObj.temperature_2m_min = myObj.temperature_2m_min.map(temp => Math.floor(temp))

        delete myObj.wind_direction_10m_dominant
        delete myObj.wind_gusts_10m_max
        delete myObj.wind_speed_10m_max
        delete myObj.weather_code

        return myObj
    }

    // ================================================================================================

    // needed to define the bg video
    defineWeatherType() {
        defineWeatherType(this.timeOfTheDay, this.weathercode);  // I import it above
    }

}

export default Model