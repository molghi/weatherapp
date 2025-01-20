import { Logic, Visual } from '../../Controller.js';
import { fetchTimezoneAndWeather } from './fetchers.js'
import  afterFetching  from './renderAfterFetch.js'
import { runEventListeners } from '../../Controller.js'

// ================================================================================================

function updateThisSavedLocation() {
    const objOfData = Visual.getThisLocationData()  // getting this location data from the newly rendered
    Logic.updateSavedLocation(objOfData)  // pushing it to Logic.savedLocations and LS
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

export { updateThisSavedLocation, savedLocationsClick, makeLocationPrimary, locationBtnsHandler }