'use strict'

import '../styles/main.scss'
// import myImageNameWithoutExtension from '../img/myImageNameWithExtension'  // myImageNameWithoutExtension will be the src 

import Model from './modules/Model.js'  
import View from './modules/View.js'  
import { renderAll, renderSunriseSunset } from './modules/controller-dependencies/rendering.js'
import KeyCommands from './modules/KeyCommands.js'  // to do sth by typing certain keys
import LS from './modules/Storage.js'  // to work with local storage

const Logic = new Model()
const Visual = new View()

// ===========================================================================================================================

async function init() {
    try {
        const [fetchedTimezone, fetchedWeather] = await fetchTimezoneAndWeather(Logic.myCoords, Logic.myCoords)

        // rendering main block, hourly, daily, title box, and making time update every min
        renderAll(fetchedTimezone, fetchedWeather)  // I import it above

        // Visual.showBackgroundVideo()

        logOutTimeNow()

        // setting sunrise and sunset time
        const todayString = Logic.getTodayString()  // formatted like '2025-01-11'
        const indexOfTodayInDaily = fetchedWeather.daily.sunset.findIndex(x => x.startsWith(todayString))
        Logic.setSunriseTime(fetchedWeather.daily.sunrise[indexOfTodayInDaily])
        Logic.setSunsetTime(fetchedWeather.daily.sunset[indexOfTodayInDaily])
        renderSunriseSunset(fetchedWeather)

        Visual.renderChangeLocBtn()  // rendering Change Location button

        const bgVideoPath = Logic.defineWeatherType()  // needed to define the bg video
        Visual.showBackgroundVideo(bgVideoPath)

        // Visual.blinkInterface()
        // Visual.glowInterface()

    } catch (error) {
        console.log(error)
    }
}
init()

// ===========================================================================================================================

// re-fetching and re-rendering the weather every hour
setInterval(async () => {
    try {
        await init();
    } catch (error) {
        console.error('Error during periodic init:', error);
    }
}, 3600 * 1000) // 3600 * 1000 milliseconds = 1 hour

// ===========================================================================================================================

// fetching timezone and weather
async function fetchTimezoneAndWeather(timezoneCoords, weatherCoords) {
    try {
        // fetching from the timezone API
        const fetchedTimezone = await Logic.fetchTimezone(timezoneCoords);
        console.log(`fetchedTimezone:`,fetchedTimezone)

        // fetching from the weather API
        const fetchedWeather = await Logic.fetchWeather(weatherCoords);
        console.log(`fetchedWeather:`,fetchedWeather)

        return [fetchedTimezone, fetchedWeather]
    } catch (error) {
        console.log(error)
    }
}

// ===========================================================================================================================

function logOutTimeNow() {
    console.log(`⏰ ${new Date().getHours()}:${(new Date().getMinutes()).toString().padStart(2,0)}`)
    setInterval(() => {
        console.log(`⏰ ${new Date().getHours()}:${(new Date().getMinutes()).toString().padStart(2,0)}`)
    }, 60000);
}

// ===========================================================================================================================

// exporting for some dependencies:
export { Logic, Visual } 