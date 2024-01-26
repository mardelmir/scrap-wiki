const express = require('express')
const app = express()
const axios = require('axios')
const cheerio = require('cheerio')

const url = 'https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap'
const urlBase = 'https://es.wikipedia.org'
app.get('/', async (req, res) => {
  try {
    const response = await axios.get(url)
    const html = response.data
    const $ = cheerio.load(html)

    const links = [] 
    $('#mw-pages a').each((index, element) => {
      const link = $(element).attr('href')
      links.push(urlBase+link)
    })

    const data = []
    for(const link of links) {
      const linkData = await obtenerLinkData(link)
      data.push(linkData)
      //console.log(linkData)
    }
  res.send(`
    <h2>LINKS</h2>
        <ul>
            ${links.map(link => `<li>${link}</li>`).join('')}
        </ul>
    <h2>Raperos</h2>
        <ul>
            ${data.map(data => `<li>
            <h3>${data.title}</h3>
                ${data.imgs.map(img => `<p>Imagen: ${img}<p>`).join('')}</p>
                ${data.texts.map(text => `<p>texto: ${text}<p>`).join('')}</p>
            </li>`).join('')}
        </ul>
  `)

  } catch (error) {
    console.log(error)
  }
})

const obtenerLinkData = async (link) => {
  try {
    const response = await axios.get(link)
    const html = response.data
    const $ = cheerio.load(html)
    const title = $('h1').text()

    const imgs = []
    const texts = []

    $('img').each((index, element) => {
      const src = $(element).attr('src')
      imgs.push(src)
    })

    $('p').each((index, element) => {
      const text = $(element).text()
      texts.push(text)
    })

    return { title, imgs, texts } 

  } catch (error) {
    console.log(error)
  }
}

app.listen(3000, () => {
  console.log('Express está escuchando en el puerto http://localhost:3000')
})
