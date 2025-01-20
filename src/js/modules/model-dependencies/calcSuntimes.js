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

function calcSunset(nowTimeString, sunsetTimeString) {
    const now = new Date()
    const padIt = val => val.toString().padStart(2,0)
    const prefix = `${now.getFullYear()}-${padIt(now.getMonth()+1)}-${padIt(now.getDate())}`
    const nowTime = new Date(`${prefix}T${nowTimeString}`).getTime()
    const sunsetTime = new Date(`${prefix}T${sunsetTimeString}`).getTime()
    const differenceInMin = Math.floor((sunsetTime - nowTime)/1000/60)
    let hours = Math.trunc(differenceInMin/60)
    const minutes = differenceInMin%60
    if (hours >= 24) {
        hours -= 24
    } else if (hours < 0) {
        hours += 24
    }
    return [hours, minutes]
}


export { calcSunrise, calcSunset }