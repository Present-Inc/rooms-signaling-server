let RoomsStore = new (require('./stores/RoomsStore'))()
let io = require('./io')

// Socket Connection Handler
io.sockets.on('connection', (socket) => {
    console.log('new socket connection... socket.id:', socket.id)

    // Create room
    socket.on('join room', (roomId) => {
        console.log(`join room with id "${roomId}"... socket.id:`, socket.id)
        RoomsStore.addRoomClient(roomId, socket)
    })
})