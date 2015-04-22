# WebRTC Video Service
Present WebRTC Video

* * *

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

## Usage

```javascript
let Client = require('socket.io-client')
let client = new Client('http://signaler.present.tv/')

// Create new room
client.emit('new room', 'example-room')

// Connect to new room's namespace
client = new Client('http://signaler.present.tv/example-room')

// Handle connect event
client.on('connect', (connected) => if (connected) console.log('welcome to the room'))

// Handle peer disconnect event
client.on('peer disconnect', (peerClientId) => console.log(`peer with client id "${peerClientId}" has left`))

// Listen for messages
client.on('message', (data) => console.log('message data:', data))

// Listen for errors
client.on('error', (data) => console.error('error data:', data))
```

## Socket Events
`new room` creates a new room with the passed `roomId` string.
...