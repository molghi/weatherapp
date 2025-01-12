import videoNightClearSky from '../../vid/night-clear-sky.mp4';
import videoDayClearSky from '../../vid/day-clear-sky.mp4';
import videoEveningSky from '../../vid/evening-sky.mp4';
import { sunriseIcon, sunsetIcon, precipitationIcon, lightbulbIcon, sunIcon, timeIcon, humidityIcon, cloudCoverIcon, eveningIcon, nightIcon, morningIcon, dayIcon } from './view-dependencies/icons.js'

class View {
    constructor() {
        this.locationEl = document.querySelector('.weather__place')
        this.coordsEl = document.querySelector('.weather__coords')
        this.timeEl = document.querySelector('.time-element')
        this.sunwordEl = document.querySelector('.sun-word')
        this.suntimeEl = document.querySelector('.sun-time')
        this.airTempEl = document.querySelector('.weather__temp-main')
        this.feelsLikeEl = document.querySelector('.weather__temp-feels')
        this.weatherDescriptionEl = document.querySelector('.weather__description')
        this.windSpeedEl = document.querySelector('.weather__wind-speed')
        this.windDirectionEl = document.querySelector('.weather__wind-direction')
        this.uvIndexEl = document.querySelector('.weather__uv-index')
        this.timeOfTheDayEl = document.querySelector('.time-day')
        this.timeboxIconEl = document.querySelector('.time-icon')
        this.updatedAtEl = document.querySelector('.weather__updated-time')
        this.videoEl = document.querySelector('video')
        this.bigIconEl = document.querySelector('.weather__icon')
        this.precipitationEl = document.querySelector('.weather__precipitation-details')
        this.hourlyBoxEl = document.querySelector('.weather__hours')
        this.dailyBoxEl = document.querySelector('.weather__days')
        this.humidityEl = document.querySelector('.weather__humidity-el')
        this.cloudCoverEl = document.querySelector('.weather__humidity-cloud-cover-el')
        this.lightEl = document.querySelector('.weather__humidity-light-el')
        this.sunEl = document.querySelector('.weather__humidity-sun-el')
        this.locationTitleEl = document.querySelector('.weather__location .weather__line-title') // Location:
        this.precipitationTitleEl = document.querySelector('.weather__precipitation .weather__line-title') // Precipitation:
        this.windTitleEl = document.querySelector('.weather__wind .weather__line-title') // Wind:
        this.uvTitleEl = document.querySelector('.weather__uv .weather__line-title') // UV Index:
        this.humidityTitleEl = document.querySelector('.weather__humidity .weather__line-title') // Humidity:
        this.cloudCoverTitleEl = document.querySelector('.weather__cloud-cover .weather__line-title') // Cloud cover:
        this.daylightTitleEl = document.querySelector('.weather__light .weather__line-title') // Daylight Duration:
        this.sunshineTitleEl = document.querySelector('.weather__sun .weather__line-title') // Sunshine Duration:
        this.hourlyTitleEl = document.querySelector('.weather__hourly .weather__small-title') // Hourly
        this.dailyTitleEl = document.querySelector('.weather__daily .weather__small-title') // Daily
        this.updatedTitleEl = document.querySelector('.weather__updated span:nth-child(1)') // Updated at
        this.changeLocBtnBoxEl = document.querySelector('.button-box')

        this.celsiusSign = "°C"
        this.fahrenheitSign = "°F"
        this.latitudeSign = `° N`
        this.longitudeSign = `° E`
        this.offsetInSeconds = 0

        this.nowHours = 0
        this.nowMinutes = 0
    }

    // ================================================================================================

    // rendering .weather__place & .weather__coords
    renderLocationAndCoords(obj) {
        const {city, continent, country, flag, coords} = obj
        this.locationEl.innerHTML = `${city}, <span class="weather__country">${country}<span class="weather__flag">${flag}</span></span>, ${continent}, Terra`
        this.coordsEl.innerHTML = `(${coords.lat.toFixed(2)}° N, ${coords.lng.toFixed(2)}° E)`
        this.locationTitleEl.innerHTML = `Location:`
    }

    // ================================================================================================

    // rendering .time-element
    renderTimeElement(timeArr) {
        let [hours, minutes] = timeArr
        const dateTodayFormatted = `${new Date().getDate().toString().padStart(2,0)}/${(new Date().getMonth()+1).toString().padStart(2,0)}/${new Date().getFullYear()}`
        const minutesFormatted = minutes.toString().padStart(2,0)
        if(hours>=24) hours -= 0
        this.timeEl.innerHTML = `${hours}<span>:</span>${minutesFormatted}`
        this.timeEl.setAttribute('title', `${dateTodayFormatted}  ̶ ${hours}:${minutesFormatted}`)
    }

    // ================================================================================================

    // rendering .sun-time
    renderSunrise(time) {
        const [hours, minutes] = time
        if(hours > 1) this.suntimeEl.innerHTML = `in ${hours} hours`;
        else if(hours === 1) this.suntimeEl.innerHTML = `in ${hours} hour`;
        else if(hours === 0 && minutes === 1) this.suntimeEl.innerHTML = `in ${minutes} minute`;
        else this.suntimeEl.innerHTML = `in ${minutes} minutes`;

        this.sunwordEl.innerHTML = `Sunrise:`

        // const word = time > 15 ? 'minutes' : 'hours'
        // this.suntimeEl.innerHTML = `in ${time} ${word}`
        // this.suntimeEl.setAttribute('title', 'Nautical sunrise')
    }

    // ================================================================================================

    // rendering .weather__temp-main & .weather__description
    renderTempAndDesc(temp, desc) {
        this.airTempEl.innerHTML = `${Math.floor(temp)}°C`
        this.weatherDescriptionEl.innerHTML = `${desc}`
    }

    // ================================================================================================

    // rendering .weather__wind-speed & .weather__wind-direction
    renderWind(windspeed, winddir) {
        this.windSpeedEl.innerHTML = `${windspeed} km/h,`
        this.windDirectionEl.innerHTML = `${winddir}`
        this.windTitleEl.innerHTML = `Wind:`
    }

    // ================================================================================================

    // rendering .weather__uv-index
    renderUvIndex(index) {
        this.uvIndexEl.innerHTML = index.toFixed(1)
        this.uvTitleEl.innerHTML = `UV Index:`
    }

    // ================================================================================================

    // rendering .time-icon
    renderTimeIcon(time) {
        const [hrs, min] = time
        let icon = ''
        if((hrs >= 0 && hrs < 7) || hrs === 24) icon = nightIcon;
        if(hrs >= 7 && hrs < 12) icon = morningIcon;
        if(hrs >= 12 && hrs < 18) icon = dayIcon;
        if(hrs >= 18 && hrs <= 23) icon = eveningIcon;
        
        this.timeboxIconEl.innerHTML = icon
    }

    // ================================================================================================

    // rendering .time-day
    renderDayTime(daytime) {
        this.timeOfTheDayEl.innerHTML = daytime
    }

    // ================================================================================================

    // rendering .weather__updated-time
    renderUpdatedAt(timeString, dateString) {
        this.updatedAtEl.innerHTML = timeString
        this.updatedAtEl.setAttribute('title', `${dateString} at ${timeString}`)
        this.updatedTitleEl.innerHTML = `Updated at`
    }

    // ================================================================================================

    showBackgroundVideo() {
        // this.videoEl.setAttribute('src', videoDayClearSky)
        this.videoEl.setAttribute('src', videoNightClearSky)
        // this.videoEl.setAttribute('src', videoEveningSky)
        this.videoEl.play()
    }

    // ================================================================================================

    // rendering .weather__icon
    renderBigIcon(icon) { 
        this.bigIconEl.innerHTML = ``
        const img = document.createElement('img')
        img.src = `${icon}`
        this.bigIconEl.appendChild(img)
    }

    // ================================================================================================

    // rendering .weather__temp-feels
    renderFeelsLike(temp) {
        this.feelsLikeEl.innerHTML = `Feels like ${temp}°C`
    }

    // ================================================================================================

    // rendering .weather__precipitation-details
    renderPrecipitation([precipitationProbability, precipitation, rain, showers, snowDepth, snowfall]) {
        console.log(`renderPrecipitation:`, precipitationProbability, precipitation, rain, showers, snowDepth, snowfall)
        const valuesMap = {
            mm0: `No precipitation`,  // mm0 means 0 mm
            mm05: `Scattered droplets`,
            mm1: `Light rain`, // 1–5 mm
            mm5: `Moderate rain`, // 5–15 mm
            mm15: `Heavy rain` // 15+ mm
        }
        let toRender = `<span title="Precipitation probability">${precipitationProbability}%</span>`
        if(precipitation === 0 && precipitationProbability === 0) toRender += `, ${valuesMap.mm0}`;
        if(precipitation < 1) toRender += `, ${valuesMap.mm05}`;
        if(precipitation >= 1 && precipitation < 5) toRender += `, ${valuesMap.mm1}`;
        if(precipitation >= 5 && precipitation < 15) toRender += `, ${valuesMap.mm5}`;
        if(precipitation >= 15) toRender += `, ${valuesMap.mm15}`;
        this.precipitationEl.innerHTML = toRender

        this.precipitationTitleEl.innerHTML = `Precipitation:`
    }

    // ================================================================================================

    // rendering .weather__hours
    renderHourly(obj) {    // 'obj' is an obj of props selected by me for the upcoming 48h
        const amountOfHourItems = 6 // how many of such items in the UI to render
        const hoursNow = new Date().getHours()
        // NOTE: in `obj.time` (is an array), there are 48 strings representing 48 hours, it starts at now-hours (index 0)

        // iterating and creating a long string of new elements to render
        const elementsToRender = obj.time.slice(1).map((timeItem, i) => {   // NOTE: all of those arrays (like 'time' in 'obj') have the same length; slicing one to get the next hour
            if(i > amountOfHourItems-1) return  // return only <amountOfHourItems> elements to render
            // console.log(timeItem, obj.humidity[i+1])
            return this.renderHour(timeItem, obj.tempGeneral[i+1], obj.tempFeelsLike[i+1], obj.weathercodes[i+1], obj.precipitationProbability[i+1], obj.humidity[i+1], obj.cloudCover[i+1])
        }).join('')

        this.hourlyBoxEl.innerHTML = elementsToRender
        this.hourlyTitleEl.innerHTML = `Hourly`
    }

    // ================================================================================================

    // a dependency of `renderHourly`
    renderHour(time, tempGeneral, tempFeelsLike, description, precipitation, humidity, cloudCover) {   
        
        return `<div class="weather__hour">
                    <div class="weather__hour-time"><span>${timeIcon}</span>${time}</div>
                    <div class="weather__hour-temp">${Math.floor(tempGeneral)}°C <span title="Feels like">(${Math.floor(tempFeelsLike)}°C)</span></div>
                    <div class="weather__hour-description" title="${description}">${description}</div>
                    <div class="weather__hour-precipitation" title="Precipitation"><span>${precipitationIcon}</span> <span title="Precipitation probability">${precipitation}%</span></div>
                    <div class="weather__hour-row">
                    <div class="weather__hour-humidity" title="Humidity"><span>${humidityIcon}</span> ${humidity}%</div>
                    <div class="weather__hour-clouds" title="Cloud cover"><span>${cloudCoverIcon}</span> ${cloudCover}%</div>
                    </div>
                </div>`
    }

    // ================================================================================================

    // rendering .weather__days
    renderDaily(obj) {
        const amountOfDayItems = 3 // how many of such items in the UI to render
        const todayFormatted = `${new Date().getFullYear()}-${(new Date().getMonth()+1).toString().padStart(2,0)}-${(new Date().getDate()).toString().padStart(2,0)}`
        let indexOfToday = obj.time.findIndex(x => x === todayFormatted)  // decrementing because we're incrementing it in the loop below

        // iterating and creating a long string of new elements to render
        const elementsToRender = obj.time.map((el, index) => {    // all of those arrays (like 'time' in 'obj') have the same length
            if(index > amountOfDayItems-1) return   // return only <amountOfDayItems> elements to render
            indexOfToday += 1
            return this.renderDay(index, 
                obj.temperature_2m_min[indexOfToday], 
                obj.temperature_2m_max[indexOfToday], 
                obj.apparent_temperature_max[indexOfToday], 
                obj.apparent_temperature_min[indexOfToday],
                obj.weathercodes[indexOfToday],
                obj.uv_index_max[indexOfToday],
                obj.sunrise[indexOfToday],
                obj.sunset[indexOfToday],
                obj.precipitation_probability_max[indexOfToday],
                obj.daylight_duration[indexOfToday],
                obj.precipitation_hours[indexOfToday],
                obj.sunshine_duration[indexOfToday],
                obj.time[indexOfToday])
        }).join('')

        this.dailyBoxEl.innerHTML = elementsToRender
        this.dailyTitleEl.innerHTML = `Daily`
    }

    // ================================================================================================

    // a dependency of `renderDaily`
    renderDay(index, tempMin, tempMax, tempFeelLikeMax, tempFeelLikeMin, desc, uv, sunrise, sunset, precipitationProbability, daylightDuration, precipitationHours, sunshineDuration, date) {    
        const dayNames = [`Tomorrow`, `The Day After Tomorrow`, `In 3 Days`, `In 4 Days`, `In 5 Days`, `In 6 Days`]
        const dateFormatted = date.split('-').reverse().join('/').replace('/20','/')
        const daylightDur = `${daylightDuration.split(' ')[0]}h ${daylightDuration.split(' ')[1]}m`
        const sunshineDur = `${sunshineDuration.split(' ')[0]}h ${sunshineDuration.split(' ')[1]}m`

        return `<div class="weather__day">
                    <div class="weather__day-name">${dayNames[index]} (${dateFormatted})</div>
                    <div class="weather__day-temp">${tempMin}-${tempMax}°C <span>(${tempFeelLikeMin}-${tempFeelLikeMax}°C)</span></div>
                    <div class="weather__day-description" title="${desc}">${desc}</div>

                    <div class="weather__day-line">
                        <div class="weather__day-uv" title="UV index"><span></span>${uv.toFixed(1)}</div>
                        <span class="weather__day-daylight" title="Daylight duration"><span>${lightbulbIcon}</span> ${daylightDur}</span>                        
                        <span class="weather__day-sunshine" title="Sunshine duration"><span>${sunIcon}</span>  ${sunshineDur}</span>                        
                    </div>
                    <div class="weather__day-sun">
                        <span class="weather__day-sunrise" title="Sunrise"><span>${sunriseIcon}</span>${sunrise}</span>
                        <span class="weather__day-sunset" title="Sunset"><span>${sunsetIcon}</span>${sunset}</span>
                    </div>
                    <div class="weather__day-precipitation" title="Precipitation probability"><span>${precipitationIcon}</span>${precipitationProbability}%</div>
                </div>`
    }

    // ================================================================================================

    // rendering .weather__humidity-el
    renderHumidity(value) {
        this.humidityEl.innerHTML = value + '%'
        this.humidityTitleEl.innerHTML = `Humidity:`
    }

    // ================================================================================================

    // rendering .weather__humidity-cloud-cover-el
    renderCloudCover(value) {
        this.cloudCoverEl.innerHTML = value + '%'
        this.cloudCoverEl.setAttribute('title', `The percentage of cloud coverage`)
        this.cloudCoverTitleEl.innerHTML = `Cloud cover:`
    }

    // ================================================================================================

    // rendering .weather__humidity-light-el & .weather__humidity-sun-el
    renderDaylightSunshine(daylightDuration, sunshineDuration) {
        this.lightEl.innerHTML = `<span title="Daylight duration">${daylightDuration}</span>`
        this.sunEl.innerHTML = `<span title="Sunshine duration">${sunshineDuration}</span>`
        this.daylightTitleEl.innerHTML = `Daylight Duration:`
        this.sunshineTitleEl.innerHTML = `Sunshine Duration:`
    }

    // ================================================================================================

    toggleSpinner(flag='show') {
        if(flag==='hide') {
            document.querySelector('.spinner-wrapper').remove()
        } else {
            const div = document.createElement('div')
            div.classList.add('spinner-wrapper')
            div.innerHTML = `<div class="spinner-pulse"></div>`
            document.body.appendChild(div)
        }
    }

    // ================================================================================================

    renderChangeLocBtn() {
        this.changeLocBtnBoxEl.innerHTML = `<button class="change-location-btn">Change Location</button>`
    }

    // ================================================================================================

}

export default View