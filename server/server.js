'use strict';

const { json } = require('body-parser')
const { Server } = require('http')
const express = require('express')
const mongoose = require('mongoose')
const socketio = require('socket.io')

const app = express()
const server = Server(app)
const io = socketio(server)

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/socket-chat'
const PORT = process.env.PORT || 3000

app.use(express.static('client'))
app.use(json())

app.get('/api/title', (req, res) =>
  res.json({ title: 'Socket Chat' })
)

// message model
const Msg = mongoose.model('msg', {
  user: String,
  body: String
})

// app.get('/api/messages', )

app.use('/api', (req, res) =>
  res.status(404).send({ code: 404, status: 'Not Found' })
)

// app.use((req, res) =>
//   res.sendFile(process.cwd() + '/client/index.html')
// )

app.use((err, req, res, next) =>
  res.status(500).send({ code: 500, status: 'Internal Server Error', detail: err.stack })
)

mongoose.Promise = Promise

mongoose.connect(MONGODB_URL, () => {
  server.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
})

io.on('connection', socket => {
  console.log(`Socket connected: ${socket.id}`)
  socket.on('disconnect', () => console.log(`Socket disconnected: ${socket.id}`))
  // socket.on newMsg
})
