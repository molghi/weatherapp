import { Value } from 'sass';
import { fetchWeather, fetchTimezone, fetchWeatherByCityName } from './model-dependencies/apis.js'
import myObject from './model-dependencies/weathercodes.js';
import defineBigIcon from './model-dependencies/defineBigIcon.js';
import defineWeatherType from './model-dependencies/defineWeatherType.js';
import giveShortDescription from './model-dependencies/giveShortDescription.js';

import { pushToLocalStorage, pushSavedLocation, getSavedLocations, getPrimaryLocation, pushPrimaryLocation, pushFetchedCoords, pushWeatherFetch, pushTimezoneFetch, pushWeatherFetchesToLS, pushTimezoneFetchesToLS, getWeatherFetchesFromLS, getTimezoneFetchesFromLS, getCoordsFetchesFromLS, getWindDirection } from './model-dependencies/pushAndGet.js';

import { getLocalTime, getLocalDay } from './model-dependencies/getLocal.js'
import { setAllDegrees, convertTempUnits } from './model-dependencies/fahrenheitCelsius.js'
import { formatHourly, formatDaily } from './model-dependencies/formatters.js'
import { updateSavedLocation, makeSavedLocationFirst, removeFromSavedLocations } from './model-dependencies/savedLocations.js'
import { calcSunrise, calcSunset } from './model-dependencies/calcSuntimes.js'
import { truncateFetchArrays, defineDayTime, switchTempUnits, convertToCorrectTime } from './model-dependencies/smallFunctions.js'

import { assignMap, addMapMarker, updateMapView } from './model-dependencies/map.js'

const API_KEY = process.env.API_KEY;
const OPEN_WEATHER_MAP_API_KEY = process.env.OPEN_WEATHER_MAP_API_KEY;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

import iconMarker from '../../../src/img/marker-icon.png';
import iconMarker2 from '../../../src/img/marker-icon-2x.png';
import iconMarker3 from '../../../src/img/marker-shadow.png';



class Model {
    constructor() {
        this.sunriseTime = 0
        this.offsetInSeconds = 0
        this.sunsetTime = 0
        this.timeOfTheDay = ''
        this.timeNow = ''
        this.weathercode = 0
        this.tempUnits = 'Celsius'
        this.previousWeatherFetches = []
        this.previousTimezoneFetches = []
        this.degrees = {}
        this.degreesFahrenheit = {}
        this.fetchedCoords = []
        this.primaryLocation = []
        this.savedLocations = []
        this.map = null;
        this.currentMarker = null;
    }

    // ================================================================================================

    // dependencies for the Leaflet functions below
    getMap = () => this.map
    getMarker = () => this.currentMarker
    setMap = (value) => this.map = value
    setMarker = (value) => this.currentMarker = value

    // ================================================================================================

    // NOTE: this modularised Leaflet stuff -- initialising and updating this map -- is quite tedious.
    // Watch out for passing correct references when using these 3 functions: assignMap, addMapMarker, updateMapView.
    // Not only that they must be correct, but also complete: original (imported) assignMap needs 5 args, addMapMarker 4 args, updateMapView 5 args.
    // And also, some of those references are the references to my personal getter/setter functions defined just above: you don't need to call them there (no parentheses), just pass a ref to them, they'll be called later in another place.

    // initialising Leaflet
    assignMap() {
        assignMap(this.primaryLocation, this.getMap, this.setMap, this.getMarker, this.setMarker)
    }

    /* ================================================================================================ */

    // adding Leaflet marker
    addMapMarker(coords, marker=this.currentMarker) {
        addMapMarker(coords, marker, this.getMap, this.setMarker)
    }

    /* ================================================================================================ */

    // updating Leaflet to show new coords
    updateMapView(newCoords, newZoomLevel) {
        updateMapView(newCoords, newZoomLevel, this.getMap, this.getMarker, this.setMarker)
    }

    /* ================================================================================================ */

    pushSavedLocation(obj, flag) {
        pushSavedLocation(obj, flag, this.savedLocations)
    }

    // ================================================================================================

    getSavedLocations() {
        getSavedLocations(this.savedLocations)
    }

    // ================================================================================================

    getPrimaryLocation() {
        this.primaryLocation = getPrimaryLocation() || []
    }

    // ================================================================================================

    pushWeatherFetch(value) {
        pushWeatherFetch(value, this.previousWeatherFetches)
    }

    // ================================================================================================

    pushTimezoneFetch(value) {
        pushTimezoneFetch(value, this.previousTimezoneFetches)
    }

    // ================================================================================================

    pushToLocalStorage(value, key) {
        pushToLocalStorage(value, key)
    }

    // ================================================================================================

    pushWeatherFetchesToLS() {
        pushWeatherFetchesToLS(this.previousWeatherFetches)
    }

    // ================================================================================================

    pushTimezoneFetchesToLS() {
        pushTimezoneFetchesToLS(this.previousTimezoneFetches)
    }

    // ================================================================================================

    getWeatherFetchesFromLS() {
        getWeatherFetchesFromLS(this.previousWeatherFetches)
    }

    // ================================================================================================

    getTimezoneFetchesFromLS() {
        getTimezoneFetchesFromLS(this.previousTimezoneFetches)
    }
    
    // ================================================================================================
    
    getCoordsFetchesFromLS() {
        getCoordsFetchesFromLS(this.fetchedCoords)
    }
    
    // ================================================================================================

    pushPrimaryLocation([lat,lng]) {
        pushPrimaryLocation([lat,lng], this.primaryLocation)
    }
    
    // ================================================================================================
    
    pushFetchedCoords(value) {
        pushFetchedCoords(value, this.fetchedCoords)
    }

    // ================================================================================================

    giveShortDescription(weathercode) {
        return giveShortDescription(weathercode)
    }

    // ================================================================================================

    // needed to define the bg video
    defineWeatherType() {
        return defineWeatherType(this.timeOfTheDay, this.weathercode);  // I import it above
    }

    // ================================================================================================

    getLocalTime(offsetInSec) {   // returns an array: current hour and minutes (as numbers)
        const data = getLocalTime(offsetInSec, this.timeOfTheDay, this.defineDayTime)
        return data
    }

    // ================================================================================================

    getLocalDay(offsetInSec) {
        return getLocalDay(offsetInSec)
    }

    // ================================================================================================

    getWeatherDescription(weathercode) {
        return myObject[String(weathercode)]  // I import it above
    }



    // ================================================================================================
    // ================================================================================================
    // ================================================================================================




    
    updateSavedLocation(objOfData) {
        updateSavedLocation(objOfData, this.savedLocations)
    }

    // ================================================================================================

    makeSavedLocationFirst(coords) {
        makeSavedLocationFirst(coords, this.savedLocations)
    }

    // ================================================================================================

    removeFromSavedLocations(latStr, lngStr) {
        removeFromSavedLocations(latStr, lngStr, this.savedLocations)
    }

    // ================================================================================================

    // checks if the arrays that have recent fetches do not grow to be more than length 20: 
    // if they more than length 20, i slice them and make them length 20 (the last 20 pushed items, older ones sliced out) else they occupy too much space in LS and grow out of hand
    truncateFetchArrays() {
        truncateFetchArrays(this.fetchedCoords, this.previousWeatherFetches, this.previousTimezoneFetches)
    }

    // ================================================================================================

    setTempUnits = (value) => this.tempUnits = value
    getTempUnits = () => this.tempUnits

    switchTempUnits() {
        return switchTempUnits(this.getTempUnits, this.setTempUnits)
    }

    // ================================================================================================

    convertToCorrectTime(dateTimeStr) {     // returns "HH:mm"
        const data = convertToCorrectTime(dateTimeStr, this.offsetInSeconds)
        return data
    }

    // ================================================================================================

    setSunriseTime(value) {
        this.sunriseTime = this.convertToCorrectTime(value)
    }

    // ================================================================================================
    
    setSunsetTime(value) {
        this.sunsetTime = this.convertToCorrectTime(value)
    }

    // ================================================================================================

    getTodayString() {
        return `${new Date().getFullYear()}-${(new Date().getMonth()+1).toString().padStart(2,0)}-${(new Date().getDate()).toString().padStart(2,0)}`
    }

    // ================================================================================================

    getTomorrowString() {
        return `${new Date().getFullYear()}-${(new Date().getMonth()+1).toString().padStart(2,0)}-${(new Date().getDate()+1).toString().padStart(2,0)}`
    }

    // ================================================================================================

    getNowTime() {
        return `${new Date().getHours()}:${new Date().getMinutes().toString().padStart(2,0)}`
    }

    // ================================================================================================

    async fetchWeather(coordsArr) {
        const dataObj = await fetchWeather(coordsArr)
        return dataObj
    }

    // ================================================================================================

    async fetchTimezone(coordsArr) {
        const dataObj = await fetchTimezone(coordsArr)
        return dataObj
    }

    // ================================================================================================

    async fetchWeatherByCityName(cityName) {
        const data = await fetchWeatherByCityName(cityName)
        return data
    }

    // ================================================================================================

    calcSunrise(time) {
        return calcSunrise(time)
    }

    // ================================================================================================

    calcSunset(nowTimeString, sunsetTimeString) {
        return calcSunset(nowTimeString, sunsetTimeString)
    }

    // ================================================================================================

    getWindDirection(degrees) {
        return getWindDirection(degrees)
    }

    // ================================================================================================

    defineDayTime(nowHours) {
        return defineDayTime(nowHours)
    }

    // ================================================================================================

    defineBigIcon(weathercode, dayTime) {
        const path = defineBigIcon(weathercode, dayTime)  // I import it above
        return path 
    }

    // ================================================================================================

    // formatting the obj that I am passing here in a neat, ready-to-be-rendered format
    formatHourly(obj) {
        return formatHourly(obj, this.getWeatherDescription)
    }

    // ================================================================================================

    // formatting the obj that I am passing here in a neat, ready-to-be-rendered format
    formatDaily(obj) {
        return formatDaily(obj, this.getWeatherDescription, this.offsetInSeconds)
    }

    // ================================================================================================

    convertTempUnits(value, flag) {
        convertTempUnits(value, flag)
    }

    // ================================================================================================

    // get all current temps on the screen as an array, in Fahr and Cels
    setAllDegrees(fetchedWeather) {
        setAllDegrees(fetchedWeather, this.degrees, this.degreesFahrenheit)
    }

}

export default Model 