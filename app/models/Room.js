class Room {
  constructor(id, initiator) {
    this.id = id
    this.initiator = initiator

    // Set: room events
    this.events = new Set()

    // Map: client id -> client socket
    this.clients = new Map()
  }

  addClient(client) {
    // Add client to clients map
    this.clients.set(client.id, client)

    // If client has a currentRoom, remove him from it before adding 
    // him to this room.
    if (client.currentRoom) {
      client.currentRoom.removeClient(client)
    }

    // Make client join this room
    client.join(this.id)
    client.currentRoom = this

    // Create "join room descriptor" object for client & this room
    let joinRoomDescriptor = {
      isInitiator: client.id === this.initiator.id, // Whether the new client is this room initiator
      roomId: this.id, // This room's id
      clientId: client.id, // The client's id
      messages: this.events.values() // An array of messages already that were broadcasted in this room
    }

    // Send client `join room` event "join room descriptor"
    this.sendEvent(client.id, 'join room', joinRoomDescriptor)
  }

  removeClient(client) {
    // Delete client from clients set
    this.clients.delete(client.id)

    // Make client leave this room
    client.leave(this.id)
    client.currentRoom = null

    // Broadcast `peer disconnect` event & peer's client id to all 
    // other clients in room.
    this.broadcastEvent('peer disconnect', client.id)
  }

  broadcastMessage(data) {
    // Broadcast message event & data to all clients in room
    this.broadcastEvent('message', data)
  }

  broadcastEvent(name, data) {
    // Add event to room events set
    this.events.add({ name: name, data: data })

    // Broadcast event to all clients in room
    this.sendEvent(this.id, name, data)
  }

  sendEvent(socketId, name, data) {
    // This room's initiator's server is circular reference to io
    let io = this.initiator.server

    // Send event to socket / room with id socketId
    io.to(socketId).emit(name, data)
  }
}

// Room subclass w/ debug logs
class DebugRoom extends Room {
  constructor(id, initiator) {
    super(id, initiator)
    console.log('Room constructor - this:', this)
  }

  addClient(client) {
    console.log(`Room ("${this.id}") addClient... client.id:`, client.id)
    return super.addClient(client)
  }

  removeClient(client) {
    console.log(`Room ("${this.id}") removeClient... client.id:`, client.id)
    return super.removeClient(client)
  }

  broadcastMessage(data) {
    console.log(`Room ("${this.id}") broadcastMessage... data:`, data)
    return super.broadcastMessage(data)
  }

  broadcastEvent(name, data) {
    console.log(`Room ("${this.id}") broadcastEvent... name "${name}" data:`, data)
    return super.broadcastEvent(name, data)
  }

  sendEvent(socketId, name, data) {
    console.log(`Room ("${this.id}") sendEvent to socketId "${socketId}"... name "${name}" data:`, data)
    return super.sendEvent(socketId, name, data)
  }
}

// Export class
module.exports = DebugRoom
