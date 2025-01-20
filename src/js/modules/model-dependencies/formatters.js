// formatting the obj that I am passing here in a neat, ready-to-be-rendered format
function formatHourly(obj, getWeatherDescription) {
    const time = obj.time.map(timeStr => `${new Date(timeStr).getHours()}:${new Date(timeStr).getMinutes().toString().padStart(2,0)}`)
    const tempFeelsLike = obj.apparent_temperature
    const tempGeneral = obj.temperature_2m
    const weathercodes = obj.weather_code.map(code => getWeatherDescription(code))
    const precipitation = obj.precipitation
    const precipitationProbability = obj.precipitation_probability
    const humidity = obj.relative_humidity_2m
    const rain = obj.rain
    const showers = obj.showers
    const snowfall = obj.snowfall
    const snowDepth = obj.snow_depth
    const cloudCover = obj.cloud_cover
    const formattedObj = {time, tempFeelsLike, tempGeneral, weathercodes, precipitation, precipitationProbability, humidity, rain, showers, snowfall, snowDepth, cloudCover}
    return formattedObj
}

// ================================================================================================

// formatting the obj that I am passing here in a neat, ready-to-be-rendered format
function formatDaily(obj, getWeatherDescription, offsetInSeconds) {
    const myObj = JSON.parse(JSON.stringify(obj))
    myObj.apparent_temperature_max = myObj.apparent_temperature_max.map(temp => Math.floor(temp))
    myObj.apparent_temperature_min = myObj.apparent_temperature_min.map(temp => Math.floor(temp))
    myObj.daylight_duration = myObj.daylight_duration.map(durInSec => `${Math.trunc(durInSec/3600)} ${Math.floor((durInSec % 3600) / 60)}`)
    myObj.sunshine_duration = myObj.sunshine_duration.map(durInSec => `${Math.trunc(durInSec/3600)} ${Math.floor((durInSec % 3600) / 60)}`)
    myObj.sunrise = returnCorrectSuntimes(myObj.sunrise, offsetInSeconds)
    myObj.sunset = returnCorrectSuntimes(myObj.sunset, offsetInSeconds)
    myObj.weathercodes = myObj.weather_code.map(code => getWeatherDescription(code))
    myObj.temperature_2m_max = myObj.temperature_2m_max.map(temp => Math.floor(temp))
    myObj.temperature_2m_min = myObj.temperature_2m_min.map(temp => Math.floor(temp))

    delete myObj.wind_direction_10m_dominant
    delete myObj.wind_gusts_10m_max
    delete myObj.wind_speed_10m_max
    delete myObj.weather_code

    return myObj
}

// ================================================================================================

function returnCorrectSuntimes(arr, offsetInSeconds) {
    const newArr = arr.map(dateTimeStr => {
        const time = new Date(dateTimeStr)
        time.setSeconds(time.getSeconds() + offsetInSeconds);
        let string = time.toISOString().slice(11, 16);
        if(string.startsWith('0')) string = string.replace('0', '');
        return string;
    })
    return newArr 
}

// ================================================================================================

export { formatHourly, formatDaily }