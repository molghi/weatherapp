import { Logic, Visual } from '../../Controller.js'


// main function here
function renderAll(fetchedTimezone, fetchedWeather) {

    // setting offset of the current timezone
    Logic.offsetInSeconds = fetchedTimezone.timezone.offset_sec
    
    // rendering everything in .title-box
    renderTitleBox(fetchedTimezone, fetchedWeather)

    // making the time element re-render every minute
    tickTime(fetchedTimezone)

    // rendering the Daily block
    renderDaily(fetchedWeather)
    
    // rendering the Hourly block
    const [formattedToRender, indexOfNowInHourly, todayFormatted] = renderHourly(fetchedWeather)

    // rendering what's above the Hourly block
    renderMainBlock(fetchedWeather, fetchedTimezone, formattedToRender, indexOfNowInHourly, todayFormatted)
}


// ================================================================================================


// a dependency of `renderAll` -- renders almost all in .title-box:  .time-day, .time-icon, .time-element -- except sunrise/sunset
function renderTitleBox(fetchedTimezone, fetchedWeather) {

    // rendering .time-element & rendering .time-icon  (local time at the location) -- .time-element is where the time is, .time-icon is the icon for the current time
    const localTime = Logic.getLocalTime(Logic.offsetInSeconds)    // localTime is an array [hoursNum, minutesNum]
    Logic.timeNow = localTime
    const dateNowAtLocation = Logic.getLocalDay(Logic.offsetInSeconds)
    Visual.renderTimeElement(dateNowAtLocation, localTime) 
    Visual.renderTimeIcon(localTime) 

    // rendering .time-day -- word describing what time of the day it is now
    const dayTime = Logic.defineDayTime(localTime[0])
    Logic.timeOfTheDay = dayTime   // needed to define the bg video
    Visual.renderDayTime(dayTime)
}


// ================================================================================================


// a dependency of `renderAll` -- renders Hourly
function renderHourly(fetchedWeather) {
    const hourlyObj = {}
    const upcomingHours = 48  // amount of upcoming hours to have data about

    const nowDay = Logic.getLocalDay(Logic.offsetInSeconds).split('/').reverse().join('-')
    const nowTime = Logic.getLocalTime(Logic.offsetInSeconds)[0].toString().padStart(2,0)
    const todayFormatted = `${nowDay}T${nowTime}:00`   // like: "2025-01-10T21:00"
    // const todayFormatted = `${new Date().getFullYear()}-${(new Date().getMonth()+1).toString().padStart(2,0)}-${(new Date().getDate()).toString().padStart(2,0)}T${(new Date().getHours()).toString().padStart(2,0)}:00`    // like: "2025-01-10T21:00"

    const indexOfNowInHourly = fetchedWeather.hourly.time.findIndex(dateTimeStr => dateTimeStr === todayFormatted)   // because 'hourly' has 300+ elements representing all hours since 7 days ago
// console.log(`indexOfNowInHourly:`, indexOfNowInHourly)
    
    Object.keys(fetchedWeather.hourly).forEach(key => hourlyObj[key] = fetchedWeather.hourly[key].slice(indexOfNowInHourly, indexOfNowInHourly+upcomingHours))  // populating `hourlyObj`
    
    const formattedToRender = Logic.formatHourly(hourlyObj)   // 'formattedToRender' is an obj of props selected by me for the upcoming 48h; I just make it formatted ready to be rendered
    
    Visual.renderHourly(formattedToRender)

    return [formattedToRender, indexOfNowInHourly, todayFormatted]
}


// ================================================================================================


// a dependency of `renderAll` -- renders Daily
function renderDaily(fetchedWeather) {
    const dateNowAtLocation = Logic.getLocalDay(Logic.offsetInSeconds).split('/').reverse().join('-')
    const dailyFormatted = Logic.formatDaily(fetchedWeather.daily)  // 'dailyFormatted' is an obj of props selected by me; I just make it formatted ready to be rendered
    Visual.renderDaily(dateNowAtLocation, dailyFormatted)
}


// ================================================================================================


// a dependency of `renderAll`
function renderMainBlock(fetchedWeather, fetchedTimezone, formattedToRender, indexOfNowInHourly, todayFormatted) {
    // NOTE: 'formattedToRender' is an obj of props selected by me neatly formatted ready to render -- produced by 'renderHourly' -- each array in it has 48 elements representing 48 hours -- the 1st el at index 0 is now-hours

    // rendering the location and coordinates
    Visual.renderLocationAndCoords(fetchedTimezone)

    // rendering current air temp and weather description
    const description = Logic.getWeatherDescription(fetchedWeather.weathercode)  // getting description by weather code
    Logic.weathercode = fetchedWeather.weathercode  // needed to define the bg video
    Visual.renderTempAndDesc(fetchedWeather.temp, description)

    // rendering wind
    const windDirectionExplanation = Logic.getWindDirection(fetchedWeather.winddirection)
    Visual.renderWind(fetchedWeather.windspeed, windDirectionExplanation)

    // rendering uv index
    const todayFormattedShort = todayFormatted.slice(0, todayFormatted.indexOf('T'))
    const indexOfToday = fetchedWeather.daily.time.findIndex(timeEntry => timeEntry === todayFormattedShort)
    const uvIndex = fetchedWeather.daily.uv_index_max[indexOfToday]
    Visual.renderUvIndex(uvIndex)

    // rendering when it was fetched
    const fetchedAt = fetchedWeather.fetchedAt.hoursMinutes
    // const fetchedAt = Logic.timeNow
    const fetchedAtDate = fetchedWeather.fetchedAt.date
    Visual.renderUpdatedAt(fetchedAt, fetchedAtDate)

    const indexNowHours = 0  // explanation: see NOTE above

    // rendering Feels like
    const nowFeelsLike = Math.floor(formattedToRender.tempFeelsLike[indexNowHours])
    Visual.renderFeelsLike(nowFeelsLike)

    // rendering precipitation
    const precipitation = [formattedToRender.precipitationProbability[indexNowHours], formattedToRender.precipitation[indexNowHours], formattedToRender.rain[indexNowHours], formattedToRender.showers[indexNowHours], formattedToRender.snowDepth[indexNowHours], formattedToRender.snowfall[indexNowHours]]
    Visual.renderPrecipitation(precipitation)

    // rendering humidity and cloud cover now
    const humidityNow = fetchedWeather.hourly.relative_humidity_2m[indexOfNowInHourly]   
    const cloudCoverNow = fetchedWeather.hourly.cloud_cover[indexOfNowInHourly]   
    Visual.renderHumidity(humidityNow)
    Visual.renderCloudCover(cloudCoverNow)

    // rendering daylight and sunshine durations now:
    const indexDayToday = fetchedWeather.daily.time.findIndex(day => day === todayFormattedShort)
    const daylightDurationRaw = fetchedWeather.daily.daylight_duration[indexDayToday]
    const sunshineDurationRaw = fetchedWeather.daily.sunshine_duration[indexDayToday]
    const daylightDuration = `${Math.trunc(daylightDurationRaw / 3600)}h ${Math.floor((daylightDurationRaw % 3600) / 60)}m`  // formatting to get hours-minutes
    const sunshineDuration = `${Math.trunc(sunshineDurationRaw / 3600)}h ${Math.floor((sunshineDurationRaw % 3600) / 60)}m`
    Visual.renderDaylightSunshine(daylightDuration, sunshineDuration)

    // rendering the big icon based on the fetched weather data and the time at that location:
    const offsetInSeconds = fetchedTimezone.timezone.offset_sec
    const localTime = Logic.getLocalTime(offsetInSeconds)
    const dayTime = Logic.defineDayTime(localTime[0])
    const bigIconPath = Logic.defineBigIcon(fetchedWeather.weathercode, dayTime)
    Visual.renderBigIcon(bigIconPath)
}


// ================================================================================================


// a dependency of `renderAll` -- making the time element re-render every minute
function tickTime(fetchedTimezone) {
    const periodicityInMs = 60000
    const offsetInSeconds = fetchedTimezone.timezone.offset_sec
    const localTime = Logic.getLocalTime(offsetInSeconds)   // 'localTime' is an array

    Visual.nowHours = localTime[0]
    Visual.nowMinutes = localTime[1]

    setInterval(() => {
        // logic:
        Visual.nowMinutes += 1
        if(Visual.nowMinutes >= 60) {
            Visual.nowMinutes = 0
            Visual.nowHours += 1
            if(Visual.nowHours >= 24) Visual.nowHours -= 24
        }

        // displaying it all:
        const dateNowAtLocation = Logic.getLocalDay(Logic.offsetInSeconds)
        Visual.renderTimeElement(dateNowAtLocation, [Visual.nowHours, Visual.nowMinutes])  // rendering .time-element
        const dayTime = Logic.defineDayTime(Visual.nowHours)
        Visual.renderDayTime(dayTime)   // rendering .time-day
        const localTime = Logic.getLocalTime(offsetInSeconds)
        Visual.renderTimeIcon(localTime)   // rendering .time-icon
    }, periodicityInMs);
}


// ================================================================================================


// rendering sunrise or sunset, depending on the current time
function renderSunriseSunset(fetchedWeather) {
   const nowTimeString = Logic.getLocalTime(Logic.offsetInSeconds).join(':')
   const sunriseTime = Logic.sunriseTime
   const sunsetTime = Logic.sunsetTime

   const [nowHours, nowMinutes] = nowTimeString.split(':')
   const [sunriseHours, sunriseMinutes] = sunriseTime.split(':')
   const [sunsetHours, sunsetMinutes] = sunsetTime.split(':')
   // Cases:
   if(+nowHours <= +sunriseHours) {
    if(+nowHours === +sunriseHours && +nowMinutes < +sunriseMinutes) {
        console.log(`now is before sunrise -- render sunrise (1)`)
        return renderSunrise(fetchedWeather)
    }
    console.log(`now is before sunrise -- render sunrise (2)`)
    renderSunrise(fetchedWeather)
   } else if(+nowHours === +sunriseHours && +nowMinutes === +sunriseMinutes) {
    console.log(`it is sunrise now -- render sunrise`)
    renderSunrise(fetchedWeather)
   } else if(+nowHours === +sunriseHours && +nowMinutes > +sunriseMinutes) {
    console.log(`it is after sunrise now -- render sunset`)
    renderSunset(fetchedWeather,nowTimeString,sunsetTime)
   } else if(+nowHours > +sunriseHours && (+nowHours <= +sunsetHours)) {
    if(+nowHours < +sunsetHours) {
        renderSunset(fetchedWeather,nowTimeString,sunsetTime)
        return console.log(`render sunset (1)`)
    } else if(+nowHours === +sunsetHours && +nowMinutes <= +sunsetMinutes) {
        renderSunset(fetchedWeather,nowTimeString,sunsetTime)
        return console.log(`render sunset (2)`)
    }
    renderSunset(fetchedWeather,nowTimeString,sunsetTime)
    console.log(`render sunset (3)`)
   } else if((+nowHours >= 0 && +nowHours < +sunriseHours) || (+nowHours === +sunriseHours && +nowMinutes <= +sunriseMinutes)) {
    renderSunrise(fetchedWeather)
    console.log(`render sunrise of today (it's past midnight but before the sunrise)`)
   } else {
    console.log('render sunrise of the next day')
    renderSunrise(fetchedWeather)
   }
}


// ================================================================================================


// a dependency of `renderSunriseSunset` -- rendering the sunrise (.sun-time) 
function renderSunrise(fetchedWeather,type='ofThisDay') {
    const tomorrowFormatted = Logic.getTomorrowString()   // formatted like: '2025-01-12'
    if(type==='ofTomorrow') {
        console.log(`tomorrowFormatted:`,tomorrowFormatted)
        // get the sunrise of tomorrow, save it to Model.sunriseTime, calc time until it, render it
    } else {
        const indexOfTomorrow = fetchedWeather.daily.sunrise.findIndex(sunriseStr => sunriseStr.startsWith(tomorrowFormatted))
        const sunriseRaw = fetchedWeather.daily.sunrise[indexOfTomorrow]
        const sunriseRawTime = new Date(sunriseRaw).getTime()
        const timeUntilSunrise = Logic.calcSunrise(sunriseRawTime)
        Visual.renderSuntime(timeUntilSunrise, 'sunrise', sunriseRaw.slice(-5))  // Visual.renderSuntime -- 1st arg is an array (time: hrs and min), 2nd arg is a string ('sunrise'/'sunset')
    }
}


// ================================================================================================


function renderSunset(fetchedWeather, nowTimeString, sunsetTimeString) {
    // console.log(nowTimeString, sunsetTimeString)
    const timeArr = Logic.calcSunset(nowTimeString, sunsetTimeString)
    // console.log(timeArr)
    Visual.renderSuntime(timeArr, 'sunset', sunsetTimeString)
}


// ================================================================================================


export { renderAll, renderSunriseSunset }