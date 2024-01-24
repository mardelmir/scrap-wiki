const express = require('express')
const app = express()

const axios = require('axios')
const cheerio = require('cheerio')

const url = 'https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap'
const baseUrl = 'https://es.wikipedia.org'

app.get('/', (req, res) => {
    axios.get(url)
        .then(response => {
            if (response.status === 200) {
                const html = response.data
                const $ = cheerio.load(html)
                const links = []
                const allPages = []

                $('#mw-pages a').each((index, element) => {
                    const link = $(element).attr('href')
                    links.push(`${baseUrl}${link}`)
                })
                
                links.forEach(link => {
                    axios.get(link)
                    .then(response => {
                        if (response.status === 200) {
                            const html = response.data
                            const $ = cheerio.load(html)

                            const imgs = []
                            const ps = []

                            $('img').each((index, element) => {
                                const img = $(element).attr('src')
                                imgs.push(img)
                            })

                            $('p').each((index, element) => {
                                const p = $(element).text()
                                ps.push(p)
                            })

                            const pageInfo = { h1: $('h1').text(), Images: imgs, Paragraphs: ps }
                            links.push(pageInfo)
                        }
                    })
                    .catch(error => console.log('Error en la petición músicos individuales', error))
                })
            }
        })
        .catch(error => console.log('Error en la petición Músicos de rap', error))
})


app.use((req, res) => {
    res.status(404).send('<h1>Página no encontrada</h1><a href="/">Volver</a>')
})

app.listen(3000, () => {
    console.log('Express está escuchando en el puerto http://localhost:3000')
})