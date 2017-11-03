/**
 * @author Daniel Seifert
 */

const express = require('express')
const db = require('../db')

const router = express.Router()

const table = 'room_users'

// Create table room_users
db.createTable(table, {
    id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
    room_id: 'INTEGER',
    user_id: 'INTEGER'
}).then(() => {

    // Insert initial test data
    db.insertToTable(table, {
        room_id: 1, // Test room
        user_id: 1  // Daniel
    })

    db.insertToTable(table, {
        room_id: 1, // Test room
        user_id: 2  // Felix
    })

    db.insertToTable(table, {
        room_id: 1, // Test room
        user_id: 3  // Sascha
    })

    db.insertToTable(table, {
        room_id: 2, // Fake room
        user_id: 1  // Daniel
    })

    db.insertToTable(table, {
        room_id: 2, // Fake room
        user_id: 2  // Felix
    })
})

router.get('/', (req, res) => {
    db.fetchAll(table).then((results) => {
        res.send({
            status: 'success',
            data: results || []
        })
    })
})

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

router.delete('/:id', (req, res) => {
    const id = req.params.id
    db.deleteOneByID(table, id).then(() => {
        res.send({
            status: 'success',
            data: []
        })
    }).catch((err) => {
        res.send({
            status: 'error',
            message: err
        })
    })
})

module.exports = router
