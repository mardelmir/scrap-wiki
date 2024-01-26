const express = require('express')
const app = express()

const axios = require('axios')
const cheerio = require('cheerio')

const url = 'https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap'
const baseUrl = 'https://es.wikipedia.org'


app.get('/', async (req, res) => {
    try {
        const response = await axios.get(url)
        const html = response.data
        const $ = cheerio.load(html)

        const links = []
        const allPages = []

        $('#mw-pages a').each((index, element) => {
            const link = $(element).attr('href')
            links.push(`${baseUrl}${link}`)
        })

        for (const link of links) {
            const response = await axios.get(link)
            const pageData = response.data
            const $ = cheerio.load(pageData)

            const imgs = []
            $('img').each((index, element) => {
                const img = $(element).attr('src')
                imgs.push(img)
            })

            const ps = []
            $('p').each((index, element) => {
                const paragraph = $(element).text()
                ps.push(paragraph)
            })

            const pageInfo = { title: $('h1').text(), imgs: imgs, paragraphs: ps }
            allPages.push(pageInfo)
        }

        res.send(`
            <h2>Links</h2>
                <ol>
                    ${links.map(link => `<li><a href="${link}">${link}</a></li>`).join('')}
                </ol>
                </br>
            <h2>Músicos de rap</h2>
                <ul>
                    ${allPages.map((page, i) => `
                    <li style="list-style: none">
                        <h3>${i + 1}. ${page.title}</h3>
                            <p><u>Imágenes:</u></p>
                                <ul>${page.imgs.map(img => `<li>${img}</li>`).join('')}</ul>
                            <p><u>Párrafos:</u></p>
                                <ul>${page.paragraphs.map(p => `<p>${p}</p>`).join('')}</ul>
                    </li></br>`).join('')}
                </ul>`)

    } catch (error) { console.log('Error en la petición', error) }
})

app.use((req, res) => { res.status(404).send('<h1>Página no encontrada</h1><a href="/"><button>Volver</button></a>') })

app.listen(3000, () => { console.log('Express está escuchando en el puerto http://localhost:3000') })