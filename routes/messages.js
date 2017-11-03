/**
 * @author Daniel Seifert
 */

const express = require('express')
const db = require('../db')

const router = express.Router()

const table = 'chats'

router.post('/send', (req, res) => {
    const now = db.getCurrentDateTimeObj()

    db.insertToTable(table, Object.assign(req.body, {
        create_date: now.date,
        millisecond: now.ms
    })).then((id) => {
        res.send({
            status: 'success',
            data: Object.assign(req.body, {
                create_date: now.date,
                millisecond: now.ms,
                id
            })
        })
    }).catch((err) => {
        res.send({
            status: 'error',
            message: err
        })
    })
})