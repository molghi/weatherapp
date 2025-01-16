'use strict'

import '../styles/main.scss'
// import myImageNameWithoutExtension from '../img/myImageNameWithExtension'  // myImageNameWithoutExtension will be the src 

import Model from './modules/Model.js'  
import View from './modules/View.js'  
import { renderAll, renderSunriseSunset } from './modules/controller-dependencies/rendering.js'
import KeyCommands from './modules/KeyCommands.js'  // to do sth by typing certain keys
import LS from './modules/Storage.js'  // to work with local storage

const Logic = new Model()
const Visual = new View()

// ===========================================================================================================================

async function init() {
    try {
        Logic.getWeatherFetchesFromLS()
        Logic.getTimezoneFetchesFromLS()
        Logic.getCoordsFetchesFromLS()

        // Using Browser Geolocation API to determine a user's position
        Visual.toggleSpinner('show')
        const userGeolocCoords = await Visual.promptGeolocation()   // userGeolocationCoords is an array
        // console.log(`userGeolocCoords:`, userGeolocCoords)
        Visual.toggleSpinner('hide')
        Logic.pushFetchedCoords(userGeolocCoords)

        // const [fetchedTimezone, fetchedWeather] = await fetchTimezoneAndWeather(Logic.myCoords, Logic.myCoords)
        const [fetchedTimezone, fetchedWeather] = await fetchTimezoneAndWeather(userGeolocCoords, userGeolocCoords)

        // a sequence of actions that happen after fetching, such as rendering and updating things:
        afterFetching(fetchedWeather, fetchedTimezone)

        // running all event listeners
        runEventListeners()

    } catch (error) {
        console.error(`Failed to fetch geolocation: ${error.message}`);
        Visual.toggleSpinner('hide')
        Visual.showError('Temporary error: Geoloc denied --> (this is where I must show the input field so the user could choose a city)')
    }
}
init()

// ===========================================================================================================================

// re-fetching and re-rendering the weather every hour
setInterval(async () => {
    try {
        await init();
    } catch (error) {
        console.error('Error during periodic init:', error);
    }
}, 3600 * 1000) // 3600 * 1000 milliseconds = 1 hour

// ===========================================================================================================================

// fetching timezone and weather
async function fetchTimezoneAndWeather(timezoneCoords, weatherCoords) {
    try {
        // fetching from the timezone API
        const fetchedTimezone = await Logic.fetchTimezone(timezoneCoords);
        console.log(`fetchedTimezone:`,fetchedTimezone)

        // fetching from the weather API
        const fetchedWeather = await Logic.fetchWeather(weatherCoords);
        console.log(`fetchedWeather:`,fetchedWeather)

        return [fetchedTimezone, fetchedWeather]
    } catch (error) {
        console.error(error)
    }
}

// ===========================================================================================================================

function logOutTimeNow() {
    console.log(`⏰ ${new Date().getHours()}:${(new Date().getMinutes()).toString().padStart(2,0)}`)
    setInterval(() => {
        console.log(`⏰ ${new Date().getHours()}:${(new Date().getMinutes()).toString().padStart(2,0)}`)
    }, 60000);
}

// ===========================================================================================================================

function runEventListeners() {
    Visual.handleTemperatureClick(changeTempUnits)
    Visual.handleChangeLocationClick(openModal)
}

// ===========================================================================================================================

function changeTempUnits() {
    const unitsNow = Logic.switchTempUnits()
    if(unitsNow === 'Fahrenheit') {
        Visual.rerenderDegrees('Fahrenheit', Logic.degreesFahrenheit)
    } else {
        Visual.rerenderDegrees('Celsius', Logic.degrees)
    }
}

// ===========================================================================================================================

function pushFetchesToModelAndLs(fetchedWeather, fetchedTimezone) {
    Logic.pushWeatherFetch(fetchedWeather)  // to Model
    Logic.pushTimezoneFetch(fetchedTimezone)  // to Model
    Logic.pushWeatherFetchesToLS()
    Logic.pushTimezoneFetchesToLS()
}

// ===========================================================================================================================

function afterFetching(fetchedWeather, fetchedTimezone) {
    // pushing fetches to Model and LS
    pushFetchesToModelAndLs(fetchedWeather, fetchedTimezone)

    // pushing fetched user coords to LS
    Logic.pushToLocalStorage(JSON.stringify(Logic.fetchedCoords), 'userCoords')

    // rendering main block, hourly, daily, title box, and making time update every min
    renderAll(fetchedTimezone, fetchedWeather)  // I import it above

    // converting from C to F -- as a result of that we have two arrays -- all Celsius values and all Fahrenheit values
    Logic.setAllDegrees(fetchedWeather)  

    // updating Document Title
    const shortDescription = Logic.giveShortDescription(fetchedWeather.weathercode)
    Visual.updateDocumentTitle(Math.floor(fetchedWeather.temp), shortDescription)

    // why not?
    logOutTimeNow()

    // setting sunrise and sunset time
    const todayString = Logic.getLocalDay(Logic.offsetInSeconds).split('/').reverse().join('-')  // formatted like '2025-01-11'
    const indexOfTodayInDaily = fetchedWeather.daily.sunset.findIndex(x => x.startsWith(todayString))
    Logic.setSunriseTime(fetchedWeather.daily.sunrise[indexOfTodayInDaily])
    Logic.setSunsetTime(fetchedWeather.daily.sunset[indexOfTodayInDaily])
    renderSunriseSunset(fetchedWeather)

    // rendering Change Location button
    Visual.renderChangeLocBtn()  

    // putting the bg video there
    const bgVideoPath = Logic.defineWeatherType()  
    Visual.showBackgroundVideo(bgVideoPath)
}

// ================================================================================================

function openModal() {
    Visual.toggleModalWindow('show')  // rendering and showing the modal with the input field focused
    Visual.handleSearchCitySubmit(fetchAndShowResults)    // handling submission of the form in that modal
    Visual.handleModalCloseBtnClick()   // handling closing the modal

    /* WHAT TO DO
    - They click on one option, I close the dropdown, close the modal, and re-render it all: fetch weather from that place and update the DOM.
    - I will save it to LS (local storage) as the current location
    */
}

// ================================================================================================

async function fetchAndShowResults(query) {
    const parentElement = document.querySelector('.modal__form')  // needed to show the little spinner
    Visual.clearModalResultsBox()    // clearing all found results in the modal
    Visual.toggleLittleSpinner('show', parentElement)
    const response = await Logic.fetchWeatherByCityName(query)  // fetching results
    Visual.toggleLittleSpinner('hide')
    Visual.renderResults(response)    // rendering results
    Visual.handleClickingResult(fetchResultWeather)  // clicking on any result closes the modal, fetches weather, and re-renders the DOM
}

// ================================================================================================

async function fetchResultWeather(lat, lng, timezone) {
    Visual.toggleModalWindow('hide')

    const [fetchedTimezone, fetchedWeather] = await fetchTimezoneAndWeather([lat, lng], [lat, lng])

    // a sequence of actions that happen after fetching, such as rendering and updating things:
    afterFetching(fetchedWeather, fetchedTimezone)

    // running all event listeners
    runEventListeners()
}

// ================================================================================================

// exporting for some dependencies:
export { Logic, Visual } 