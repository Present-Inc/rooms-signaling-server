let Server = require('socket.io')
let io = new Server()

// Listen on configured / default port
io.listen(process.env['PORT'] || 8000)

// Export io
module.exports = io
