# Vanilla JS: Weather App

A simple Vanilla JavaScript application providing concise weather details for various cities.

App Functionality:

- Displays the current weather data for the current location (Browser Geolocation API, Weather API)
- Displays the background video, weather-dependent
- Displays the local time for the current location
- Converts to Celsius/Fahrenheit by clicking on any temp element (except the ones in Saved Locations)
- Allows to change the location by clicking the button (at the bottom right)
- Allows to save the current location to Your Locations by clicking the plus button (at the top; 6 locations max)
- Allows to set the current location as your new Primary Location by clicking the house button (at the top; primary means it will be shown upon the page reload)
- Allows to fetch the weather by clicking on any of the Saved Locations
- Allows to view the map of the current location with a few weather layers upon clicking the globe button (bottom right)

Technologies used: the MVC project architecture with the Subscriber-Publisher pattern, ES6 classes, modularising, async/await, fetch, external APIs, Browser Geolocation API, localStorage, SCSS, Webpack module bundler.
