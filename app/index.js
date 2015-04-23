let RoomsStore = new (require('./stores/RoomsStore'))()
let io = require('./io')

// Socket Connection Handler
io.sockets.on('connection', (socket) => {
  console.log('new socket connection... socket.id:', socket.id)

  // Join room
  socket.on('join room', (roomId) => RoomsStore.addRoomClient(roomId, socket))

  // Message current room
  socket.on('message', (data) => {
    if (socket.currentRoom) {
      socket.currentRoom.broadcastMessage(data)
    }
  })

  // Leave current room
  socket.on('leave room', () => {
    if (socket.currentRoom) {
      socket.currentRoom.removeClient(socket)
    }
  })

  // Disconnect / leave current rooms
  socket.on('disconnect', () => if (socket.currentRoom) RoomsStore.removeRoomClient(socket.currentRoom.id, socket))
})