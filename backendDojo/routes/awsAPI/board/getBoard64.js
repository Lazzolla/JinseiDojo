const express = require('express'),
    aws = require('aws-sdk'),
    ensureAuthenticated = require('../../../passport/ensureAuth'),
    config = require('../../../config/config')

const router = express.Router()



const s3 = new aws.S3({
    accessKeyId: config.AWS_KEY_ID,
    secretAccessKey: config.AWS_PASS,
    Bucket: 'boardbucket'
})

router.get('/', ensureAuthenticated, async (req, res) => {

    await s3.listObjectsV2(params = { Bucket: 'boardbucket' }, async (err, data) => {
        if (err) {
            res.status(500).json({ err })
        }
        if (data) {
            const extensions = data.Contents.map((el, key) => {
                const ext = el.Key.split('.')[1]
                return ext
            })
            const promesis = data.Contents.map(async el => {
                const img = await s3.getObject(params = {
                    Bucket: 'boardbucket',
                    Key: el.Key
                }).promise()
                return img
            })
            const boardImages = await Promise.all(promesis)
            res.send({boardImages, extensions})

        }
    })

})
module.exports = router

