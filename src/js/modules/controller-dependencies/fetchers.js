import { Logic, Visual } from '../../Controller.js';
import  afterFetching  from './renderAfterFetch.js'
import { runEventListeners } from '../../Controller.js'

// ================================================================================================

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

export { fetchTimezoneAndWeather, fetchAndShowResults, fetchResultWeather }