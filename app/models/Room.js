class Room {
  constructor(id, initiator) {
    this.id = id
    this.initiator = initiator

    // Array: room events
    this.events = []

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
      messages: this.events // An array of messages already that were broadcasted in this room
    }

    // !!: DEBUG ONLY
    console.log('joinRoomDescriptor:', joinRoomDescriptor)

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

  broadcastMessage(data, sourceClient) {
    // Broadcast message event & data to all clients in room
    this.broadcastEvent('message', data, sourceClient)
  }

  broadcastEvent(name, data, sourceClient) {
    // Add event to room events set
    this.events.push({ 
      name: name, 
      data: data,
      client: sourceClient
    })

    // Broadcast event to all clients in room, except source client
    for (client in this.clients.values()) {
      if (client.id !== sourceClient.id) {
        this.sendEvent(client.id, name, data)
      }
    }
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

  broadcastMessage(data, sourceClient) {
    console.log(`Room ("${this.id}") broadcastMessage... data:`, data)
    return super.broadcastMessage(data, sourceClient)
  }

  broadcastEvent(name, data, sourceClient) {
    console.log(`Room ("${this.id}") broadcastEvent... name "${name}" data:`, data)
    console.log('this.events:', this.events)
    return super.broadcastEvent(name, data, sourceClient)
  }

  sendEvent(socketId, name, data) {
    console.log(`Room ("${this.id}") sendEvent to socketId "${socketId}"... name "${name}" data:`, data)
    return super.sendEvent(socketId, name, data)
  }
}

// Export class
module.exports = DebugRoom
