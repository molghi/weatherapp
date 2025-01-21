import { Logic, Visual } from '../../Controller.js'


// main function here
function renderAll(fetchedTimezone, fetchedWeather) {
    Logic.offsetInSeconds = fetchedTimezone.timezone.offset_sec  // setting offset of the current timezone
    renderTitleBox(fetchedTimezone, fetchedWeather)  // rendering everything in .title-box
    tickTime(fetchedTimezone)  // making the time element re-render every minute
    renderDaily(fetchedWeather)  // rendering the Daily block
    const [formattedToRender, indexOfNowInHourly, todayFormatted] = renderHourly(fetchedWeather)  // rendering the Hourly block
    renderMainBlock(fetchedWeather, fetchedTimezone, formattedToRender, indexOfNowInHourly, todayFormatted)  // rendering what's above the Hourly block
}

// ================================================================================================

// dependency of `renderAll` -- renders almost all in .title-box:  .time-day, .time-icon, .time-element -- except sunrise/sunset
function renderTitleBox(fetchedTimezone, fetchedWeather) {

    // rendering .time-element & rendering .time-icon  (local time at the location) -- .time-element is where the time is, .time-icon is the icon for the current time
    const localTime = Logic.getLocalTime(Logic.offsetInSeconds)    // getting the local time; localTime is an array [hoursNum, minutesNum]
    Logic.timeNow = localTime
    const dateNowAtLocation = Logic.getLocalDay(Logic.offsetInSeconds)    // getting the local date
    Visual.renderTimeElement(dateNowAtLocation, localTime) 
    Visual.renderTimeIcon(localTime) 

    // rendering .time-day -- the word describing what time of the day it is now there
    const dayTime = Logic.defineDayTime(localTime[0])
    Logic.timeOfTheDay = dayTime   // needed to define the bg video
    Visual.renderDayTime(dayTime)
}

// ================================================================================================

// dependency of `renderAll` -- renders Hourly
function renderHourly(fetchedWeather) {
    const hourlyObj = {}
    const upcomingHours = 48  // amount of upcoming hours to have the data about

    const nowDay = Logic.getLocalDay(Logic.offsetInSeconds).split('/').reverse().join('-')
    const nowTime = Logic.getLocalTime(Logic.offsetInSeconds)[0].toString().padStart(2,0)
    const todayFormatted = `${nowDay}T${nowTime}:00`   // formatted like: "2025-01-10T21:00"

    const indexOfNowInHourly = fetchedWeather.hourly.time.findIndex(dateTimeStr => dateTimeStr === todayFormatted)   // because 'hourly' has 300+ elements representing all hours since 7 days ago
    
    Object.keys(fetchedWeather.hourly).forEach(key => hourlyObj[key] = fetchedWeather.hourly[key].slice(indexOfNowInHourly, indexOfNowInHourly+upcomingHours))  // populating `hourlyObj`
    
    const formattedToRender = Logic.formatHourly(hourlyObj)   // 'formattedToRender' is an obj of props selected by me for the upcoming 48h; I just make it formatted ready to be rendered
    
    Visual.renderHourly(formattedToRender)

    return [formattedToRender, indexOfNowInHourly, todayFormatted]
}

// ================================================================================================

// dependency of `renderAll` -- renders Daily
function renderDaily(fetchedWeather) {
    const dateNowAtLocation = Logic.getLocalDay(Logic.offsetInSeconds).split('/').reverse().join('-')   // getting the local date at the location
    const dailyFormatted = Logic.formatDaily(fetchedWeather.daily)  // 'dailyFormatted' is an obj of props selected by me; I just make it formatted ready to be rendered
    Visual.renderDaily(dateNowAtLocation, dailyFormatted)
}

// ================================================================================================

// dependency of `renderAll`
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

// dependency of `renderAll` -- making the time element re-render every minute
let timeElementTickTimer  // to prevent overlapping scenarios
function tickTime(fetchedTimezone) {
    const periodicityInMs = 60000   // =60sec
    const offsetInSeconds = fetchedTimezone.timezone.offset_sec
    const localTime = Logic.getLocalTime(offsetInSeconds)   // getting local time; 'localTime' is an array

    Visual.nowHours = localTime[0]
    Visual.nowMinutes = localTime[1]

    if(timeElementTickTimer) clearInterval(timeElementTickTimer);

    timeElementTickTimer = setInterval(() => {
        // setting the logic:
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
        if(+nowHours === +sunriseHours && +nowMinutes <= +sunriseMinutes) {
            // console.log(`now is before sunrise -- render sunrise`)
            renderSunrise(fetchedWeather)
        } else if(+nowHours === +sunriseHours && +nowMinutes > +sunriseMinutes) {
            // console.log(`now is after sunrise -- render sunset`)
            renderSunset(fetchedWeather,nowTimeString,sunsetTime)
        } else {
            // console.log(`now is before sunrise -- render sunrise`)
            renderSunrise(fetchedWeather)
        }
   } 
   
   else if(+nowHours === +sunriseHours && +nowMinutes === +sunriseMinutes) {
    // console.log(`it is sunrise now -- render sunrise`)
    renderSunrise(fetchedWeather)
   } 
   
   else if(+nowHours === +sunriseHours && +nowMinutes > +sunriseMinutes) {
    // console.log(`it is after sunrise now -- render sunset`)
    renderSunset(fetchedWeather,nowTimeString,sunsetTime)
   }
   
   else if(+nowHours > +sunriseHours && (+nowHours <= +sunsetHours)) {
        if(+nowHours < +sunsetHours) {
            renderSunset(fetchedWeather,nowTimeString,sunsetTime)
            // console.log(`render sunset`)
            return 
        } else if(+nowHours === +sunsetHours && +nowMinutes <= +sunsetMinutes) {
            renderSunset(fetchedWeather,nowTimeString,sunsetTime)
            // console.log(`render sunset`)
            return 
        }
    renderSunset(fetchedWeather,nowTimeString,sunsetTime)
    // console.log(`render sunset`)
   } 
   
   else if((+nowHours >= 0 && +nowHours < +sunriseHours) || (+nowHours === +sunriseHours && +nowMinutes <= +sunriseMinutes)) {
    renderSunrise(fetchedWeather)
    // console.log(`render sunrise of today -- it's past midnight but before the sunrise`)
   } 
   
   else {
    // console.log('render sunrise of the next day')
    renderSunrise(fetchedWeather)
   }
}

// ================================================================================================

// dependency of `renderSunriseSunset` -- rendering the sunrise (.sun-time) 
function renderSunrise(fetchedWeather,type='ofThisDay') {
    const tomorrowFormatted = Logic.getTomorrowString()   // formatted like: '2025-01-12'

    const indexOfTomorrow = fetchedWeather.daily.sunrise.findIndex(sunriseStr => sunriseStr.startsWith(tomorrowFormatted))  // finding the index of tomorrow in 'daily'
    const sunriseRaw = fetchedWeather.daily.sunrise[indexOfTomorrow]   // formatted like '2025-01-22T09:30'
    const sunriseRawTime = new Date(sunriseRaw).getTime()
    const timeUntilSunrise = Logic.calcSunrise(sunriseRawTime)  // an array: hours and minutes until sunrise
    const sunriseTimeCalced = calcLocalSuntime(sunriseRaw, Logic.offsetInSeconds)  // local time of the sunrise, formatted like '8:16'
    Visual.renderSuntime(timeUntilSunrise, 'sunrise', sunriseTimeCalced)  // Visual.renderSuntime: 1st arg is an array (time: hrs and min), 2nd arg is a string ('sunrise'/'sunset')
}

// ================================================================================================

// dependency of 'renderSunrise' -- returns a string
function calcLocalSuntime(suntimeIsoString, offsetInSeconds) {
    const suntimeUtc = new Date(suntimeIsoString);  // parsing the string into a date object
    const offsetInMs = offsetInSeconds * 1000; // converting to milliseconds
    const localSuntime = new Date(suntimeUtc.getTime() + offsetInMs);  // calculating the local time by adding the offset

    // extracting hours and minutes
    const hours = localSuntime.getUTCHours();
    const minutes = localSuntime.getUTCMinutes();

    return `${hours}:${minutes.toString().padStart(2,0)}`
}

// ================================================================================================

// dependency of `renderSunriseSunset`
function renderSunset(fetchedWeather, nowTimeString, sunsetTimeString) {
    const timeArr = Logic.calcSunset(nowTimeString, sunsetTimeString)
    Visual.renderSuntime(timeArr, 'sunset', sunsetTimeString)
}

// ================================================================================================


export { renderAll, renderSunriseSunset }