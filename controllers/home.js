const _ = require('lodash')
const async = require('async')
const Group = require('../models/groups')
const Users = require('../models/users')

module.exports = function() {
    const home = {
        setRouting,
        getHomePage
    }

    return home

    function setRouting(router) {
        router.get('/home', home.getHomePage)
    }

    function getHomePage(req, res) {
        async.parallel([
            function (callback) {
                Group.find({}, (err, result) => {
                    callback(err, result)
                })
            },

            function (callback) {
                Group.aggregate([
                    { $group: { _id: '$city' } }
                ], (err, newResult) => {
                    callback(err, newResult)
                })
            },

            function (callback) {
                // find user who matches the req.user.username
                Users.findOne({ 'username': req.user.username })
                    // for that particular user, populate the friend request
                    .populate('request.userId')
                    .exec((err, result) => {
                        callback(err, result)
                    })
            }

        ], (err, results) => {
            const res1 = results[0]
            const res2 = results[1]
            const res3 = results[2]

            const dataChunk = []
            const chunkSize = 3
            for (let i = 0; i < res1.length; i += chunkSize) {
                dataChunk.push(res1.slice(i, i + chunkSize))
            }

            const citySort = _.sortBy(res2, '_id')

            res.render('home', {
                title: 'Webchat - Home',
                user: req.user,
                chunks: dataChunk,
                cities: citySort,
                data: res3
            })
        })
    }
}