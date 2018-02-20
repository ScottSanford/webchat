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
        }
    }
}