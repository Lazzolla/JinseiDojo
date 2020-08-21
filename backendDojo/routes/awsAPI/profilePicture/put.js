const express = require('express'),
    router = express.Router(),
    aws = require('aws-sdk'),
    multerS3 = require('multer-s3'),
    multer = require('multer'),
    path = require('path'),
    { v4: uuidv4 } = require('uuid'),
    ensureAuthenticated = require('../../../passport/ensureAuth'),
    User = require('../../../models/User'),
    config = require('../../../config/config')


const s3 = new aws.S3({
    accessKeyId: config.AWS_KEY_ID,
    secretAccessKey: config.AWS_PASS,
    Bucket: 'profilepicturesbucket'
})

const profileImagePut = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'profilepicturesbucket',
        acl: 'public-read',
        key: function (req, file, cb) {
            cb(null, Key = uuidv4() + path.extname(file.originalname))
        }

    }),
    limits: { fileSize: 4000000 },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif|JPEG|JPG|PNG|GIF/
        const mimetype = filetypes.test(file.mimetype)
        const extname = filetypes.test(path.extname(file.originalname))
        if (mimetype && extname) {
            return cb(null, true)
        }
        cb("El archivo no es una imagen valida, elegí un archivo jpeg, jpg, png, o gif")
    }
}).single('image')

router.post('/', ensureAuthenticated, async (req, res) => {

    await profileImagePut(req, res, async (err) => {

        if (err) {
            if (err.message !== null) {
                return res.status(500).json({
                    message: "El archivo es muy pesado"
                })
            } else {
                return res.status(500).json({
                    message: err
                })
            }
        } else {
            if (req.user.profilePictureName !== 'defaultProfilePicture.png') {
                await s3.deleteObject(params = {
                    Bucket: 'profilepicturesbucket',
                    Key: req.user.profilePictureName
                }, (err) => {
                    if (err) {
                        return res.status(500).json({ message: 'Algo salio mal cuando intentabamos borrar la imagen anterior' })
                    }
                })
            }
            await User.findByIdAndUpdate({ _id: req.user.id },
                {
                    profilePictureName: Key,
                    profilePictureLocation: "https://profilepicturesbucket.s3-sa-east-1.amazonaws.com/" + Key
                },
                { new: true },
                (err, user) => {
                    if (err) {
                        return res.status(500).json({
                            message: err || "Ooops, something happened"
                        })
                    }
                    if (user) {
                        user.password = undefined
                        user.secretCode = undefined
                        user.isAuthenticated = true
                        return res.send({ user })
                    }
                })
        }


    })
})
module.exports = router

