const Users = require('../models/users')
const async = require('async')

module.exports = function() {
    return {
        SetRouting: function(router) {
            router.get('/group/:name', this.groupPage)
            router.post('/group/:name', this.groupPostPage)
        },

        groupPage: function(req, res) {
            const name = req.params.name
            
            // get data of every logged in user
            async.parallel([
                function(callback) {
                    // find user who matches the req.user.username
                    Users.findOne({'username': req.user.username})
                        // for that particular user, populate the friend request
                        .populate('request.userId')
                        .exec((err, result) => {
                            callback(err, result)
                        })
                }
            ], (err, result) => {
                const result1 = result[0]
                res.render('groupchat/group', {
                    title: 'Webchat - Group',
                    groupName: name,
                    user: req.user,
                    data: result1
                })
            })
            
        },

        groupPostPage: function(req, res) {
            async.parallel([
                // Update the Receiver List
                function(callback) {
                    if(req.body.receiverName) {
                        // For the receiver of the friend request
                        Users.update({
                            'username': req.body.receiverName,
                            'request.userId': {$ne: req.user._id},
                            'friendsList': {$ne: req.user._id}
                        }, {
                            $push: {
                                request: {
                                    userId: req.user._id,
                                    username: req.user.username
                                }
                            },
                            $inc: { totalRequest: 1}
                        }, (err, count) => {
                            callback(err, count)
                        })
                    }
                },

                // Update the Sender
                function(callback) {
                    if(req.body.receiverName) {
                        Users.update({
                            'username': req.user.username,
                            'sentRequest.username': {$ne: req.body.receiverName}
                        },{
                            $push: {
                                sentRequest: {
                                    username: req.body.receiverName
                                }
                            }
                        }, (err, count) => {
                            callback(err, count)
                        })
                    }
                }
            ], (err, results) => {
                res.redirect(`/group/${req.params.name}`)
            })

            async.parallel([
                // Update the Receiver of a Friend Request
                function(callback) {
                    if(req.body.senderId) {
                        // Update the User's collection
                        Users.update({
                            '_id': req.user._id,
                            'friendsList.friendId': {$ne: req.body.senderId}
                        }, {
                            // Push new friend in friend's list
                            $push: {
                                friendsList: {
                                    friendId: req.body.senderId,
                                    friendName: req.body.senderName
                                }
                            },
                            // Pull away the request since it's no longer a request
                            $pull: {
                                request: {
                                    userId: req.body.senderId,
                                    username: req.body.senderName
                                }
                            },
                            // change the value of totalRequest
                            $inc: {totalRequest: -1}
                        }, (err, count) => {
                            callback(err, count)
                        })
                    }
                }, 

                // Update the Sender when the friend request is made
                function (callback) {
                    if (req.body.senderId) {
                        // Update the User's collection
                        Users.update({
                            '_id': req.body.senderId,
                            'friendsList.friendId': { $ne: req.user._id }
                        }, {
                                // Push new friend in friend's list
                                $push: {
                                    friendsList: {
                                        friendId: req.user._id,
                                        friendName: req.user.username
                                    }
                                },
                                // Pull away the sent request since it's no longer a request
                                $pull: {
                                    sentRequest: {
                                        username: req.user.username
                                    }
                                },
                            }, (err, count) => {
                                callback(err, count)
                            })
                    }
                },

                // Cancel Friend Request on Receiver side
                function(callback) {
                    if(req.body.user_Id) {
                        Users.update({
                            '_id': req.user._id,
                            'request.userId': {$eq: req.body.user_Id}
                        }, {
                            $pull: {
                                request: {
                                    userId: req.body.user_Id,
                                }
                            },
                            // change the value of totalRequest
                            $inc: { totalRequest: -1 }
                        }, (err, count) => {
                            callback(err, count)
                        })
                    }
                },

                function(callback) {
                    if (req.body.senderName) {
                        Users.update({
                            '_id': req.body.user_Id,
                            'sentRequest.username': { $eq: req.user.username }
                        }, {
                            // Pull away the sent request since it's no longer a request
                            $pull: {
                                sentRequest: {
                                    username: req.user.username
                                }
                            }
                        }, (err, count) => {
                            callback(err, count)
                        })
                    }
                }

            ], (err, results) => {
                res.redirect(`/group/${req.params.name}`)
            })
        }
    }
}