import { Logic, Visual } from '../../Controller.js';

export default function showCorrectError(errorString) {
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
        document.querySelector('.added-locations').innerHTML = ''   // making sure it's empty first
        if(Logic.savedLocations.length > 0) Logic.savedLocations.forEach(locationObj => Visual.addLocation('render', locationObj)) 

        // running all event listeners
        runEventListeners()
    } else {
        const errorMessage = `Error: Failed to fetch the data.`
        Visual.showError(errorMessage) 
    }
}