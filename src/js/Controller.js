'use strict'

import '../styles/main.scss'
// import myImageNameWithoutExtension from '../img/myImageNameWithExtension'  // myImageNameWithoutExtension will be the src 

import Model from './modules/Model.js'  
import View from './modules/View.js'  
import KeyCommands from './modules/KeyCommands.js'  // to do sth by typing certain keys
import LS from './modules/Storage.js'  // to work with local storage


const Logic = new Model()
const Visual = new View()

async function init() {
    // fetching from the timezone API:
    const fetchedTimezone = await Logic.fetchTimezone(Logic.myCoords);
    console.log(fetchedTimezone)

    // rendering local time at the location
    const offsetInSeconds = fetchedTimezone.timezone.offset_sec
    const localTime = Logic.getLocalTime(offsetInSeconds)
    Visual.renderTimeElement(localTime)
    Visual.renderDayTimeAndIcon(localTime)

    // rendering the location and coordinates
    Visual.renderLocationAndCoords(fetchedTimezone)

    // rendering the sunrise
    const sunriseRaw = fetchedTimezone.sun.rise.nautical
    const timeUntilSunrise = Logic.calcSunrise(sunriseRaw)
    Visual.renderSunrise(timeUntilSunrise)

    // fetching from the weather API
    const fetchedWeather = await Logic.fetchWeather(Logic.myCoords);
    console.log(fetchedWeather)

    // rendering current air temp and weather description
    const description = Logic.getWeatherDescription(fetchedWeather.weathercode)  // getting description by weather code
    Visual.renderTempAndDesc(fetchedWeather.temp, description)

    // rendering wind
    const windDirectionExplanation = Logic.getWindDirection(fetchedWeather.winddirection)
    Visual.renderWind(fetchedWeather.windspeed, windDirectionExplanation)

    // rendering uv index
    const uvIndex = fetchedWeather.daily.uv_index_max[7]
    Visual.renderUvIndex(uvIndex)

    // rendering when it was fetched
    const fetchedAt = fetchedWeather.fetchedAt.hoursMinutes
    const fetchedAtDate = fetchedWeather.fetchedAt.date
    Visual.renderUpdatedAt(fetchedAt, fetchedAtDate)
}
init()
