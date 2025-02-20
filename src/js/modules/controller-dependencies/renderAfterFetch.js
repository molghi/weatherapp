import { Logic, Visual } from "../../Controller.js";
import { pushFetchesToModelAndLs } from "./smallFuncs.js";
import { renderAll, renderSunriseSunset } from "./rendering.js";

// a sequence of actions that happen after fetching, such as rendering and updating things:
export default async function afterFetching(fetchedWeather, fetchedTimezone) {
    pushFetchesToModelAndLs(fetchedWeather, fetchedTimezone); // pushing fetches to Model and LS

    Logic.pushToLocalStorage(JSON.stringify(Logic.fetchedCoords), "userCoords"); // pushing fetched user coords to LS

    renderAll(fetchedTimezone, fetchedWeather); // rendering main block, hourly, daily, title box, and making time update every min

    Logic.setAllDegrees(fetchedWeather); // converting from C to F -- as a result of that we have two arrays -- all Celsius values and all Fahrenheit values

    // updating Document Title
    const shortDescription = Logic.giveShortDescription(fetchedWeather.weathercode);
    Visual.updateDocumentTitle(Math.floor(fetchedWeather.temp), shortDescription);

    // setting sunrise and sunset time
    const todayString = Logic.getLocalDay(Logic.offsetInSeconds).split("/").reverse().join("-"); // formatted like '2025-01-11'
    const indexOfTodayInDaily = fetchedWeather.daily.sunset.findIndex((x) => x.startsWith(todayString));
    Logic.setSunriseTime(fetchedWeather.daily.sunrise[indexOfTodayInDaily]);
    Logic.setSunsetTime(fetchedWeather.daily.sunset[indexOfTodayInDaily]);
    renderSunriseSunset(fetchedWeather);

    Visual.renderChangeLocBtn(); // rendering Change Location button
    Visual.renderMapBtn(); // rendering Show Map globe icon button

    // putting the bg video there
    const bgVideoPath = Logic.defineWeatherType();
    // await Visual.showBackgroundVideo(bgVideoPath)

    // showing bg img fetched online
    clearInterval(Logic.bgImgTimer);
    await fetchBgImg();
    Logic.bgImgTimer = setInterval(async () => {
        // changing it every 10 minites
        await fetchBgImg();
    }, 1000 * 60 * 10);
    // }, 1000 * 10);
}

// ================================================================================================

async function fetchBgImg() {
    const dayTime = Logic.timeOfTheDay;
    const shortDesc = Logic.giveShortDescription(Logic.weathercode);
    const imgPath = await Logic.getNewBgImg(shortDesc.toLowerCase()); // fetching
    const imageTag = document.querySelector(".img");

    // imageTag.classList.add("dark"); // dark: filter: brightness(0);
    imageTag.parentElement.classList.remove("fadeIn");
    imageTag.parentElement.classList.add("fadeOut");
    imageTag.src = imgPath;
    imageTag.addEventListener("load", () => {
        // wait until it's fully loaded
        imageTag.parentElement.classList.remove("fadeOut");
        imageTag.parentElement.classList.add("fadeIn"); // fade in from black
        imageTag.classList.add("move"); // start moving it
        // imageTag.classList.remove("dark");
    });
}
