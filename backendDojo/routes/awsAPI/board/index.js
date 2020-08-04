const express = require('express');
const router = express.Router()


router.use('/upload', require('./upload.js'))
    .use('/getboard', require('./getBoard.js'))
    .use('/getboard64', require('./getBoard64.js'))
    // .use('/delImage', require('./delete.js'))
    // .use('/putImage', require('./put.js'))



module.exports = router
