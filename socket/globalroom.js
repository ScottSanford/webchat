const _ = require('lodash')

module.exports = function(io, Global) {
    const clients = new Global()

    io.on('connection', socket => {
        socket.on('global room', global => {
            socket.join(global.room)

            clients.EnterRoom(socket.id, global.name, global.room, global.img)

            const nameProp = clients.GetRoomList(global.room)
            const array = _.uniqBy(nameProp, 'name')

            io.to(global.room).emit('loggedInUser', array)
        })
    })
}