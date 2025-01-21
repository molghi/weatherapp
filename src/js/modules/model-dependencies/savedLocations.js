import { pushToLocalStorage } from './pushAndGet.js'


// updating saved location
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

// making one saved location first/primary
function makeSavedLocationFirst(coords, savedLocations) {
    const indexOfEntry = savedLocations.findIndex(entry => entry.coords.toString() === `${coords[0]},${coords[1]}`)
    const spliced = savedLocations.splice(indexOfEntry, 1)  // removing from the array
    savedLocations.unshift(spliced[0])   // adding as first
    pushToLocalStorage(JSON.stringify(savedLocations), 'savedLocations')   // updating in LS
}

// ================================================================================================

// removing saved location
function removeFromSavedLocations(latStr, lngStr, savedLocations) {
    const indexToRemove = savedLocations.findIndex(entry => entry.coords.toString() === `${latStr},${lngStr}`)
    savedLocations.splice(indexToRemove, 1)  // removing from the array
    pushToLocalStorage(JSON.stringify(savedLocations), 'savedLocations')  // pushing to LS
}

// ================================================================================================

// updating saved locations
function updateSavedLocations(arr, savedLocations) {
    if(arr.length===0 || !arr) return;

    // updating
    arr.forEach((locEl, i) => {
        savedLocations[i].description = locEl.description;
        savedLocations[i].feelsLikeTemp = `Feels like ${locEl.feelsLikeTemp}°C`;
        savedLocations[i].icon = locEl.icon;
        savedLocations[i].localTime = `${locEl.localTime[0]}:${locEl.localTime[1].toString().padStart(2,0)}`;
        savedLocations[i].temp = `${locEl.temp}°C`;
    })

    // and pushing to ls
    localStorage.setItem('savedLocations', JSON.stringify(savedLocations))
}


export { updateSavedLocation, makeSavedLocationFirst, removeFromSavedLocations, updateSavedLocations }