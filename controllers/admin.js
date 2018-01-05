const path = require('path')
const fs = require('fs')
const formidable = require('formidable')
const Group = require('../models/groups')
const aws = require('../helpers/AWSUpload')

module.exports = function() {
    return {
        SetRouting: function(router) {
            // GET Routes
            router.get('/dashboard', this.adminPage)

            // POST Routes
            router.post('/uploadFile', aws.Upload.any(), this.uploadFile)
            router.post('/dashboard', this.adminPostPage)
        }, 

        adminPage: function(req, res) {
            res.render('admin/dashboard')
        }, 

        adminPostPage: function(req, res) {
            const newGroup = new Group()
            newGroup.name = req.body.group
            newGroup.city = req.body.city
            newGroup.image = req.body.upload
            newGroup.save(err => res.render('admin/dashboard'))
        },

        uploadFile: function(req, res) {
            const form = new formidable.IncomingForm()
            // where to store the image uploads
            form.uploadDir = path.join(__dirname, '../public/uploads')

            form.on('file', (field, file) => {
                fs.rename(file.path, path.join(form.uploadDir, file.name), (err) => {
                    if (err) {
                        throw err
                    }
                    console.log('File renamed successfully')
                })
            })

            form.on('error', err => console.log(err))
            form.on('end', () => console.log('File upload is successful'))
            form.parse(req)
        }
    }
}
