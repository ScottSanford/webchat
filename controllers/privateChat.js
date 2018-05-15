const async = require('async')
const Users = require('../models/users')
const Message = require('../models/message')

module.exports = function() {
    return {
        SetRouting: function(router) {
            router.get('/chat/:name', this.getChatPage)
            router.post('/chat/:name', this.postChatPage)
        },

        getChatPage: function(req, res) {
            // get data of every logged in user
            async.parallel([
                function(callback) {
                    // find user who matches the req.user.username
                    Users.findOne({ 'username': req.user.username })
                        // for that particular user, populate the friend request
                        .populate('request.userId')
                        .exec((err, result) => {
                            callback(err, result)
                        })
                },

                function(callback) {
                    Message.aggregate([
                        {$match: {$or: [
                                        {'senderName': req.user.username}, 
                                        {'receiverName': req.user.username}
                                    ]
                                }
                        },
                        {$sort: {'createdAt': -1}},
                        {$group: 
                            {'_id': {
                                'last_message_between': {
                                    $cond: [{$gt: [
                                                    {$substr: ['$senderName', 0, 1]},
                                                    {$substr: ['$receiverName', 0, 1]}
                                                ]
                                            },
                                            {$concat: ['$senderName', ' and ', '$receiverName']},
                                            {$concat: ['$receiverName', ' and ', '$senderName']}
                                        ]
                                    }
                                },
                                'body': {$first: '$$ROOT'}
                            }
                        }
                    ], (error, newResult) => {
                        console.log(newResult)
                        callback(newResult)
                    })
                }
            ], (err, result) => {
                const result1 = result[0]
                res.render('privatechat/privatechat', {
                    title: 'Webchat - Private',
                    user: req.user,
                    data: result1
                })
            })
        },

        postChatPage: function(req, res, next) {
            const params = req.params.name.split('.')
            const nameParams = params[0]
            const nameRegrex = RegExp('^'+nameParams.toLowerCase(), 'i')

            async.waterfall([
                function(callback) {
                    if (req.body.message) {
                        Users.findOne({
                            'username': {$regex: nameRegrex}
                        }, (err, data) => {
                            callback(err, data)
                        })
                    }
                },

                function(data, callback) {
                    if (req.body.message) {
                        const newMessage = new Message()
                        newMessage.sender = req.user._id
                        newMessage.receiver = data._id
                        newMessage.senderName = req.user.username
                        newMessage.receiverName = data.username
                        newMessage.message = req.body.message
                        newMessage.userImage = req.user.userImage
                        newMessage.createdAt = new Date()

                        newMessage.save((err, result) => {
                            if (err) {
                                return next(err)
                            }
                            console.log(result)
                            callback(err, result)
                        })
                    }
                }
            ], (err, results) => {
                res.redirect('/chat/' + req.params.name)
            })
        }
    }
}