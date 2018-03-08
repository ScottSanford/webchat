const _ = require('lodash')

module.exports = function(io, Global) {
    const clients = new Global()

    io.on('connection', socket => {
        socket.on('global room', global => {
            socket.join(global.room)

            clients.EnterRoom(socket.id, global.name, global.room, global.img)

            // name of all people who are logged into the app
            const nameProp = clients.GetRoomList(global.room)
            const array = _.uniqBy(nameProp, 'name')

            io.to(global.room).emit('loggedInUser', array)
        })

        socket.on('disconnect', () => {
            const user = clients.RemoveUser(socket.id)

            if (user) {
                // name of all people who are logged into the app
                const nameProp = clients.GetRoomList(global.room)
                const array = _.uniqBy(nameProp, 'name')
                const removeData = _.remove(array, {'name': user.name})
                io.to(user.room).emit('loggedInUser', array)
            }
        })
    })
}