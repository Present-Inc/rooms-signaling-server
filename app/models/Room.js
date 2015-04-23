class Room {
  constructor(id, initiator) {
    // Room id
    this.id = id

    // Initiator's socket
    this.initiator = initiator

    // Map: client id -> client socket
    this.clients = new Map([[initiator.id, initiator]])

    console.log('Room constructor - this:', this)
  }

  addClient(client) {
    console.log(`Room ("${this.id}") addClient... client.id:`, client.id)
    // Add client to clients set
    this.clients.set(client.id, client)

    // Make client join this room
    client.join(this.id)

    // Set this room as client's currentRoom
    client.currentRoom = this

    // Broadcast message events from socket to all other clients in 
    // namespace.
    client.on('message', (data) => this.broadcastMessage(data))
    
    // When client disconnects, remove client from room
    client.on('disconnect', () => this.removeClient(client))
  }

  removeClient(client) {
    console.log(`Room ("${this.id}") removeClient... client.id:`, client.id)
    // Delete client from clients set
    this.clients.delete(client.id)

    // Make client leave this room
    client.leave(this.id)

    // Set client's current room to null
    client.currentRoom = null

    // Broadcast `peer disconnect` event to all other clients in room
    io.to(this.id).emit('peer disconnect', client.id)
  }

  broadcastMessage(data) {
    console.log(`Room ("${this.id}") broadcastMessage... data:`, data)
    // room's initiatior's (socket) server is (circular reference 
    // to) `io`.
    let io = this.initiator.server

    // Broadcast message to all clients in room
    io.to(this.id).emit('message', data)
  }
}

// Export Room
module.exports = Room
