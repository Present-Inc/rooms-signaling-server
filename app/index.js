let RoomsStore = new (require('./stores/RoomsStore'))()
let io = require('./io')

// Socket Connection Handler
io.sockets.on('connection', (socket) => {
    // Create room
    socket.on('new room', (roomId) => {
        RoomsStore.createRoom(roomId, socket)
    })

    // Ping room
    socket.on('ping', (roomId) => {
        socket.emit('ping', RoomsStore.pingRoom(roomId))
    })
})