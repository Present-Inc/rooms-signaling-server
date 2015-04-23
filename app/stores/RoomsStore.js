let Room = require('../models/Room')

class RoomsStore {
  constructor() {
    // Map: roomId -> room
    this.rooms = new Map()

    console.log('RoomsStore constructor - this:', this)
  }

  createRoom(roomId, initiator) {
    console.log(`RoomsStore createRoom with id "${roomId}"... initiator.id:`, initiator.id)
    return this.rooms.set(roomId, new Room(roomId, initiator))
  }

  getRoom(roomId) {
    console.log(`RoomsStore getRoom with id "${roomId}"...`)
    return this.rooms.get(roomId)
  }

  deleteRoom(roomId) {
    console.log(`RoomsStore deleteRoom with id "${roomId}"...`)
    let room = this.getRoom(roomId)

    // If room doesn't exist, bail
    if (!room) {
      return
    }

    // Remove all clients from room, including initiator
    room.clients.forEach(client => room.removeClient(client))

    // Delete room
    return this.rooms.delete(roomId)
  }

  addRoomClient(roomId, client) {
    console.log(`RoomsStore addRoomClient to room with id "${roomId}"... client.id:`, client.id)
    let room = this.getRoom(roomId)

    // If room doesn't exist, create room with client as initiator
    if (!room) {
      return this.createRoom(roomId, client)
    }

    // Room exists, add room client
    return room.addClient(client)
  }

  removeRoomClient(roomId, client) {
    console.log(`RoomsStore removeRoomClient from room with id "${roomId}"... client.id:`, client.id)
    let room = this.getRoom(roomId)

    // If room doesn't exist, bail
    if (!room) {
      return
    }

    // If the client isn't the initiator of the room, just remove 
    // him from the room.
    if (client.id !== room.initiator.id) {
      return room.removeClient(client)
    }

    // Client is room's initiator... delete the room.
    return this.deleteRoom(roomId)
  }
}

// Export RoomsStore
module.exports = RoomsStore
