const OPEN_WEATHER_MAP_API_KEY = process.env.OPEN_WEATHER_MAP_API_KEY;
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// NOTE: this modularised Leaflet stuff -- initialising and updating this map -- is quite tedious.
// Watch out for passing correct references when using these 3 functions: assignMap, addMapMarker, updateMapView.
// Not only that they must be correct, but also complete: original (imported) assignMap needs 5 args, addMapMarker 4 args, updateMapView 5 args.
// And also, some of those references are the references to my personal getter/setter functions defined in Model: you don't need to call them there (no parentheses), just pass a ref to them, they'll be called later in another place.

// ================================================================================================

function assignMap(primaryLocation, getMap, setMap, getMarker, setMarker) {    // 'primaryLocation' is an arr of lat and lng
    try {
        if(primaryLocation.length === 0) {
            return console.warn(`assignMap early return: Cannot initialise Leaflet without coords`)
        }

        const myCoords = primaryLocation.map(x => Number(x))   // making it all type number, not type string
        const zoomLevel = 6
        setMap(L.map('map').setView(myCoords, zoomLevel))   // doing this instead of: map = ...
        const map = getMap()  // getting the map (Model.map) after it was set

        // Adding layers
        const tempLayer = L.tileLayer(`https://{s}.tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${OPEN_WEATHER_MAP_API_KEY}`, {
            attribution: '&copy; <a href="https://www.openweathermap.org/copyright">OpenWeatherMap</a>',
        });

        const precipitationLayer = L.tileLayer(`https://{s}.tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${OPEN_WEATHER_MAP_API_KEY}`, {
            attribution: '&copy; <a href="https://www.openweathermap.org/copyright">OpenWeatherMap</a>',
        });

        // Adding base map
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

        // Adding the layers control
        L.control.layers({
            "Temperature": tempLayer,
            "Precipitation": precipitationLayer
        }, {}).addTo(map);

        // Setting initial weather layer (e.g., temperature)
        tempLayer.addTo(map);

        // adding the marker to the map: 'addMapMarker' needs the references to my get/set functions to work:
        const mapGetter = getMap
        const markerGetter = getMarker
        const markerSetter = setMarker
        addMapMarker(myCoords, markerGetter, mapGetter, markerSetter)

        // After re-initialization, forcing the map to recheck its size
        map.invalidateSize();
    } catch (error) {
        console.error(`💥💥💥 Error: Leaflet initialising`)
        throw error
    }
}


// ================================================================================================


// I call it in 'updateMapView' and 'assignMap'
function addMapMarker(coords, markerGetter, mapGetter, markerSetter) {
    const marker = markerGetter()   // getting Model.currentMarker
    const map = mapGetter()   // getting Model.map
    
    if (marker) map.removeLayer(marker);  // If a marker already exists, removing it, before adding a new one

    const icon = L.icon({
        iconUrl: 'assets/icons/marker-icon.png',
        shadowUrl: 'assets/icons/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 45],
        shadowSize: [41, 41],
        shadowAnchor: [12, 45],
    });

    // Adding new marker
    markerSetter(L.marker(coords, { icon }).addTo(map))  // doing this instead of: marker = ...
}


// ================================================================================================


function updateMapView(newCoords, newZoomLevel, mapGetter, markerGetter, markerSetter) {
    const map = mapGetter()   // getting Model.map

    // getting the references to what 'addMapMarker' needs to work:
    const mapGetterRef = mapGetter
    const markerGetterRef = markerGetter
    const markerSetterRef = markerSetter

    // updating the map view without recreating the map
    map.setView(newCoords, newZoomLevel);

    // updating the marker
    addMapMarker(newCoords, markerGetterRef, mapGetterRef, markerSetterRef)
}


// ================================================================================================


export { assignMap, addMapMarker, updateMapView }