class Global {
    constructor() {
        this.globalRoom = []
    }

    EnterRoom(id, name, room, img) {
        const roomName = { id, name, room, img}
        this.globalRoom.push(roomName)
        return roomName
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