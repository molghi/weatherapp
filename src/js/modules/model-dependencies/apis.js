import { Logic, Visual } from "../../Controller.js"; // needed to show and then hide the spinner: Visual.toggleSpinner
const API_KEY = process.env.API_KEY;
const OPEN_WEATHER_MAP_API_KEY = process.env.OPEN_WEATHER_MAP_API_KEY;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const UNSPLASH_KEY = process.env.UNSPLASH_KEY;

// ================================================================================================

async function fetchWeather(coordsArr, type) {
    try {
        const hourlyParams = `temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,weather_code,cloud_cover,visibility,wind_gusts_10m`;
        const dailyParams = `weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant`;
        const timezoneParams = `Europe%2FIstanbul`;

        if (type !== "in the background") {
            Visual.toggleSpinner();
        } // 'in the background' means for Saved Locations (not the main fetch)

        const API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${coordsArr[0]}&longitude=${coordsArr[1]}&hourly=${hourlyParams}&daily=${dailyParams}&current_weather=true&past_days=7&timezone=${timezoneParams}`;
        const response = await fetch(API_URL);

        if (!response.ok) {
            console.error("💥💥💥 Weather fetch response not OK:", response.status, response.statusText);
            throw new Error("💥💥💥 Failed to fetch the weather");
        }

        if (type !== "in the background") {
            Visual.toggleSpinner("hide");
        }

        const data = await response.json();
        const myObj = {
            temp: data.current_weather.temperature,
            weathercode: data.current_weather.weathercode,
            winddirection: data.current_weather.winddirection,
            windspeed: data.current_weather.windspeed,
            daily: data.daily,
            daily_units: data.daily_units,
            elevation: data.elevation,
            hourly: data.hourly,
            hourly_units: data.hourly_units,
            fetchedAt: {
                fullTime: new Date(),
                hoursMinutes: `${new Date().getHours()}:${new Date().getMinutes().toString().padStart(2, 0)}`,
                date: `${new Date().getDate().toString().padStart(2, 0)}/${(new Date().getMonth() + 1).toString().padStart(2, 0)}/${new Date().getFullYear()}`,
            },
        };
        return myObj;
    } catch (error) {
        console.error(error, error.message);
        throw error; // rethrowing the error to catch further up the chain
    }
}

// ================================================================================================

async function fetchTimezone(coordsArr) {
    try {
        const [lat, lng] = coordsArr;
        const API__URL = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${API_KEY}`;
        const response = await fetch(API__URL);
        if (!response.ok) {
            console.error("💥💥💥 Timezone fetch response not OK:", response.status, response.statusText);
            throw new Error("💥💥💥 Failed to fetch the timezone");
        }
        const data = await response.json();
        const myObj = {
            continent: data.results[0].components.continent,
            country: data.results[0].components.country,
            city: data.results[0].components.city,
            flag: data.results[0].annotations.flag,
            sun: data.results[0].annotations.sun,
            timezone: data.results[0].annotations.timezone,
            coords: data.results[0].geometry,
            fetchedAt: {
                fullTime: new Date(),
                hoursMinutes: `${new Date().getHours()}:${new Date().getMinutes().toString().padStart(2, 0)}`,
                date: `${new Date().getDate().toString().padStart(2, 0)}/${(new Date().getMonth() + 1).toString().padStart(2, 0)}/${new Date().getFullYear()}`,
            },
        };
        return myObj;
    } catch (error) {
        console.error(error, error.message);
        throw error;
    }
}

// ================================================================================================

async function fetchWeatherByCityName(cityName) {
    try {
        const resultsToReturn = 10;
        const API_URL = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=${resultsToReturn}&language=en&format=json`;
        const response = await fetch(API_URL);
        if (!response.ok) {
            console.error("💥💥💥 City name fetch response not OK:", response.status, response.statusText);
            throw new Error("💥💥💥 Fetching by city name was unsuccessful");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error, error.message);
        throw error;
    }
}

// ================================================================================================

async function fetchImage(query) {
    try {
        if (query === "clear") query = "nature";
        const URL = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=landscape&page=1&per_page=30&client_id=${UNSPLASH_KEY}`;
        const URL2 = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=landscape&&page=4per_page=30&client_id=${UNSPLASH_KEY}`;
        const URL3 = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=landscape&&page=5per_page=30&client_id=${UNSPLASH_KEY}`;
        const URL4 = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=landscape&&page=6per_page=30&client_id=${UNSPLASH_KEY}`;
        const URL5 = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=landscape&&page=7per_page=30&client_id=${UNSPLASH_KEY}`;
        const URL6 = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=landscape&&page=8per_page=30&client_id=${UNSPLASH_KEY}`;
        const URL7 = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=landscape&&page=9per_page=30&client_id=${UNSPLASH_KEY}`;
        const URL8 = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=landscape&&page=10per_page=30&client_id=${UNSPLASH_KEY}`;
        // const URL = `https://api.pexels.com/v1/search?query=nature%20night&per_page=80&orientation=landscape`;
        // const response = await fetch(URL, {
        //   headers: {
        //     Authorization: PEXELS_KEY,
        //   },
        // });
        const response = await fetch(URL);
        const response2 = await fetch(URL2);
        const response3 = await fetch(URL3);
        const response4 = await fetch(URL4);
        const response5 = await fetch(URL5);
        const response6 = await fetch(URL6);
        const response7 = await fetch(URL7);
        const response8 = await fetch(URL8);
        if (!response.ok) throw new Error("💥 Oops! Something failed (Unsplash)");
        if (!response2.ok) throw new Error("💥 Oops! Something failed (Unsplash)");
        if (!response3.ok) throw new Error("💥 Oops! Something failed (Unsplash)");
        if (!response4.ok) throw new Error("💥 Oops! Something failed (Unsplash)");
        if (!response5.ok) throw new Error("💥 Oops! Something failed (Unsplash)");
        if (!response6.ok) throw new Error("💥 Oops! Something failed (Unsplash)");
        if (!response7.ok) throw new Error("💥 Oops! Something failed (Unsplash)");
        if (!response8.ok) throw new Error("💥 Oops! Something failed (Unsplash)");
        const data = await response.json();
        const data2 = await response2.json();
        const data3 = await response3.json();
        const data4 = await response4.json();
        const data5 = await response5.json();
        const data6 = await response6.json();
        const data7 = await response7.json();
        const data8 = await response8.json();
        // const results = data3.results.map((x) => x.urls.full); // unsplash: array or pure img urls (30)
        const results = [...data.results, ...data2.results, ...data3.results, ...data4.results, ...data5.results, ...data6.results, ...data7.results, ...data8.results].map((x) => x.urls.full); // unsplash: array or pure img urls (30)
        // const results = data.photos.map((x) => x.src.original); // pexels
        // fetching 100 images
        return results;
    } catch (error) {
        console.error(error);
    }
}

// ================================================================================================

export { fetchWeather, fetchTimezone, fetchWeatherByCityName, fetchImage };
