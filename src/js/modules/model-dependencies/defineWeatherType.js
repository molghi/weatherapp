// importing all necessary videos
// import clearNight from '../../../img/weather-icons/clear-night.svg'

// and then:
// case `0_Evening`:     // "0": "Clear sky"
    // return clearNight;


// I am calling it in Controller
function defineWeatherType(timeOfTheDay, weathercode) {    // types: string and number; returns a video path
    console.log(`defineWeatherType:`,timeOfTheDay, weathercode)
    const string = `${timeOfTheDay}-${weathercode}`

    switch (string) {
        case "Morning-0":
        case "Day-0":
        case "Evening-0":    // "0": "Clear sky"
        case "Night-0":
            // return import(`../../../img/weather-icons/overcast.svg`);
            break
        case "Morning-1":
        case "Morning-2":
        case "Morning-3":
        case "Day-1":
        case "Day-2":
        case "Day-3":
        case "Evening-1":      // "Mainly clear, partly cloudy, and overcast"
        case "Evening-2":
        case "Evening-3":
        case "Night-1":
        case "Night-2":
        case "Night-3":
            break
        case "Morning-45":
        case "Morning-48":
        case "Day-45":
        case "Day-48":
        case "Evening-45":
        case "Evening-48":      // "Fog and depositing rime fog"
        case "Night-45":
        case "Night-48":
            break
        case "Morning-51":
        case "Morning-53":
        case "Morning-55":
        case "Day-51":
        case "Day-53":
        case "Day-55":
        case "Evening-51":
        case "Evening-53":
        case "Evening-55":     // "Drizzle: Light, moderate, and dense intensity"
        case "Night-51":
        case "Night-53":
        case "Night-55":
            break
        case "Morning-56":
        case "Morning-57":
        case "Day-56":
        case "Day-57":
        case "Evening-56":
        case "Evening-57":     // "Freezing Drizzle: Light and dense intensity"
        case "Night-56":
        case "Night-57":
            break
        case "Morning-61":
        case "Morning-63":
        case "Morning-65":
        case "Day-61":
        case "Day-63":
        case "Day-65":
        case "Evening-61":
        case "Evening-63":     // "Rain: Slight, moderate and heavy intensity"
        case "Evening-65":
        case "Night-61":
        case "Night-63":
        case "Night-65":
            break
        case "Morning-66":
        case "Morning-67":
        case "Day-66":
        case "Day-67":
        case "Evening-66":    // "Freezing Rain: Light and heavy intensity"
        case "Evening-67":
        case "Night-66":
        case "Night-67":
            break
        case "Morning-71":
        case "Morning-73":
        case "Morning-75":
        case "Day-71":
        case "Day-73":
        case "Day-75":
        case "Evening-71":     // "Snow fall: Slight, moderate, and heavy intensity"
        case "Evening-73":
        case "Evening-75":
        case "Night-71":
        case "Night-73":
        case "Night-75":
            break
        case "Morning-77":
        case "Day-77":         // "Snow grains"
        case "Evening-77":
        case "Night-77":
            break
        case "Morning-80":
        case "Morning-81":
        case "Morning-82":
        case "Day-80":
        case "Day-81":
        case "Day-82":
        case "Evening-80":
        case "Evening-81":     // "Rain showers: Slight, moderate, and violent"
        case "Evening-82":
        case "Night-80":
        case "Night-81":
        case "Night-82":
            break
        case "Morning-85":
        case "Morning-86":
        case "Day-85":
        case "Day-86":
        case "Evening-85":     // "Snow showers slight and heavy"
        case "Evening-86":
        case "Night-85":
        case "Night-86":
            break
        case "Morning-95":
        case "Day-95":         // "Thunderstorm: Slight or moderate"
        case "Evening-95":
        case "Night-95":
            break
        case "Morning-96":
        case "Morning-99":
        case "Day-96":
        case "Day-99":
        case "Evening-96":     // "Thunderstorm with slight and heavy hail"
        case "Evening-99":
        case "Night-96":
        case "Night-99":
            break
    
        default:
            console.log(`default`)
            break;
    }
}

export default defineWeatherType; 