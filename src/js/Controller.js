'use strict'

import '../styles/main.scss'
// import myImageNameWithoutExtension from '../img/myImageNameWithExtension'  // myImageNameWithoutExtension will be the src 

import Model from './modules/Model.js'  
import View from './modules/View.js'  
import { renderAll, renderSunriseSunset } from './modules/controller-dependencies/rendering.js'
// import KeyCommands from './modules/KeyCommands.js'  // to do sth by typing certain keys
// import LS from './modules/Storage.js'  // to work with local storage

const Logic = new Model()
const Visual = new View()

// ===========================================================================================================================


async function init(flag) {
    try {
        Logic.getWeatherFetchesFromLS()  // fetching from local storage: recent weather api fetches
        Logic.getTimezoneFetchesFromLS()  // fetching from local storage: recent timezone api fetches
        Logic.getCoordsFetchesFromLS()  // fetching from local storage: recently added coords
        Logic.getSavedLocations()  // fetching from local storage: recently saved locations
        Logic.getPrimaryLocation()  // fetching from local storage: the primary location array of lat and lng
        Logic.truncateFetchArrays()  // checks if the arrays that have recent fetches do not grow to be more than length 20: if they more than length 20, i slice them and make them length 20 else they occupy too much space in LS and grow out of hand
        // Logic.assignMap();

        let coords

        if(Logic.primaryLocation.length > 0) {
            coords = Logic.primaryLocation
        } else if(localStorage.getItem('currentLocation')) {
            coords = JSON.parse(localStorage.getItem('currentLocation'))    // if exists in LS, make this the 'coords' -- if not, prompt geolocation
        } else {
            // Using Browser Geolocation API to determine a user's position 
            console.log(`🔶 Using Browser Geolocation API`)
            Visual.toggleSpinner('show')
            coords = await Visual.promptGeolocation()   // 'coords' is an array
            Visual.toggleSpinner('hide')
        }

        Logic.pushFetchedCoords(coords)
        Logic.pushPrimaryLocation(coords)

        if(flag !== 'refresh') { // 'init' is called with the arg 'refresh' if it refreshes every hour -- but leaflet ignores it else it produces error (multiple initialises of it)
            if(Logic.primaryLocation.length > 0) Logic.assignMap();   // initialising Leaflet (it should not re-run every hour)
        }

        // fetching timezone and weather:
        const [fetchedTimezone, fetchedWeather] = await fetchTimezoneAndWeather(coords, coords)

        // a sequence of actions that happen after fetching, such as rendering and updating things:
        afterFetching(fetchedWeather, fetchedTimezone)

        // rendering saved locations:
        if(Logic.savedLocations.length > 0) Logic.savedLocations.forEach(locationObj => Visual.addLocation('render', locationObj)) 

        // running all event listeners
        runEventListeners()

    } catch (error) {
        console.error(`💥💥💥 Something failed: ${error}\n${error.message}`);
        showCorrectError(error.message)
    }
}
init()


// ===========================================================================================================================


// re-fetching and re-rendering the weather every hour
setInterval(async () => {
    try {
        await init('refresh');
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
        throw error
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
    Visual.handleLocationBtns(locationBtnsHandler)
    Visual.handleSavedLocationsClick(savedLocationsClick)
    Visual.handleMapBtnClick(showMap)
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
    Logic.pushWeatherFetch(fetchedWeather)  // pushing to Model
    Logic.pushTimezoneFetch(fetchedTimezone)  // pushing to Model
    Logic.pushWeatherFetchesToLS()  // pushing to local storage
    Logic.pushTimezoneFetchesToLS()  // pushing to local storage
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
    
    // rendering Show Map globe icon button
    Visual.renderMapBtn()

    // putting the bg video there
    const bgVideoPath = Logic.defineWeatherType()  
    Visual.showBackgroundVideo(bgVideoPath)
}


// ================================================================================================


function openModal() {
    Visual.toggleModalWindow('show')  // rendering and showing the modal with the search form, input field focused
    Visual.handleSearchCitySubmit(fetchAndShowResults)    // handling submission of the form in that modal
    Visual.handleModalCloseBtnClick()   // handling closing the modal
    
    /* WHAT TO DO
    - They click on one option, I close the dropdown, close the modal, and re-render it all: fetch weather from that place and update the DOM.
    - I will save it to LS (local storage) as the current location
    */
}


// ================================================================================================


async function fetchAndShowResults(query) {
    try {
        const parentElement = document.querySelector('.modal__form')  // needed to show the little spinner
        Visual.clearModalResultsBox()    // clearing all found results in the modal
        Visual.toggleLittleSpinner('show', parentElement)
        const response = await Logic.fetchWeatherByCityName(query)  // fetching results
        Visual.toggleLittleSpinner('hide')
        Visual.renderResults(response)    // rendering results
        Visual.handleClickingResult(fetchResultWeather)  // clicking on any result closes the modal, fetches weather, and re-renders the DOM
    } catch (error) {
        console.error(error, error.message)
        if(error.message.startsWith('Failed')) {
            Visual.toggleLittleSpinner('hide')
            if(document.querySelector('.modal__nothing')) document.querySelector('.modal__nothing').remove()
            const html = `<div class="modal__nothing">Sorry, failed to fetch results.<br><br>Try again later.</div>`
            document.querySelector('.modal__form').insertAdjacentHTML(`beforeend`, html)
        }
    }
}


// ================================================================================================


async function fetchResultWeather(lat, lng, timezone) {
    try {
        Visual.toggleModalWindow('hide')

        Logic.pushPrimaryLocation([lat, lng])

        const [fetchedTimezone, fetchedWeather] = await fetchTimezoneAndWeather([lat, lng], [lat, lng])

        // a sequence of actions that happen after fetching, such as rendering and updating things:
        afterFetching(fetchedWeather, fetchedTimezone)

        // running all event listeners
        runEventListeners()
    } catch (error) {
        console.error(error)
    }
}


// ================================================================================================


function locationBtnsHandler(typeOfAction, obj) { 
    console.log(typeOfAction, obj)
    const savedLocationsCoords = Logic.savedLocations.map(locationObj => locationObj.coords.toString())  // stringifying coords, which is an array, to compare it

    if(savedLocationsCoords.includes(obj.coords.toString())) {   // if Saved Locations already contains this location I'm adding
        if(typeOfAction === 'makePrimary') return makeLocationPrimary(obj);
        else return // if it is case 'adding new' and Saved Locations already contains this location, do nothing
    } else {  // if Saved Locations doesn't contain this location I'm adding

        if(savedLocationsCoords.length >= 6) {
            return alert(`6 saved locations is the limit!\nRemove some of the existing ones to add new.`)   // can add no more than 6 locations to Saved Locations
        }
    
        if(typeOfAction === 'addLocation') {     // clicked on the Add Location btn:
            Logic.pushSavedLocation(obj)    // adding it to Model and LS
            Visual.addLocation('render', obj)   // adding it in the UI
            return
        } 

        if(typeOfAction === 'makePrimary') {  // ...then I need to add this location and make it primary
            Logic.pushSavedLocation(obj)    // adding it to Model and LS
            Visual.addLocation('render', obj)   // adding it in the UI
            makeLocationPrimary(obj)
        }
    }

    // e.target.closest('.btn-add-location').setAttribute('disabled', true)
    // const thisLocationDataObj = this.addLocation()
}

// ================================================================================================

function makeLocationPrimary(obj) {
    const { coords } = obj
    const indexInSavedLocations = Logic.savedLocations.findIndex(entry => entry.coords.toString() === coords.toString())

    if(indexInSavedLocations === 0) {  // means the index of it there is zero, it is first, do nothing with Logic.savedLocations, only change Logic.primaryLocation
        return Logic.pushPrimaryLocation([coords[0], coords[1]]);
    }  

    if(indexInSavedLocations > 0) {  // means it is there but not the first, so I need to make it first
        Logic.makeSavedLocationFirst(coords)  // making it first and pushing it to LS
    }

    if(indexInSavedLocations < 0) { // means it's not on the list, so I add it there and make it first
        Logic.pushSavedLocation(obj, 'pushPrimary')    // adding it to Model and LS to savedLocations as the 1st entry
    }

    Logic.pushPrimaryLocation([coords[0], coords[1]])  // changing primaryLocation and pushing it to LS
    document.querySelector('.added-locations').innerHTML = ``  // to re-render
    Logic.savedLocations.forEach(entryObj => Visual.addLocation('render', entryObj))  // getting new data and re-rendering this entire section
}

// ================================================================================================

async function savedLocationsClick(typeOfAction, coords) {
    try {
        const [lat, lng] = coords.split(',')

        if(typeOfAction === 'remove') {  // removing saved location
            Logic.removeFromSavedLocations(lat, lng)  // delete from Model and push this change to LS
            document.querySelector('.added-locations').innerHTML = ``   // to re-render
            Logic.savedLocations.forEach(entryObj => Visual.addLocation('render', entryObj))  // getting new data and re-rendering this entire section
        }

        if(typeOfAction === 'fetch') {  // fetching the weather by 'coords' and displaying it
            const [fetchedTimezone, fetchedWeather] = await fetchTimezoneAndWeather([lat, lng], [lat, lng])

            // a sequence of actions that happen after fetching, such as rendering and updating things:
            afterFetching(fetchedWeather, fetchedTimezone)

            // running all event listeners
            runEventListeners()

            // because I just clicked on the saved location item and fetched the weather from there, I need to update that element in Saved Locations
            updateThisSavedLocation()
        }
    } catch (error) {
        console.error(error, error.message);
        // if(error.message === `Failed to fetch the weather`) {
        if(error.message.startsWith('Failed to fetch')) {
            Visual.toggleSpinner('hide')
            alert("Sorry, fetching data failed. Try again later.")
        }
    }

}


// ================================================================================================


function updateThisSavedLocation() {
    const objOfData = Visual.getThisLocationData()  // getting this location data from the newly rendered
    Logic.updateSavedLocation(objOfData)  // pushing it to Logic.savedLocations and LS
    document.querySelector('.added-locations').innerHTML = ``  // to re-render
    Logic.savedLocations.forEach(entryObj => Visual.addLocation('render', entryObj))  // getting new data and re-rendering this entire section
}


// ================================================================================================


function showCorrectError(errorString) {
    console.log(errorString)

    let errorMessage = 'Error: Something failed.'

    if(errorString === `Failed to fetch the timezone`) {
        errorMessage = `Error: Failed to fetch the timezone.<br><br>Showing the last successful fetch...`
        Visual.toggleSpinner('hide')
        Visual.showError(errorMessage) 
        setTimeout(() => {
            document.querySelector('.error').style.animation = `bounceOut 0.1s ease-in-out forwards`
        }, 5000);
        setTimeout(() => {
            showLastSuccessfulFetch()
        }, 6000);
        return
    }

    if(errorString === `Failed to fetch the weather`) {
        errorMessage = `Error: Failed to fetch the weather.<br><br>Showing the last successful fetch...`
        Visual.toggleSpinner('hide')
        Visual.showError(errorMessage) 
        setTimeout(() => {
            document.querySelector('.error').style.animation = `bounceOut 0.1s ease-in-out forwards`
        }, 5000);
        setTimeout(() => {
            showLastSuccessfulFetch()
        }, 6000);
        return
    } 

    if(errorString === `User denied Geolocation`) {
        console.log(`ℹ️ User denied Geolocation`)
        Visual.toggleSpinner('hide')
        openModal()
        return
    }

    Visual.toggleSpinner('hide')
    Visual.showError(errorMessage) 
}


// ================================================================================================

function showLastSuccessfulFetch() {
    Visual.toggleSpinner('show')

    if(document.querySelector('.error')) document.querySelector('.error').remove();  // removing the error message

    if(Logic.previousTimezoneFetches.length > 0 && Logic.previousWeatherFetches.length > 0) {  // if length is > 0, then there is some stuff to show
        const weatherFetch = Logic.previousWeatherFetches[Logic.previousWeatherFetches.length-1]  // getting the last (pushed) one
        const timezoneFetch = Logic.previousTimezoneFetches[Logic.previousTimezoneFetches.length-1]  // getting the last (pushed) one

        Visual.toggleSpinner('hide')

        // a sequence of actions that USUALLY happen after fetching, such as rendering and updating things: (here based on the cached data)
        afterFetching(weatherFetch, timezoneFetch)

        // rendering saved locations:
        if(Logic.savedLocations.length > 0) Logic.savedLocations.forEach(locationObj => Visual.addLocation('render', locationObj)) 

        // running all event listeners
        runEventListeners()
    } else {
        const errorMessage = `Error: Failed to fetch the data.`
        Visual.showError(errorMessage) 
    }
}

// ================================================================================================


function showMap() {
    Visual.renderMapModal()  // open modal
    Visual.handleClosingMap()
    const newCoords = document.querySelector('.weather__coords').textContent.slice(1,-1).split(',').map(x => Number(x.trim().slice(0,-3))) // getting the coords from the UI
    const zoomLvl = 6
    Logic.updateMapView(newCoords, zoomLvl)  // updating the map coords
    Logic.map.invalidateSize()  // making sure it renders right
}


// ================================================================================================

// exporting for some dependencies:
export { Logic, Visual } 