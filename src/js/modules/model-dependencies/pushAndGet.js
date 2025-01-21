
function pushToLocalStorage(value, key) {
    localStorage.setItem(key, value)
}

// ================================================================================================

// pushing saved location
function pushSavedLocation(obj, flag, savedLocations) {
    if(flag==='pushPrimary') {
        savedLocations.unshift(obj)
    } else {
        savedLocations.push(obj)
    }
    pushToLocalStorage(JSON.stringify(savedLocations), 'savedLocations')
}

// ================================================================================================

// fetching saved locations
function getSavedLocations(savedLocations) {
    const fetched = localStorage.getItem('savedLocations')
    if(!fetched) return
    JSON.parse(fetched).forEach(locationObj => {
        const index = savedLocations.findIndex(savedLoc => savedLoc.coords.toString() === locationObj.coords.toString())
        if(index < 0) savedLocations.push(locationObj)  // if index < 0, means it wasn't found there, means we can push it there without the fear of having duplicates
    })
}

// ================================================================================================

// fetching primary location
function getPrimaryLocation() {
    const fetched = localStorage.getItem('primaryLocation')
    if(!fetched) return null
    return JSON.parse(fetched)
}

// ================================================================================================

// pushing primary location
function pushPrimaryLocation([lat,lng], primaryLocation) {
    primaryLocation = []
    primaryLocation.push(lat, lng)
    pushToLocalStorage(JSON.stringify(primaryLocation), 'primaryLocation')
}

// ================================================================================================

// pushing fetched coords
function pushFetchedCoords(value, fetchedCoords) {
    fetchedCoords.push(value)
}

// ================================================================================================

// pushing weather fetch
function pushWeatherFetch(value, previousWeatherFetches) {
    previousWeatherFetches.push(value)
}

// ================================================================================================

// pushing timezone fetch
function pushTimezoneFetch(value, previousTimezoneFetches) {
    previousTimezoneFetches.push(value)
}

// ================================================================================================

// pushing weather fetches to LS
function pushWeatherFetchesToLS(previousWeatherFetches) {
    // console.log(previousWeatherFetches)
        const weather = JSON.stringify(previousWeatherFetches)
        pushToLocalStorage(weather, 'weatherFetches')
        // console.log(JSON.parse(localStorage.getItem('weatherFetches')))
    }

// ================================================================================================

// pushing timezone fetches to LS
function pushTimezoneFetchesToLS(previousTimezoneFetches) {
    const timezone = JSON.stringify(previousTimezoneFetches)
    pushToLocalStorage(timezone, 'timezoneFetches')
}

// ================================================================================================

// fetching weather fetches from LS
function getWeatherFetchesFromLS(previousWeatherFetches) {
    const fetch = localStorage.getItem('weatherFetches')
    if (fetch) previousWeatherFetches = JSON.parse(fetch);
}

// ================================================================================================

// fetching timezone fetches from LS
function getTimezoneFetchesFromLS(previousTimezoneFetches) {
    const fetch = localStorage.getItem('timezoneFetches')
    if (fetch) previousTimezoneFetches = JSON.parse(fetch);
}
    
// ================================================================================================
    
// fetching coords fetches from LS
function getCoordsFetchesFromLS(fetchedCoords) {
    const fetch = localStorage.getItem('userCoords')
    if (fetch) fetchedCoords = JSON.parse(fetch);
}

// ================================================================================================

// getting and returning the string of explained wind direction
function getWindDirection(degrees) {
    const directions = [
        "North", "North-Northeast", "Northeast", "East-Northeast",
        "East", "East-Southeast", "Southeast", "South-Southeast",
        "South", "South-Southwest", "Southwest", "West-Southwest",
        "West", "West-Northwest", "Northwest", "North-Northwest"
    ];
    const index = Math.round(degrees / 22.5) % 16; 
    // Note: Divide by 22.5 to get 16 sectors --> The value 22.5 is used to divide a full circle (360°) into 16 equal compass sectors (directions), corresponding to the 16-point compass rose (e.g., North, North-Northeast, Northeast, etc.) --> 360° ÷ 16 = 22.5° per sector
    return directions[index];
}

export { pushToLocalStorage, pushSavedLocation, getSavedLocations, getPrimaryLocation, pushPrimaryLocation, pushFetchedCoords, pushWeatherFetch, pushTimezoneFetch, pushWeatherFetchesToLS, pushTimezoneFetchesToLS, getWeatherFetchesFromLS, getTimezoneFetchesFromLS, getCoordsFetchesFromLS, getWindDirection }