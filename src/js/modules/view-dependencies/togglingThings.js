function toggleSpinner(flag) { //='show'
    if(flag==='hide') {
        if(document.querySelector('.spinner-wrapper')) document.querySelector('.spinner-wrapper').remove()
    } else {
        const div = document.createElement('div')
        div.classList.add('spinner-wrapper')
        div.innerHTML = `<div class="spinner-pulse"></div>`
        document.body.appendChild(div)
    }
}

// ================================================================================================

function toggleLittleSpinner(flag, parentElement) { // ='show'
    if(flag==='hide') {
        if(document.querySelector('.spinner-little-wrapper')) document.querySelector('.spinner-little-wrapper').remove()
    } else {
        const div = document.createElement('div')
        div.classList.add('spinner-little-wrapper')
        div.innerHTML = `<div class="spinner-little-pulse"></div>`
        parentElement.appendChild(div)
    }
}

// ================================================================================================

function toggleModalWindow(flag, renderModalWindow){ // ='show'
    if(flag==='hide') {   // hiding/removing it
        document.querySelector('.modal').style.backgroundColor = 'transparent'
        document.querySelector('.modal__window').style.animation = `bounceReverse 0.1s ease-in-out forwards`
        setTimeout(() => {
            if(document.querySelector('.modal')) document.querySelector('.modal').remove()
        }, 500);
    } else { // showing it
        renderModalWindow()
        setTimeout(() => {
            document.querySelector('.modal__input').focus()
        }, 500);
    }
}

export { toggleSpinner, toggleLittleSpinner, toggleModalWindow }