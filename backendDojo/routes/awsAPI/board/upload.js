const express = require('express'),
    aws = require('aws-sdk'),
    multerS3 = require('multer-s3'),
    multer = require('multer'),
    path = require('path'),
    ensureAuthenticated = require('../../../passport/ensureAuth'),
    config = require('../../../config/config')

const router = express.Router()



const s3 = new aws.S3({
    accessKeyId: config.AWS_KEY_ID,
    secretAccessKey: config.AWS_PASS,
    Bucket: 'boardbucket'
})

const profileImageUpload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'boardbucket',
        acl: 'public-read',
        key: function (req, file, cb) {
            cb(null, path.basename(file.originalname, path.extname(file.originalname)) + '-' + Date.now() + path.extname(file.originalname))
        }
    }),
    limits: { fileSize: 40000000 },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/
        const mimetype = filetypes.test(file.mimetype)
        const extname = filetypes.test(path.extname(file.originalname))
        if (mimetype && extname) {
            return cb(null, true)
        }
        cb("Error: El archivo no es una imagen valida")
    }
}).array('boardImages', 5)

router.post('/', ensureAuthenticated, async (req, res) => {

    await s3.listObjectsV2(params = { Bucket: 'boardbucket' }, async (err, data) => {
        console.log(data)
        if(err) {
            res.status(500).json({err})
        }
        if (data.KeyCount > 0) {
            await s3.deleteObjects({
                Bucket: 'boardbucket',
                Delete: {
                    Objects: data.Contents.map(o => ({ Key: o.Key }))
                }
            }, (err, data) => {
                if (err) {
                    res.status(500).json({ message: err })
                }
                if (data) {
                    console.log(data)
                }
            })
        }
        await profileImageUpload(req, res, (err) => {
            if (err) {
                res.status(500).json({ message: err })
            } else {
                if (req.files === undefined) {
                    console.log('Error: No file selected')
                    res.json('Error: No file selected')
                } else {
                    res.json({
                        message: 'board guardado correctamente'
                    })
                }
            }
        })
    })
})
module.exports = router

