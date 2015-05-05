let Room = require('../models/Room')

class RoomsStore {
  constructor() {
    // Map: roomId -> room
    this.rooms = new Map()
  }

  createRoom(roomId, initiator) {
    let room = new Room(roomId, initiator)

    // Add new room to rooms map
    this.rooms.set(roomId, room)

    return room
  }

  getRoom(roomId) {
    return this.rooms.get(roomId)
  }

  deleteRoom(roomId) {
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
    let room = this.getRoom(roomId)

    // If room doesn't exist, create room with client as initiator
    if (!room) {
      room = this.createRoom(roomId, client)
    }

    // Room exists, add room client
    return room.addClient(client)
  }

  removeRoomClient(roomId, client) {
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

// RoomsStore subclass w/ debug logs
class DebugRoomsStore extends RoomsStore {
  constructor() {
    super()
    console.log('RoomsStore constructor - this:', this)
  }

  createRoom(roomId, initiator) {
    console.log(`RoomsStore createRoom with id "${roomId}"... initiator.id:`, initiator.id)
    return super.createRoom(roomId, initiator)
  }

  getRoom(roomId) {
    console.log(`RoomsStore getRoom with id "${roomId}"...`)
    return super.getRoom(roomId)
  }

  deleteRoom(roomId) {
    console.log(`RoomsStore deleteRoom with id "${roomId}"...`)
    return super.deleteRoom(roomId)
  }

  addRoomClient(roomId, client) {
    console.log(`RoomsStore addRoomClient to room with id "${roomId}"... client.id:`, client.id)
    return super.addRoomClient(roomId, client)
  }

  removeRoomClient(roomId, client) {
    console.log(`RoomsStore removeRoomClient from room with id "${roomId}"... client.id:`, client.id)
    return super.removeRoomClient(roomId, client)
  }
}

// Export class
module.exports = DebugRoomsStore
