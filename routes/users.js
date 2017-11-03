/**
 * @author Daniel Seifert
 */

const express = require('express')
const db = require('../db')

const router = express.Router()

const table = 'users'

// Create table users
db.createTable(table, {
    id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
    name: 'VARCHAR(50)'
}).then(() => {

    // Insert initial test data
    db.insertToTable(table, {
        name: 'Daniel'
    })

    db.insertToTable(table, {
        name: 'Felix'
    })

    db.insertToTable(table, {
        name: 'Sascha'
    })
})

// Get all users
router.get('/', (req, res) => {
    db.fetchAll(table).then((results) => {
        res.send({
            status: 'success',
            data: {
                users: results || []
            }
        })
    })
})

// Get all rooms
router.get('/:id/rooms', (req, res) => {
    db.fetchManyByField('room_users', 'user_id', req.params.id).then((room_users) => {
        db.fetchAll('rooms').then((rooms) => {
            res.send({
                status: 'success',
                data: {
                    rooms: room_users.map((room_user) => {
                        const room = rooms.find((room) => room.id === room_user.room_id)
                        return room ? room : {
                            id: room_user.room_id,
                            name: 'deleted'
                        }
                    })
                }
            })
        }).catch((err) => {
            res.send({
                status: 'error',
                message: err
            })
        })
    }).catch((err) => {
        res.send({
            status: 'error',
            message: err
        })
    })
})

// Edit user
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
                message: 'user not found'
            })
        }
    }).catch((err) => {
        res.send({
            status: 'error',
            message: err
        })
    })
})

// Add user
router.post('/', (req, res) => {
    db.insertToTable(table, req.body).then((lastID) => {
        res.send({
            status: 'success',
            data: Object.assign(req.body, {
                id: lastID
            })
        })
    }).catch((err) => {
        res.send({
            status: 'error',
            message: err
        })
    })
})

// Delete user
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
