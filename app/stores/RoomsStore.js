let Room = require('../models/Room')

class RoomsStore {
  constructor() {
    // Map: roomId -> room
    this.rooms = new Map()
  }

  createRoom(roomId, initiator) {
    return this.rooms.set(roomId, new Room(roomId, initiator))
  }

  getRoom(roomId) {
    return this.rooms.get(roomId)
  }

  deleteRoom(roomId) {
    return this.rooms.delete(roomId)
  }

  removeRoomClient(roomId, client) {
    let room = this.getRoom(roomId)

    // If room doesn't exist, bail
    if (!room) {
      return
    }

    // Room exists... if client is room's initiator, delete room and bail
    if (client.id === room.initiator.id) {
      return this.deleteRoom(roomId)
    }

    // Client is not room's initiator... remove room client
    return room.removeClient(client)
  }
}

// Export RoomsStore
module.exports = RoomsStore
