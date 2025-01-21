
// calculating when the sunrise is: returns [hours, minutes]
function calcSunrise(time) {
    const sunriseMs = time
    const nowMs = Date.now()
    const differenceInMin = Math.floor((sunriseMs - nowMs)/1000/60)
    let hours = Math.trunc(differenceInMin/60)
    const minutes = differenceInMin%60
    if (hours >= 24) {
        hours -= 24
    } else if (hours < 0) {
        hours += 24
    }

    return [hours, minutes]
}

// ================================================================================================

// calculating when the sunset is: returns [hours, minutes]
function calcSunset(nowTimeString, sunsetTimeString) {
    const nowTimeStringSafe = nowTimeString.split(':').map(x => x.length===1 ? x.padStart(2, '0') : x).join(':')
    const sunsetTimeStringSafe = sunsetTimeString.split(':').map(x => x.length===1 ? x.padStart(2, '0') : x).join(':')

    const now = new Date()
    const padIt = val => val.toString().padStart(2,0)

    const prefix = `${now.getFullYear()}-${padIt(now.getMonth()+1)}-${padIt(now.getDate())}`
    const nowTime = new Date(`${prefix}T${nowTimeStringSafe}`).getTime()
    const sunsetTime = new Date(`${prefix}T${sunsetTimeStringSafe}`).getTime()
    const differenceInMin = Math.floor((sunsetTime - nowTime)/1000/60)

    let hours = Math.trunc(differenceInMin/60);
    const minutes = Math.abs(differenceInMin % 60);

    if (hours >= 24) {
        hours -= 24
    } else if (hours < 0) {
        hours += 24
    }

    return [hours, minutes]
}


export { calcSunrise, calcSunset }