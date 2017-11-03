/**
 * @author Daniel Seifert
 */

const express = require('express')
const db = require('../db')

const router = express.Router()

const table = 'rooms'

// Create table rooms
db.createTable(table, {
    id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
    name: 'VARCHAR(50)'
}).then(() => {

    // Insert initial test data
    db.insertToTable(table, {
        name: 'Test room'
    })

    db.insertToTable(table, {
        name: 'Fake room'
    })
})

// Get room
router.get('/', (req, res) => {
    db.fetchAll(table).then((results) => {
        res.send({
            status: 'success',
            data: {
                rooms: results || []
            }
        })
    })
})

// Edit room
router.put('/:id', (req, res) => {
    const id = req.params.id
    db.fetchOneByID(table, id).then((one) => {
        if (one) {
            one = Object.assign(one, { id })
            db.updateOneByID(table, Object.assign(one, req.body)).then(() => {
                res.send({
                    status: 'success',
                    data: Object.assign(one, req.body)
                })
            }).catch((err) => {
                res.send({
                    status: 'error',
                    message: err
                })
            })
        } else {
            res.send({
                status: 'fail',
                message: 'room not found'
            })
        }
    }).catch((err) => {
        res.send({
            status: 'error',
            message: err
        })
    })
})

// Create room
router.post('/', (req, res) => {
    db.insertToTable(table, req.body).then((id) => {
        res.send({
            status: 'success',
            data: Object.assign(req.body, { id })
        })
    }).catch((err) => {
        res.send({
            status: 'error',
            message: err
        })
    })
})

// Send message to room
router.post('/:id/send', (req, res) => {
    const data = Object.assign(req.body, { room_id: req.params.id })

    db.insertToTable('chats', data).then((id) => {
        res.send({
            status: 'success',
            data: Object.assign(req.body, { id })
        })
    }).catch((err) => {
        res.send({
            status: 'error',
            message: err
        })
    })
})

router.post('/:id/join', (req, res) => {
    const data = Object.assign(req.body, { room_id: req.params.id })

    db.insertToTable(table, data).then((id) => {
        res.send({
            status: 'success',
            data: Object.assign(req.body, { id })
        })
    }).catch((err) => {
        res.send({
            status: 'error',
            message: err
        })
    })
})

// Delete room
router.delete('/:id', (req, res) => {
    db.deleteOneByID(table, req.params.id).then(() => {
        res.send({
            status: 'success',
            data: {}
        })
    }).catch((err) => {
        res.send({
            status: 'error',
            message: err
        })
    })
})

module.exports = router
