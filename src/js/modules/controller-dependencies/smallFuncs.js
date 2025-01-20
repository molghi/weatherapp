import { Logic, Visual } from '../../Controller.js';
import { fetchAndShowResults } from './fetchers.js'

// ================================================================================================

function changeTempUnits() {
    const unitsNow = Logic.switchTempUnits()

    if(unitsNow === 'Fahrenheit') Visual.rerenderDegrees('Fahrenheit', Logic.degreesFahrenheit); 

    else Visual.rerenderDegrees('Celsius', Logic.degrees);
}

// ================================================================================================

function pushFetchesToModelAndLs(fetchedWeather, fetchedTimezone) {
    Logic.pushWeatherFetch(fetchedWeather)  // pushing to Model
    Logic.pushTimezoneFetch(fetchedTimezone)  // pushing to Model
    Logic.pushWeatherFetchesToLS()  // pushing to local storage
    Logic.pushTimezoneFetchesToLS()  // pushing to local storage
}

// ================================================================================================

function openModal() {
    Visual.toggleModalWindow('show')  // rendering and showing the modal with the search form, input field focused
    Visual.handleSearchCitySubmit(fetchAndShowResults)    // handling submission of the form in that modal
    Visual.handleModalCloseBtnClick()   // handling closing the modal
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

function getFromLS() {
    Logic.getWeatherFetchesFromLS()  // fetching from local storage: recent weather api fetches
    Logic.getTimezoneFetchesFromLS()  // fetching from local storage: recent timezone api fetches
    Logic.getCoordsFetchesFromLS()  // fetching from local storage: recently added coords
    Logic.getSavedLocations()  // fetching from local storage: recently saved locations
    Logic.getPrimaryLocation()  // fetching from local storage: the primary location array of lat and lng
    Logic.truncateFetchArrays()  // checks if the arrays that have recent fetches do not grow to be more than length 20: if they more than length 20, i slice them and make them length 20 else they occupy too much space in LS and grow out of hand
}

// ================================================================================================

async function setCoords() {
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

    return coords
}

// ================================================================================================

export { changeTempUnits, pushFetchesToModelAndLs, openModal, showMap, getFromLS, setCoords }