
// converts 'value' to F/C and returns it
function convertTempUnits(value, flag) {
    if(flag === 'toFahrenheit') {
        return (value * 9/5) + 32
    } else { // to Celsius
        return (value - 32) * 5/9
    }
}

// ================================================================================================

// get all current temps on the screen as an array, in Fahr and Cels
function setAllDegrees(fetchedWeather, degrees, degreesFahrenheit) {
    getObjectOfDegrees(fetchedWeather, degrees)  // gets you an object of all degree values that are in the UI now (main, feels like, in hourly and daily), based on the fetch response

    // setting Fahrenheit values:
    degreesFahrenheit.tempNow = Math.floor(convertTempUnits(degrees.tempNow, 'toFahrenheit'))

    degreesFahrenheit.feelsLike = Math.floor(convertTempUnits(degrees.feelsLike, 'toFahrenheit'))

    degreesFahrenheit.hourly = degrees.hourly.map(arr => {
        const val1 = Math.floor(convertTempUnits(arr[0], 'toFahrenheit'))
        const val2 = Math.floor(convertTempUnits(arr[1], 'toFahrenheit'))
        return [val1, val2]
    })
    degreesFahrenheit.daily = degrees.daily.map(arr => {
        const val1 = Math.floor(convertTempUnits(arr[0], 'toFahrenheit'))
        const val2 = Math.floor(convertTempUnits(arr[1], 'toFahrenheit'))
        const val3 = Math.floor(convertTempUnits(arr[2], 'toFahrenheit'))
        const val4 = Math.floor(convertTempUnits(arr[3], 'toFahrenheit'))
        return [val1, val2, val3, val4]
    })
        
    // after that, 'degreesFahrenheit' is an arr of Fahrenheit values ready to render   ---   'degrees' is an arr of Celsius values ready to render
}

// ================================================================================================

// dependency of 'setAllDegrees' -- this fn gets you an object of all degree values that are in the UI now (main, feels like, in hourly and daily) -- based on the fetch response
function getObjectOfDegrees(fetchedWeather, degrees) {
    degrees.tempNow = fetchedWeather.temp
        
    const today = getTodayString()
    let now = getNowTime()

    if(new Date().getHours() < 10) now = '0' + now   // failsafe

    const nowString = `${today}T${now}`.split(':')[0]

    let indexInHourly = fetchedWeather.hourly.time.findIndex(x => x.startsWith(nowString))    // we need the index of the present moment to navigate in fetched results

    degrees.feelsLike = fetchedWeather.hourly.apparent_temperature[indexInHourly]
    degrees.hourly = []
    degrees.daily = []

    // pushing Hourly's (6 for 6 hours)
    for (let i = 0; i < 6; i++) {
        const tempMain = fetchedWeather.hourly.temperature_2m[indexInHourly]
        const tempFeelsLike = fetchedWeather.hourly.apparent_temperature[indexInHourly]
        degrees.hourly.push([tempMain, tempFeelsLike])
        indexInHourly += 1
    }
        
    let indexOfDaily = fetchedWeather.daily.time.findIndex(x => x === today)    // we need the index of today
    
    // pushing Daily's (3 for 3 days)
    for (let i = 0; i < 3; i++) {
        indexOfDaily += 1
        const feelsLikeMin = fetchedWeather.daily.apparent_temperature_min[indexOfDaily]
        const feelsLikeMax = fetchedWeather.daily.apparent_temperature_max[indexOfDaily]
        const mainTempMin = fetchedWeather.daily.temperature_2m_min[indexOfDaily]
        const mainTempMax = fetchedWeather.daily.temperature_2m_max[indexOfDaily]
        degrees.daily.push([mainTempMin, mainTempMax, feelsLikeMin, feelsLikeMax])
    }
}

// ================================================================================================

// dependencies of 'getObjectOfDegrees'
const getTodayString = () => `${new Date().getFullYear()}-${(new Date().getMonth()+1).toString().padStart(2,0)}-${(new Date().getDate()).toString().padStart(2,0)}`
const getNowTime = () => `${new Date().getHours()}:${new Date().getMinutes().toString().padStart(2,0)}`

// ================================================================================================


export { setAllDegrees, convertTempUnits }