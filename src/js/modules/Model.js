import { Value } from "sass";
import { fetchWeather, fetchTimezone, fetchWeatherByCityName, fetchImage } from "./model-dependencies/apis.js";
import myObject from "./model-dependencies/weathercodes.js";
import defineBigIcon from "./model-dependencies/defineBigIcon.js";
import defineWeatherType from "./model-dependencies/defineWeatherType.js";
import giveShortDescription from "./model-dependencies/giveShortDescription.js";

import {
    pushToLocalStorage,
    pushSavedLocation,
    getSavedLocations,
    getPrimaryLocation,
    pushPrimaryLocation,
    pushFetchedCoords,
    pushWeatherFetch,
    pushTimezoneFetch,
    pushWeatherFetchesToLS,
    pushTimezoneFetchesToLS,
    getWeatherFetchesFromLS,
    getTimezoneFetchesFromLS,
    getCoordsFetchesFromLS,
    getWindDirection,
} from "./model-dependencies/pushAndGet.js";

import { getLocalTime, getLocalDay } from "./model-dependencies/getLocal.js";
import { setAllDegrees, convertTempUnits } from "./model-dependencies/fahrenheitCelsius.js";
import { formatHourly, formatDaily, formatSavedLocations } from "./model-dependencies/formatters.js";
import { updateSavedLocation, makeSavedLocationFirst, removeFromSavedLocations, updateSavedLocations } from "./model-dependencies/savedLocations.js";
import { calcSunrise, calcSunset } from "./model-dependencies/calcSuntimes.js";
import { truncateFetchArrays, defineDayTime, switchTempUnits, convertToCorrectTime } from "./model-dependencies/smallFunctions.js";

import { assignMap, addMapMarker, updateMapView } from "./model-dependencies/map.js";

const API_KEY = process.env.API_KEY;
const OPEN_WEATHER_MAP_API_KEY = process.env.OPEN_WEATHER_MAP_API_KEY;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

import iconMarker from "../../../src/img/marker-icon.png";
import iconMarker2 from "../../../src/img/marker-icon-2x.png";
import iconMarker3 from "../../../src/img/marker-shadow.png";

class Model {
    constructor() {
        this.sunriseTime = 0;
        this.offsetInSeconds = 0;
        this.sunsetTime = 0;
        this.timeOfTheDay = "";
        this.timeNow = "";
        this.weathercode = 0;
        this.tempUnits = "Celsius";
        this.previousWeatherFetches = [];
        this.previousTimezoneFetches = [];
        this.degrees = {};
        this.degreesFahrenheit = {};
        this.fetchedCoords = [];
        this.primaryLocation = [];
        this.savedLocations = [];
        this.map = null;
        this.currentMarker = null;
        this.bgImgTimer = "";
    }

    // ================================================================================================

    // dependencies for the Leaflet functions below
    getMap = () => this.map;
    getMarker = () => this.currentMarker;
    setMap = (value) => (this.map = value);
    setMarker = (value) => (this.currentMarker = value);

    // ================================================================================================

    // NOTE: this modularised Leaflet stuff -- initialising and updating this map -- is quite tedious.
    // Watch out for passing correct references when using these 3 functions: assignMap, addMapMarker, updateMapView.
    // Not only that they must be correct, but also complete: original (imported) assignMap needs 5 args, addMapMarker 4 args, updateMapView 5 args.
    // And also, some of those references are the references to my personal getter/setter functions defined just above: you don't need to call them there (no parentheses), just pass a ref to them, they'll be called later in another place.

    // initialising Leaflet
    assignMap() {
        assignMap(this.primaryLocation, this.getMap, this.setMap, this.getMarker, this.setMarker);
    }

    /* ================================================================================================ */

    // adding Leaflet marker
    addMapMarker(coords, marker = this.currentMarker) {
        addMapMarker(coords, marker, this.getMap, this.setMarker);
    }

    /* ================================================================================================ */

    // updating Leaflet to show new coords
    updateMapView(newCoords, newZoomLevel) {
        updateMapView(newCoords, newZoomLevel, this.getMap, this.getMarker, this.setMarker);
    }

    /* ================================================================================================ */

    // pushing a new saved location
    pushSavedLocation(obj, flag) {
        pushSavedLocation(obj, flag, this.savedLocations);
    }

    // ================================================================================================

    // fetching saved locations from the LS
    getSavedLocations() {
        getSavedLocations(this.savedLocations);
    }

    // ================================================================================================

    // fetching primary location from the LS
    getPrimaryLocation() {
        this.primaryLocation = getPrimaryLocation() || [];
    }

    // ================================================================================================

    // pushing timezone fetch to Model/Logic
    pushTimezoneFetch(value) {
        this.previousTimezoneFetches.push(value);
    }

    // pushing timezone fetch to LS
    pushTimezoneFetchesToLS() {
        const timezone = JSON.stringify(this.previousTimezoneFetches);
        pushToLocalStorage(timezone, "timezoneFetches");
    }

    // fetching timezone fetches from the LS
    getTimezoneFetchesFromLS() {
        const fetch = localStorage.getItem("timezoneFetches");
        if (fetch) this.previousTimezoneFetches = JSON.parse(fetch);
    }

    // ================================================================================================

    // pushing something to LS
    pushToLocalStorage(value, key) {
        localStorage.setItem(key, value);
    }

    // ================================================================================================

    // pushing weather fetch to Model/Logic
    pushWeatherFetch(value) {
        this.previousWeatherFetches.push(value);
    }

    // pushing weather fetch to LS
    pushWeatherFetchesToLS() {
        const weather = JSON.stringify(this.previousWeatherFetches);
        this.pushToLocalStorage(weather, "weatherFetches");
    }

    // fetching weather fetches from the LS
    getWeatherFetchesFromLS() {
        const fetch = localStorage.getItem("weatherFetches");
        if (fetch) this.previousWeatherFetches = JSON.parse(fetch);
    }

    // ================================================================================================

    // fetching coords fetches from the LS
    getCoordsFetchesFromLS() {
        const fetch = localStorage.getItem("userCoords");
        if (fetch) this.fetchedCoords = JSON.parse(fetch);
    }

    // pushing coords to Model
    pushFetchedCoords(value) {
        this.fetchedCoords.push(value);
    }

    // ================================================================================================

    // pushing primary location
    pushPrimaryLocation([lat, lng]) {
        this.primaryLocation = [];
        this.primaryLocation.push(lat, lng);
        pushToLocalStorage(JSON.stringify(this.primaryLocation), "primaryLocation");
    }

    // ================================================================================================

    // getting the short weather description -- used in the document.title
    giveShortDescription(weathercode) {
        return giveShortDescription(weathercode);
    }

    // ================================================================================================

    // needed to define the bg video
    defineWeatherType() {
        return defineWeatherType(this.timeOfTheDay, this.weathercode); // I import it above
    }

    // ================================================================================================

    // getting local time at location
    getLocalTime(offsetInSec) {
        // returns an array: current hour and minutes (as numbers)
        const data = getLocalTime(offsetInSec, this.timeOfTheDay, this.defineDayTime);
        return data;
    }

    // ================================================================================================

    // getting local date at location
    getLocalDay(offsetInSec) {
        return getLocalDay(offsetInSec);
    }

    // ================================================================================================

    // getting weather description (long) by weathercode
    getWeatherDescription(weathercode) {
        return myObject[String(weathercode)]; // I import it above
    }

    // ================================================================================================
    // ================================================================================================
    // ================================================================================================

    // updating saved location
    updateSavedLocation(objOfData) {
        updateSavedLocation(objOfData, this.savedLocations);
    }

    // ================================================================================================

    // making a saved location first (primary)
    makeSavedLocationFirst(coords) {
        makeSavedLocationFirst(coords, this.savedLocations);
    }

    // ================================================================================================

    // removing from saved locations
    removeFromSavedLocations(latStr, lngStr) {
        removeFromSavedLocations(latStr, lngStr, this.savedLocations);
    }

    // ================================================================================================

    // dependencies of 'truncateFetchArrays'
    fetchedCoordsGetter = () => this.fetchedCoords;
    fetchedWeathersGetter = () => this.previousWeatherFetches;
    fetchedTimezonesGetter = () => this.previousTimezoneFetches;
    fetchedCoordsSetter = (value) => (this.fetchedCoords = value);
    fetchedWeathersSetter = (value) => (this.previousWeatherFetches = value);
    fetchedTimezonesSetter = (value) => (this.previousTimezoneFetches = value);

    // checks if the arrays that have recent fetches do not grow to be more than length 20:
    // if they more than length 20, i slice them and make them length 20 (the last 20 pushed items, older ones sliced out) else they occupy too much space in LS and grow out of hand
    truncateFetchArrays() {
        truncateFetchArrays(this.fetchedCoordsGetter, this.fetchedWeathersGetter, this.fetchedTimezonesGetter, this.fetchedCoordsSetter, this.fetchedWeathersSetter, this.fetchedTimezonesSetter);
    }

    // ================================================================================================

    // dependencies of 'switchTempUnits'
    setTempUnits = (value) => (this.tempUnits = value);
    getTempUnits = () => this.tempUnits;

    // switching temp units: C/F or F/C
    switchTempUnits() {
        return switchTempUnits(this.getTempUnits, this.setTempUnits);
    }

    // ================================================================================================

    // getting the local time at location?...
    convertToCorrectTime(dateTimeStr) {
        // returns "HH:mm"
        const data = convertToCorrectTime(dateTimeStr, this.offsetInSeconds);
        return data;
    }

    // ================================================================================================

    // setting sunrise time
    setSunriseTime(value) {
        this.sunriseTime = this.convertToCorrectTime(value);
    }

    // ================================================================================================

    // setting sunset time
    setSunsetTime(value) {
        this.sunsetTime = this.convertToCorrectTime(value);
    }

    // ================================================================================================

    // getting a formatted string
    getTodayString() {
        return `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, 0)}-${new Date().getDate().toString().padStart(2, 0)}`;
    }

    // ================================================================================================

    // getting a formatted string
    getTomorrowString() {
        return `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, 0)}-${(new Date().getDate() + 1).toString().padStart(2, 0)}`;
    }

    // ================================================================================================

    // getting a formatted string
    getNowTime() {
        return `${new Date().getHours()}:${new Date().getMinutes().toString().padStart(2, 0)}`;
    }

    // ================================================================================================

    // fetching weather by coords
    async fetchWeather(coordsArr, type) {
        const dataObj = await fetchWeather(coordsArr, type);
        return dataObj;
    }

    // ================================================================================================

    // fetching timezone by coords
    async fetchTimezone(coordsArr) {
        const dataObj = await fetchTimezone(coordsArr);
        return dataObj;
    }

    // ================================================================================================

    // fetching weather by city name
    async fetchWeatherByCityName(cityName) {
        const data = await fetchWeatherByCityName(cityName);
        return data;
    }

    // ================================================================================================

    // calculating when is sunrise
    calcSunrise(time) {
        return calcSunrise(time);
    }

    // ================================================================================================

    // calculating when is sunset
    calcSunset(nowTimeString, sunsetTimeString) {
        return calcSunset(nowTimeString, sunsetTimeString);
    }

    // ================================================================================================

    // getting the description of the wind direction by degrees
    getWindDirection(degrees) {
        return getWindDirection(degrees);
    }

    // ================================================================================================

    // getting the time of the day
    defineDayTime(nowHours) {
        return defineDayTime(nowHours);
    }

    // ================================================================================================

    // getting the path to the big weather icon
    defineBigIcon(weathercode, dayTime) {
        const path = defineBigIcon(weathercode, dayTime); // I import it above
        return path;
    }

    // ================================================================================================

    // formatting the obj that I am passing here in a neat, ready-to-be-rendered format
    formatHourly(obj) {
        return formatHourly(obj, this.getWeatherDescription);
    }

    // ================================================================================================

    // formatting the obj that I am passing here in a neat, ready-to-be-rendered format
    formatDaily(obj) {
        return formatDaily(obj, this.getWeatherDescription, this.offsetInSeconds);
    }

    // ================================================================================================

    // formatting for Saved Locations
    formatSavedLocations(arr) {
        if (arr.length === 0 || !arr) return;
        return formatSavedLocations(arr);
    }

    // ================================================================================================

    // converting temp: C/F or F/C
    convertTempUnits(value, flag) {
        convertTempUnits(value, flag);
    }

    // ================================================================================================

    // getting all current temps on the screen as an array, in Fahr and Cels
    setAllDegrees(fetchedWeather) {
        setAllDegrees(fetchedWeather, this.degrees, this.degreesFahrenheit);
    }

    // ================================================================================================

    // updating Saved Locations
    updateSavedLocations(arr) {
        updateSavedLocations(arr, this.savedLocations);
    }

    // ================================================================================================

    async getNewBgImg(desc) {
        // if (desc.includes('evening')) desc += ' dark night';
        const results = await fetchImage(desc);
        const chooseRandom = (arr) => Math.floor(Math.random() * arr.length); // helper fn; returns random index of 'arr'
        const randomIndex = chooseRandom(results);
        return results[randomIndex];
    }

    // ================================================================================================
}

export default Model;
