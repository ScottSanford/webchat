class Global {
    constructor() {
        this.globalRoom = []
    }

    EnterRoom(id, name, room, img) {
        const roomName = { id, name, room, img}
        this.globalRoom.push(roomName)
        return roomName
    }

    GetUser(id) {
        const getUser = this.globalRoom.filter(userId => userId.id === id)[0]

        return getUser
    }

    RemoveUser(id) {
        const user = this.GetUser(id)

        if (user) {
            this.user = this.globalRoom.filter(user => user.id !== id)
        }

        return user
    }

    GetRoomList(room) {
        const roomName = this.globalRoom.filter(user => user.room === room)
        const namesArray = roomName.map(user => {
            return {
                name: user.name,
                img: user.img
            }
        })
        return namesArray
    }
}

module.exports = { Global }