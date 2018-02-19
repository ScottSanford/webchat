const Users = require('../models/users')
const async = require('async')

module.exports = function() {
    return {
        SetRouting: function(router) {
            router.get('/group/:name', this.groupPage)
            router.get('/group/:name', this.groupPostPage)
        },

        groupPage: function(req, res) {
            const name = req.params.name
            res.render('groupchat/group', {
                title: 'Webchat - Group',
                groupName: name,
                user: req.user
            })
        },

        groupPostPage: function(req, res) {
            async.parallel([
                function(callback) {
                    if(req.body.receiverName) {
                        // For the receiver of the friend request
                        Users.update({
                            'username': req.body.receiverName,
                            'request.userId': {$ne: req.user._id},
                            'friendsList': {$ne: req.user._id}
                        }, {
                            $push: {request: {
                                userId: req.user._id,
                                username: req.user.username
                            }},
                            $inc: { totalRequest: 1}
                        }, (err, count) => {
                            callback(err, count)
                        })
                    }
                }
            ])
        }
    }
}