const express = require('express'),
    aws = require('aws-sdk'),
    { v4: uuidv4 } = require('uuid'),
    config = require('../../../config/config')

const router = express.Router()



const s3 = new aws.S3({
    accessKeyId: config.AWS_KEY_ID,
    secretAccessKey: config.AWS_PASS,
    Bucket: 'boardbucket'
})

router.get('/', async (req, res) => {

    await s3.listObjectsV2(params = { Bucket: 'boardbucket' }, async (err, data) => {
        if(err) {
            res.status(500).json({err})
        }
        if(data) {
            const boardLocations = data.Contents.map(loc => {
            return { id: uuidv4() ,src: "https://boardbucket.s3-sa-east-1.amazonaws.com/" + loc.Key}
            })
            res.send(boardLocations)
        }
    })
})
module.exports = router

