const mongoose = require('mongoose')

const groupNames = {
    name: {type: String, default: ''},
    city: {type: String, default: ''}, 
    image: {type: String, default: 'default.png'}, 
    fans: [{
        username: {type: String, default: ''}, 
        email: {type: String, default: ''}
    }]
}

// Group Data to be saved for MongoDB 
const groupSchema = mongoose.Schema(groupNames)

// Give Model a name of 'Group' and pass in the Schema
module.exports = mongoose.model('Group', groupSchema)