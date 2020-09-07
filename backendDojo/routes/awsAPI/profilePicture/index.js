const express = require('express'),
    router = express.Router()

router.use('/getImage', require('./get.js'))
    .use('/delImage', require('./delete.js'))
    .use('/putImage', require('./put.js'))

module.exports = router
