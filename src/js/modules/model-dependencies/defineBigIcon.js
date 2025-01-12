async function defineBigIcon(weathercode, dayTime) {
        console.log('defineBigIcon:', weathercode, dayTime)
        const string = `${weathercode}_${dayTime}`

        switch (string) {
            case `0_Evening`:     // "0": "Clear sky"
                return import(`../../../img/weather-icons/clear-night.svg`);
            case `0_Night`:
                return import(`../../../img/weather-icons/starry-night.svg`);
            case `0_Morning`:
                return import(`../../../img/weather-icons/horizon.svg`);
            case `0_Day`:
                return import(`../../../img/weather-icons/clear-day.svg`);

            case `1_Night`:
            case `2_Night`:
            case `3_Night`:
                return import(`../../../img/weather-icons/overcast-night.svg`);
            case `1_Evening`:     // "Mainly clear, partly cloudy, and overcast"
            case `2_Evening`:
            case `3_Evening`:
                return import(`../../../img/weather-icons/partly-cloudy-night.svg`);
            case `1_Morning`:
            case `2_Morning`:
            case `3_Morning`:
                return import(`../../../img/weather-icons/partly-cloudy-day.svg`);
            case `1_Day`:
            case `2_Day`:
                return import(`../../../img/weather-icons/cloudy.svg`);
            case `3_Day`:
                return import(`../../../img/weather-icons/overcast-day.svg`);

            case "45_Evening":
            case "48_Evening":     // "Fog and depositing rime fog"
            return import(`../../../img/weather-icons/partly-cloudy-night-fog.svg`);
            case "45_Night":
                return import(`../../../img/weather-icons/fog-night.svg`);
            case "48_Night":
                return import(`../../../img/weather-icons/partly-cloudy-night-haze.svg`);
            case "45_Morning":
                return import(`../../../img/weather-icons/fog.svg`);
            case "48_Morning":
                return import(`../../../img/weather-icons/partly-cloudy-day-haze.svg`);
            case "45_Day":
                return import(`../../../img/weather-icons/fog-day.svg`);
            case "48_Day":
                return import(`../../../img/weather-icons/partly-cloudy-day-fog.svg`);

            case "51_Evening":
            case "53_Evening":
            case "55_Evening":     // "Drizzle: Light, moderate, and dense intensity"
                return import(`../../../img/weather-icons/drizzle.svg`);
            case "51_Night":
            case "53_Night":
            case "55_Night":
                return import(`../../../img/weather-icons/partly-cloudy-night-drizzle.svg`);
            case "51_Morning":
            case "53_Morning":
            case "55_Morning":  
                return import(`../../../img/weather-icons/partly-cloudy-day-drizzle.svg`);
            case "51_Day":
            case "53_Day":
            case "55_Day":
                return import(`../../../img/weather-icons/drizzle.svg`);

            case "56_Evening":
            case "57_Evening":
            case "56_Night":        // "Freezing Drizzle: Light and dense intensity"
            case "57_Night":
                return import(`../../../img/weather-icons/partly-cloudy-night-sleet.svg`);
            case "56_Morning":
            case "57_Morning":
                return import(`../../../img/weather-icons/partly-cloudy-day-sleet.svg`);
            case "56_Day":   
            case "57_Day":
                return import(`../../../img/weather-icons/sleet.svg`);

            case "61_Evening":
            case "63_Evening":
            case "65_Evening":
            case "61_Night":         // "Rain: Slight, moderate and heavy intensity"
            case "63_Night":
            case "65_Night":
                return import(`../../../img/weather-icons/partly-cloudy-night-rain.svg`);
            case "61_Morning":
            case "63_Morning":
            case "65_Morning":
                return import(`../../../img/weather-icons/partly-cloudy-day-rain.svg`);
            case "61_Day":   
            case "63_Day":
            case "65_Day":
                return import(`../../../img/weather-icons/rain.svg`);

            case "66_Evening":
            case "67_Evening":
            case "66_Night":         // "Freezing Rain: Light and heavy intensity"
            case "67_Night":
                return import(`../../../img/weather-icons/partly-cloudy-night-sleet.svg`);
            case "66_Morning":
            case "67_Morning":
                return import(`../../../img/weather-icons/partly-cloudy-day-sleet.svg`);
            case "66_Day":  
            case "67_Day":
                return import(`../../../img/weather-icons/sleet.svg`);

            case "71_Evening":
            case "73_Evening":
            case "75_Evening":
            case "71_Night":        // "Snow fall: Slight, moderate, and heavy intensity"
            case "73_Night":
            case "75_Night":
                return import(`../../../img/weather-icons/partly-cloudy-night-snow.svg`);
            case "71_Morning":
            case "73_Morning":
            case "75_Morning":
                return import(`../../../img/weather-icons/partly-cloudy-day-snow.svg`);
            case "71_Day":  
            case "73_Day":
            case "75_Day":
                return import(`../../../img/weather-icons/snow.svg`);

            case "77_Evening":
            case "77_Night":         // "Snow grains"
                return import(`../../../img/weather-icons/snow.svg`);
            case "77_Morning":
            case "77_Day":
                return import(`../../../img/weather-icons/snowflake.svg`);

            case "80_Evening":
            case "81_Evening":
            case "82_Evening":
            case "80_Night":        // "Rain showers: Slight, moderate, and violent"
            case "81_Night":
            case "82_Night":
                return import(`../../../img/weather-icons/partly-cloudy-night-rain.svg`);
            case "80_Morning":
            case "81_Morning":
            case "82_Morning":
                return import(`../../../img/weather-icons/partly-cloudy-day-rain.svg`);
            case "80_Day":
            case "81_Day":
            case "82_Day":
                return import(`../../../img/weather-icons/rain.svg`);

            case "85_Evening":
            case "86_Evening":
            case "85_Night":        // "Snow showers slight and heavy"
            case "86_Night":
                return import(`../../../img/weather-icons/partly-cloudy-night-snow.svg`);
            case "85_Morning":
            case "86_Morning":
                return import(`../../../img/weather-icons/partly-cloudy-day-snow.svg`);
            case "85_Day":
            case "86_Day":
                return import(`../../../img/weather-icons/snow.svg`);

            case "95_Evening":
                return import(`../../../img/weather-icons/thunderstorms-night-rain.svg`);
            case "95_Night":       // "Thunderstorm: Slight or moderate"
                return import(`../../../img/weather-icons/thunderstorms-night.svg`);
            case "95_Morning":
                return import(`../../../img/weather-icons/thunderstorms-day.svg`);
            case "95_Day":
                return import(`../../../img/weather-icons/thunderstorms.svg`);

            case "96_Evening":
            case "99_Evening":
            case "96_Night":
            case "99_Night":        // "Thunderstorm with slight and heavy hail"
                return import(`../../../img/weather-icons/partly-cloudy-night-hail.svg`);
            case "96_Morning":
            case "99_Morning":
                return import(`../../../img/weather-icons/partly-cloudy-day-hail.svg`);
            case "96_Day":
            case "99_Day":
                return import(`../../../img/weather-icons/hail.svg`);

            default:
                return import(`../../../img/weather-icons/overcast.svg`);
                break;
        }
    }


export default defineBigIcon;