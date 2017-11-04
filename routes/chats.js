/**
 * @author Daniel Seifert
 */

const _take = require('lodash/take')
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
  attachment_url: 'TEXT',
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
      message: 'Foo Bar'
    },
    {
      user_id: 3, // Sascha
      room_id: 2, // Fake room
      message: 'OK'
    }
  ]

  function insertToTable (data) {
    const now = db.getCurrentDateTimeObj()
    return db.insertToTable(table, Object.assign(data, {
      create_date: now.date,
      millisecond: now.ms
    }))
  }

  // Insert data sequential
  const insertData = (messages) => {
    return messages.reduce((p, data) => {
      return p.then(function () { return insertToTable(data) })
    }, Promise.resolve())
  }

  insertData(messages)
})

// Send a message to room
router.post('/:id', (req, res) => {
  const params = security.xssClean(req.params)
  const body = security.xssClean(req.body)

  const now = db.getCurrentDateTimeObj()

  const data = Object.assign(body, {
    room_id: params.id,
    create_date: now.date,
    millisecond: now.ms
  })

  db.insertToTable(table, data).then((id) => {
    const message = Object.assign(data, { id })

    global.socket.emit('chats.new_message', message)

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

// Get all messages from room
router.get('/:id', (req, res) => {
  const defaults = {
    limit: 100,
    order: 'ASC'
  }

  const { id } = security.xssClean(req.params)
  const { limit, order } = Object.assign(defaults, security.xssClean(req.query))

  db.fetchManyOrderedByField(table, 'room_id', id, 'create_date, millisecond', order).then((messages) => {
    res.send({
      status: 'success',
      data: {
        messages: _take(messages, limit)
      }
    })
  }).catch((err) => {
    res.send({
      status: 'error',
      message: err
    })
  })
})

// Delete all messages from room
router.delete('/:id', (req, res) => {
  const { id } = security.xssClean(req.params)

  db.deleteManyByField(table, 'room_id', id).then(() => {
    global.socket.emit('chats.cleared', {
      create_date: db.getCurrentDateTime(),
      room_id: id
    })

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
