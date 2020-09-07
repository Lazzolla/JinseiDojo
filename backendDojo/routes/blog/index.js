const express = require('express');
const router = express.Router()

router.use('/publish', require('./blogPublish'))
    .use('/publications', require('./publications'))
    .use('/getpublications', require('./getPublications'))
    .use('/delpublication', require('./delPublication'))
    .use('/latestpub', require('./latestPub'))
    .use('/postcomment', require('./postComment'))
    .use('/getcomments', require('./getComments'))
    .use('/delcomment', require('./delComment'))

module.exports = router
