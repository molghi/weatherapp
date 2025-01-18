import { sunriseIcon, sunsetIcon, precipitationIcon, lightbulbIcon, sunIcon, timeIcon, humidityIcon, cloudCoverIcon, eveningIcon, nightIcon, morningIcon, dayIcon, houseIcon, plusIcon, globeIcon } from './view-dependencies/icons.js'

class View {
    constructor() {
        this.weatherBoxEl = document.querySelector('.weather')
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
        this.videoBoxEl = document.querySelector('.video-box')
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
        this.mapDiv = document.querySelector('#map')

        this.celsiusSign = "°C"
        this.fahrenheitSign = "°F"
        this.latitudeSign = `° N`
        this.longitudeSign = `° E`
        this.offsetInSeconds = 0

        this.nowHours = 0
        this.nowMinutes = 0

        this.boundCloseModal = this.closeModal.bind(this); // Storing bound function

        this.clickHandler = this.clickHandler.bind(this);
    }

    // ================================================================================================

    // rendering .weather__place & .weather__coords
    renderLocationAndCoords(obj) {
        let {city, continent, country, flag, coords, timezone} = obj
        city = city ? city : ''
        continent = continent ? continent : ''
        country = country ? country : ''
        flag = flag ? flag : ''
        coords = coords ? coords : ''
        if(!city && timezone.name) city = timezone.name.split('/')[1].replaceAll('_','')
        this.locationEl.innerHTML = `${city}, <span class="weather__country">${country}<span class="weather__flag">${flag}</span></span>, ${continent}, Terra`
        this.coordsEl.innerHTML = `(${coords?.lat.toFixed(2)}° N, ${coords?.lng.toFixed(2)}° E)`
        this.locationTitleEl.innerHTML = `Location:`
        this.addTopIcons()
    }
    
    // ================================================================================================
    
    // adding the Make Primary and Add to Cities List btn-icons
    addTopIcons() {
        const parentEl = document.querySelector('.weather__top')
        const div = document.createElement('div')
        div.classList.add('weather__icons')
        div.innerHTML = `<button title="Make this your primary location" class="btn-make-primary">${houseIcon}</button>
<button title="Add this location to your list" class="btn-add-location">${plusIcon}</button>`
        parentEl.appendChild(div)
    }

    // ================================================================================================

    // rendering .time-element
    renderTimeElement(dateTodayFormatted, timeArr) {
        let [hours, minutes] = timeArr
        // dateTodayFormatted = `${new Date().getDate().toString().padStart(2,0)}/${(new Date().getMonth()+1).toString().padStart(2,0)}/${new Date().getFullYear()}`
        const minutesFormatted = minutes.toString().padStart(2,0)
        if(hours>=24) hours -= 0
        this.timeEl.innerHTML = `${hours}<span>:</span>${minutesFormatted}`
        this.timeEl.setAttribute('title', `Location date-time: ${dateTodayFormatted}  ̶ ${hours}:${minutesFormatted}`)
    }

    // ================================================================================================

    // rendering .sun-time
    renderSuntime(time, type='sunrise', actualTime='') {   // 'time' is an array, 'type' is a string
        const [hours, minutes] = time
        if(hours > 1) this.suntimeEl.innerHTML = `in ${hours} hours`;
        else if(hours === 1) this.suntimeEl.innerHTML = `in ${hours} hour`;
        else if(hours === 0 && minutes === 1) this.suntimeEl.innerHTML = `in ${minutes} minute`;
        else this.suntimeEl.innerHTML = `in ${minutes} minutes`;

        if(actualTime.startsWith('0')) actualTime = actualTime.replace('0', '');
        this.suntimeEl.setAttribute('title', `At ${actualTime}`);

        if(type==='sunset') {
            this.sunwordEl.innerHTML = `Sunset:`
        } else this.sunwordEl.innerHTML = `Sunrise:`

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
        this.updatedAtEl.setAttribute('title', `Updated at ${dateString} at ${timeString} (local time)`)
        this.updatedTitleEl.innerHTML = `Updated at`
    }

    // ================================================================================================

    showBackgroundVideo(path) {
        this.videoBoxEl.style.animation = 'fadein 5s linear'
        this.filterVideo('default') // reset video filters
        this.videoEl.pause(); // Pause current video
        this.videoEl.setAttribute('src', path)
        this.videoEl.currentTime = 0; // Start from the beginning

        setTimeout(() => {
            this.videoBoxEl.style.animation = 'none'
        }, 5000);

        this.videoEl.play().catch((error) => {
            console.error('💥💥💥 Error playing bg video:', error);
            this.videoEl.setAttribute('src', 'assets/videos/foggy-forest-2.mp4'); // Fallback to default video
            this.videoEl.play();
        })
    }

    // ================================================================================================

    filterVideo(flag) {
        if(flag==='reset' || flag==='default') {
            return this.videoEl.style.filter = 'brightness(0.3) blur(1px)'
        }
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
        if(precipitation > 0 && precipitation < 1) toRender += `, ${valuesMap.mm05}`;
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
    renderDaily(dateNowAtLocation, obj) {
        const amountOfDayItems = 3 // how many of such items in the UI to render
        let indexOfToday = obj.time.findIndex(x => x === dateNowAtLocation)  // decrementing because we're incrementing it in the loop below

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
                    <div class="weather__day-temp">${tempMin} - ${tempMax}°C &nbsp;<span>(${tempFeelLikeMin} - ${tempFeelLikeMax}°C)</span></div>
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
            if(document.querySelector('.spinner-wrapper')) document.querySelector('.spinner-wrapper').remove()
        } else {
            const div = document.createElement('div')
            div.classList.add('spinner-wrapper')
            div.innerHTML = `<div class="spinner-pulse"></div>`
            document.body.appendChild(div)
        }
    }

    // ================================================================================================

    toggleLittleSpinner(flag='show', parentElement) {
        if(flag==='hide') {
            document.querySelector('.spinner-little-wrapper').remove()
        } else {
            const div = document.createElement('div')
            div.classList.add('spinner-little-wrapper')
            div.innerHTML = `<div class="spinner-little-pulse"></div>`
            parentElement.appendChild(div)
        }
    }

    // ================================================================================================

    renderChangeLocBtn() {
        document.querySelector('.change-location-btn').textContent = `Change Location`
        // this.changeLocBtnBoxEl.innerHTML = `<button class="change-location-btn">Change Location</button>`
    }

    // ================================================================================================

    renderMapBtn() {
        document.querySelector('.show-map-btn').innerHTML = globeIcon
        // const html = `<button class="show-map-btn" title="Show the map">${globeIcon}</button>`
        // this.changeLocBtnBoxEl.insertAdjacentHTML('afterbegin', html)
    }

    // ================================================================================================

    handleTemperatureClick(handler) {
        this.weatherBoxEl.addEventListener('click', function(e) {
            if(!e.target.closest('.weather__temp') && !e.target.closest('.weather__day-temp') && !e.target.closest('.weather__hour-temp')) return  
            handler()
        })
    }

    // ================================================================================================

    showError(text) {
        const div = document.createElement('div')
        div.classList.add('error', 'message-error')
        div.innerHTML = `<div><span>Sorry, some error happened... Cannot show the weather now.</span><span>Try again later.</span></div>`;
        if(text) div.innerHTML = `<div>${text}</div>`;
        document.body.appendChild(div)
    }

    // ================================================================================================

    rerenderDegrees(flag, obj) {
        const allHourlyTemps = [...document.querySelectorAll('.weather__hour-temp')]
        const allDailyTemps = [...document.querySelectorAll('.weather__day-temp')]
        const getHourlyTempHtml = (sign, usual, feels) => `${usual}${sign} <span title="Feels like">(${feels}${sign})</span>`
        const getDailyTempHtml = (sign, usualMin, usualMax, feelsMin, feelsMax) => `${usualMin} - ${usualMax}${sign} &nbsp;<span>(${feelsMin} - ${feelsMax}${sign})</span>`

        if(flag==='Fahrenheit') {   // setting Fahrenheit
            this.airTempEl.innerHTML = `${obj.tempNow}${this.fahrenheitSign}`   // setting the big degrees element
            this.feelsLikeEl.innerHTML = `Feels like ${obj.feelsLike}${this.fahrenheitSign}`   // setting the Feels like under it
            allHourlyTemps.forEach((hourlyTempEl, i) => {   // setting all Hourly degrees
                const usual = obj.hourly[i][0]
                const feels = obj.hourly[i][1]
                hourlyTempEl.innerHTML = getHourlyTempHtml(this.fahrenheitSign, usual, feels)
            })
            allDailyTemps.forEach((dailyTempEl, i) => {    // setting all Daily degrees
                const usualMin = obj.daily[i][0]
                const usualMax = obj.daily[i][1]
                const feelsMin = obj.daily[i][2]
                const feelsMax = obj.daily[i][3]
                dailyTempEl.innerHTML = getDailyTempHtml(this.fahrenheitSign, usualMin, usualMax, feelsMin, feelsMax)
            })
        } 
        
        else {   // setting Celsius
            this.airTempEl.innerHTML = `${Math.floor(obj.tempNow)}${this.celsiusSign}`
            this.feelsLikeEl.innerHTML = `Feels like ${Math.floor(obj.feelsLike)}${this.celsiusSign}`
            allHourlyTemps.forEach((hourlyTempEl, i) => {  
                const usual = Math.floor(obj.hourly[i][0])
                const feels = Math.floor(obj.hourly[i][1])
                hourlyTempEl.innerHTML = getHourlyTempHtml(this.celsiusSign, usual, feels)
            })
            allDailyTemps.forEach((dailyTempEl, i) => {    
                const usualMin = Math.floor(obj.daily[i][0])
                const usualMax = Math.floor(obj.daily[i][1])
                const feelsMin = Math.floor(obj.daily[i][2])
                const feelsMax = Math.floor(obj.daily[i][3])
                dailyTempEl.innerHTML = getDailyTempHtml(this.celsiusSign, usualMin, usualMax, feelsMin, feelsMax)
            })
        }
    }

    // ================================================================================================

    promptGeolocation() {
        return new Promise((resolve, reject) => {   // using promises to be able to consume it then
            if (navigator.geolocation) {  // checks whether the Geolocation API is supported by the user's browser
                navigator.geolocation.getCurrentPosition(  // navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options) // getCurrentPosition operates asynchronously.
                    (position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        // console.log(`Geoloc fetch success: Latitude: ${lat}, Longitude: ${lng}`);
                        resolve([lat, lng]); // Resolve the Promise with the coordinates
                    },
                    (error) => {
                        console.error(`Error (${error.code}): ${error.message}`);
                        reject(error); // Reject the Promise with the error
                    },
                    {
                        enableHighAccuracy: true,   // Requests more precise location information (e.g., GPS instead of Wi-Fi or cell tower data)
                        timeout: 10000,   // Specifies the maximum time (in milliseconds) the device will wait to retrieve the location. If the specified time elapses without success, the errorCallback is invoked with a timeout error.
                        maximumAge: 0,  // Determines the maximum age (in milliseconds) of cached location data. 0 means always fetch fresh data rather than using cached results.
                    }
                );
            } else {
                const error = "💥̶💥̶💥̶ Geolocation is not supported by this browser.";
                console.error(error);
                reject(new Error(error));
            }
        });
    }

    // ================================================================================================

    updateDocumentTitle(tempNow, shortDesc) { // tempFeelsLike too?
        const value = `${tempNow}${this.celsiusSign}, ${shortDesc}`
        document.title = `Weather Control: ${value}`
    }

    // ================================================================================================

    handleChangeLocationClick(handler) {
        const btn = document.querySelector('.change-location-btn')
        btn.addEventListener('click', function(e) {
            handler()
        })
    }

    // ================================================================================================

    toggleModalWindow(flag='show'){
        if(flag==='hide') {   // hiding/removing it
            document.querySelector('.modal').style.backgroundColor = 'transparent'
            document.querySelector('.modal__window').style.animation = `bounceReverse 0.1s ease-in-out forwards`
            setTimeout(() => {
                if(document.querySelector('.modal')) document.querySelector('.modal').remove()
            }, 500);
        } else { // showing it
            this.renderModalWindow()
            setTimeout(() => {
                document.querySelector('.modal__input').focus()
            }, 500);
        }
    }

    // ================================================================================================

    handleSearchCitySubmit(handler) {
        document.querySelector('.modal__form').addEventListener('submit', function(e) {
            e.preventDefault()
            const inputValue = this.querySelector('input').value
            // this.querySelector('input').value = ''
            handler(inputValue)
        })
    }

    // ================================================================================================

    renderModalWindow() {
        const div = document.createElement('div')
        div.classList.add('modal')
        div.innerHTML = `<div class="modal__window">
            <div class="modal__title">Search By City Name:</div>
            <form class="modal__form" action="#">
                <input type="text" class="modal__input" autofocus>
            </form>
            <div class="modal__close-btn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
            </div>
        </div>`
        document.body.appendChild(div)
    }

    // ================================================================================================

    renderResults(resultsObj) {
        if(!resultsObj.hasOwnProperty('results')) {   // if nothing was found:
            const html = `<div class="modal__nothing">Nothing was found</div>`
            document.querySelector('.modal__form').insertAdjacentHTML(`beforeend`, html)
            return
        }
        const div = document.createElement('div')
        div.classList.add('modal__results')
        const results = resultsObj.results.map(result => this.giveOneResultHtml(result)).join('')
        div.innerHTML = ''
        div.innerHTML = results
        document.querySelector('.modal__form').appendChild(div)
    }

    // ================================================================================================

    giveOneResultHtml(resultObj) {
        let {country, name, latitude, longitude, timezone, admin1} = resultObj
        name = name ? name : ''   // name is a city name
        admin1 = admin1 ? ', ' + admin1 : ''   // admin1 is a region/state
        country = country ? ', ' + country : ''
        timezone = timezone ? timezone : ''
        latitude = latitude ? latitude : ''
        longitude = longitude ? longitude : ''
        const fullname = `${name}${admin1}${country}`
        return `<div class="modal__result" data-lat="${latitude}" data-lng="${longitude}" data-timezone="${timezone}" title="${fullname}">
${fullname}
</div>`
    }

    // ================================================================================================

    clearModalResultsBox() {
        if(document.querySelector('.modal__results')) document.querySelector('.modal__results').remove()
        if(document.querySelector('.modal__nothing')) document.querySelector('.modal__nothing').remove()    
    }

    // ================================================================================================

    handleModalCloseBtnClick() {
        document.addEventListener('click', this.boundCloseModal)
    }

    // ================================================================================================

    closeModal(e) {
        if(e.target.classList.contains('modal')) {
            this.toggleModalWindow('hide')
            document.removeEventListener('click', this.boundCloseModal); // Remove listener after hiding modal
        }
        if(!e.target.closest('.modal__close-btn')) return 
        this.toggleModalWindow('hide')
        document.removeEventListener('click', this.boundCloseModal); // Remove listener after hiding modal
    }

    // ================================================================================================

    handleClickingResult(handler) {
        document.querySelector('.modal').addEventListener('click', function(e) {
            if(!e.target.classList.contains('modal__result')) return
            const lat = e.target.dataset?.lat
            const lng = e.target.dataset?.lng
            const timezone = e.target.dataset.timezone
            handler(lat, lng, timezone)
        })
    }

    // ================================================================================================

    // btns: Make Primary and Add a Location to the list
    handleLocationBtns(handler) {
        // this.weatherBoxEl.addEventListener('click', this.topLocationBtnsHandler)
        this.removeLocationBtnsHandler() // removing any existing listener first (because I re-render the element with these buttons frequently)
        this.boundTopLocationBtnsHandler = (e) => this.topLocationBtnsHandler(e, handler) // binding the handler to topLocationBtnsHandler and storing the reference
        this.weatherBoxEl.addEventListener('click', this.boundTopLocationBtnsHandler)
    }
    
    // ================================================================================================

    // dependency of 'handleLocationBtns'
    removeLocationBtnsHandler() {
        if (this.boundTopLocationBtnsHandler) {
            this.weatherBoxEl.removeEventListener('click', this.boundTopLocationBtnsHandler)
            this.boundTopLocationBtnsHandler = null // cleaning up reference
        }
    }

    // ================================================================================================

    topLocationBtnsHandler(e, handler) {
        if(!e.target.closest('.btn-make-primary') && !e.target.closest('.btn-add-location')) return

        const localTime = this.timeEl.textContent
        const cityName = this.locationEl.textContent.split(',')[0]
        const country = this.locationEl.textContent.split(',')[1].slice(1,-4)
        const temp = this.airTempEl.textContent
        const icon = this.bigIconEl.querySelector('img').src 
        const coords = this.coordsEl.textContent.slice(1,-1).split(',').map(x => x.trim().slice(0,-3))
        const feelsLikeTemp = this.feelsLikeEl.textContent
        const description = this.weatherDescriptionEl.textContent
        const thisLocationDataObj = { localTime, cityName, country, temp, icon, coords, feelsLikeTemp, description }

        if(e.target.closest('.btn-make-primary')) {
            handler('makePrimary', thisLocationDataObj)
        }

        if(e.target.closest('.btn-add-location')) {  // clicking on the Add Location button
            handler('addLocation', thisLocationDataObj)
        }
    }

    // ================================================================================================

    addLocation(type='addingNew', obj) {
        let localTime, cityName, country, temp, icon, coords, feelsLikeTemp, description;
        if(type === 'addingNew') {  // adding a new location upon the Add Location btn click:
            ({localTime, cityName, country, temp, icon, coords, feelsLikeTemp, description} = this.getThisLocationData())
        } else {  // rendering the existing ones:
            ({localTime, cityName, country, temp, icon, coords, feelsLikeTemp, description} = obj) // the variables are already declared, so wrapping the destructuring in parentheses to distinguish it from a block else it will err
        }
        
        const html = this.giveSmallLocationHtml(localTime, cityName, country, temp, icon, coords, feelsLikeTemp, description) 

        document.querySelector('.added-locations').insertAdjacentHTML('beforeend', html)
        
        return { localTime, cityName, country, temp, icon, coords, feelsLikeTemp, description }
    }

    // ================================================================================================

    giveSmallLocationHtml(localTime, cityName, country, temp, icon, coords, feelsLikeTemp, description) {
        return `<div class="added-location" data-coords="${coords}">
                   <button class="added-location-remove-btn">Remove</button>
                   <div class="added-location-col">
                        <div class="added-location-time">${localTime}</div>
                        <div class="added-location-city" title="${cityName}, ${country}">${cityName}</div>
                   </div>
                   <div class="added-location-col added-location-icon" title="${description}"><img src="${icon}"></div>
                   <div class="added-location-col added-location-temp" title="${feelsLikeTemp}">${temp}</div>
               </div>`
    }

    // ================================================================================================

    getThisLocationData() {
        const localTime = this.timeEl.textContent
        const cityName = this.locationEl.textContent.split(',')[0]
        const country = this.locationEl.textContent.split(',')[1].slice(1,-4)
        const temp = this.airTempEl.textContent
        const icon = this.bigIconEl.querySelector('img').src 
        const coords = this.coordsEl.textContent.slice(1,-1).split(',').map(x => x.trim().slice(0,-3))
        const feelsLikeTemp = this.feelsLikeEl.textContent
        const description = this.weatherDescriptionEl.textContent
        return { localTime, cityName, country, temp, icon, coords, feelsLikeTemp, description }
    }

    // ================================================================================================

    handleSavedLocationsClick(handler) {
        document.querySelector('.added-locations').addEventListener('click', (e) => {
            // if(!e.target.classList.contains('added-location-remove-btn')) return
            if(!e.target.closest('.added-location')) return

            if(e.target.classList.contains('added-location-remove-btn')) {    // click on remove btn --> removing the item
                handler('remove', e.target.closest('.added-location').dataset.coords)
                return
            } 

            if(e.target.closest('.added-location')) {    // click not on remove btn --> fetch weather
                handler('fetch', e.target.closest('.added-location').dataset.coords)
                return
            }
        })
    }

    // ================================================================================================

    handleMapBtnClick(handler) {
        // this.changeLocBtnBoxEl.addEventListener('click', (e) => {
        //     if(!e.target.closest('.show-map-btn')) return
        //     handler()
        // })

        // Store the handler for later use
        this.handler = handler;

        // Remove any existing event listeners
        this.changeLocBtnBoxEl.removeEventListener('click', this.clickHandler);

        // Attach the new event listener
        this.changeLocBtnBoxEl.addEventListener('click', this.clickHandler);

    }

    // The method that handles the click event
    clickHandler(e) {
        if (!e.target.closest('.show-map-btn')) return;
        if (this.handler) this.handler()
    }

    // ================================================================================================

    handleClosingMap() {
        const handleClick = (e) => {
        if (!e.target.closest('.modal__close-btn') && !e.target.classList.contains('modal--maps')) return;

        const modal = document.querySelector('.modal--maps');

        if (modal) {
            modal.style.backgroundColor = 'transparent';
            modal.querySelector('.modal__window').style.animation = `bounceReverse 0.1s ease-in-out forwards`;

            setTimeout(() => {
                this.moveMapDiv('move out')
                modal.remove();
                document.removeEventListener('click', handleClick); // Remove the event listener after cleanup
                console.log(`event listener removed`)
            }, 500);
        }
        };

        document.addEventListener('click', handleClick);
    }

    // ================================================================================================

    renderMapModal() {
        const div = document.createElement('div')
        div.classList.add('modal', 'modal--maps')
        div.innerHTML = `<div class="modal__window">
            <div class="modal__close-btn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
            </div>
        </div>`
        document.body.appendChild(div)
        this.moveMapDiv('move in')
    }

    // ================================================================================================

    moveMapDiv(flag) {
        const map = this.mapDiv
        if(flag === 'move in') {
            document.querySelector('.modal__window').appendChild(map)
        }
        if(flag === 'move out') {
            document.body.appendChild(map)
        }
    }

}

export default View