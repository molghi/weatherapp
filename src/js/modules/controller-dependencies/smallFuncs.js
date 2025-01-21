import { Logic, Visual } from '../../Controller.js';
import { fetchAndShowResults } from './fetchers.js'

// ================================================================================================

// switching temp units in Logic and re-rendering in Fahr/Cels
function changeTempUnits() {
    const unitsNow = Logic.switchTempUnits()

    if(unitsNow === 'Fahrenheit') Visual.rerenderDegrees('Fahrenheit', Logic.degreesFahrenheit); 

    else Visual.rerenderDegrees('Celsius', Logic.degrees);
}

// ================================================================================================

// pushing weather and timezone fetches to Model/Logic and to LS
function pushFetchesToModelAndLs(fetchedWeather, fetchedTimezone) {
    Logic.pushWeatherFetch(fetchedWeather)  // pushing to Model
    Logic.pushTimezoneFetch(fetchedTimezone)  // pushing to Model
    Logic.pushWeatherFetchesToLS()  // pushing to local storage
    Logic.pushTimezoneFetchesToLS()  // pushing to local storage
}

// ================================================================================================

// showing modal with Search By City form
function openModal() {
    Visual.toggleModalWindow('show')  // rendering the modal with the search form, input field focused
    Visual.handleSearchCitySubmit(fetchAndShowResults)    // handling submission of that form 
    Visual.handleModalCloseBtnClick()   // handling closing the modal
}

// ================================================================================================

// showing modal with the location map
function showMap() {
    Visual.renderMapModal()  // open modal
    Visual.handleClosingMap()  // handle closing this modal
    const newCoords = document.querySelector('.weather__coords').textContent.slice(1,-1).split(',').map(x => Number(x.trim().slice(0,-3))) // getting the coords from the UI
    const zoomLvl = 6
    Logic.updateMapView(newCoords, zoomLvl)  // updating the map coords
    Logic.map.invalidateSize()  // making sure it renders right (Leaflet method)
}

// ================================================================================================

// fetching a bunch of stuff from LS and truncating arrays if they are too long
function getFromLS() {
    Logic.getWeatherFetchesFromLS()  // fetching from local storage: recent weather api fetches
    Logic.getTimezoneFetchesFromLS()  // fetching from local storage: recent timezone api fetches
    Logic.getCoordsFetchesFromLS()  // fetching from local storage: recently added coords
    Logic.getSavedLocations()  // fetching from local storage: recently saved locations
    Logic.getPrimaryLocation()  // fetching from local storage: the primary location array of lat and lng

    Logic.truncateFetchArrays()  // checks if the arrays that have recent fetches do not grow to be more than length 20: if they more than length 20, i slice them and make them length 20 else they occupy too much space in LS and grow out of hand
}

// ================================================================================================

// setting the current coordinates and returning them as an array
async function setCoords() {
    let coords

    if(Logic.primaryLocation.length > 0) {  // if Primary Location was already set before, fetch it
        coords = Logic.primaryLocation
    } else if(localStorage.getItem('currentLocation')) {  // although, I don't think I have this one anymore in LS...
        coords = JSON.parse(localStorage.getItem('currentLocation'))  
    } else {
        console.log(`🔶 Using Browser Geolocation API`)  // using Browser Geolocation API to determine a user's position 
        Visual.toggleSpinner('show')
        coords = await Visual.promptGeolocation()   // 'coords' is an array
        Visual.toggleSpinner('hide')
    }

    Logic.pushFetchedCoords(coords)   // although, I don't think I use this one anywhere...
    Logic.pushPrimaryLocation(coords)  

    return coords
}

// ================================================================================================

export { changeTempUnits, pushFetchesToModelAndLs, openModal, showMap, getFromLS, setCoords }