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
    user_id: 1 // Daniel
  })

  db.insertToTable(table, {
    room_id: 1, // Test room
    user_id: 2 // Felix
  })

  db.insertToTable(table, {
    room_id: 1, // Test room
    user_id: 3 // Sascha
  })

  db.insertToTable(table, {
    room_id: 2, // Fake room
    user_id: 1 // Daniel
  })

  db.insertToTable(table, {
    room_id: 2, // Fake room
    user_id: 2 // Felix
  })
})

module.exports = router
