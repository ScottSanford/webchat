const async = require('async')
const Users = require('../models/users')

module.exports = function() {
    return {
        SetRouting: function(router) {
            router.get('/chat', this.getChatPage)
        },

        getChatPage: function(req, res) {
            // get data of every logged in user
            async.parallel([
                function (callback) {
                    // find user who matches the req.user.username
                    Users.findOne({ 'username': req.user.username })
                        // for that particular user, populate the friend request
                        .populate('request.userId')
                        .exec((err, result) => {
                            callback(err, result)
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
        }
    }
}