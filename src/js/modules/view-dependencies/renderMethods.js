import { sunriseIcon, sunsetIcon, precipitationIcon, lightbulbIcon, sunIcon, timeIcon, humidityIcon, cloudCoverIcon, eveningIcon, nightIcon, morningIcon, dayIcon, houseIcon, plusIcon, globeIcon } from './icons.js'

// rendering .weather__place & .weather__coords
function renderLocationAndCoords(obj, locationEl, coordsEl, locationTitleEl) {
    let {city, continent, country, flag, coords, timezone} = obj
    city = city ? city : ''
    continent = continent ? continent : ''
    country = country ? country : ''
    flag = flag ? flag : ''
    coords = coords ? coords : ''

    if(!city && timezone.name) city = timezone.name.split('/')[1].replaceAll('_','')

    locationEl.innerHTML = `${city}, <span class="weather__country">${country}<span class="weather__flag">${flag}</span></span>, ${continent}, Terra`
    coordsEl.innerHTML = `(${coords?.lat.toFixed(2)}° N, ${coords?.lng.toFixed(2)}° E)`
    locationTitleEl.innerHTML = `Location:`

    addTopIcons()
}

// ================================================================================================

// adding the Make Primary and Add to Cities List btn-icons ---> called only in 'renderLocationAndCoords'
function addTopIcons() {
    if(document.querySelector('.weather__icons')) document.querySelector('.weather__icons').remove()
    const parentEl = document.querySelector('.weather__top')
    const div = document.createElement('div')
    div.classList.add('weather__icons')
    div.innerHTML = `<button title="Make this your primary location" class="btn-make-primary">${houseIcon}</button>
<button title="Add this location to your list" class="btn-add-location">${plusIcon}</button>`
    parentEl.appendChild(div)
}

// ================================================================================================

// rendering .time-element
function renderTimeElement(dateTodayFormatted, timeArr, timeEl) {
    let [hours, minutes] = timeArr
    const minutesFormatted = minutes.toString().padStart(2,0)
    if(hours>=24) hours -= 0
    timeEl.innerHTML = `${hours}<span>:</span>${minutesFormatted}`
    timeEl.setAttribute('title', `Location date-time: ${dateTodayFormatted}  ̶ ${hours}:${minutesFormatted}`)
}

// ================================================================================================

// rendering .sun-time
function renderSuntime(time, type='sunrise', actualTime='', suntimeEl, sunwordEl) {   // 'time' is an array, 'type' is a string
    const [hours, minutes] = time
    if(hours > 1) suntimeEl.innerHTML = `in ${hours} hours`;
    else if(hours === 1) suntimeEl.innerHTML = `in ${hours} hour`;
    else if(hours === 0 && minutes === 1) suntimeEl.innerHTML = `in ${minutes} minute`;
    else suntimeEl.innerHTML = `in ${minutes} minutes`;

    if(actualTime.startsWith('0')) actualTime = actualTime.replace('0', '');
    suntimeEl.setAttribute('title', `At ${actualTime}`);

    if(type==='sunset') {
        sunwordEl.innerHTML = `Sunset:`
    } else sunwordEl.innerHTML = `Sunrise:`

    // const word = time > 15 ? 'minutes' : 'hours'
    // suntimeEl.innerHTML = `in ${time} ${word}`
    // suntimeEl.setAttribute('title', 'Nautical sunrise')
}

// ================================================================================================

// rendering .time-icon
function renderTimeIcon(time, timeboxIconEl) {
    const [hrs, min] = time
    let icon = ''
    if((hrs >= 0 && hrs < 7) || hrs === 24) icon = nightIcon;
    if(hrs >= 7 && hrs < 12) icon = morningIcon;
    if(hrs >= 12 && hrs < 18) icon = dayIcon;
    if(hrs >= 18 && hrs <= 23) icon = eveningIcon;
    
    timeboxIconEl.innerHTML = icon
}

// ================================================================================================

// rendering bg video
async function showBackgroundVideo(path, videoBoxEl, videoEl) {
    try {
        videoBoxEl.style.animation = 'fadein 5s linear';   // set animation
        filterVideo('default', videoEl);   // Reset video filters
        videoEl.pause();   // Pause current video

        videoEl.querySelector('source').setAttribute('src', path);  // set the src to the new video

        // Wait for the video to load
        await new Promise((resolve, reject) => {
            videoEl.oncanplaythrough = resolve;  // Resolves when the video is ready to play
            videoEl.onerror = reject;  // Rejects if there's an error in loading
            videoEl.load();  // This will reload the video
        });

        // Now playing the video after it's ready
        await videoEl.play();

        setTimeout(() => {
            videoBoxEl.style.animation = 'none';  // resetting animation
        }, 5000);

    } catch (error) {
        console.error('💥💥💥 Error playing bg video:', error);
        videoEl.setAttribute('src', 'assets/videos/foggy-forest-2.mp4');   // Fallback to default video
        // Wait for the fallback video to load
        await new Promise((resolve, reject) => {
            videoEl.oncanplaythrough = resolve;
            videoEl.onerror = reject;
            videoEl.load();
        });
        // Now playing the fallback video
        await videoEl.play();
    }
}

// ================================================================================================

// I call it in 'showBackgroundVideo'
function filterVideo(flag, videoEl) {
    if(flag==='reset' || flag==='default') {
        return videoEl.style.filter = 'brightness(0.3) blur(1px)'
    }
}

// ================================================================================================

// rendering .weather__icon
function renderBigIcon(icon, bigIconEl) {
    bigIconEl.innerHTML = ``
    const img = document.createElement('img')
    img.src = `${icon}`
    bigIconEl.appendChild(img)
}

// ================================================================================================

// rendering .weather__precipitation-details
function renderPrecipitation([precipitationProbability, precipitation, rain, showers, snowDepth, snowfall], precipitationEl, precipitationTitleEl) {
    console.log(`renderPrecipitation:`, precipitationProbability, precipitation, rain, showers, snowDepth, snowfall)

    const valuesMapRain = {
        mm0: `No precipitation`,  // mm0 means 0 mm
        mm05: `Scattered droplets`,
        mm1: `Light rain`, // 1–5 mm
        mm5: `Moderate rain`, // 5–15 mm
        mm15: `Heavy rain` // 15+ mm
    }
    const valuesMapSnow = {
        cm0: `No snow`,            // cm0 means 0 cm
        cm05: `Light flurries`,    // 0–2 cm
        cm2: `Light snow`,         // 2–5 cm
        cm5: `Moderate snow`,      // 5–10 cm
        cm10: `Heavy snow`         // 10+ cm
    }

    let toRender = `<span title="Precipitation probability">${precipitationProbability}%</span>`

    if(rain!==0 && precipitation === 0 && precipitationProbability === 0) toRender += `, ${valuesMapRain.mm0}`;
    if(rain!==0 && precipitation > 0 && precipitation < 1) toRender += `, ${valuesMapRain.mm05}`;
    if(rain!==0 && precipitation >= 1 && precipitation < 5) toRender += `, ${valuesMapRain.mm1}`;
    if(rain!==0 && precipitation >= 5 && precipitation < 15) toRender += `, ${valuesMapRain.mm5}`;
    if(rain!==0 && precipitation >= 15) toRender += `, ${valuesMapRain.mm15}`;
    
    if(snowfall>0 && precipitation === 0 && precipitationProbability === 0) toRender += `, ${valuesMapSnow.cm0}`;
    if(snowfall>0 && precipitation > 0 && precipitation < 1) toRender += `, ${valuesMapSnow.cm05}`;
    if(snowfall>0 && precipitation >= 1 && precipitation < 5) toRender += `, ${valuesMapSnow.cm2}`;
    if(snowfall>0 && precipitation >= 5 && precipitation < 10) toRender += `, ${valuesMapSnow.cm5}`;
    if(snowfall>0 && precipitation >= 10) toRender += `, ${valuesMapSnow.cm10}`;
    
    precipitationEl.innerHTML = toRender

    precipitationTitleEl.innerHTML = `Precipitation:`
}

// ================================================================================================

// rendering .weather__hours
function renderHourly(obj, hourlyBoxEl, hourlyTitleEl) {    // 'obj' is an obj of props selected by me for the upcoming 48h
    const amountOfHourItems = 6 // how many of such items in the UI to render
    const hoursNow = new Date().getHours()
    // NOTE: in `obj.time` (is an array), there are 48 strings representing 48 hours, it starts at now-hours (index 0)

    // iterating and creating a long string of new elements to render
    const elementsToRender = obj.time.slice(1).map((timeItem, i) => {   // NOTE: all of those arrays (like 'time' in 'obj') have the same length; slicing one to get the next hour
        if(i > amountOfHourItems-1) return  // return only <amountOfHourItems> elements to render
        return renderHour(timeItem, obj.tempGeneral[i+1], obj.tempFeelsLike[i+1], obj.weathercodes[i+1], obj.precipitationProbability[i+1], obj.humidity[i+1], obj.cloudCover[i+1])
    }).join('')

    hourlyBoxEl.innerHTML = elementsToRender
    hourlyTitleEl.innerHTML = `Hourly`
}

// ================================================================================================

// a dependency of `renderHourly`
function renderHour(time, tempGeneral, tempFeelsLike, description, precipitation, humidity, cloudCover) {   
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
function renderDaily(dateNowAtLocation, obj, dailyBoxEl, dailyTitleEl) {
    const amountOfDayItems = 3 // how many of such items in the UI to render
    let indexOfToday = obj.time.findIndex(x => x === dateNowAtLocation)  // decrementing because we're incrementing it in the loop below

    // iterating and creating a long string of new elements to render
    const elementsToRender = obj.time.map((el, index) => {    // all of those arrays (like 'time' in 'obj') have the same length
        if(index > amountOfDayItems-1) return   // return only <amountOfDayItems> elements to render
        indexOfToday += 1
        return renderDay(index, 
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

    dailyBoxEl.innerHTML = elementsToRender
    dailyTitleEl.innerHTML = `Daily`
}

// ================================================================================================

// a dependency of `renderDaily`
function renderDay(index, tempMin, tempMax, tempFeelLikeMax, tempFeelLikeMin, desc, uv, sunrise, sunset, precipitationProbability, daylightDuration, precipitationHours, sunshineDuration, date) {    
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

// rendering .weather__humidity-light-el & .weather__humidity-sun-el
function renderDaylightSunshine(daylightDuration, sunshineDuration, lightEl, sunEl, daylightTitleEl, sunshineTitleEl) {
    lightEl.innerHTML = `<span title="Daylight duration">${daylightDuration}</span>`
    sunEl.innerHTML = `<span title="Sunshine duration">${sunshineDuration}</span>`
    daylightTitleEl.innerHTML = `Daylight Duration:`
    sunshineTitleEl.innerHTML = `Sunshine Duration:`
}

// ================================================================================================

// showing a big error if fetching failed
function showError(text) {
    const div = document.createElement('div')
    div.classList.add('error', 'message-error')
    div.innerHTML = `<div><span>Sorry, some error happened... Cannot show the weather now.</span><span>Try again later.</span></div>`;
    if(text) div.innerHTML = `<div>${text}</div>`;
    document.body.appendChild(div)
}

// ================================================================================================

// changing Fahr to Cels and back
function rerenderDegrees(flag, obj, airTempEl, fahrenheitSign, feelsLikeEl, celsiusSign, savedLocTempCelsius) {
    const allHourlyTemps = [...document.querySelectorAll('.weather__hour-temp')]
    const allDailyTemps = [...document.querySelectorAll('.weather__day-temp')]
    const getHourlyTempHtml = (sign, usual, feels) => `${usual}${sign} <span title="Feels like">(${feels}${sign})</span>`
    const getDailyTempHtml = (sign, usualMin, usualMax, feelsMin, feelsMax) => `${usualMin} - ${usualMax}${sign} &nbsp;<span>(${feelsMin} - ${feelsMax}${sign})</span>`

    changeTempSavedLocations(flag, fahrenheitSign, celsiusSign, savedLocTempCelsius)

    if(flag==='Fahrenheit') {   // setting Fahrenheit
        airTempEl.innerHTML = `${obj.tempNow}${fahrenheitSign}`   // setting the big degrees element
        feelsLikeEl.innerHTML = `Feels like ${obj.feelsLike}${fahrenheitSign}`   // setting the Feels like under it
        allHourlyTemps.forEach((hourlyTempEl, i) => {   // setting all Hourly degrees
            const usual = obj.hourly[i][0]
            const feels = obj.hourly[i][1]
            hourlyTempEl.innerHTML = getHourlyTempHtml(fahrenheitSign, usual, feels)
        })
        allDailyTemps.forEach((dailyTempEl, i) => {    // setting all Daily degrees
            const usualMin = obj.daily[i][0]
            const usualMax = obj.daily[i][1]
            const feelsMin = obj.daily[i][2]
            const feelsMax = obj.daily[i][3]
            dailyTempEl.innerHTML = getDailyTempHtml(fahrenheitSign, usualMin, usualMax, feelsMin, feelsMax)
        })
    } else {   // setting Celsius
        airTempEl.innerHTML = `${Math.floor(obj.tempNow)}${celsiusSign}`
        feelsLikeEl.innerHTML = `Feels like ${Math.floor(obj.feelsLike)}${celsiusSign}`
        allHourlyTemps.forEach((hourlyTempEl, i) => {  
            const usual = Math.floor(obj.hourly[i][0])
            const feels = Math.floor(obj.hourly[i][1])
            hourlyTempEl.innerHTML = getHourlyTempHtml(celsiusSign, usual, feels)
        })
        allDailyTemps.forEach((dailyTempEl, i) => {    
            const usualMin = Math.floor(obj.daily[i][0])
            const usualMax = Math.floor(obj.daily[i][1])
            const feelsMin = Math.floor(obj.daily[i][2])
            const feelsMax = Math.floor(obj.daily[i][3])
            dailyTempEl.innerHTML = getDailyTempHtml(celsiusSign, usualMin, usualMax, feelsMin, feelsMax)
        })
    }
}

// ================================================================================================

// changing temp units in Saved Locations: from Celsius to F and back --- I call it in 'rerenderDegrees'
function changeTempSavedLocations(flag, fahrenheitSign, celsiusSign, savedLocTempCelsius) {

        const inFahrenheit = savedLocTempCelsius.map((oneElData,i) => {
            const val1 = Math.floor((oneElData[0] * 9/5) + 32)
            const val2 = Math.floor((oneElData[1] * 9/5) + 32)
            return [val1, val2]
        })

        if(flag === 'Fahrenheit') {
            [...document.querySelectorAll('.added-location')].forEach((locEl, i) => {
                locEl.querySelector('.added-location-temp').innerHTML = `${inFahrenheit[i][0]}${fahrenheitSign}`
                locEl.querySelector('.added-location-temp').setAttribute('title', `Feels like ${inFahrenheit[i][1]}${fahrenheitSign}`)
            })
        } else {
            [...document.querySelectorAll('.added-location')].forEach((locEl, i) => {
                locEl.querySelector('.added-location-temp').innerHTML = `${savedLocTempCelsius[i][0]}${celsiusSign}`
                locEl.querySelector('.added-location-temp').setAttribute('title', `Feels like ${savedLocTempCelsius[i][1]}${celsiusSign}`)
            })
        }

    }

// ================================================================================================

// rendering modal window
function renderModalWindow() {
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

// rendering the results in search city form upon submitting it
function renderResults(resultsObj) {
        if(!resultsObj.hasOwnProperty('results')) {   // if nothing was found:
            const html = `<div class="modal__nothing">Nothing was found</div>`
            document.querySelector('.modal__form').insertAdjacentHTML(`beforeend`, html)
            return
        }

        const div = document.createElement('div')
        div.classList.add('modal__results')

        const results = resultsObj.results.map(result => giveOneResultHtml(result)).join('')
        div.innerHTML = ''
        div.innerHTML = results
        document.querySelector('.modal__form').appendChild(div)
    }

// ================================================================================================

// I call it in 'renderResults'
function giveOneResultHtml(resultObj) {
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

// adding new Saved Location
function addLocation(type='addingNew', obj, thisLocData) {
    let localTime, cityName, country, temp, icon, coords, feelsLikeTemp, description;
    if(type === 'addingNew') {  // adding a new location upon the Add Location btn click:
        ({localTime, cityName, country, temp, icon, coords, feelsLikeTemp, description} = thisLocData)
    } else {  // rendering the existing ones:
        ({localTime, cityName, country, temp, icon, coords, feelsLikeTemp, description} = obj) // the variables are already declared, so wrapping the destructuring in parentheses to distinguish it from a block else it will err
    }
    
    const html = giveSmallLocationHtml(localTime, cityName, country, temp, icon, coords, feelsLikeTemp, description) 

    document.querySelector('.added-locations').insertAdjacentHTML('beforeend', html)
    
    return { localTime, cityName, country, temp, icon, coords, feelsLikeTemp, description }
}

// ================================================================================================

// I call it in 'addLocation'
function giveSmallLocationHtml(localTime, cityName, country, temp, icon, coords, feelsLikeTemp, description) {
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

// rendering map modal
function renderMapModal() {
    const div = document.createElement('div')
    div.classList.add('modal', 'modal--maps')
    div.innerHTML = `<div class="modal__window">
        <div class="modal__close-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
        </div>
    </div>`
    document.body.appendChild(div)
}

// ================================================================================================

// rendering .weather__temp-main & .weather__description
function renderTempAndDesc(temp, desc, airTempEl, weatherDescriptionEl) {
    airTempEl.innerHTML = `${Math.floor(temp)}°C`
    weatherDescriptionEl.innerHTML = `${desc}`
}

// ================================================================================================

// rendering .weather__wind-speed & .weather__wind-direction
function renderWind(windspeed, winddir, windSpeedEl, windDirectionEl, windTitleEl) {
    windSpeedEl.innerHTML = `${windspeed} km/h,`
    windDirectionEl.innerHTML = `${winddir}`
    windTitleEl.innerHTML = `Wind:`
}

// ================================================================================================

// rendering .weather__uv-index
function renderUvIndex(index, uvIndexEl, uvTitleEl) {
    uvIndexEl.innerHTML = index.toFixed(1)
    uvTitleEl.innerHTML = `UV Index:`
}

// ================================================================================================

// rendering .time-day
function renderDayTime(daytime, timeOfTheDayEl) {
    timeOfTheDayEl.innerHTML = daytime
}

// ================================================================================================

// rendering .weather__updated-time
function renderUpdatedAt(timeString, dateString, updatedAtEl, updatedTitleEl){
    updatedAtEl.innerHTML = timeString
    updatedAtEl.setAttribute('title', `Updated at ${dateString} at ${timeString} (local time)`)
    updatedTitleEl.innerHTML = `Updated at`
}

// ================================================================================================

// rendering .weather__temp-feels
function renderFeelsLike(temp, feelsLikeEl) {
    feelsLikeEl.innerHTML = `Feels like ${temp}°C`
}

// ================================================================================================
    
// rendering .weather__humidity-el
function renderHumidity(value, humidityEl, humidityTitleEl) {
    humidityEl.innerHTML = value + '%'
    humidityTitleEl.innerHTML = `Humidity:`
}

// ================================================================================================

// rendering .weather__humidity-cloud-cover-el
function renderCloudCover(value, cloudCoverEl, cloudCoverTitleEl) {
    cloudCoverEl.innerHTML = value + '%'
    cloudCoverEl.setAttribute('title', `The percentage of cloud coverage`)
    cloudCoverTitleEl.innerHTML = `Cloud cover:`
}

// ================================================================================================

// rendering change location button
function renderChangeLocBtn() {
    document.querySelector('.button-box button:nth-child(1)').textContent = `Change Location`
    document.querySelector('.button-box button:nth-child(1)').classList.add('change-location-btn')
}

// ================================================================================================

export { renderLocationAndCoords, renderTimeElement, renderSuntime, renderTimeIcon, showBackgroundVideo, renderBigIcon, renderPrecipitation, renderHourly, renderDaily,renderDaylightSunshine, showError, rerenderDegrees, renderModalWindow, renderResults, addLocation, renderMapModal, renderTempAndDesc, renderWind, renderUvIndex, renderDayTime, renderUpdatedAt, renderFeelsLike, renderHumidity, renderCloudCover, renderChangeLocBtn }