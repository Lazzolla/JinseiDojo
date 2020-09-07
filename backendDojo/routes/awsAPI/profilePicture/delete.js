const express = require('express'),
    router = express.Router(),
    aws = require('aws-sdk'),
    multerS3 = require('multer-s3'),
    multer = require('multer'),
    path = require('path'),
    { ensureAuthenticated } = require('../../../middlewares/validation/validateCredentials'),
    config = require('../../../config/config')


const s3 = new aws.S3({
    accessKeyId: config.AWS_KEY_ID,
    secretAccessKey: config.AWS_PASS,
    Bucket: 'profilepicturesbucket'
})

const profileImageUpload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'profilepicturesbucket',
        acl: 'public-read',
        key: function (req, file, cb) {
            cb(null, path.basename(file.originalname, path.extname(file.originalname)) + '-' + Date.now() + path.extname(file.originalname))
        }
    }),
    limits: { fileSize: 20000000 },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/
        const mimetype = filetypes.test(file.mimetype)
        const extname = filetypes.test(path.extname(file.originalname))
        if (mimetype && extname) {
            return cb(null, true)
        }
        cb("Error: El archivo no es una imagen valida")
    }
}).single('image')

router.post('/', ensureAuthenticated, async (req, res) => {
    await profileImageUpload(req, res, (err) => {
        if (err) {
            res.json({ err })
        } else {
            if (req.file === undefined) {
                console.log('Error: No file selected')
                res.json('Error: No file selected')
            } else {
                const imageName = req.file.key,
                    imageLocation = req.file.location
                res.json({
                    image: imageName,
                    location: imageLocation
                })
            }
        }
    })
})

module.exports = router

