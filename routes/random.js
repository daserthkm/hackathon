/**
 * @author Daniel Seifert
 */

const _rand = require('lodash/random')
const axios = require('axios')
const express = require('express')

const router = express.Router()

// Get random chuck norris joke
router.get('/chuck', (req, res) => {
    axios.get('https://api.chucknorris.io/jokes/random?category=dev')
        .then(response => {
            const data = response.data
            if (data) {
                res.send({
                    status: 'success',
                    data: Object.assign(data, {
                        icon_url: data.icon_url.replace('https', 'http')
                    })
                })
            } else {
                res.send({
                    status: 'error',
                    message: 'could not retrieve a meme'
                })
            }
        })
        .catch((err) => {
            res.send({
                status: 'error',
                message: err
            })
        })
})

// Get meme from imgflip
router.get('/meme', (req, res) => {
    axios.get('https://api.imgflip.com/get_memes')
        .then(response => {
            const { success, data: { memes } } = response.data

            if (success) {
                const meme = memes[_rand(0, memes.length - 1)]

                res.send({
                    status: 'success',
                    data: Object.assign(meme, {
                        url: meme.url.replace('https', 'http')
                    })
                })
            } else {
                res.send({
                    status: 'error',
                    message: 'could not retrieve a meme'
                })
            }
        })
        .catch((err) => {
            res.send({
                status: 'error',
                message: err
            })
        })
})

module.exports = router
