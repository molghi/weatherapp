import { Logic, Visual, runEventListeners } from '../../Controller.js';
import  afterFetching  from './renderAfterFetch.js'
import { updateSavedLocElements } from '../view-dependencies/renderMethods.js'

// ================================================================================================

// fetching timezone and weather
async function fetchTimezoneAndWeather(timezoneCoords, weatherCoords, type) {
    try {
        // fetching from the timezone API
        const fetchedTimezone = await Logic.fetchTimezone(timezoneCoords);
        // console.log(`fetchedTimezone:`,fetchedTimezone)

        // fetching from the weather API
        const fetchedWeather = await Logic.fetchWeather(weatherCoords, type);
        // console.log(`fetchedWeather:`,fetchedWeather)

        return [fetchedTimezone, fetchedWeather]
    } catch (error) {
        console.error(error)
        throw error
    }
}

// ================================================================================================

// fetching and showing the results in Search By City form
async function fetchAndShowResults(query) {
    try {
        const parentElement = document.querySelector('.modal__form')  // needed to show the little spinner
        Visual.clearModalResultsBox()    // clearing all previously found results in the modal
        Visual.toggleLittleSpinner('show', parentElement)

        const response = await Logic.fetchWeatherByCityName(query)  // fetching results
        Visual.toggleLittleSpinner('hide')
        Visual.renderResults(response)    // rendering results
        Visual.handleClickingResult(fetchResultWeather)  // clicking on any result closes the modal, fetches the weather, and re-renders the DOM
    } catch (error) {
        console.error(error, error.message)
        if(error.message.startsWith('Failed')) {
            Visual.toggleLittleSpinner('hide')
            if(document.querySelector('.modal__nothing')) document.querySelector('.modal__nothing').remove()   // removing any existing .modal__nothing
            const html = `<div class="modal__nothing">Sorry, failed to fetch results.<br><br>Try again later.</div>`
            document.querySelector('.modal__form').insertAdjacentHTML(`beforeend`, html)   // adding new .modal__nothing
        }
    }
}

// ================================================================================================

// fetching the weather upon clicking on some result in Search By City form
async function fetchResultWeather(lat, lng, timezone) {
    try {
        Visual.toggleModalWindow('hide') // closing the modal

        if(Logic.primaryLocation.length === 0) Logic.pushPrimaryLocation([lat, lng]);   // if there is no set Primary Location, set it

        const [fetchedTimezone, fetchedWeather] = await fetchTimezoneAndWeather([lat, lng], [lat, lng])   // fetch new

        afterFetching(fetchedWeather, fetchedTimezone)  // a sequence of actions that happen after fetching, such as rendering and updating things

        runEventListeners()  // running all event listeners
    } catch (error) {
        console.error(error)
    }
}

// ================================================================================================

// updating Saved Locations (once 'init' runs: on app start/page refresh and every hour)
async function updateSavedLocations() {
    try {
        const allLocationsCoords = Logic.savedLocations.map(entry => entry.coords)  // getting the coords of all Saved Locations
        const fetched = []

        for (const locCoords of allLocationsCoords) {    // using for-of instead of any high-order array method because they don't handle async requests properly
            const fetchedData = await fetchTimezoneAndWeather(locCoords, locCoords, 'in the background');  // fetching new
            const fetchedTimezone = fetchedData[0];
            const fetchedWeather = fetchedData[1];
            fetched.push([fetchedTimezone, fetchedWeather]);  // populating 'fetched'
        }

        const formattedObjToRender = Logic.formatSavedLocations(fetched)    // filtering the API response
        Logic.updateSavedLocations(formattedObjToRender)  // updating in Model and pushing to LS

    } catch (error) {
        console.error(error);
    }
}

export { fetchTimezoneAndWeather, fetchAndShowResults, fetchResultWeather, updateSavedLocations }