class Users {
    constructor() {
        this.users = []
    }

    AddUserData(id, name, room) {
        let user = {id, name, room}
        this.users.push(user)
        return user
    }

    GetUser(id) {
        const getUser = this.users.filter(userId => userId.id === id)[0]

        return getUser
    }

    RemoveUser(id) {
        const user = this.GetUser(id)

        if (user) {
            this.users = this.users.filter(user => user.id !== id)
        }

        return user
    }

    GetUsersList(room) {
        const usersInRoom = this.users.filter(user => user.room === room)
        const namesArray = usersInRoom.map(user => user.name)
        return namesArray
    }
 }

 module.exports = {Users}