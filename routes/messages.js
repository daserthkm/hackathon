/**
 * @author Daniel Seifert
 */

const express = require('express')
const db = require('../db')
const security = require('../security')

const router = express.Router()

const tableChatLikes = 'chat_likes'

db.createTable(tableChatLikes, {
  id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
  user_id: 'INTEGER',
  message_id: 'INTEGER'
})

// Get random chuck norris joke
router.post('/:id/likes', (req, res) => {
  const { id } = security.xssClean(req.params)
  const data = Object.assign(security.xssClean(req.body), { message_id: id })

  db.fetchManyByField(tableChatLikes, 'message_id', id).then((likes) => {
    const like = likes.find((like) => like.user_id === data.user_id)
    return like ? Promise.reject(new Error('user has already liked this message')) : Promise.resolve()
  }).then(() => {
    db.insertToTable('chat_likes', data).then((id) => {
      const like = Object.assign(data, { id })

      global.socket.emit('messages.liked', like)

      res.send({
        status: 'success',
        data: like
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

router.get('/:id/likes', (req, res) => {
  const { id } = security.xssClean(req.params)

  db.fetchManyByField(tableChatLikes, 'message_id', id).then((likes) => {
    res.send({
      status: 'success',
      data: {
        likes: likes || []
      }
    })
  }).catch((err) => {
    res.send({
      status: 'error',
      message: err
    })
  })
})

router.delete('/:id/likes', (req, res) => {
  const { id } = security.xssClean(req.params)
  const data = security.xssClean(req.body)

  db.fetchManyByField(tableChatLikes, 'message_id', id).then((likes) => {
    const like = likes.find((like) => like.user_id === data.user_id)
    if (like) {
      db.deleteOneByID(tableChatLikes, like.id).then(() => {
        global.socket.emit('messages.like_revoked', like)

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
        message: 'user has not liked this message'
      })
    }
  })
})

module.exports = router
