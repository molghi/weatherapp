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
    try {
        // fetching from the timezone API:
        const fetchedTimezone = await Logic.fetchTimezone(Logic.myCoords);
        console.log(fetchedTimezone)

        // fetching from the weather API
        const fetchedWeather = await Logic.fetchWeather(Logic.myCoords);
        console.log(fetchedWeather)

        // rendering local time at the location
        const offsetInSeconds = fetchedTimezone.timezone.offset_sec
        const localTime = Logic.getLocalTime(offsetInSeconds)
        Visual.renderTimeElement(localTime)
        Visual.renderTimeIcon(localTime)

        // rendering the location and coordinates
        Visual.renderLocationAndCoords(fetchedTimezone)

        // rendering the sunrise fetchedWeather.daily.sunrise[8]
        const sunriseRaw = fetchedWeather.daily.sunrise[8]
        const sunriseRawTime = new Date(sunriseRaw).getTime()
        const timeUntilSunrise = Logic.calcSunrise(sunriseRawTime)
        Visual.renderSunrise(timeUntilSunrise)

        // rendering current air temp and weather description
        const description = Logic.getWeatherDescription(fetchedWeather.weathercode)  // getting description by weather code
        Visual.renderTempAndDesc(fetchedWeather.temp, description)

        // rendering the big icon and the day time element
        const nowHours = new Date().getHours()
        const dayTime = Logic.defineDayTime(nowHours)
        const bigIcon = await Logic.defineBigIcon(fetchedWeather.weathercode, dayTime)
        Visual.renderBigIcon(bigIcon.default)
        Visual.renderDayTime(dayTime)

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

        // rendering Hourly
        const hourlyObj = {}
        const upcomingHours = 24  // amount of upcoming hours to have data about
        Object.keys(fetchedWeather.hourly).forEach(key => hourlyObj[key] = fetchedWeather.hourly[key].slice(0, upcomingHours))  // populating `hourlyObj`
        const formattedToRender = Logic.formatHourly(hourlyObj)   // it's an obj of props selected by me for the upcoming 24h
        Visual.renderHourly(formattedToRender)

        // rendering Feels like
        const nowFeelsLike = Math.floor(formattedToRender.tempFeelsLike[0])
        Visual.renderFeelsLike(nowFeelsLike)

        // rendering precipitation
        const precipitation = [formattedToRender.precipitationProbability[0], formattedToRender.precipitation[0], formattedToRender.rain[0], formattedToRender.showers[0], formattedToRender.snowDepth[0], formattedToRender.snowfall[0]]
        Visual.renderPrecipitation(precipitation)

        // rendering Daily
        const dailyFormatted = Logic.formatDaily(fetchedWeather.daily)
        Visual.renderDaily(dailyFormatted)

    } catch (error) {
        console.log(error)
    }
}
init()
