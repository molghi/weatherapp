import videoNightClearSky from '../../vid/night_clear_sky.mp4';

class View {
    constructor() {
        // console.log(`hello from View`)
        this.locationEl = document.querySelector('.weather__place')
        this.coordsEl = document.querySelector('.weather__coords')
        this.timeEl = document.querySelector('.time-element')
        this.sunsetEl = document.querySelector('.sunset-time')
        this.airTempEl = document.querySelector('.weather__temp')
        this.weatherDescriptionEl = document.querySelector('.weather__description')
        this.windSpeedEl = document.querySelector('.weather__wind-speed')
        this.windDirectionEl = document.querySelector('.weather__wind-direction')
        this.uvIndexEl = document.querySelector('.weather__uv-index')
        this.timeOfTheDayEl = document.querySelector('.time-day')
        this.timeboxIconEl = document.querySelector('.time-icon')
        this.updatedAtEl = document.querySelector('.weather__updated-time')
        this.videoEl = document.querySelector('video')
        this.showBackgroundVideo()
    }

    renderLocationAndCoords(obj) {
        const {city, continent, country, flag, coords} = obj
        this.locationEl.innerHTML = `${city}, <span class="weather__country">${country}<span class="weather__flag">${flag}</span></span>, ${continent}, Terra`
        this.coordsEl.innerHTML = `(${coords.lat.toFixed(2)}° N, ${coords.lng.toFixed(2)}° E)`
    }

    renderTimeElement(timeArr) {
        const [hours, minutes] = timeArr
        this.timeEl.innerHTML = `${hours}<span>:</span>${minutes.toString().padStart(2,0)}`
    }

    renderSunrise(time) {
        const word = time > 15 ? 'minutes' : 'hours'
        this.sunsetEl.innerHTML = `in ${time} ${word}`
        this.sunsetEl.setAttribute('title', 'Nautical sunrise')
    }

    renderTempAndDesc(temp, desc) {
        this.airTempEl.innerHTML = `${Math.floor(temp)}°C`
        this.weatherDescriptionEl.innerHTML = `${desc}`
    }

    renderWind(windspeed, winddir) {
        this.windSpeedEl.innerHTML = `${windspeed} km/h,`
        this.windDirectionEl.innerHTML = `${winddir}`
    }

    renderUvIndex(index) {
        this.uvIndexEl.innerHTML = index
    }

    renderDayTimeAndIcon(time) {
        const [hrs, min] = time
        let daytime, icon
        if(hrs >= 0 && hrs < 7) {
            daytime = 'Night'
            icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"/></svg>`
        }
        if(hrs >= 7 && hrs < 12) {
            daytime = 'Morning'
            icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" id="sun-horizon">
                    <rect width="256" height="256" fill="none"></rect>
                    <path d="M77.74854,43.58691a8.00009,8.00009,0,0,1,14.78222-6.123l7.65332,18.47754a8.00009,8.00009,0,1,1-14.78222,6.123ZM21.46387,108.53027l18.47754,7.65332a7.99964,7.99964,0,1,0,6.123-14.78125L27.58691,93.749a7.99964,7.99964,0,1,0-6.123,14.78125ZM213,116.79492a7.97082,7.97082,0,0,0,3.05859-.61133l18.47754-7.65332a7.99964,7.99964,0,1,0-6.123-14.78125l-18.47754,7.65332A8.001,8.001,0,0,0,213,116.79492ZM160.14551,66.39355a7.99266,7.99266,0,0,0,10.45263-4.3291l7.65332-18.47754a8.00009,8.00009,0,0,0-14.78222-6.123l-7.65332,18.47754A7.99929,7.99929,0,0,0,160.14551,66.39355ZM240,152H195.52319a68,68,0,1,0-135.04638,0H16a8,8,0,0,0,0,16H185.81812l.02905.00195L185.87085,168H240a8,8,0,0,0,0-16Zm-32,40H48a8,8,0,0,0,0,16H208a8,8,0,0,0,0-16Z"></path>
                    </svg>`
        }
        if(hrs >= 12 && hrs < 18) {
            daytime = 'Day'
            icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z"/></svg>`
        }
        if(hrs >= 18 && hrs < 23) {
            daytime = 'Evening'
            icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" id="sun-horizon">
                    <rect width="256" height="256" fill="none"></rect>
                    <path d="M77.74854,43.58691a8.00009,8.00009,0,0,1,14.78222-6.123l7.65332,18.47754a8.00009,8.00009,0,1,1-14.78222,6.123ZM21.46387,108.53027l18.47754,7.65332a7.99964,7.99964,0,1,0,6.123-14.78125L27.58691,93.749a7.99964,7.99964,0,1,0-6.123,14.78125ZM213,116.79492a7.97082,7.97082,0,0,0,3.05859-.61133l18.47754-7.65332a7.99964,7.99964,0,1,0-6.123-14.78125l-18.47754,7.65332A8.001,8.001,0,0,0,213,116.79492ZM160.14551,66.39355a7.99266,7.99266,0,0,0,10.45263-4.3291l7.65332-18.47754a8.00009,8.00009,0,0,0-14.78222-6.123l-7.65332,18.47754A7.99929,7.99929,0,0,0,160.14551,66.39355ZM240,152H195.52319a68,68,0,1,0-135.04638,0H16a8,8,0,0,0,0,16H185.81812l.02905.00195L185.87085,168H240a8,8,0,0,0,0-16Zm-32,40H48a8,8,0,0,0,0,16H208a8,8,0,0,0,0-16Z"></path>
                    </svg>`
        }
        
        this.timeOfTheDayEl.textContent = daytime
        this.timeboxIconEl.innerHTML = icon
    }

    renderUpdatedAt(timeString, dateString) {
        this.updatedAtEl.innerHTML = timeString
        this.updatedAtEl.setAttribute('title', `${dateString} at ${timeString}`)
    }

    showBackgroundVideo() {
        this.videoEl.setAttribute('src', videoNightClearSky)
        this.videoEl.play()
    }
}

export default View