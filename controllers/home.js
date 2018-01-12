const _ = require('lodash')
const async = require('async')
const Group = require('../models/groups')

module.exports = function() {
    return {
        SetRouting: function(router) {
            router.get('/home', this.homePage)
        }, 

        homePage: function (req, res) {
            async.parallel([
                function(callback) {
                    Group.find({}, (err, result) => {
                        callback(err, result)
                    })
                }, 

                function(callback) {
                    Group.aggregate([
                        {$group: { _id: '$city'}}
                    ],(err, newResult) => {
                        callback(err, newResult)
                    })
                }

            ], (err, results) => {
                const res1 = results[0]
                const res2 = results[1]
                
                const dataChunk = []
                const chunkSize = 3
                for (let i = 0; i < res1.length; i += chunkSize) {
                    dataChunk.push(res1.slice(i, i+chunkSize))
                }

                const citySort = _.sortBy(res2, '_id')

                res.render('home', {
                    title: 'Webchat - Home',
                    data: dataChunk, 
                    cities: citySort
                })
            })

        }
    }
}