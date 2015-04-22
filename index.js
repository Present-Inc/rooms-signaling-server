// Socket IO Server
let Server = require('socket.io')
let io = new Server({
  port: process.env['PORT'] || 8000
})

// Channels
let channels = {}

// Socket IO Events
io.sockets.on('connection', (socket) => {
	// wtf? "initiatorChannel"?
	let initiatorChannel = ''

	// wtf? force io.isConnected... on module-level `io`?
	io.isConnected = true

	// New channel event
    socket.on('new-channel', (data) => {
    	// If channel doesn't exist yet, set initiatorChannel to the channel (`data.channel`)
        if (!channels[data.channel]) {
            initiatorChannel = data.channel
        }

        // Put channel in channels
        channels[data.channel] = data.channel

        // Handle `onNewNamespace` w/ channel & sender...?
        onNewNamespace(data.channel, data.sender)
    })

    // Presence event
    socket.on('presence', (channel) => {
    	// set `isChannelPresent` to whether the channel exists or not
        let isChannelPresent = !!channels[channel]

        // emit a `presence` event w/ `isChannelPresent`
        socket.emit('presence', isChannelPresent)
    })

    // Disconnect event
    socket.on('disconnect', (channel) => {
    	// If "initiatorChannel"...? delete initiatorChannel from channels
        if (initiatorChannel) {
            delete channels[initiatorChannel]
        }
    })
})

// New namespace handler
// wtf
function onNewNamespace(channel, sender) {
    io.of(`/${channel}`).on('connection', (socket) => {
        var username;
        if (io.isConnected) {
            io.isConnected = false
            socket.emit('connect', true)
        }

        socket.on('message', (data) => {
            if (data.sender == sender) {
                if(!username) {
                	username = data.data.sender
                }
                
                socket.broadcast.emit('message', data.data)
            }
        })
        
        socket.on('disconnect', => {
            if(username) {
                socket.broadcast.emit('user-left', username)
                username = null
            }
        })
    })
}