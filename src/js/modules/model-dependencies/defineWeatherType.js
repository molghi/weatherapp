
// a helper fn: getting a random video out of some of my selections
const getRandomFromSelection = (arr) => {
    let randomIndex = Math.floor(Math.random() * arr.length)
    return arr[randomIndex]
}

const pathBeginning = `assets/videos`

// ================================================================================================

// video selections (path collections):
const clearSkyDay = [`${pathBeginning}/sunrise-clear.mp4`, `${pathBeginning}/clear-blue-sky-timelapse.mp4`, `${pathBeginning}/ocean-clear-sky.mp4`]
const clearEvening = [`${pathBeginning}/sunset-field-2.mp4`]
const night = [`${pathBeginning}/starry-night.mp4`, `${pathBeginning}/starry-night-sky.mp4`, `${pathBeginning}/starry-night-sky-2.mp4`, `${pathBeginning}/night-sky-with-stars.mp4`, `${pathBeginning}/night-planet.mp4`]

const rainyDay = [`${pathBeginning}/rain-pouring.mp4`, `${pathBeginning}/rain-pouring-2.mp4`, `${pathBeginning}/rain-glass-2.mp4`, `${pathBeginning}/rain-drops-falling.mp4`]
const rainyNight = [`${pathBeginning}/rainy-night.mp4`, `${pathBeginning}/raindrops-flowing-night.mp4`, `${pathBeginning}/rain-at-night.mp4`] 
const rainyEvening = [`${pathBeginning}/rain-dark.mp4`, `${pathBeginning}/rain-dark-leaves.mp4`, `${pathBeginning}/rain-dark-forest.mp4`, `${pathBeginning}/evening-heavy-rain.mp4`]

const morningPartlyCloudy = [`${pathBeginning}/sunrise-timelapse-2.mp4`]
const dayPartlyCloudy = [`${pathBeginning}/blue-sky-clouds-3.mp4`, `${pathBeginning}/blue-sky-rare-clouds.mp4`, `${pathBeginning}/cloud-formation-cloudy.mp4`, `${pathBeginning}/sunset-clouds-timelapse.mp4`]
const eveningPartlyCloudy = [`${pathBeginning}/sunset-clouds.mp4`, `${pathBeginning}/sunset-cloudy-timelapse.mp4`, `${pathBeginning}/sunset-cloudy.mp4`, `${pathBeginning}/sunset-golden-mountains.mp4`, `${pathBeginning}/sunset-ocean-cloudy.mp4`, `${pathBeginning}/sunset-waves-2.mp4`]
const nightPartlyCloudy = [`${pathBeginning}/starry-night.mp4`, `${pathBeginning}/starry-night-sky.mp4`, `${pathBeginning}/starry-night-sky-2.mp4`, `${pathBeginning}/night-sky-with-stars.mp4`,  `${pathBeginning}/night-planet.mp4`, `${pathBeginning}/night-moon-cloudy-3.mp4`, `${pathBeginning}/night-moon-cloudy-2.mp4`, `${pathBeginning}/night-cloudy-moon.mp4`]

const dayFoggy = [`${pathBeginning}/aerial-fog.mp4`, `${pathBeginning}/foggy-mountains-3.mp4`, `${pathBeginning}/foggy-mountains-2.mp4`, `${pathBeginning}/foggy-forest-2.mp4`]
const eveningFoggy = [`${pathBeginning}/evening-foggy-forest.mp4`]
const nightFoggy = [`${pathBeginning}/night-smoke.mp4`, `${pathBeginning}/night-cloudy-moon.mp4`]

const lightRainDay = [`${pathBeginning}/rain-pine-tree.mp4`, `${pathBeginning}/rain-green-leaves.mp4`, `${pathBeginning}/rain-glass-day-2.mp4`]
const lightRainNight = [`${pathBeginning}/rain-light-gloomy.mp4`, `${pathBeginning}/rain-gloomy.mp4`]

const snowyDay = [`${pathBeginning}/snow-day-2.mp4`, `${pathBeginning}/snow-day-3.mp4`,  `${pathBeginning}/snow-day-6.mp4`, `${pathBeginning}/snow-forest-day.mp4`]
const snowyEvening = [`${pathBeginning}/snow-forest-gloomy-day.mp4`]
const snowyNight = [`${pathBeginning}/snow-night-3.mp4`, `${pathBeginning}/snow-night-4.mp4`, `${pathBeginning}/snow-night-5.mp4`]

const thunderDay = [`${pathBeginning}/storm-clouds-timelapse.mp4`, `${pathBeginning}/storm-clouds-2.mp4`, `${pathBeginning}/day-dark-clouds.mp4`,  `${pathBeginning}/clouds-darkish-2.mp4`, `${pathBeginning}/clouds-darkish-3.mp4`, `${pathBeginning}/clouds-darkish.mp4`]
const thunderEve = [`${pathBeginning}/rain-storm-lightning.mp4`]
const thunderNight = [`${pathBeginning}/rain-and-storm-night.mp4`]

// console.log(clearSkyDay.length+clearEvening.length+night.length+rainyDay.length+rainyNight.length+rainyEvening.length+morningPartlyCloudy.length+dayPartlyCloudy.length+eveningPartlyCloudy.length+nightPartlyCloudy.length+dayFoggy.length+eveningFoggy.length+nightFoggy.length+lightRainDay.length+lightRainNight.length+snowyDay.length+snowyEvening.length+snowyNight.length+thunderDay.length+thunderEve.length+thunderNight.length)


// =========================================================================================================================================
// =========================================================================================================================================
// =========================================================================================================================================


// I am calling it in Controller
function defineWeatherType(timeOfTheDay, weathercode) {    // types: string and number; returns a video path
    const string = `${timeOfTheDay}-${weathercode}`

    switch (string) {
        case "Morning-0":
        case "Day-0":
            return getRandomFromSelection(clearSkyDay)
        case "Evening-0":    // "0": "Clear sky"
            return getRandomFromSelection(clearEvening)
        case "Night-0":
            return getRandomFromSelection(night)

// ================================================================================================

        case "Morning-1":
        case "Morning-2":
        case "Morning-3":
            return getRandomFromSelection(morningPartlyCloudy)
        case "Day-1":
        case "Day-2":
        case "Day-3":
            return getRandomFromSelection(dayPartlyCloudy)
        case "Evening-1":      // "Mainly clear, partly cloudy, and overcast"
        case "Evening-2":
        case "Evening-3":
            return getRandomFromSelection(eveningPartlyCloudy)
        case "Night-1":
        case "Night-2":
        case "Night-3":
            return getRandomFromSelection(nightPartlyCloudy) 

// ================================================================================================

        case "Morning-45":
        case "Morning-48":
        case "Day-45":
        case "Day-48":
            return getRandomFromSelection(dayFoggy)
        case "Evening-45":
        case "Evening-48":      // "Fog and depositing rime fog"
            return getRandomFromSelection(eveningFoggy)
        case "Night-45":
        case "Night-48":
            return getRandomFromSelection(nightFoggy)

// ================================================================================================

        case "Morning-51":
        case "Morning-53":
        case "Morning-55":
        case "Day-51":
        case "Day-53":
        case "Day-55":
            return getRandomFromSelection(lightRainDay)
        case "Evening-51":
        case "Evening-53":
        case "Evening-55":     // "Drizzle: Light, moderate, and dense intensity"
        case "Night-51":
        case "Night-53":
        case "Night-55":
            return getRandomFromSelection(lightRainNight)

// ================================================================================================

        case "Morning-56":
        case "Morning-57":
        case "Day-56":
        case "Day-57":
            return getRandomFromSelection(lightRainDay)
        case "Evening-56":
        case "Evening-57":     // "Freezing Drizzle: Light and dense intensity"
        case "Night-56":
        case "Night-57":
            return getRandomFromSelection(lightRainNight)

// ================================================================================================

        case "Morning-61":
        case "Morning-63":
        case "Morning-65":
        case "Day-61":
        case "Day-63":
        case "Day-65":
            return getRandomFromSelection(rainyDay)
        case "Evening-61":
        case "Evening-63":     // "Rain: Slight, moderate and heavy intensity"
        case "Evening-65":
            return getRandomFromSelection(rainyEvening)
        case "Night-61":
        case "Night-63":
        case "Night-65":
            return getRandomFromSelection(rainyNight)

// ================================================================================================

        case "Morning-66":
        case "Morning-67":
        case "Day-66":
        case "Day-67":
            return getRandomFromSelection(rainyDay)
        case "Evening-66":    // "Freezing Rain: Light and heavy intensity"
        case "Evening-67":
            return getRandomFromSelection(rainyEvening)
        case "Night-66":
        case "Night-67":
            return getRandomFromSelection(rainyNight)

// ================================================================================================

        case "Morning-71":
        case "Morning-73":
        case "Morning-75":
        case "Day-71":
        case "Day-73":
        case "Day-75":
            return getRandomFromSelection(snowyDay)
        case "Evening-71":     // "Snow fall: Slight, moderate, and heavy intensity"
        case "Evening-73":
        case "Evening-75":
            return getRandomFromSelection(snowyEvening)
        case "Night-71":
        case "Night-73":
        case "Night-75":
            return getRandomFromSelection(snowyNight)            

// ================================================================================================

        case "Morning-77":
        case "Day-77":         // "Snow grains"
            return getRandomFromSelection(snowyDay)
        case "Evening-77":
            return getRandomFromSelection(snowyEvening)
        case "Night-77":
            return getRandomFromSelection(snowyNight)            

// ================================================================================================

        case "Morning-80":
        case "Morning-81":
        case "Morning-82":
        case "Day-80":
        case "Day-81":
        case "Day-82":
            return getRandomFromSelection(rainyDay)
        case "Evening-80":
        case "Evening-81":     // "Rain showers: Slight, moderate, and violent"
        case "Evening-82":
            return getRandomFromSelection(rainyEvening)
        case "Night-80":
        case "Night-81":
        case "Night-82":
            return getRandomFromSelection(rainyNight)

// ================================================================================================

        case "Morning-85":
        case "Morning-86":
        case "Day-85":
        case "Day-86":
            return getRandomFromSelection(snowyDay)
        case "Evening-85":     // "Snow showers slight and heavy"
        case "Evening-86":
            return getRandomFromSelection(snowyEvening)
        case "Night-85":
        case "Night-86":
            return getRandomFromSelection(snowyNight)

// ================================================================================================

        case "Morning-95":
        case "Day-95":         // "Thunderstorm: Slight or moderate"
            return getRandomFromSelection(thunderDay)
        case "Evening-95":
            return getRandomFromSelection(thunderEve)
        case "Night-95":
            return getRandomFromSelection(thunderNight)

// ================================================================================================

        case "Morning-96":
        case "Morning-99":
        case "Day-96":
        case "Day-99":
            return getRandomFromSelection(thunderDay)
        case "Evening-96":     // "Thunderstorm with slight and heavy hail"
        case "Evening-99":
            return getRandomFromSelection(thunderEve)
        case "Night-96":
        case "Night-99":
            return getRandomFromSelection(thunderNight)

// ================================================================================================

        default:
            return `${pathBeginning}/foggy-forest-2.mp4`
            // return `${pathBeginning}/night-smoke.mp4`
    }
}

export default defineWeatherType; 