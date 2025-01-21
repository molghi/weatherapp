
// getting local time: returns an array: current hour and minutes (as numbers)
function getLocalTime(offsetInSec, timeOfTheDay, defineDayTime, type) {  
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

    if(type !== 'in the background') {  // I call it with 'in the background' when I need to update my Saved Location elements
        timeOfTheDay = defineDayTime(adjustedHours)
    }  

    return [adjustedHours, adjustedMinutes]
}

// ================================================================================================

// getting local date: returns a string
function getLocalDay(offsetInSec) {
    const nowUTC = new Date();
    const utcTimestamp = nowUTC.getTime();  // getting the current UTC time in milliseconds
        
    const localTimestamp = utcTimestamp + offsetInSec * 1000;  // calculating the local timestamp
        
    const localDate = new Date(localTimestamp);  // creating a Date object for the local time

    // extractting the day, month, and year based on local time
    const day = localDate.getUTCDate();
    const month = localDate.getUTCMonth() + 1;  
    const year = localDate.getUTCFullYear();
        
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`
}

export { getLocalTime, getLocalDay }