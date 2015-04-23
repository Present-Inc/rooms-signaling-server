# WebRTC Video Service
Present WebRTC Video

* * *

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

## Usage

```javascript
let Client = require('socket.io-client')
let client = new Client('http://signaler.present.tv/')

// Join / create new room
// NOTE: if room doesn't already exist, this creates a new room 
// before joining; when this client (the room's intiator) leaves 
// or disconnects, all other clients are removed and the room 
// is deleted.
client.emit('join room', 'example-room')

// Handle peer disconnect event
client.on('peer disconnect', (peerClientId) => console.log(`peer with client id "${peerClientId}" has left`))

// Listen for messages in current room
client.on('message', (data) => console.log('message data:', data))

// Listen for errors
client.on('error', (data) => console.error('error data:', data))

...

// Leave current room
// NOTE: on disconnect, client automatically leaves current room
client.emit('leave room')
```

## Socket Events
`new room` creates a new room with the passed `roomId` string.
...