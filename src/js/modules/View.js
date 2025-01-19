// importing icons
import { sunriseIcon, sunsetIcon, precipitationIcon, lightbulbIcon, sunIcon, timeIcon, humidityIcon, cloudCoverIcon, eveningIcon, nightIcon, morningIcon, dayIcon, houseIcon, plusIcon, globeIcon } from './view-dependencies/icons.js'

// importing functions that render things
import { renderLocationAndCoords, renderTimeElement, renderSuntime, renderTimeIcon, showBackgroundVideo, renderBigIcon, renderPrecipitation, renderHourly, renderDaily, renderDaylightSunshine, showError, rerenderDegrees, renderModalWindow, renderResults, addLocation, renderMapModal, renderTempAndDesc, renderWind, renderUvIndex, renderDayTime, renderUpdatedAt, renderFeelsLike, renderHumidity, renderCloudCover, renderChangeLocBtn } from './view-dependencies/renderMethods.js'

// more importing
import { handleTemperatureClick, handleClickingResult, handleSavedLocationsClick } from './view-dependencies/eventHandlers.js'
import { promptGeolocation } from './view-dependencies/geolocation.js'
import { toggleSpinner, toggleLittleSpinner, toggleModalWindow } from './view-dependencies/togglingThings.js'


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

        this.changeLocationHandler = this.changeLocationHandler.bind(this)
        this.formHandler = this.formHandler.bind(this)
        this.boundCloseModal = this.closeModal.bind(this); // Storing bound function
        this.clickHandler = this.clickHandler.bind(this);

        this.savedLocTempCelsius = ''
    }

    // ================================================================================================

    // rendering .weather__place & .weather__coords
    renderLocationAndCoords(obj) {
        renderLocationAndCoords(obj, this.locationEl, this.coordsEl, this.locationTitleEl)
    }

    // ================================================================================================

    // rendering .time-element
    renderTimeElement(dateTodayFormatted, timeArr) {
        renderTimeElement(dateTodayFormatted, timeArr, this.timeEl)
    }

    // ================================================================================================

    // rendering .sun-time
    renderSuntime(time, type='sunrise', actualTime='') {   // 'time' is an array, 'type' is a string
        renderSuntime(time, type='sunrise', actualTime='', this.suntimeEl, this.sunwordEl)
    }

    // ================================================================================================

    // rendering .weather__temp-main & .weather__description
    renderTempAndDesc(temp, desc) {
        renderTempAndDesc(temp, desc, this.airTempEl, this.weatherDescriptionEl)
    }

    // ================================================================================================

    // rendering .weather__wind-speed & .weather__wind-direction
    renderWind(windspeed, winddir) {
        renderWind(windspeed, winddir, this.windSpeedEl, this.windDirectionEl, this.windTitleEl)
    }

    // ================================================================================================

    // rendering .weather__uv-index
    renderUvIndex(index) {
        renderUvIndex(index, this.uvIndexEl, this.uvTitleEl)
    }

    // ================================================================================================

    // rendering .time-icon
    renderTimeIcon(time) {
        renderTimeIcon(time, this.timeboxIconEl)
    }

    // ================================================================================================

    // rendering .time-day
    renderDayTime(daytime) {
        renderDayTime(daytime, this.timeOfTheDayEl)
    }

    // ================================================================================================

    // rendering .weather__updated-time
    renderUpdatedAt(timeString, dateString) {
        renderUpdatedAt(timeString, dateString, this.updatedAtEl, this.updatedTitleEl)
    }

    // ================================================================================================

    showBackgroundVideo(path) {
        showBackgroundVideo(path, this.videoBoxEl, this.videoEl)
    }

    // ================================================================================================

    // rendering .weather__icon
    renderBigIcon(icon) { 
        renderBigIcon(icon, this.bigIconEl)
    }

    // ================================================================================================

    // rendering .weather__precipitation-details
    renderPrecipitation([precipitationProbability, precipitation, rain, showers, snowDepth, snowfall]) {
        renderPrecipitation([precipitationProbability, precipitation, rain, showers, snowDepth, snowfall], this.precipitationEl, this.precipitationTitleEl)
    }

    // ================================================================================================

    // rendering .weather__hours
    renderHourly(obj) {    // 'obj' is an obj of props selected by me for the upcoming 48h
        renderHourly(obj, this.hourlyBoxEl, this.hourlyTitleEl)
    }

    // ================================================================================================

    // rendering .weather__days
    renderDaily(dateNowAtLocation, obj) {
        renderDaily(dateNowAtLocation, obj, this.dailyBoxEl, this.dailyTitleEl)
    }

    // ================================================================================================

    // rendering .weather__temp-feels
    renderFeelsLike(temp) {
        renderFeelsLike(temp, this.feelsLikeEl)
    }

    // ================================================================================================
    
    // rendering .weather__humidity-el
    renderHumidity(value) {
        renderHumidity(value, this.humidityEl, this.humidityTitleEl)
    }

    // ================================================================================================

    // rendering .weather__humidity-cloud-cover-el
    renderCloudCover(value) {
        renderCloudCover(value, this.cloudCoverEl, this.cloudCoverTitleEl)
    }

    // ================================================================================================

    // rendering .weather__humidity-light-el & .weather__humidity-sun-el
    renderDaylightSunshine(daylightDuration, sunshineDuration) {
        renderDaylightSunshine(daylightDuration, sunshineDuration, this.lightEl, this.sunEl, this.daylightTitleEl, this.sunshineTitleEl)
    }

    // ================================================================================================

    showError(text) {
        showError(text)
    }

    // ================================================================================================

    renderChangeLocBtn() {
        renderChangeLocBtn()
    }

    // ================================================================================================

    renderMapBtn() {
        document.querySelector('.show-map-btn').innerHTML = globeIcon
    }

    // ================================================================================================

    // changing Fahr to Cels and back
    rerenderDegrees(flag, obj) {
        this.getCelsiusSavedLocations()  // getting the Cels temp values from the rendered Saved Locations block
        rerenderDegrees(flag, obj, this.airTempEl, this.fahrenheitSign, this.feelsLikeEl, this.celsiusSign, this.savedLocTempCelsius)
    }

    // ================================================================================================

    // getting the Cels temp values from the rendered Saved Locations block ---  I call it in 'rerenderDegrees'
    getCelsiusSavedLocations() {
        if(!this.savedLocTempCelsius) {
            this.savedLocTempCelsius = [...document.querySelectorAll('.added-location')].map(locationEl => {   // it's an array of arrays: each arr there represents one Saved Loc el
                const bigTemp = +locationEl.querySelector('.added-location-temp').textContent.slice(0,-2)  // getting the numeric value of temp (main)
                const hiddenTemp = +locationEl.querySelector('.added-location-temp').getAttribute('title').split(' ')[2].slice(0,-2)  // getting the numeric value of temp (feels like)
                return [bigTemp, hiddenTemp]
            })
        }
    }

    // ================================================================================================

    // rendering modal window
    renderModalWindow() {
        renderModalWindow()
    }

    // ================================================================================================

    // rendering the results in search city form upon submitting it
    renderResults(resultsObj) {
        renderResults(resultsObj)
    }

    // ================================================================================================

    // adding new Saved Location
    addLocation(type='addingNew', obj) {
        const thisLocationData = this.getThisLocationData()
        addLocation(type, obj, thisLocationData)
    }

    // ================================================================================================

    // get some data about the cur loc
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

    renderMapModal() {
        renderMapModal()
        this.moveMapDiv()
    }


    // ================================================================================================
    // ================================================================================================
    // ================================================================================================


    moveMapDiv(flag='move in') {
        if(flag === 'move in') document.querySelector('.modal__window').appendChild(this.mapDiv);
        if(flag === 'move out') document.body.appendChild(this.mapDiv);
    }

    // ================================================================================================

    updateDocumentTitle(tempNow, shortDesc) { 
        const value = `${tempNow}${this.celsiusSign}, ${shortDesc}`
        document.title = `Weather Control: ${value}`
    }

    // ================================================================================================

    clearModalResultsBox() {
        if(document.querySelector('.modal__results')) document.querySelector('.modal__results').remove()
        if(document.querySelector('.modal__nothing')) document.querySelector('.modal__nothing').remove()    
    }

    // ================================================================================================

    toggleSpinner(flag='show') {
        toggleSpinner(flag)
    }

    // ================================================================================================

    toggleLittleSpinner(flag='show', parentElement) {
        toggleLittleSpinner(flag, parentElement)
    }

    // ================================================================================================

    toggleModalWindow(flag='show'){
        toggleModalWindow(flag, this.renderModalWindow)
    }

    // ================================================================================================

    promptGeolocation() {
        promptGeolocation()
    }




    // ================================================================================================
    // ================================================================================================
    // ================================================================================================



    
    // handling click on any temp (Cels) element --> upon it the Fahr/Cels convertion happens
    handleTemperatureClick(handler) {
        handleTemperatureClick(handler, this.weatherBoxEl)
    }

    // ================================================================================================

    // handle clicking one result in city search form (upon changing location)
    handleClickingResult(handler) {
        handleClickingResult(handler)
    }

    // ================================================================================================

    handleSavedLocationsClick(handler) {
        handleSavedLocationsClick(handler)
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

    handleChangeLocationClick(handler) {
        const btn = document.querySelector('.change-location-btn')
        this.changeLocationCallback = handler
        btn.removeEventListener('click', this.changeLocationHandler)
        btn.addEventListener('click', this.changeLocationHandler)
    }

    changeLocationHandler() {
        this.changeLocationCallback()
    }

    // ================================================================================================

    /*  NOTE: How it works:
    1 - Class constructor:  this.formHandler = this.formHandler.bind(this)  --> binding the reference to the event listener callback function to be able to remove it later
        - later where I write 'this.formHandler', it references the Class property where this function/method is bound, not just the method in this class.
    2 - In a function that attaches/removes event listener to some el, pass that callback ('this.formHandler') to the listeners
    3 - In a function that attaches/removes event listener to some el, store the reference to your 'handler' -- assign it as another prop to the Class
    4 - Prevent duplicate listeners by removing the previous listener before adding a new one: first remove, then add.
    5 - Have the event listener callback function defined as a separate class method -- with the current setup it's not necessary to have it defined as an arrow function/method
        - Since you're binding the method in the constructor (this.formHandler = this.formHandler.bind(this)), it is not necessary to define it as an arrow function. The binding ensures that 'this' refers to the class instance, achieving the same result as an arrow function would, but with a method.
    */

    handleSearchCitySubmit(handler) {
        if(!document.querySelector('.modal__form')) return console.log('No form')
        this.formHandlerCallback = handler
        document.querySelector('.modal__form').removeEventListener('submit', this.formHandler)
        document.querySelector('.modal__form').addEventListener('submit', this.formHandler)
    }

    formHandler(e) {
        e.preventDefault()
        const inputValue = e.target.querySelector('input').value
        this.formHandlerCallback(inputValue)
    }

    // ================================================================================================

    handleModalCloseBtnClick() {
        document.addEventListener('click', this.boundCloseModal)
    }

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

    // btns: Make Primary and Add a Location to the list
    handleLocationBtns(handler) {
        this.removeLocationBtnsHandler() // removing any existing listener first (because I re-render the element with these buttons frequently)
        this.boundTopLocationBtnsHandler = (e) => this.topLocationBtnsHandler(e, handler) // binding the handler to topLocationBtnsHandler and storing the reference
        this.weatherBoxEl.addEventListener('click', this.boundTopLocationBtnsHandler)
    }

    // dependency of 'handleLocationBtns'
    removeLocationBtnsHandler() {
        if (this.boundTopLocationBtnsHandler) {
            this.weatherBoxEl.removeEventListener('click', this.boundTopLocationBtnsHandler)
            this.boundTopLocationBtnsHandler = null // cleaning up reference
        }
    }

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

    handleMapBtnClick(handler) {
        this.handler = handler;  // Store the handler for later use
        this.changeLocBtnBoxEl.removeEventListener('click', this.clickHandler); // Remove any existing event listeners
        this.changeLocBtnBoxEl.addEventListener('click', this.clickHandler);  // Attach the new event listener
    }

    // The method that handles the click event
    clickHandler(e) {
        if (!e.target.closest('.show-map-btn')) return;
        if (this.handler) this.handler()
    }

    // ================================================================================================

}

export default View