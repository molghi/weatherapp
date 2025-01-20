import { Logic, Visual } from '../../Controller.js';
import { pushFetchesToModelAndLs } from './smallFuncs.js'
import { renderAll, renderSunriseSunset } from './rendering.js'


export default async function afterFetching(fetchedWeather, fetchedTimezone) {
    // pushing fetches to Model and LS
    pushFetchesToModelAndLs(fetchedWeather, fetchedTimezone)

    // pushing fetched user coords to LS
    Logic.pushToLocalStorage(JSON.stringify(Logic.fetchedCoords), 'userCoords')

    // rendering main block, hourly, daily, title box, and making time update every min
    renderAll(fetchedTimezone, fetchedWeather)  // I import it above

    // converting from C to F -- as a result of that we have two arrays -- all Celsius values and all Fahrenheit values
    Logic.setAllDegrees(fetchedWeather)  

    // updating Document Title
    const shortDescription = Logic.giveShortDescription(fetchedWeather.weathercode)
    Visual.updateDocumentTitle(Math.floor(fetchedWeather.temp), shortDescription)

    // DELETE IT
    logOutTimeNow()

    // setting sunrise and sunset time
    const todayString = Logic.getLocalDay(Logic.offsetInSeconds).split('/').reverse().join('-')  // formatted like '2025-01-11'
    const indexOfTodayInDaily = fetchedWeather.daily.sunset.findIndex(x => x.startsWith(todayString))
    Logic.setSunriseTime(fetchedWeather.daily.sunrise[indexOfTodayInDaily])
    Logic.setSunsetTime(fetchedWeather.daily.sunset[indexOfTodayInDaily])
    renderSunriseSunset(fetchedWeather)

    // rendering Change Location button
    Visual.renderChangeLocBtn()  
    
    // rendering Show Map globe icon button
    Visual.renderMapBtn()

    // putting the bg video there
    const bgVideoPath = Logic.defineWeatherType()  
    await Visual.showBackgroundVideo(bgVideoPath)
}

// ================================================================================================

// DELETE IT
function logOutTimeNow() {
    console.log(`⏰ ${new Date().getHours()}:${(new Date().getMinutes()).toString().padStart(2,0)}`)
    setInterval(() => {
        console.log(`⏰ ${new Date().getHours()}:${(new Date().getMinutes()).toString().padStart(2,0)}`)
    }, 60000);
}