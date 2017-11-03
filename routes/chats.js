/**
 * @author Daniel Seifert
 */

const express = require('express')
const db = require('../db')
const security = require('../security')

const router = express.Router()

const table = 'chats'

// Create table chats
db.createTable(table, {
    id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
    user_id: 'INTEGER',
    room_id: 'INTEGER',
    message: 'TEXT',
    millisecond: 'INTEGER'
}).then(() => {
    const messages = [
        {
            user_id: 1, // Daniel
            room_id: 1, // Test room
            message: 'Hello World'
        },
        {
            user_id: 2, // Felix
            room_id: 1, // Test room
            message: 'This is a test'
        },
        {
            user_id: 3, // Sascha
            room_id: 1, // Test room
            message: 'Got it'
        },
        {
            user_id: 1, // Daniel
            room_id: 2, // Fake room
            message: 'Alright'
        }
    ]

    function insertToTable(data) {
        const now = db.getCurrentDateTimeObj()
        return db.insertToTable(table, Object.assign(data, {
            create_date: now.date,
            millisecond: now.ms
        }))
    }

    // Insert data sequential
    const insertData = (messages) => {
        return messages.reduce((p, data) => {
            return p.then(function(){ return insertToTable(data); });
        }, Promise.resolve());
    }

    insertData(messages)
})

// Get all messages from room
router.get('/:id', (req, res) => {
    db.fetchManyByField(table, 'room_id', req.params.id).then((chats) => {
        res.send({
            status: 'success',
            data: {
                messages: chats
            }
        })
    }).catch((err) => {
        res.send({
            status: 'error',
            message: err
        })
    })
})

// Send a message to room
router.post('/:id', (req, res) => {
    const params = security.xssClean(req.params)
    const body = security.xssClean(req.body)

    const now = db.getCurrentDateTimeObj()

    db.insertToTable(table, Object.assign(body, {
        room_id: params.id,
        create_date: now.date,
        millisecond: now.ms
    })).then((id) => {
        const message = Object.assign(body, {
            create_date: now.date,
            millisecond: now.ms,
            id
        })

        global.socket.emit('chat.new_message', message)

        res.send({
            status: 'success',
            data: message
        })
    }).catch((err) => {
        res.send({
            status: 'error',
            message: err
        })
    })
})

// Delete one message
router.delete('/:id', (req, res) => {
    const id = req.params.id
    db.deleteOneByID(table, id).then(() => {
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
