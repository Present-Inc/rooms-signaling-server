class Room {
  constructor(id, initiator) {
    // initiatior's (socket) server is (circular reference to) `io`
    let io = initiator.server

    // Room namespace
    this.namespace = io.of(`/${id}`)

    // Add clients as they connect to the room's namespace
    this.namespace.on('connection', (client) => this.addClient(client))

    // Room id
    this.id = id

    // Initiator's socket
    this.initiator = initiator

    // Map: client id -> client socket
    this.clients = new Map([[initiator.id, initiator]])
  }

  addClient(client) {
    // Add client to clients set
    this.clients.set(client.id, client)

    // Emit connect event to newly-connected client
    client.emit('connect', true)

    // Broadcast message events from socket to all other clients in namespace
    client.on('message', (data) => this.broadcastMessage(data))
    
    // When client disconnects, remove client from room
    client.on('disconnect', () => this.removeClient(client))
  }

  removeClient(client) {
    // Delete client from clients set
    this.clients.delete(client.id)

    // Broadcast user-left event to all other clients in namespace 
    this.namespace.emit('userLeft', client.id)
  }

  broadcastMessage(data) {
    // Broadcast message to all clients in room
    this.namespace.emit('message', data)
  }
}

// Export Room
module.exports = Room
