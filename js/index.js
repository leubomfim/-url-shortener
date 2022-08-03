const inputUrl = document.querySelector('#url')
const small = document.querySelector('small')

const saveStorage = (url) => {
    localStorage.setItem('url', JSON.stringify(url))
}

const getLocal = () => JSON.parse(localStorage.getItem('url')) ?? []

const saveUrl = (short) => {
    const url = {
        url_previously: inputUrl.value.trim(),
        url_shortened: short
    }

    addUrl(url)
    createElement(url)
}

const addUrl = (url) => {
    const dbUrl = getLocal()
    dbUrl.push(url)
    saveStorage(dbUrl)
}

const form = document.querySelector('.form')

form.addEventListener('submit', (e) => {
    e.preventDefault()
    
    if(!inputUrl.value) {
        small.classList.add('error-profile')
        inputUrl.style.border = '1px solid #ee5252'
        small.innerText = 'Please add a link'
    } else {
        fetch(`https://api.shrtco.de/v2/shorten?url=${inputUrl.value.trim()}`) 
        .then(response => response.json())
        .then(urlShortly => {
            const result = urlShortly.result
            saveUrl(result.full_short_link)
        })
        .catch(err => {
            console.log(err)
        })
    }
})

function createElement(shortLink) {
    inputUrl.style.border = 'none'
    small.classList.remove('error-profile')
    const boxUrl = document.createElement('div')
    const linkPreviously = document.createElement('p')
    const urlShortened = document.createElement('div')
    const linkShortenedText = document.createElement('p')
    const btnCopy = document.createElement('button')

    linkPreviously.classList.add('url-previously')
    urlShortened.classList.add('url-shortened')
    linkShortenedText.classList.add('url-shortened-text')
    btnCopy.classList.add('btn-copy')

    boxUrl.classList.add('link')

    linkPreviously.innerText = shortLink.url_previously
    linkShortenedText.innerText = shortLink.url_shortened
    btnCopy.innerHTML = 'Copy'

    btnCopy.addEventListener('click', e => {
        copyClick(e)
    })

    boxUrl.appendChild(linkPreviously)
    urlShortened.appendChild(linkShortenedText)
    urlShortened.appendChild(btnCopy)
    boxUrl.appendChild(urlShortened)
    document.querySelector('.links').appendChild(boxUrl)

    inputUrl.focus()
}

function copyClick(el) {
    const documentTarget = el.target
    const parentBtn = documentTarget.parentElement
    const sonShortener = parentBtn.firstChild
    navigator.clipboard.writeText(sonShortener.innerText)
    if(el.target.classList.contains('btn-copy')) {
        el.target.style.backgroundColor = '#3A3053'
        el.target.innerHTML = 'Copied!'

        setTimeout( () => {
            el.target.style.backgroundColor = '#2acfcf'
            el.target.innerHTML = 'Copy'
        },3000)
    } else {
        return false
    }
}

function uploadPage() {
    document.querySelector('.container-loading').style.display = 'none'
    document.querySelector('.links').style.display = 'flex'
    const dbUrl = getLocal()
    dbUrl.forEach((shortLink) => {
       createElement(shortLink)
    })
}

document.querySelector('.menu').addEventListener('click', () => {
    document.querySelector('.modal-nav').classList.toggle('active')
    document.querySelector('.menu').classList.toggle('open')
})

window.addEventListener('load', uploadPage)