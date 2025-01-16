import { Value } from 'sass';
import { fetchWeather, fetchTimezone, fetchWeatherByCityName } from './model-dependencies/apis.js'
import myObject from './model-dependencies/weathercodes.js';
import defineBigIcon from './model-dependencies/defineBigIcon.js';
import defineWeatherType from './model-dependencies/defineWeatherType.js';

class Model {
    #state = {}
    constructor() {
        // this.myCoords = [41.0082, 28.9784]  // Istanbul
        // this.myCoords = [52.5200, 13.4050] // Berlin
        // this.myCoords = [48.8566, 2.3522] // Paris
        // this.myCoords = [51.5074, -0.1278] // London
        // this.myCoords = [40.7128, -74.0060] // New York
        // this.myCoords = [64.1355, -21.8954] // Reykjavik
        // this.myCoords = [-33.8688, 151.2093] // Sydney
        // this.myCoords = [22.3193, 114.1694] // Hong Kong
        // this.myCoords = [23.5859, 58.4059] // Muscat
        // this.myCoords = [30.0444, 31.2357] // Cairo
        // this.myCoords = [24.7136, 46.6753] // Riyadh
        // this.myCoords = [68.9585, 33.0827] // Murmansk
        // this.myCoords = [64.5399, 40.5152] // Arkhangelsk
        this.myCoords = [57.1497, -2.0943] // Aberdeen

        this.sunriseTime = 0
        this.offsetInSeconds = 0
        this.sunsetTime = 0
        this.timeOfTheDay = ''
        this.timeNow = ''
        this.weathercode = 0
        this.tempUnits = 'Celsius'
        this.previousWeatherFetches = []
        this.previousTimezoneFetches = []
        this.degrees = {}
        this.degreesFahrenheit = {}
        this.fetchedCoords = []
    }

    // ================================================================================================

    pushFetchedCoords(value) {
        this.fetchedCoords.push(value)
    }

    // ================================================================================================

    switchTempUnits() {
        if(this.tempUnits === 'Celsius') this.tempUnits = 'Fahrenheit'
        else this.tempUnits = 'Celsius'
        return this.tempUnits
    }

    // ================================================================================================

    convertToCorrectTime(dateTimeStr) {     // returns "HH:mm"
        const time = new Date(dateTimeStr)
        time.setSeconds(time.getSeconds() + this.offsetInSeconds);
        return time.toISOString().slice(11, 16);
    }

    // ================================================================================================

    setSunriseTime(value) {
        // console.log(value)
        this.sunriseTime = this.convertToCorrectTime(value)
        // const hours = new Date(value).getHours()
        // const minutes = new Date(value).getMinutes()
        // this.sunriseTime = `${hours}:${minutes}`
    }

    // ================================================================================================
    
    setSunsetTime(value) {
        this.sunsetTime = this.convertToCorrectTime(value)
        // const hours = new Date(value).getHours()
        // const minutes = new Date(value).getMinutes()
        // this.sunsetTime = `${hours}:${minutes}`
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

    async fetchWeatherByCityName(cityName) {
        const data = await fetchWeatherByCityName(cityName)
        return data
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

        this.timeOfTheDay = this.defineDayTime(adjustedHours)

        return [adjustedHours, adjustedMinutes]
    }

    // ================================================================================================

    getLocalDay(offsetInSec) {
        const nowUTC = new Date();
        const utcTimestamp = nowUTC.getTime();  // Get the current UTC time in milliseconds
        
        const localTimestamp = utcTimestamp + offsetInSec * 1000;  // Calculate the local timestamp
        
        const localDate = new Date(localTimestamp);  // Create a Date object for the local time

        // Extract the day, month, and year based on local time
        const day = localDate.getUTCDate();
        const month = localDate.getUTCMonth() + 1;  
        const year = localDate.getUTCFullYear();
        
        return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`
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

    calcSunset(nowTimeString, sunsetTimeString) {
        const now = new Date()
        const padIt = val => val.toString().padStart(2,0)
        const prefix = `${now.getFullYear()}-${padIt(now.getMonth()+1)}-${padIt(now.getDate())}`
        const nowTime = new Date(`${prefix}T${nowTimeString}`).getTime()
        const sunsetTime = new Date(`${prefix}T${sunsetTimeString}`).getTime()
        const differenceInMin = Math.floor((sunsetTime - nowTime)/1000/60)
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
        else if(nowHours>=0  && nowHours <6) return 'Night'
        else if(nowHours>=6  && nowHours <12) return 'Morning'
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
        console.log(obj)
        const myObj = JSON.parse(JSON.stringify(obj))
        myObj.apparent_temperature_max = myObj.apparent_temperature_max.map(temp => Math.floor(temp))
        myObj.apparent_temperature_min = myObj.apparent_temperature_min.map(temp => Math.floor(temp))
        myObj.daylight_duration = myObj.daylight_duration.map(durInSec => `${Math.trunc(durInSec/3600)} ${Math.floor((durInSec % 3600) / 60)}`)
        myObj.sunshine_duration = myObj.sunshine_duration.map(durInSec => `${Math.trunc(durInSec/3600)} ${Math.floor((durInSec % 3600) / 60)}`)
        myObj.sunrise = this.returnCorrectSuntimes(myObj.sunrise)
        myObj.sunset = this.returnCorrectSuntimes(myObj.sunset)
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

    returnCorrectSuntimes(arr) {
        const newArr = arr.map(dateTimeStr => {
            const time = new Date(dateTimeStr)
            time.setSeconds(time.getSeconds() + this.offsetInSeconds);
            let string = time.toISOString().slice(11, 16);
            if(string.startsWith('0')) string = string.replace('0', '');
            return string;
        })
        return newArr 
    }

    // ================================================================================================

    // needed to define the bg video
    defineWeatherType() {
        return defineWeatherType(this.timeOfTheDay, this.weathercode);  // I import it above
    }

    // ================================================================================================

    convertTempUnits(value, flag) {
        if(flag === 'toFahrenheit') {
            return (value * 9/5) + 32
        } else { // to Celsius
            return (value - 32) * 5/9
        }
    }

    // ================================================================================================

    pushWeatherFetch(value) {
        this.previousWeatherFetches.push(value)
    }

    // ================================================================================================

    pushTimezoneFetch(value) {
        this.previousTimezoneFetches.push(value)
    }

    // ================================================================================================

    pushToLocalStorage(value, key) {
        localStorage.setItem(key, value)
    }

    // ================================================================================================

    pushWeatherFetchesToLS() {
        const weather = JSON.stringify(this.previousWeatherFetches)
        this.pushToLocalStorage(weather, 'weatherFetches')
    }

    // ================================================================================================

    pushTimezoneFetchesToLS() {
        const timezone = JSON.stringify(this.previousTimezoneFetches)
        this.pushToLocalStorage(timezone, 'timezoneFetches')
    }

    // ================================================================================================

    getWeatherFetchesFromLS() {
        const fetch = localStorage.getItem('weatherFetches')
        if (fetch) {
            this.previousWeatherFetches = JSON.parse(fetch)
        }
    }

    // ================================================================================================

    getTimezoneFetchesFromLS() {
        const fetch = localStorage.getItem('timezoneFetches')
        if (fetch) {
            this.previousTimezoneFetches = JSON.parse(fetch)
        }
    }
    
    // ================================================================================================
    
    getCoordsFetchesFromLS() {
        const fetch = localStorage.getItem('userCoords')
        if (fetch) {
            this.fetchedCoords = JSON.parse(fetch)
        }
    }

    // ================================================================================================

    setAllDegrees(fetchedWeather) {
        this.getObjectOfDegrees(fetchedWeather)  // gets you an object of all degree values that are in the UI now (main, feels like, in hourly and daily), based on the fetch response

        // setting Fahrenheit values:
        this.degreesFahrenheit.tempNow = Math.floor(this.convertTempUnits(this.degrees.tempNow, 'toFahrenheit'))
        this.degreesFahrenheit.feelsLike = Math.floor(this.convertTempUnits(this.degrees.feelsLike, 'toFahrenheit'))
        this.degreesFahrenheit.hourly = this.degrees.hourly.map(arr => {
            const val1 = Math.floor(this.convertTempUnits(arr[0], 'toFahrenheit'))
            const val2 = Math.floor(this.convertTempUnits(arr[1], 'toFahrenheit'))
            return [val1, val2]
        })
        this.degreesFahrenheit.daily = this.degrees.daily.map(arr => {
            const val1 = Math.floor(this.convertTempUnits(arr[0], 'toFahrenheit'))
            const val2 = Math.floor(this.convertTempUnits(arr[1], 'toFahrenheit'))
            const val3 = Math.floor(this.convertTempUnits(arr[2], 'toFahrenheit'))
            const val4 = Math.floor(this.convertTempUnits(arr[3], 'toFahrenheit'))
            return [val1, val2, val3, val4]
        })
        
        // this.degreesFahrenheit  is an arr of Fahrenheit values to render
        // this.degrees  is an arr of Celsius values to render
    }

    // ================================================================================================

    // gets you an object of all degree values that are in the UI now (main, feels like, in hourly and daily) -- based on the fetch response
    getObjectOfDegrees(fetchedWeather) {
        this.degrees.tempNow = fetchedWeather.temp
        
        const today = this.getTodayString()
        let now = this.getNowTime()
        if(new Date().getHours() < 10) now = '0' + now
        const nowString = `${today}T${now}`.split(':')[0]
        let indexInHourly = fetchedWeather.hourly.time.findIndex(x => x.startsWith(nowString))
        this.degrees.feelsLike = fetchedWeather.hourly.apparent_temperature[indexInHourly]
        this.degrees.hourly = []
        this.degrees.daily = []

        // pushing Hourly's (6 for 6 hours)
        for (let i = 0; i < 6; i++) {
            const tempMain = fetchedWeather.hourly.temperature_2m[indexInHourly]
            const tempFeelsLike = fetchedWeather.hourly.apparent_temperature[indexInHourly]
            this.degrees.hourly.push([tempMain, tempFeelsLike])
            indexInHourly += 1
        }
        
        // pushing Daily's (3 for 3 days)
        let indexOfDaily = fetchedWeather.daily.time.findIndex(x => x === today)

        for (let i = 0; i < 3; i++) {
            indexOfDaily += 1
            const feelsLikeMin = fetchedWeather.daily.apparent_temperature_min[indexOfDaily]
            const feelsLikeMax = fetchedWeather.daily.apparent_temperature_max[indexOfDaily]
            const mainTempMin = fetchedWeather.daily.temperature_2m_min[indexOfDaily]
            const mainTempMax = fetchedWeather.daily.temperature_2m_max[indexOfDaily]
            this.degrees.daily.push([mainTempMin, mainTempMax, feelsLikeMin, feelsLikeMax])
        }
    }

    // ================================================================================================

    giveShortDescription(weathercode) {
        weathercode = String(weathercode)
        let shortDesc = ''
        switch (weathercode) {
            case '0':
                shortDesc = 'Clear'
                break;
            case '1':
            case '2':
            case '3':
                shortDesc = 'Cloudy'
                break;
            case '45':
            case '48':
                shortDesc = 'Foggy'
                break;
            case '51':
            case '53':
            case '55':
            case '56':
            case '57':
                shortDesc = 'Drizzle'
                break;
            case '61':
            case '63':
            case '65':
            case '66':
            case '67':
            case '80':
            case '81':
            case '82':
                shortDesc = 'Rain'
                break;
            case '71':
            case '73':
            case '75':
            case '77':
            case '85':
            case '86':
                shortDesc = 'Snow'
                break;
            case '95':
            case '96':
            case '99':
                shortDesc = 'Thunder'
                break;
            default:
                shortDesc = ''
                break;
        }
        return shortDesc
    }

}

export default Model