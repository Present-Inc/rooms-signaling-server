let Room = require('../models/Room')

class RoomsStore {
  constructor() {
    // Map: roomId -> room
    this.rooms = new Map()
  }

  createRoom(roomId, initiator) {
    return this.rooms.set(roomId, new Room(roomId, initiator))
  }

  deleteRoom(roomId) {
    return this.rooms.delete(roomId)
  }

  removeRoomClient(roomId, client) {
    let room = this.getRoom(roomId)

    // If room doesn't exist, throw 'room not found' error
    if (!room) {
      throw new Error('Room not found')
    }

    // Room exists... if client is room's initiator, delete room
    if (client.id === room.initiator.id) {
      return this.deleteRoom(roomId)
    }

    // Client is not room's initiator... remove room client
    return room.removeClient(client)
  }
}

// Export RoomsStore
module.exports = RoomsStore
