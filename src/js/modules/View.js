import videoNightClearSky from '../../vid/night-clear-sky.mp4';
import videoDayClearSky from '../../vid/day-clear-sky.mp4';
import videoEveningSky from '../../vid/evening-sky.mp4';
import { sunriseIcon, sunsetIcon, precipitationIcon, lightbulbIcon, sunIcon, timeIcon, humidityIcon, cloudCoverIcon, eveningIcon, nightIcon, morningIcon, dayIcon } from './view-dependencies/icons.js'

class View {
    constructor() {
        this.locationEl = document.querySelector('.weather__place')
        this.coordsEl = document.querySelector('.weather__coords')
        this.timeEl = document.querySelector('.time-element')
        this.sunsetEl = document.querySelector('.sunset-time')
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
        this.celsiusSign = "°C"
        this.fahrenheitSign = "°F"
        this.latitudeSign = `° N`
        this.longitudeSign = `° E`
        this.showBackgroundVideo()
    }

    // ================================================================================================

    renderLocationAndCoords(obj) {
        const {city, continent, country, flag, coords} = obj
        this.locationEl.innerHTML = `${city}, <span class="weather__country">${country}<span class="weather__flag">${flag}</span></span>, ${continent}, Terra`
        this.coordsEl.innerHTML = `(${coords.lat.toFixed(2)}° N, ${coords.lng.toFixed(2)}° E)`
    }

    // ================================================================================================

    renderTimeElement(timeArr) {
        let [hours, minutes] = timeArr
        if(hours===24) hours = 0
        this.timeEl.innerHTML = `${hours}<span>:</span>${minutes.toString().padStart(2,0)}`
    }

    // ================================================================================================

    renderSunrise(time) {
        const [hours, minutes] = time
        if(hours > 1) this.sunsetEl.innerHTML = `in ${hours} hours`
        else if(hours === 1) this.sunsetEl.innerHTML = `in ${hours} hour`
        else if(hours === 0 && minutes === 1) this.sunsetEl.innerHTML = `in ${minutes} minute`
        else this.sunsetEl.innerHTML = `in ${minutes} minutes`

        // const word = time > 15 ? 'minutes' : 'hours'
        // this.sunsetEl.innerHTML = `in ${time} ${word}`
        // this.sunsetEl.setAttribute('title', 'Nautical sunrise')
    }

    // ================================================================================================

    renderTempAndDesc(temp, desc) {
        this.airTempEl.innerHTML = `${Math.floor(temp)}°C`
        this.weatherDescriptionEl.innerHTML = `${desc}`
    }

    // ================================================================================================

    renderWind(windspeed, winddir) {
        this.windSpeedEl.innerHTML = `${windspeed} km/h,`
        this.windDirectionEl.innerHTML = `${winddir}`
    }

    // ================================================================================================

    renderUvIndex(index) {
        this.uvIndexEl.innerHTML = index
    }

    // ================================================================================================

    renderTimeIcon(time) {
        const [hrs, min] = time
        let icon = ''
        if((hrs >= 0 && hrs < 7) || hrs === 24) {
            icon = nightIcon
        }
        if(hrs >= 7 && hrs < 12) {
            icon = morningIcon
        }
        if(hrs >= 12 && hrs < 18) {
            icon = dayIcon
        }
        if(hrs >= 18 && hrs <= 23) {
            icon = eveningIcon
        }
        
        this.timeboxIconEl.innerHTML = icon
    }

    // ================================================================================================

    renderDayTime(daytime) {
        this.timeOfTheDayEl.innerHTML = daytime
    }

    // ================================================================================================

    renderUpdatedAt(timeString, dateString) {
        this.updatedAtEl.innerHTML = timeString
        this.updatedAtEl.setAttribute('title', `${dateString} at ${timeString}`)
    }

    // ================================================================================================

    showBackgroundVideo() {
        // this.videoEl.setAttribute('src', videoDayClearSky)
        this.videoEl.setAttribute('src', videoNightClearSky)
        // this.videoEl.setAttribute('src', videoEveningSky)
        this.videoEl.play()
    }

    // ================================================================================================

    renderBigIcon(icon) { 
        this.bigIconEl.innerHTML = ``
        const img = document.createElement('img')
        img.src = `${icon}`
        this.bigIconEl.appendChild(img)
    }

    // ================================================================================================

    renderFeelsLike(temp) {
        this.feelsLikeEl.innerHTML = `Feels like ${temp}°C`
    }

    // ================================================================================================

    renderPrecipitation([precipitationProbability, precipitation, rain, showers, snowDepth, snowfall]) {
        let toRender = ''
        if(precipitation === 0 && precipitationProbability === 0) toRender = `No precipitation (0%)`
        this.precipitationEl.innerHTML = toRender
    }

    // ================================================================================================

    renderHourly(obj) {
        const amountOfHourItems = 6 // how many of such items in the UI to render

        // iterating and creating a long string of new elements to render
        const elementsToRender = obj.time.map((timeItem, i) => {   // all of those arrays (like 'time' in 'obj') have the same length
            if(i > amountOfHourItems-1) return  // return only <amountOfHourItems> elements to render
            return this.renderHour(timeItem, obj.tempGeneral[i], obj.tempFeelsLike[i], obj.weathercodes[i], obj.precipitation[i], obj.humidity
[i], obj.cloudCover[i])
        }).join('')

        this.hourlyBoxEl.innerHTML = elementsToRender
    }

    // ================================================================================================

    renderHour(time, tempGeneral, tempFeelsLike, description, precipitation, humidity, cloudCover) {   // a dependency of `renderHourly`
        
        return `<div class="weather__hour">
                    <div class="weather__hour-time"><span>${timeIcon}</span>${time}</div>
                    <div class="weather__hour-temp">${Math.floor(tempGeneral)}°C <span title="Feels like">(${Math.floor(tempFeelsLike)}°C)</span></div>
                    <div class="weather__hour-description">${description}</div>
                    <div class="weather__hour-precipitation" title="Precipitation"><span>${precipitationIcon}</span> ${precipitation}%</div>
                    <div class="weather__hour-row">
                    <div class="weather__hour-humidity" title="Humidity"><span>${humidityIcon}</span> ${humidity}%</div>
                    <div class="weather__hour-clouds" title="Cloud cover"><span>${cloudCoverIcon}</span> ${cloudCover}%</div>
                    </div>
                </div>`
    }

    // ================================================================================================

    renderDaily(obj) {
        console.log(obj)
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
    }

    // ================================================================================================

    // a dependency of `renderDaily`:
    renderDay(index, tempMin, tempMax, tempFeelLikeMax, tempFeelLikeMin, desc, uv, sunrise, sunset, precipitationProbability, daylightDuration, precipitationHours, sunshineDuration, date) {    
        const dayNames = [`Tomorrow`, `The Day After Tomorrow`, `In 3 Days`, `In 4 Days`, `In 5 Days`, `In 6 Days`]
        const dateFormatted = date.split('-').reverse().join('/').replace('/20','/')
        const daylightDur = `${daylightDuration.split(' ')[0]}h ${daylightDuration.split(' ')[1]}m`
        const sunshineDur = `${sunshineDuration.split(' ')[0]}h ${sunshineDuration.split(' ')[1]}m`

        return `<div class="weather__day">
                    <div class="weather__day-name">${dayNames[index]} (${dateFormatted})</div>
                    <div class="weather__day-temp">${tempMin}-${tempMax}°C <span>(${tempFeelLikeMin}-${tempFeelLikeMax}°C)</span></div>
                    <div class="weather__day-description">${desc}</div>

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

}

export default View