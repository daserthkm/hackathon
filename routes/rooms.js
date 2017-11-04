/**
 * @author Daniel Seifert
 */

const express = require('express')
const db = require('../db')
const security = require('../security')

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

// List all rooms
router.get('/', (req, res) => {
  db.fetchAll(table).then((rooms) => {
    res.send({
      status: 'success',
      data: {
        rooms: rooms || []
      }
    })
  }).catch((err) => {
    res.send({
      status: 'error',
      message: err
    })
  })
})

// Create new room
router.post('/', (req, res) => {
  const data = security.xssClean(req.body)

  db.insertToTable(table, data).then((id) => {
    const room = Object.assign(data, { id })

    global.socket.emit('rooms.created', room)

    res.send({
      status: 'success',
      data: room
    })
  }).catch((err) => {
    res.send({
      status: 'error',
      message: err
    })
  })
})

// Get one room
router.get('/:id', (req, res) => {
  const { id } = security.xssClean(req.params)

  db.fetchOneByID(table, id).then((rooms) => {
    res.send({
      status: 'success',
      data: {
        rooms: rooms || []
      }
    })
  }).catch((err) => {
    res.send({
      status: 'error',
      message: err
    })
  })
})

// Edit one room
router.put('/:id', (req, res) => {
  const { id } = security.xssClean(req.params)
  const data = security.xssClean(req.body)

  // Fetch previous room data
  db.fetchOneByID(table, id).then((room) => {
    if (room) {
      room = Object.assign(room, { id })
      db.updateOneByID(table, Object.assign(room, data), id).then(() => {
        const update = Object.assign(room, data)

        global.socket.emit('rooms.changed', update)

        res.send({
          status: 'success',
          data: update
        })
      }).catch((err) => {
        res.send({
          status: 'error',
          message: err
        })
      })
    } else {
      res.send({
        status: 'error',
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

// Delete room
router.delete('/:id', (req, res) => {
  const { id } = security.xssClean(req.params)

  db.fetchOneByID(table, id).then((room) => {
    if (room) {
      db.deleteOneByID(table, req.params.id).then(() => {
        global.socket.emit('rooms.deleted', room)

        res.send({
          status: 'success',
          data: null
        })
      }).catch((err) => {
        res.send({
          status: 'error',
          message: err
        })
      })
    } else {
      res.send({
        status: 'error',
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

// Get all room members
router.get('/:id/users', (req, res) => {
  const { id } = security.xssClean(req.params)

  // Fetch mapping
  db.fetchManyByField('room_users', 'room_id', id).then((roomusers) => {
    // Fetch all users an map data
    db.fetchAll('users').then((users) => {
      res.send({
        status: 'success',
        data: {
          users: roomusers.map((roomuser) => {
            const user = users.find((user) => user.id === roomuser.user_id)
            return user || {
              id: roomuser.user_id,
              name: 'deleted'
            }
          }) || []
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

router.post('/:id/users', (req, res) => {
  const { id } = security.xssClean(req.params)
  const data = Object.assign(security.xssClean(req.body), { room_id: id })

  // Check if user is already member
  db.fetchManyByField('room_users', 'room_id', id).then((roomusers) => {
    const member = roomusers.find((roomuser) => roomuser.user_id === data.user_id)
    return member ? Promise.reject(new Error('user is already member of this room')) : Promise.resolve()
  }).then(() => {
    db.insertToTable('room_users', data).then((id) => {
      const member = Object.assign(data, { id })

      global.socket.emit('rooms.user_joined', member)

      res.send({
        status: 'success',
        data: member
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
      message: err.message
    })
  })
})

router.delete('/:id/users', (req, res) => {
  const { id } = security.xssClean(req.params)
  const data = security.xssClean(req.body)

  db.fetchManyByField('room_users', 'room_id', id).then((roomusers) => {
    const roomuser = roomusers.find((roomuser) => roomuser.user_id === data.user_id)
    if (roomuser) {
      db.deleteOneByID('room_users', roomuser.id).then(() => {
        global.socket.emit('rooms.user_left', roomuser)

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
    } else {
      res.send({
        status: 'error',
        message: 'user is no member of this room'
      })
    }
  })
})

module.exports = router
