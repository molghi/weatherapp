function getLocalTime(offsetInSec, timeOfTheDay, defineDayTime) {   // returns an array: current hour and minutes (as numbers)
    const offsetInHours = offsetInSec / 3600
    const utcHours = new Date().getUTCHours()
    const utcMinutes = new Date().getUTCMinutes()

    let adjustedHours = utcHours + offsetInHours
    let adjustedMinutes = utcMinutes

    // handling the wrapping of time around a 24-hour clock
    // If adjustedHours exceeds 24, it means the calculated time has gone beyond midnight of the current day and entered the next day.
    // Subtracting 24 ensures the hours "wrap around" and stay within the valid 0–23 range.
    if (adjustedHours >= 24) {
        adjustedHours -= 24
    } else if (adjustedHours < 0) {
        adjustedHours += 24
    }

    timeOfTheDay = defineDayTime(adjustedHours)

    return [adjustedHours, adjustedMinutes]
}

// ================================================================================================

function getLocalDay(offsetInSec) {
    const nowUTC = new Date();
    const utcTimestamp = nowUTC.getTime();  // Get the current UTC time in milliseconds
        
    const localTimestamp = utcTimestamp + offsetInSec * 1000;  // Calculate the local timestamp
        
    const localDate = new Date(localTimestamp);  // Create a Date object for the local time

    // Extract the day, month, and year based on local time
    const day = localDate.getUTCDate();
    const month = localDate.getUTCMonth() + 1;  
    const year = localDate.getUTCFullYear();
        
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`
}

export { getLocalTime, getLocalDay }