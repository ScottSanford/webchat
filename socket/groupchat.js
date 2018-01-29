module.exports = function(io, Users) {

    const users = new Users()

    io.on('connection', socket => {
        console.log('User connected')

        socket.on('join', (params, callback) => {
            // join a specific channel
            socket.join(params.room)
            // add user to the channel
            users.AddUserData(socket.id, params.name, params.room)
            // get users list in a room
            io.to(params.room).emit('usersList', users.GetUsersList(params.room))

            callback()
        })

        socket.on('createMessage', (message, callback) => {
            io.to(message.room).emit('newMessage', {
                text: message.text,
                room: message.room,
                from: message.from
            })

            callback()
        })

        socket.on('disconnect', () => {
            const user = users.RemoveUser(socket.id)

            if (user) {
                io.to(user.room).emit('usersList', users.GetUsersList(user.room))
            }
        })
    })
}