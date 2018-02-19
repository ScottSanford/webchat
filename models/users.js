const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')

const user = {
    username: {type: String, unique: true},
    fullname: {type: String, unique: true, default: ''},
    email: {type: String, unique: true},
    password: {type: String, default: ''},
    userImage: {type: String, default: 'default.png'},
    facebook: {type: String, default: ''},
    fbTokens: Array,
    google: {type: String, default: ''},
    sentRequest: [{
        username: {type: String, default: ''}
    }],
    request: [{
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        username: {type: String, default: '' }
    }],
    friendsList: [{
        friendId: {type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        friendName: {type: String, default: ''}
    }],
    totalRequest: {type: Number, default: 0}
}

// User Data to be saved for MongoDB 
const userSchema = mongoose.Schema(user)

userSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
}

userSchema.methods.validUserPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}

// Give Model a name of 'User' and pass in the Schema
module.exports = mongoose.model('User', userSchema)
