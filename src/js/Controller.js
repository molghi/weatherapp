'use strict';

import '../styles/main.scss';

import Model from './modules/Model.js';
import View from './modules/View.js';

import afterFetching from './modules/controller-dependencies/renderAfterFetch.js';
import showCorrectError from './modules/controller-dependencies/errorHandler.js';
import {
  savedLocationsClick,
  locationBtnsHandler,
} from './modules/controller-dependencies/savedLocFuncs.js';
import {
  fetchTimezoneAndWeather,
  updateSavedLocations,
} from './modules/controller-dependencies/fetchers.js';
import {
  changeTempUnits,
  openModal,
  showMap,
  getFromLS,
  setCoords,
} from './modules/controller-dependencies/smallFuncs.js';

const Logic = new Model();
const Visual = new View();

// ===========================================================================================================================

async function init(flag) {
  try {
    getFromLS(); // fetching various things from local storage

    const coords = await setCoords(); // setting the coords

    // NOTE: 'init' is called with the arg 'refresh' if it refreshes every hour -- but leaflet ignores it, else it produces error (multiple initialises of it)
    if (flag !== 'refresh') {
      if (Logic.primaryLocation.length > 0)
        Logic.assignMap(); // initialising Leaflet
      else console.log('Leaflet was not initialised');
    }

    const [fetchedTimezone, fetchedWeather] = await fetchTimezoneAndWeather(
      coords,
      coords
    ); // fetching timezone and weather

    afterFetching(fetchedWeather, fetchedTimezone); // a sequence of actions that happen after fetching, such as rendering and updating things

    if (Logic.savedLocations.length > 0) {
      // rendering saved locations
      await updateSavedLocations();
      document.querySelector('.added-locations').innerHTML = ''; // making sure it's empty first
      Logic.savedLocations.forEach((locationObj) =>
        Visual.addLocation('render', locationObj)
      ); // rendering
    }

    runEventListeners(); // running all event listeners
  } catch (error) {
    console.error(`💥💥💥 Something failed: ${error}\n${error.message}`);
    showCorrectError(error.message);
  }
}
init();

// ===========================================================================================================================

// re-fetching and re-rendering the weather every hour
let isRunning = false; // to prevent overlapping scenarios

setInterval(async () => {
  if (isRunning) return; // skip if already running
  isRunning = true;
  try {
    await init('refresh');
  } catch (error) {
    console.error('Error during periodic init:', error);
  } finally {
    isRunning = false;
  }
  // }, 10 * 1000) // test
}, 3600 * 1000); // 3600 * 1000 milliseconds = 1 hour

// ===========================================================================================================================

// running main event listeners
function runEventListeners() {
  Visual.handleTemperatureClick(changeTempUnits);
  Visual.handleChangeLocationClick(openModal);
  Visual.handleLocationBtns(locationBtnsHandler);
  Visual.handleSavedLocationsClick(savedLocationsClick);
  Visual.handleMapBtnClick(showMap);
}

// ================================================================================================

// exporting for some dependencies:
export { Logic, Visual, runEventListeners };
