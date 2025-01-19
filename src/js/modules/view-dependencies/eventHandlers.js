
// handling click on any temp (Cels) element --> upon it the Fahr/Cels convertion happens
function handleTemperatureClick(handler, weatherBoxEl) {
    weatherBoxEl.addEventListener('click', function(e) {
        if(!e.target.closest('.weather__temp') && !e.target.closest('.weather__day-temp') && !e.target.closest('.weather__hour-temp')) return  
        handler()
    })
}

// ================================================================================================

function handleClickingResult(handler) {
    document.querySelector('.modal').addEventListener('click', function(e) {
        if(!e.target.classList.contains('modal__result')) return
        const lat = e.target.dataset?.lat
        const lng = e.target.dataset?.lng
        const timezone = e.target.dataset?.timezone
        handler(lat, lng, timezone)
    })
}

// ================================================================================================

function handleSavedLocationsClick(handler) {
    document.querySelector('.added-locations').addEventListener('click', (e) => {
        if(!e.target.closest('.added-location')) return

        if(e.target.classList.contains('added-location-remove-btn')) {    // click on remove btn --> removing the item
            handler('remove', e.target.closest('.added-location').dataset.coords)
            return
        } 

        if(e.target.closest('.added-location')) {    // click not on remove btn --> fetch weather
            handler('fetch', e.target.closest('.added-location').dataset.coords)
            return
        }
    })
}

// ================================================================================================

export { handleTemperatureClick, handleClickingResult, handleSavedLocationsClick }