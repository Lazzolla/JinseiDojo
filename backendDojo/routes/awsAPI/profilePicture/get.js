const express = require('express'),
    router = express.Router(),
    aws = require('aws-sdk'),
    { ensureAuthenticated } = require('../../../middlewares/validation/validateCredentials'),
    config = require('../../../config/config')

const s3 = new aws.S3({
    accessKeyId: config.AWS_KEY_ID,
    secretAccessKey: config.AWS_PASS,
    region: 'sa-east-1'
})

router.get('/', ensureAuthenticated, (req, res) => {
    const { profilePictureName } = req.user
    const params = { Bucket: 'profilepicturesbucket', Key: profilePictureName }
    s3.getObject(params, function (err, data) {
        if (err) {
            return res.status(500).json({
                message: err || "No pudimos encontrar tu foto de perfil"
            })
        }
        return res.send({ data })
    })
})

module.exports = router

