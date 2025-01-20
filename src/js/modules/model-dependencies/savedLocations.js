import { pushToLocalStorage } from './pushAndGet.js'

function updateSavedLocation(objOfData, savedLocations) {
    const indexOfThisLocation = savedLocations.findIndex(entry => entry.coords.toString() === objOfData.coords.toString())

    // updating:
    savedLocations[indexOfThisLocation].localTime = objOfData.localTime
    savedLocations[indexOfThisLocation].temp = objOfData.temp
    savedLocations[indexOfThisLocation].icon = objOfData.icon
    savedLocations[indexOfThisLocation].feelsLikeTemp = objOfData.feelsLikeTemp
    savedLocations[indexOfThisLocation].description = objOfData.description

    // pushing to LS
    pushToLocalStorage(JSON.stringify(savedLocations), 'savedLocations')
}

    // ================================================================================================

function makeSavedLocationFirst(coords, savedLocations) {
    const indexOfEntry = savedLocations.findIndex(entry => entry.coords.toString() === `${coords[0]},${coords[1]}`)
    const spliced = savedLocations.splice(indexOfEntry, 1)  // removing from the array
    savedLocations.unshift(spliced[0])   // adding as first
    pushToLocalStorage(JSON.stringify(savedLocations), 'savedLocations')
}

// ================================================================================================

function removeFromSavedLocations(latStr, lngStr, savedLocations) {
    const indexToRemove = savedLocations.findIndex(entry => entry.coords.toString() === `${latStr},${lngStr}`)
    savedLocations.splice(indexToRemove, 1)  // removing from the array
    pushToLocalStorage(JSON.stringify(savedLocations), 'savedLocations')
}

export { updateSavedLocation, makeSavedLocationFirst, removeFromSavedLocations }