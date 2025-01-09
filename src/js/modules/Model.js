import { fetchWeather, fetchTimezone } from './model-dependencies/apis.js'
import myObject from './model-dependencies/weathercodes.js';

class Model {
    #state = {}
    constructor() {
        this.myCoords = [41.0082, 28.9784]  // lat & long of Istanbul
        this.celsiusSign = "°C"
        this.fahrenheitSign = "°F"
        this.latitudeSign = `° N`
        this.longitudeSign = `° E`
        // console.log(myObject)
        // fetchTimezone([41.0082, 28.9784])
    }

    async fetchWeather(coordsArr) {
        const dataObj = await fetchWeather(coordsArr)
        return dataObj
    }

    async fetchTimezone(coordsArr) {
        const dataObj = await fetchTimezone(coordsArr)
        return dataObj
    }

    getLocalTime(offsetInSec) {   // returns an array: current hour and minutes (as numbers)
        const offsetInHours = offsetInSec / 3600
        const utcHours = new Date().getUTCHours()
        const utcMinutes = new Date().getUTCMinutes()

        let adjustedHours = utcHours + offsetInHours
        let adjustedMinutes = utcMinutes

        // if (adjustedHours >= 24) {
        //     adjustedHours -= 24
        // } else if (adjustedHours < 0) {
        //     adjustedHours += 24
        // }

        return [adjustedHours, adjustedMinutes]
    }

    calcSunrise(time) {
        const sunriseMs = time*1000
        const nowMs = Date.now()
        const differenceInMin = Math.floor((sunriseMs - nowMs)/1000/60)
        const hours = Math.trunc(differenceInMin/60)
        const minutes = differenceInMin%60
        if(hours>1) return hours
        else return minutes
    }

    getWeatherDescription(weathercode) {
        return myObject[String(weathercode)]
    }

    getWindDirection(degrees) {
        const directions = [
            "North", "North-Northeast", "Northeast", "East-Northeast",
            "East", "East-Southeast", "Southeast", "South-Southeast",
            "South", "South-Southwest", "Southwest", "West-Southwest",
            "West", "West-Northwest", "Northwest", "North-Northwest"
        ];
        const index = Math.round(degrees / 22.5) % 16; // Divide by 22.5 to get 16 sectors --> The value 22.5 is used to divide a full circle (360°) into 16 equal compass sectors (directions), corresponding to the 16-point compass rose (e.g., North, North-Northeast, Northeast, etc.) --> 360° ÷ 16 = 22.5° per sector
        return directions[index];
        /* Wind Direction Key:
            0° = North (N)
            90° = East (E)
            180° = South (S)
            270° = West (W)
        */
    }

}

export default Model