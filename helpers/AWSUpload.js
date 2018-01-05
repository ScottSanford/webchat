const AWS = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')

AWS.config.update({
    accessKeyId: 'AKIAJ3RXZXOHRRDVX3KA', 
    secretAccessKey: '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', 
    region: 'us-east-2'
})

const s3 = new AWS.S3({})
const upload = multer({
    storage: multerS3({
        s3: s3, 
        bucket: 'ssanford-webchat', 
        acl: 'public-read', 
        metadata(req, file, cb) {
            cb(null, {fieldName: file.fieldname})
        }, 
        key(req, file, cb) {
            cb(null, file.originalname)
        }, 
        rename(fieldName, filename) {
            return filename.replace(/\W+/g, '-')
        }
    })
})

exports.Upload = upload