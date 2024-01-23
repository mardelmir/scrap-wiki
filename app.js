const express = require('express')
const app = express()

const axios = require('axios')
const cheerio = require('cheerio')

const url = 'https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap'

app.get('/', (req, res) => {
    axios.get(url).then((response) => {
        if (response.status === 200) {
            const html = response.data
            const $ = cheerio.load(html)
            const links = []

            $('#mw-pages a').each((index, element) => {
                const link = $(element).attr('href')
                links.push(link)
            })

            return links
        }
    })

})


app.use((req, res) => {
    res.status(404).send('<h1>Página no encontrada</h1><a>Volver</a>')
})

app.listen(3000, () => {
    console.log('Express está escuchando en el puerto http://localhost:3000')
})