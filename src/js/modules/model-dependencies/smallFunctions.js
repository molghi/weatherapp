
// checks if the arrays that have recent fetches do not grow to be more than length 20: 
// if they more than length 20, i slice them and make them length 20 (the last 20 pushed items, older ones sliced out) else they occupy too much space in LS
function truncateFetchArrays(fetchedCoordsGetter, previousWeatherFetchesGetter, previousTimezoneFetchesGetter, fetchedCoordsSetter, previousWeatherFetchesSetter, previousTimezoneFetchesSetter) {
    const fetchedCoords = fetchedCoordsGetter()
    const previousWeatherFetches = previousWeatherFetchesGetter()
    const previousTimezoneFetches = previousTimezoneFetchesGetter()

    const amountOfElementsToHave = 20

    if(fetchedCoords.length > amountOfElementsToHave) {
        // fetchedCoords = fetchedCoords.slice(-amountOfElementsToHave)
        fetchedCoordsSetter(fetchedCoords.slice(-amountOfElementsToHave))
        // localStorage.setItem('userCoords', JSON.stringify(fetchedCoords))
        localStorage.setItem('userCoords', JSON.stringify(fetchedCoordsGetter()))
    }
    if(previousWeatherFetches.length > amountOfElementsToHave) {
        // previousWeatherFetches = previousWeatherFetches.slice(-amountOfElementsToHave)
        previousWeatherFetchesSetter(previousWeatherFetches.slice(-amountOfElementsToHave))
        // localStorage.setItem('weatherFetches', JSON.stringify(previousWeatherFetches))
        localStorage.setItem('weatherFetches', JSON.stringify(previousWeatherFetchesGetter()))
    }
    if(previousTimezoneFetches.length > amountOfElementsToHave) {
        // previousTimezoneFetches = previousTimezoneFetches.slice(-amountOfElementsToHave)
        previousTimezoneFetchesSetter(previousTimezoneFetches.slice(-amountOfElementsToHave))
        // localStorage.setItem('timezoneFetches', JSON.stringify(previousTimezoneFetches))
        localStorage.setItem('timezoneFetches', JSON.stringify(previousTimezoneFetchesGetter()))
    }
}

// ================================================================================================

// defines the time of the day (returns a word, string)
function defineDayTime(nowHours) {
    if(nowHours>=18  && nowHours <=23) return 'Evening'
    else if(nowHours>=0  && nowHours <6) return 'Night'
    else if(nowHours>=6  && nowHours <12) return 'Morning'
    else return 'Day'
}

// ================================================================================================

// switches the value of Logic.tempUnits and returns it
function switchTempUnits(tempUnitsGetter, tempUnitsSetter) {
    const tempUnits = tempUnitsGetter()
    if(tempUnits === 'Celsius') tempUnitsSetter('Fahrenheit')
    else tempUnitsSetter('Celsius')
    return tempUnitsGetter()
}

// ================================================================================================

// converts to local time: returns "HH:mm"
function convertToCorrectTime(dateTimeStr, offsetInSeconds) {    
    const time = new Date(dateTimeStr)
    time.setSeconds(time.getSeconds() + offsetInSeconds);
    return time.toISOString().slice(11, 16);
}


export { truncateFetchArrays, defineDayTime, switchTempUnits, convertToCorrectTime }