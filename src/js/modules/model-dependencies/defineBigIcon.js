// importing all necessary icons 
import clearNight from '../../../img/weather-icons/clear-night.svg';
import starryNight from '../../../img/weather-icons/starry-night.svg';
import horizon from '../../../img/weather-icons/horizon.svg';
import clearDay from '../../../img/weather-icons/clear-day.svg';
import overcastNight from '../../../img/weather-icons/overcast-night.svg';
import partlyCloudyNight from '../../../img/weather-icons/partly-cloudy-night.svg';
import partlyCloudyDay from '../../../img/weather-icons/partly-cloudy-day.svg';
import cloudy from '../../../img/weather-icons/cloudy.svg';
import overcastDay from '../../../img/weather-icons/overcast-day.svg';
import partlyCloudyNightFog from '../../../img/weather-icons/partly-cloudy-night-fog.svg';
import fogNight from '../../../img/weather-icons/fog-night.svg';
import partlyCloudyNightHaze from '../../../img/weather-icons/partly-cloudy-night-haze.svg';
import fog from '../../../img/weather-icons/fog.svg';
import partlyCloudyDayHaze from '../../../img/weather-icons/partly-cloudy-day-haze.svg';
import fogDay from '../../../img/weather-icons/fog-day.svg';
import partlyCloudyDayFog from '../../../img/weather-icons/partly-cloudy-day-fog.svg';
import drizzle from '../../../img/weather-icons/drizzle.svg';
import partlyCloudyNightDrizzle from '../../../img/weather-icons/partly-cloudy-night-drizzle.svg';
import partlyCloudyDayDrizzle from '../../../img/weather-icons/partly-cloudy-day-drizzle.svg';
import partlyCloudyNightSleet from '../../../img/weather-icons/partly-cloudy-night-sleet.svg';
import partlyCloudyDaySleet from '../../../img/weather-icons/partly-cloudy-day-sleet.svg';
import sleet from '../../../img/weather-icons/sleet.svg';
import partlyCloudyNightRain from '../../../img/weather-icons/partly-cloudy-night-rain.svg';
import partlyCloudyDayRain from '../../../img/weather-icons/partly-cloudy-day-rain.svg';
import rain from '../../../img/weather-icons/rain.svg';
import partlyCloudyNightSnow from '../../../img/weather-icons/partly-cloudy-night-snow.svg';
import partlyCloudyDaySnow from '../../../img/weather-icons/partly-cloudy-day-snow.svg';
import snow from '../../../img/weather-icons/snow.svg';
import snowflake from '../../../img/weather-icons/snowflake.svg';
import thunderstormsNightRain from '../../../img/weather-icons/thunderstorms-night-rain.svg';
import thunderstormsNight from '../../../img/weather-icons/thunderstorms-night.svg';
import thunderstormsDay from '../../../img/weather-icons/thunderstorms-day.svg';
import thunderstorms from '../../../img/weather-icons/thunderstorms.svg';
import partlyCloudyNightHail from '../../../img/weather-icons/partly-cloudy-night-hail.svg';
import partlyCloudyDayHail from '../../../img/weather-icons/partly-cloudy-day-hail.svg';
import hail from '../../../img/weather-icons/hail.svg';
import overcast from '../../../img/weather-icons/overcast.svg';


// I call it in 'rendering.js' file
function defineBigIcon(weathercode, dayTime) {
        const string = `${weathercode}_${dayTime}`

        switch (string) {
            case `0_Evening`:     // "0": "Clear sky"
                return clearNight;
            case `0_Night`:
                return starryNight;
            case `0_Morning`:
                return horizon;
            case `0_Day`:
                return clearDay;

            case `1_Night`:
            case `2_Night`:
            case `3_Night`:
                return overcastNight;
            case `1_Evening`:     // "Mainly clear, partly cloudy, and overcast"
            case `2_Evening`:
            case `3_Evening`:
                return partlyCloudyNight;
            case `1_Morning`:
            case `2_Morning`:
            case `3_Morning`:
                return partlyCloudyDay;
            case `1_Day`:
            case `2_Day`:
                return cloudy;
            case `3_Day`:
                return overcastDay;

            case "45_Evening":
            case "48_Evening":     // "Fog and depositing rime fog"
                return partlyCloudyNightFog;
            case "45_Night":
                return fogNight;
            case "48_Night":
                return partlyCloudyNightHaze;
            case "45_Morning":
                return fog;
            case "48_Morning":
                return partlyCloudyDayHaze;
            case "45_Day":
                return fogDay;
            case "48_Day":
                return partlyCloudyDayFog;

            case "51_Evening":
            case "53_Evening":
            case "55_Evening":     // "Drizzle: Light, moderate, and dense intensity"
                return drizzle;
            case "51_Night":
            case "53_Night":
            case "55_Night":
                return partlyCloudyNightDrizzle;
            case "51_Morning":
            case "53_Morning":
            case "55_Morning":  
                return partlyCloudyDayDrizzle;
            case "51_Day":
            case "53_Day":
            case "55_Day":
                return drizzle;

            case "56_Evening":
            case "57_Evening":
            case "56_Night":        // "Freezing Drizzle: Light and dense intensity"
            case "57_Night":
                return partlyCloudyNightSleet;
            case "56_Morning":
            case "57_Morning":
                return partlyCloudyDaySleet;
            case "56_Day":   
            case "57_Day":
                return sleet;

            case "61_Evening":
            case "63_Evening":
            case "65_Evening":
            case "61_Night":         // "Rain: Slight, moderate and heavy intensity"
            case "63_Night":
            case "65_Night":
                return partlyCloudyNightRain;
            case "61_Morning":
            case "63_Morning":
            case "65_Morning":
                return partlyCloudyDayRain;
            case "61_Day":   
            case "63_Day":
            case "65_Day":
                return rain;

            case "66_Evening":
            case "67_Evening":
            case "66_Night":         // "Freezing Rain: Light and heavy intensity"
            case "67_Night":
                return partlyCloudyNightSleet;
            case "66_Morning":
            case "67_Morning":
                return partlyCloudyDaySleet;
            case "66_Day":  
            case "67_Day":
                return sleet;

            case "71_Evening":
            case "73_Evening":
            case "75_Evening":
            case "71_Night":        // "Snow fall: Slight, moderate, and heavy intensity"
            case "73_Night":
            case "75_Night":
                return partlyCloudyNightSnow;
            case "71_Morning":
            case "73_Morning":
            case "75_Morning":
                return partlyCloudyDaySnow;
            case "71_Day":  
            case "73_Day":
            case "75_Day":
                return snow;

            case "77_Evening":
            case "77_Night":         // "Snow grains"
                return snow;
            case "77_Morning":
            case "77_Day":
                return snowflake;

            case "80_Evening":
            case "81_Evening":
            case "82_Evening":
            case "80_Night":        // "Rain showers: Slight, moderate, and violent"
            case "81_Night":
            case "82_Night":
                return partlyCloudyNightRain;
            case "80_Morning":
            case "81_Morning":
            case "82_Morning":
                return partlyCloudyDayRain;
            case "80_Day":
            case "81_Day":
            case "82_Day":
                return rain;

            case "85_Evening":
            case "86_Evening":
            case "85_Night":        // "Snow showers slight and heavy"
            case "86_Night":
                return partlyCloudyNightSnow;
            case "85_Morning":
            case "86_Morning":
                return partlyCloudyDaySnow;
            case "85_Day":
            case "86_Day":
                return snow;

            case "95_Evening":
                return thunderstormsNightRain;
            case "95_Night":       // "Thunderstorm: Slight or moderate"
                return thunderstormsNight;
            case "95_Morning":
                return thunderstormsDay;
            case "95_Day":
                return thunderstorms;

            case "96_Evening":
            case "99_Evening":
            case "96_Night":
            case "99_Night":        // "Thunderstorm with slight and heavy hail"
                return partlyCloudyNightHail;
            case "96_Morning":
            case "99_Morning":
                return partlyCloudyDayHail;
            case "96_Day":
            case "99_Day":
                return hail;

            default:
                return overcast;
                break;
        }
    }


export default defineBigIcon;
