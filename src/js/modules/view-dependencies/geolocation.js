
function promptGeolocation() {
        return new Promise((resolve, reject) => {   // using promises to be able to consume it then
            if (navigator.geolocation) {  // checks whether the Geolocation API is supported by the user's browser
                navigator.geolocation.getCurrentPosition(  // navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options) // getCurrentPosition operates asynchronously.
                    (position) => {  // successCallback
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        resolve([lat, lng]); // Resolve the Promise with the coordinates
                    },
                    (error) => {  // errorCallback
                        console.error(`Error (${error.code}): ${error.message}`);
                        reject(error); // Reject the Promise with the error
                    },
                    {  // options object
                        enableHighAccuracy: true,   // Requests more precise location information (e.g., GPS instead of Wi-Fi or cell tower data)
                        timeout: 10000,   // Specifies the maximum time (in milliseconds) the device will wait to retrieve the location. If the specified time elapses without success, the errorCallback is invoked with a timeout error.
                        maximumAge: 0,  // Determines the maximum age (in milliseconds) of cached location data. 0 means always fetch fresh data rather than using cached results.
                    }
                );
            } else {
                const error = "💥̶💥̶💥̶ Geolocation is not supported by this browser.";
                console.error(error);
                reject(new Error(error));
            }
        });
    }

export { promptGeolocation }