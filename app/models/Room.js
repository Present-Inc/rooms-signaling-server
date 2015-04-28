class Room {
  constructor(id, initiator) {
    this.id = id
    this.initiator = initiator

    // Map: client id -> client socket
    this.clients = new Map([[initiator.id, initiator]])

    console.log('Room constructor - this:', this)
  }

  addClient(client) {
    console.log(`Room ("${this.id}") addClient... client.id:`, client.id)
    // Add client to clients set
    this.clients.set(client.id, client)

    // If client has a currentRoom, remove him from it before adding 
    // him to this room.
    if (client.currentRoom) {
      client.currentRoom.removeClient(client)
    }

    // Make client join this room
    client.join(this.id)
    client.currentRoom = this
  }

  removeClient(client) {
    console.log(`Room ("${this.id}") removeClient... client.id:`, client.id)
    let io = this.initiator.server
    
    // Delete client from clients set
    this.clients.delete(client.id)

    // Make client leave this room
    client.leave(this.id)
    client.currentRoom = null

    // Broadcast `peer disconnect` event to all other clients in room
    io.to(this.id).emit('peer disconnect', client.id)
  }

  broadcastMessage(data) {
    console.log(`Room ("${this.id}") broadcastMessage... data:`, data)
    let io = this.initiator.server

    // Broadcast message to all clients in room
    io.to(this.id).emit('message', data)
  }
}

// Export Room
module.exports = Room
